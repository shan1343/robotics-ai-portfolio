"""Structural contract checks, NOT an end-to-end learning/GUI success metric."""
import json, pathlib, re, sys

def check(root):
    root = pathlib.Path(root)
    results = []
    def test(name, fn):
        try:
            assert fn(), name
            results.append({'check': name, 'pass': True})
        except Exception as exc:
            results.append({'check': name, 'pass': False, 'reason': str(exc)})
    def text(p): return (root / p).read_text(encoding='utf-8-sig')
    test('manifest_and_four_independent_skills', lambda: json.loads(text('.codex-plugin/plugin.json'))['name']=='academic-loop' and len(list((root/'skills').glob('*/SKILL.md')))==4)
    test('valid_utf8_and_no_placeholder', lambda: all('\ufffd' not in p.read_text(encoding='utf-8-sig') and '[TODO' not in p.read_text(encoding='utf-8-sig') for p in root.rglob('*.md')))
    def links():
        for p in root.rglob('*.md'):
            for link in re.findall(r'\]\(([^)]+)\)', p.read_text(encoding='utf-8-sig')):
                if '://' in link or link.startswith('#'): continue
                dest=(p.parent/link.split('#')[0]).resolve()
                if not dest.exists(): raise AssertionError(str(p.relative_to(root))+': '+link)
        return True
    test('relative_references_resolve', links)
    test('preparation_and_processing_have_separate_done_states', lambda: all(x in text('skills/academic-class-operator/SKILL.md') for x in ('## PRE_CLASS','## POST_CLASS','No LM generation','DIRECT_SOURCE')))
    test('study_supports_direct_hint_solution_and_interactive_modes', lambda: all(x in text('skills/academic-study/SKILL.md') for x in ('DIRECT_ANSWER','HINT_ONLY','WORKED_SOLUTION','INTERACTIVE_REVIEW','first incorrect')))
    test('source_fidelity_not_silent_supplementation', lambda: all(x in text('references/operating-contract.md') for x in ('SOURCE_FIDELITY','Do not silently','terminology','not available in the source')))
    test('shared_provider_checkpoint_and_memory_retrieval', lambda: all(x in text('references/learning-and-continuity.md') for x in ('REOPEN','WRITEBACK','personal-ai','GitHub','not automatically')))
    test('quota_failure_preserves_ordinary_study', lambda: all(x in text('references/operating-contract.md') for x in ('QUOTA_FALLBACK','ordinary Chat','no extra')))
    test('repair_targets_source_and_verifies_installed_copy', lambda: all(x in text('references/maintenance.md') for x in ('ONE_TIME','PERSISTENT','LEARNING_EVIDENCE','source','installed','rollback')))
    test('recorded_interfaces_are_not_claimed_as_implemented', lambda: all(x in text('references/recorded-workflows.md') for x in ('No UI implementation','observed','not','verified')))
    test('material_portfolio_attribution_is_separate_from_mastery', lambda: all(x in text('references/learning-and-continuity.md') for x in ('PORTFOLIO','user contribution','AI contribution','unverified')))
    test('no_packaged_credentials_or_raw_recordings', lambda: not any(p.name in ('events.jsonl','desktop-events.jsonl','auth.json','.env') or p.suffix=='.zip' for p in root.rglob('*') if p.is_file()))
    return results

if __name__=='__main__':
    r=check(sys.argv[1]); output={'scope':'STRUCTURAL_ONLY','passed':sum(x['pass'] for x in r),'total':len(r),'checks':r}
    print(json.dumps(output,ensure_ascii=False,indent=2)); sys.exit(0 if all(x['pass'] for x in r) else 1)
