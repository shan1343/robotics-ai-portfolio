import fs from 'node:fs';
import assert from 'node:assert/strict';
import { evaluateCanaryEvidence } from '../code/personal-ai/src/lived-canary-evidence.js';
const base = JSON.parse(fs.readFileSync(new URL('../code/personal-ai/fixtures/github-pass.synthetic.json', import.meta.url)));
const clone = () => structuredClone(base);
const cases = [
  ['합성 입력의 일관성', () => clone(), 'PASS'],
  ['다른 대상에 부작용 발생', () => { const r=clone(); r.metrics.crossScopeSideEffects=1; r.outcome='FAIL'; return r; }, 'FAIL'],
  ['부작용을 숨기고 PASS 보고', () => { const r=clone(); r.metrics.crossScopeSideEffects=1; return r; }, 'INVALID'],
  ['합성 검사를 실사용 결과로 승격', () => { const r=clone(); r.lifecycleState='RESULT_LANDED'; return r; }, 'INVALID'],
  ['합성 입력의 두 상태를 바꿔 실사용처럼 위장', () => { const r=clone(); r.evidenceClass='LIVED_SANITIZED'; r.lifecycleState='RESULT_LANDED'; return r; }, 'INVALID'],
  ['필수 재조회 검사 누락', () => { const r=clone(); r.assertions=r.assertions.filter(a=>a.id!=='GH-REFETCH-01'); return r; }, 'INVALID'],
  ['검토 기준 revision 변경', () => { const r=clone(); r.preparedAgainst.sharedMain='0'.repeat(40); return r; }, 'INVALID'],
];
const rows=cases.map(([name,make,expected])=>{const result=evaluateCanaryEvidence(make());assert.equal(result.verdict,expected,name);return {name,expected,...result,check:'PASS'};});
console.log(JSON.stringify({kind:'LOCAL_SYNTHETIC_REGRESSION',providerCalls:0,tests:rows.length,passed:rows.length,cases:rows},null,2));
