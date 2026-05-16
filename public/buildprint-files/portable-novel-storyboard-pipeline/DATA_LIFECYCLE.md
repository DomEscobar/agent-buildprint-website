# Data Lifecycle

1. Project created with model/style settings.
2. Chapters imported into chapter store.
3. Event extraction writes event summary or error per chapter.
4. ScriptAgent writes plan workspace and scripts.
5. Asset extraction creates assets and script links.
6. Production workspace creates director plan, storyboard table, storyboard rows, asset links, tracks.
7. Media generation creates task records and media refs.
8. Preview selects track videos and resolves file URLs.
9. Export package snapshots all selected records and refs.

Retention/deletion: partially outside selected scope. Toonflow has deletion routes, but this Buildprint requires explicit retention policy before production use.

