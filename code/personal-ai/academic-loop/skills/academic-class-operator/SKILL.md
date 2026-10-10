---
name: academic-class-operator
description: Use for 수업 전 준비, 예습, 오늘 수업 처리해, 강의자료 정리, or LM 돌려. Not for a simple concept question, active tutoring, assignment solving or exam practice alone.
---
# Academic class operator
Read [the operating contract](../../references/operating-contract.md). Reuse [learning and continuity](../../references/learning-and-continuity.md); read [UI workflows](../../references/recorded-workflows.md) only for UI work.
First distinguish PRE_CLASS from POST_CLASS. Resolve only materially necessary course/session identity; supplied sources can be enough for a short preparation request. Recover an existing matching export before creating another.

## PRE_CLASS
Fit the user's available time; roughly 5–15 minutes only when no shorter limit is given. Show the continuation point, a few prerequisites supported by the material, relevant prior weakness only if recoverable, and one question to notice in class.
No LM generation, recording reconciliation, Docs export, mandatory quiz or processing-status write for ordinary pre-class preparation. Do not look across the whole semester. With title-only sources, stay at title/structure level and state the missing detail.
Done = the requested preparation packet in this chat. No attendance, PROCESSED or STUDIED inference.

## POST_CLASS
For duplicate-name source reconciliation, uncertain note inclusion or a multi-session handoff, read [source coverage](../../references/source-coverage.md). Verify identity by exact objects and body evidence; template warnings alone do not establish missing content.
1. Resolve exact course/session, intended result, available PPT/PDF, recording/transcript, notes and any existing reconstruction. Check content and version; a notification or filename is not evidence of coverage. Missing input remains explicit.
2. **Manual LM is a supported normal path.** If the user already used the established Notion LM prompt with the session's PPT + long recording + applicable same-session GoodNotes and exported Docs, recover and verify that artifact instead of rerunning LM. Use native connectors/local tools for missing inputs. Invoke NotebookLM through Work/browser only when requested or when a real missing reconstruction justifies it. Existing selected-session exports take precedence over regenerating everything.
3. For a UI-only step, prefer a matching validated recorded workflow. Its absence is not a blanket browser ban: a callable browser/computer tool may inspect the actual authorized target and execute a bounded one-off flow using observed controls. Never invent selectors or claim a recording exists. Stop at login/2FA/consent; no user recording starts without readiness and consent.
4. Reconstruct only selected sources in their organization and terminology. Bind claims to pages/timestamps where available, separate teacher/source statements from AI synthesis, and expose missing/conflicting evidence without silently reconciling it.
5. If LM cannot run, preserve the checkpoint. Offer or execute a clearly labeled DIRECT_SOURCE partial result when it fits the requested outcome. Never call direct ChatGPT processing “LM completed”. Do not certify audio coverage without accessible audio/transcript. Do not regenerate repeatedly against an unchanged quota/auth block.
6. Verify the actual downstream artifact's identity and content, save its exact pointer/coverage in the existing course/session surface if authorized, and read it back. State provider and generation/source version. Docs export is a snapshot, not a promise of bidirectional synchronization.

## Completion
Report the usable result, coverage gaps and the next study starting point. PROCESSED applies only to verified scope; incomplete coverage is PARTIAL. Reconstruction is never STUDIED. Do not launch tutoring, homework solving or extra exports merely because processing finished.
