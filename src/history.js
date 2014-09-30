/* Given the browser history and some Courses (data model):
 *  -identify relevant pages
 */

var isHistoryItemACourse = function (h, courseId) {
    if (h['title'].indexOf(courseId) != -1) {
        return true;
    }
    if (h['title'].replace('-','').indexOf(courseId) != -1) {
        return true;
    }
    return false;
};

var getPagesFromHistory = function (courseIds, callback) {
  chrome.history.search({
      text:'',
      startTime: 0,
      endTime: new Date().getTime(),
      maxResults: 6000
  }, function(results) {
      // TODO Look at Visit Graph to find addl pages referred to by history pages.

      // tag each history item with at most one course
      _.each(results, function(r) {
          _.each(courseIds, function(c) {
            if (isHistoryItemACourse(r,c)) {
                r.courseId = c;
            }
          });
      });
      // filter out history items which are not tagged with a course
      results = _.filter(results, function (r) {
          return r.courseId !== undefined;
      });

      // turn into a map from course to list of pages
      results = _.groupBy(results, 'courseId');

      callback(results);
  });
};
