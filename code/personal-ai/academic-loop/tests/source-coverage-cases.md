# Source coverage regression cases

These are behavioral review cases, not proof of live provider access, cross-surface execution or student learning. Evaluate the resulting decisions and coverage, not exact wording.

| Input situation | Required observable outcome |
| --- | --- |
| User requests lectures 1-10; first search returns only lectures 1-6; relevant folder has all ten. | Reconcile the folder's complete inventory and record ten lecture identities. Do not stop at six or label four absent. |
| Official slides and GoodNotes export share a filename but have different IDs and folders. | Retain both source roles; inspect session/body evidence to associate them. Do not deduplicate by filename. |
| LM template says notes unavailable; user says all notes are included; accessible body contains handwritten-note material. | Preserve the user's correction and observed body evidence separately. Do not declare missing notes or independent 100% fidelity without further evidence. Do not rerun LM automatically. |
| Handoff lists two topics; complete lecture has two more examples and a final guideline section. | Include the additional source units in review or retain them as explicit deferred units. Do not treat the two topics as the complete lecture. |
| Provider identifies 30 links; ordinary Chat has not been exercised. | Report LINK_VERIFIED for the reconciled inventory; CONTENT_VERIFIED only for inspected units; receiver acceptance untested. No claim of automatic branch synchronization. |
| PDF text is fetched but diagrams and handwritten annotations cannot be rendered. | Record text/OCR method and the specific visual gaps. Do not certify full visual recovery or source absence. |
| User requests three assignments with 9, 9 and 10 problems; one problem has two subparts. | Track all 28 problem IDs and that problem's two subparts; preserve unsolved/deferred scope. AI solutions do not mark STUDIED or submitted. |
| User supplies one self-contained equation and asks for a hint. | Give the requested hint without a whole-course inventory, unsolicited worked answer or compulsory Work switch. |
| Full-course setup is complete; user asks to start lecture 1. | Fresh-read the checkpoint and exact lecture 1 sources; recover its full unit without refetching the entire unchanged corpus. |
