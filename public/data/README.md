# Downloadable data assets

Files placed in this directory are served at the site root under `/data/`.
For example, `public/data/who-gho-myanmar-raw.csv` is downloadable at
`https://<site>/data/who-gho-myanmar-raw.csv`.

To surface a file on the **Dataset & 4 Traps** page, add an entry to
`DATA_DOWNLOADS` in `src/data/downloads.ts`. The download section renders
only when that array is non-empty.
