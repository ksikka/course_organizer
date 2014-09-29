Chrome Extension that automatically organizes your class-relevant pages.

### How I made it:
1. Get browser history data

    one call to chrome api, json stringify the data

2. Develop a Heuristic for determining whether or not a HistoryItem is relevant to a course

    try looking for the course name in the title... (see `analyze.py`)

3. Design UI, the key idea behind the product

    need to know what courses they are taking - setup/options page
    user wants to search, first they think of the course, then they find the page
    convenient to use existing Chrome search bar (omnibox API)

4. Architect codebase

    understand the structure of the code
    data sources (browser history, course data)
    end result of data analysis: Map from Course to Course Pages
    Suggestion logic, given a string input, parse it and suggest Pages.

5. Implement User Interface to start getting a feel for it

    implement the omnibox logic
    parse user input string, determing what state they're in
    begin suggesting pages based on the course

