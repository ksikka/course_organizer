Chrome Extension that automatically organizes your class-relevant pages.

### How I made it:
1. Get browser history data

    1. one call to chrome api, json stringify the data

2. Develop a Heuristic for determining whether or not a HistoryItem is relevant to a course

    1. try looking for the course name in the title... (see `analyze.py`)

3. Design UI, the key idea behind the product

    1. need to know what courses they are taking - setup/options page
    2. user wants to search, first they think of the course, then they find the page
    3. convenient to use existing Chrome search bar (omnibox API)

4. Architect codebase

    1. understand the structure of the code
    2. data sources (browser history, course data)
    3. end result of data analysis: Map from Course to Course Pages
    4. Suggestion logic, given a string input, parse it and suggest Pages.

5. Implement User Interface to start getting a feel for it

    1. implement the omnibox logic
    2. parse user input string, determing what state they're in
    3. begin suggesting pages based on the course
    4. Add some formatting
    5. Group by suggested pages by domain

6. Run into limitations - omnibox can only show 5 suggestions

    1. I really need a new UI, 5 suggestions is not going to cut it
    2. Maybe I should process the VisitItem graph data to get a better idea of what end structure my data will have.

7. Process VisitItems from HistoryItems to get related pages of known course pages

    1. API is not intuitive and documentation is misleading
    2. Upon inspection, the data looks immensely useful.

