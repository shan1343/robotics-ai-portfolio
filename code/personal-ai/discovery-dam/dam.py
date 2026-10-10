#!/usr/bin/env python3
"""Deterministic candidate handling. No credentials, network, scheduler or model calls."""
import argparse
import copy
import hashlib
import json
import os
import tempfile
from collections import Counter
from datetime import datetime, timezone
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

TRACKERS = {'si', 'fbclid', 'gclid', 'mc_cid', 'mc_eid'}
LEVELS = {'metadata': 0, 'excerpt': 1, 'original': 2}


def canonical(url):
    p = urlsplit(url.strip())
    if p.scheme not in ('https', 'http') or not p.hostname or p.username or p.password:
        raise ValueError('Expected public http(s) URL without credentials')
    host = p.hostname.lower()
    args = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True)
            if not k.lower().startswith('utm_') and k.lower() not in TRACKERS]
    q = dict(args)
    if host in ('youtu.be', 'www.youtu.be'):
        return 'https://www.youtube.com/watch?v=' + p.path.strip('/').split('/')[0]
    if host in ('youtube.com', 'www.youtube.com', 'm.youtube.com'):
        vid = q.get('v') if p.path == '/watch' else p.path.split('/')[2] if p.path.startswith(('/shorts/', '/embed/')) else None
        if vid:
            return 'https://www.youtube.com/watch?v=' + vid
    netloc = host + ((':' + str(p.port)) if p.port and p.port not in (80, 443) else '')
    return urlunsplit((p.scheme.lower(), netloc, p.path or '/', urlencode(args), p.fragment))


def stamp(value):
    d = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if d.tzinfo is None:
        raise ValueError('Timestamp must include timezone')
    return d.astimezone(timezone.utc).isoformat()


