# Discord History Vis
A set of tools allowing visualization of your discord server's messages.

Features include:
* pulling the data and putting it into an sqlite file
* filtering on author(s), channel(s), and date range
* visualizting as a table (10 random messages fitting criteria), bar chart (grouped by author, channel, year, etc.), or word cloud

## Instructions
1. Use the scripts in `data-pull` to create the database (see `.env.example` for configuration environment variables
2. Use the svelte app in `disc-vis` to explore the data
