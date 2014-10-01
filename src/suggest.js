/* Suggestion logic (controller):
 *  -parse user's text
 *  -get course(s)
 *  -get pages
 *  -return formatted output
 */

/* A valid input will be a prefix (length >= 2) of any String of the following form:
 *  15451 .*
 *  15-451 .*
 * If not valid, return 'invalid'.
 * If only the 15 or 15- are present, return 'deptonly'
 * If 'deptonly' and only part of a course number is present, return 'course_prefix'
 * If the whole course number is there and no more text, return 'coursenumber'
 * If more text after course umber, return 'course_and_prefix'
 */
var parse = function(text) {
    if (text.match(/^\d{2}-?$/)) {
        return 'deptonly';
    } else if (text.match(/^\d{2}-?[0-9][0-9]?$/)) {
        return 'course_prefix';
    } else if (text.match(/^\d{2}-?[0-9]{3} ?$/)) {
        return 'coursenumber';
    } else if (text.match(/^\d{2}-?[0-9]{3} ?.*$/)) {
        return 'course_and_prefix';
    } else {
        return 'invalid';
    }
};

var noText = function() {
//    chrome.omnibox.setDefaultSuggestion({description: "Start typing a course number..."});
};


var getCoursePages = function (courseIds, callback) {
    /* TODO use crowd knowledge and ext-suggested-user-input to provide more pages. */
    getPagesFromHistory(courseIds, callback);
};

var formatPage = function(h) {
    return "   "+escapeXml(h.title)+": <url>"+escapeXml(h.url)+"</url>";
};

/* Given the text,
 *  compute suggestions for Pages,
 *  return them by calling the callback 'suggest'.
 *  Ref: https://developer.chrome.com/extensions/omnibox#property-onInputChanged-callback */
var suggester = function(text, suggest) {
    if (text.length < 2) {
        noText();
        suggest([]);
        return;
    }
    var state = parse(text);
    if (state === 'invalid') {
//        chrome.omnibox.setDefaultSuggestion({description: "Course number \""+text+"\" not found"});
        suggest([]);
    } else if (state === 'deptonly') {
//        chrome.omnibox.setDefaultSuggestion({description: "You typed a department"});
        suggest([]);
    } else if (state === 'course_prefix') {
//        chrome.omnibox.setDefaultSuggestion({description: "You're typing a course"});
        suggest([]);
    } else if (state === 'coursenumber') {
//        chrome.omnibox.setDefaultSuggestion({description: "Here are all the relevant pages for the course:"});
        var courseId = text.replace('-','');
        getCoursePages([courseId], function(courseToInformation) {
            var infoMap = courseToInformation[courseId];
            suggest(infoMap);
        /* this is deprecated now...
            var listOfSuggestionLists = [];
            _.each(results[courseId], function(pages, domain) {
                var suggestions = _.map(pages, function(p) {
                    var stringToShow = formatPage(p);
                    return { content: p.url, description: stringToShow };
                });
                suggestions[0].description = '<match>'+domain+'</match>' + suggestions[0].description;
                listOfSuggestionLists.push(suggestions);
            })
            suggest(_.flatten(listOfSuggestionLists, true));
        */
        });
    } else if (state === 'course_and_prefix') {
//        chrome.omnibox.setDefaultSuggestion({description: "This is the prefix we're looking for!"});
        suggest([]);
    }
}
