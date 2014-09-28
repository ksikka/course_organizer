"""
Store JSON of historyItems into data.json.

Output when I run this is:
    piazza.com:
    (1) 15-451 (2 unread): https://piazza.com/class/hxh1myx4txy2hb

    docs.google.com:
    (65) Fall 2014: 15-451 Homework 4 Sign Up - Google Sheets: https://docs.google.com/spreadsheets/d/11BLcPM1XCFySM9yXu_zgh1eL0Bjrz-ixiZ94pL2NY5g/edit#gid=0
    (1) Fall 2014: 15-451 Homework 4 Sign Up - Google Sheets: https://docs.google.com/spreadsheets/d/11BLcPM1XCFySM9yXu_zgh1eL0Bjrz-ixiZ94pL2NY5g/edit?usp=sharing

    www.cs.cmu.edu:
    (6) CMU 15-451/651, F14: Schedule: http://www.cs.cmu.edu/~15451/schedule.html
    (4) CMU 15-451/651: Algorithms, Fall 2014: Main Page: http://www.cs.cmu.edu/~15451/
    (1) CMU 15-451/651 F14: Resources: http://www.cs.cmu.edu/~15451/resources.html
    (5) CMU 15-451/651 F14: Assignments: http://www.cs.cmu.edu/~15451/homework.html

    mono1.humancomp.cs.cmu.edu:
    (1) Course: 15-451/651 Algorithms: http://mono1.humancomp.cs.cmu.edu/moodle/course/view.php?id=2

    www.google.com:
    (1) cmu 15451 - Google Search: https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=cmu%2015451
    (1) cmu fall 15451 - Google Search: ht
"""

import json
import urlparse
from collections import defaultdict

course_number = '15-451'


def is_course(h):
    if course_number in h['title']:
        return True

    if course_number.replace('-','') in h['title']:
        return True

    return False

def add_domain(h):
    p = urlparse.urlparse(h['url'])
    h['domain'] = p.netloc

def h_str(h):
    return "({visitCount}) {title}: {url}".format(**h)


def main():

    h_by_domain = defaultdict(list)

    with open('data.json') as f:
        data = json.load(f)

    for h in data:

        if is_course(h):
            add_domain(h)
            h_by_domain[h['domain']].append(h)

    for k, v in h_by_domain.iteritems():
        print k + ": "
        for h in v:
            print h_str(h)
        print ""

main()
