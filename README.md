Chrome Extension that automatically organizes your class-relevant pages.

### How I made it:
1. Get browser history data

    one call to chrome api, json stringify the data

2. Develop a Heuristic for determining whether or not a HistoryItem is relevant to a course

    try looking for the course name in the title... (see `analyze.py`)

3. Design UI, the key idea behind the product

    need to know what courses they are taking - setup/options page