def fingerprint(row):
    fields = {k: row.get(k) for k in ('title', 'published_at', 'content_hash', 'evidence', 'topics')}
    return hashlib.sha256(json.dumps(fields, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def feedback(control, event):
    out = copy.deepcopy(control)
    if any(x['id'] == event['id'] for x in out.get('feedback', [])):
        return out
    if event['expected_version'] != out.get('version', 1):
        raise ValueError('Criteria version conflict')
    if not event.get('literal', '').strip():
        raise ValueError('Explicit feedback text required')
    scope = event.get('scope', 'persistent')
    if scope not in ('persistent', 'run'):
        raise ValueError('Feedback scope must be persistent or run')
    if scope == 'run':
        if not event.get('run_id'):
            raise ValueError('Run-scoped feedback needs run_id')
        out['scope_run_id'] = event['run_id']
    patch = event.get('patch', {})
    allowed = {'preferred_topics', 'muted_topics', 'blocked_urls', 'max_per_family', 'focus'}
    if set(patch) - allowed:
        raise ValueError('Unsupported feedback field')
    for key in ('preferred_topics', 'muted_topics', 'blocked_urls'):
        if key in patch and (not isinstance(patch[key], list) or not all(isinstance(x, str) for x in patch[key])):
            raise ValueError('Expected list of strings: ' + key)
    if 'max_per_family' in patch and not 1 <= patch['max_per_family'] <= 10:
        raise ValueError('Family cap outside 1..10')
    out.update(patch)
    out['version'] = out.get('version', 1) + 1
    out['feedback'] = out.get('feedback', []) + [{'id': event['id'], 'literal': event['literal'], 'patch': patch,
                                               'scope': scope, 'run_id': event.get('run_id')}]
    return out


def merge(previous, batch, control, limit=8, capacity=300):
    if batch['criteria_version'] != control['version']:
        raise ValueError('Batch criteria differs from current control')
    if control.get('scope_run_id') and control['scope_run_id'] != batch['run_id']:
        raise ValueError('Temporary feedback belongs to a different run')
    now = stamp(batch['observed_at'])
    rows = {r['key']: copy.deepcopy(r) for r in previous.get('candidates', [])}
    blocked = {canonical(u) for u in control.get('blocked_urls', [])}
    new, changed, rejected = set(), set(), []
    sightings = set()
    for candidate in batch['candidates']:
        url = canonical(candidate['url'])
        if url in blocked:
            rejected.append(url)
            continue
        evidence = candidate.get('evidence', 'metadata')
        if evidence not in LEVELS:
            raise ValueError('Unknown evidence level')
        rank = candidate.get('rank', 1)
        if not isinstance(rank, int) or rank < 1:
            raise ValueError('Rank must be positive integer')
        lane = candidate['lane']
        key = candidate.get('event_key') or url
        fresh = {k: candidate[k] for k in ('title', 'topics', 'published_at', 'content_hash', 'parent', 'edge') if k in candidate}
        if fresh.get('published_at'):
            stamp(fresh['published_at'])
        existing = rows.get(key)
        old_fp = fingerprint(existing) if existing else None
        if not existing:
            existing = {'key': key, 'url': url, 'title': candidate.get('title', ''), 'topics': [],
                        'first_seen': now, 'evidence': evidence, 'lanes': {}, 'aliases': [],
                        'family': candidate.get('family') or urlsplit(url).hostname}
            rows[key] = existing
            new.add(key)
        # Lower-quality discovery cannot overwrite a previously read original.
        if LEVELS[evidence] >= LEVELS[existing['evidence']]:
            existing.update(fresh)
            existing['evidence'] = evidence
        existing['last_seen'] = now
        existing['aliases'] = sorted(set(existing['aliases'] + [url]))
        # One contribution per lane prevents query fan-out inflating agreement.
        existing['lanes'][lane] = min(rank, existing['lanes'].get(lane, rank))
        if old_fp and old_fp != fingerprint(existing):
            changed.add(key)
        sightings.add(key)
    preferred = set(control.get('preferred_topics', []))
    muted = set(control.get('muted_topics', []))
    scored = []
    for r in rows.values():
        if ({r['url']} | set(r.get('aliases', []))) & blocked or set(r.get('topics', [])) & muted:
            continue
        # Fusion is a ranking aid, not a factual reliability score.
        rrf = sum(1 / (60 + rank) for rank in r['lanes'].values())
        boost = 0.02 * len(set(r.get('topics', [])) & preferred)
        r['score'] = round(rrf + boost, 8)
        r['criteria_version'] = control['version']
        scored.append(r)
    scored.sort(key=lambda r: (-r['score'], r['key']))
    selected, families = [], Counter()
    for r in scored:
        if families[r['family']] < control.get('max_per_family', 2):
            selected.append(r['key'])
            families[r['family']] += 1
        if len(selected) >= limit:
            break
    # Bound candidate metadata; pending source failures remain separately untouched.
    kept_keys = set(r['key'] for r in scored[:capacity])
    evicted = sorted(set(rows) - kept_keys)
    kept = [r for r in scored if r['key'] in kept_keys]
    selected = [k for k in selected if k in kept_keys]
    return {'schema': 1, 'criteria_version': control['version'], 'observed_at': now,
            'run_id': batch['run_id'], 'candidates': kept, 'selected_keys': selected,
            'pending': copy.deepcopy(previous.get('pending', [])),
            'metrics': {'input_rows': len(batch['candidates']), 'unique_in_batch': len(sightings),
                        'new': len(new), 'changed': len(changed),
                        'already_seen': len(sightings - new), 'blocked': len(rejected),
                        'candidate_count': len(kept), 'selected': len(selected),
                        'families_selected': len(families), 'evicted': len(evicted)},
            'evicted_keys': evicted, 'channels': batch.get('channels', []),
            'commit_status': 'STAGED_NOT_PROVIDER_COMMITTED'}


def write_atomic(path, data):
    directory = os.path.dirname(os.path.abspath(path))
    os.makedirs(directory, exist_ok=True)
    fd, temp = tempfile.mkstemp(prefix='.dam-', dir=directory)
    try:
        with os.fdopen(fd, 'w', encoding='utf8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def read(path):
    with open(path, encoding='utf8') as f:
        return json.load(f)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='command', required=True)
    m = sub.add_parser('merge')
    m.add_argument('--previous')
    m.add_argument('--batch', required=True)
    m.add_argument('--control', required=True)
    m.add_argument('--out', required=True)
    m.add_argument('--limit', type=int, default=8)
    m.add_argument('--capacity', type=int, default=300)
    f = sub.add_parser('feedback')
    f.add_argument('--control', required=True)
    f.add_argument('--event', required=True)
    f.add_argument('--out', required=True)
    a = p.parse_args()
    if a.command == 'merge':
        if not 1 <= a.limit <= a.capacity <= 1000:
            p.error('Require 1 <= limit <= capacity <= 1000')
        result = merge(read(a.previous) if a.previous else {}, read(a.batch), read(a.control), a.limit, a.capacity)
    else:
        result = feedback(read(a.control), read(a.event))
    write_atomic(a.out, result)
    print(json.dumps(result['metrics'] if 'metrics' in result else {'version': result['version']}))

if __name__ == '__main__':
    main()
