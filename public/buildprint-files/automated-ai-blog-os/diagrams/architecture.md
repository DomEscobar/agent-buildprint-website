# Architecture diagram

```txt
Sources -> Scanner -> SourceRecords -> Idea Scorer -> IdeaRecords
                                      -> Content Memory
IdeaRecord + Memory -> Draft Generator -> DraftRecord + MD/MDX
DraftRecord -> Claim Validator -> SEO Validator -> Approval Queue -> Publisher/Scheduler
All storage -> Manager Audit -> Audit Report
```
