# QA Plan

## Fixture QA

- Import 3 chapter fixtures; assert chapter indexes 1..3 and event pending.
- Run mock event extractor; assert each chapter transitions success and event text is stored.
- Force one provider error; assert failed state and error reason persist.
- Run ScriptAgent mock; assert skeleton, adaptation strategy, and scripts are persisted.
- Extract assets from two scripts; assert duplicate asset names are de-duped and script links exist.
- Build storyboard table and panel; assert row count, durations, track grouping, and asset links.
- Generate mock asset/storyboard images; assert media refs and task state.
- Generate mock video prompt and video; assert track prompt, video state, and selected video.
- Export package; snapshot JSON/zip manifest.

## Manual QA

- Verify no live provider calls occur in default proof.
- Verify export package has enough information for another stack to render a preview.
- Verify missing/invalid token behavior if API facade includes auth.

## Not Claimed

- Browser/canvas parity.
- Real provider output quality.
- Final stitched video parity.

