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

var getAllVisits = function(callback) {
    var visitListList = [];
    chrome.history.search({
        text:'',
        startTime: 0,
        endTime: new Date().getTime(),
        maxResults: 6000
    }, function(results) {
        var done = 0;
        _.each(results, function(r) {
            chrome.history.getVisits({url:r.url}, function(visits) {

                _.each(visits, function(v) {
                    v.historyItem = r;
                });

                visitListList.push(visits);

                done ++;
                if (done == results.length) {
                    var visits = _.flatten(visitListList);

                    callback(visits);
                }
            });
        });
    });
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
                r.domain = urlDomain(r.url);
            }
          });
      });
      // filter out history items which are not tagged with a course
      results = _.filter(results, function (r) {
          return r.courseId !== undefined;
      });

      // turn into a map from course to list of pages
      results = _.groupBy(results, 'courseId');

      /*DEBUG*/
      resultDEBUG = _.clone(results);
      getAllVisits(function(visits) {
          console.log(visits);
          var byUrl = _.groupBy(visits, function(v) {return v.historyItem.url;});
          var byId = _.indexBy(visits, 'visitId');
          var byParent = _.groupBy(visits, 'referringVisitId');
          _.each(resultDEBUG['15451'], function(p) {
              var roots = byUrl[p.url];
              _.each(roots, function(root) {
                var children = byParent[root.visitId] || [];
                console.log('Root '+root.historyItem.title+': '+root.historyItem.url+' '+children.length);
                _.each(children, function(c) {
                  console.log(c);
                });
              });

          });
      });

      _.each(results, function(pages, courseId) {
          results[courseId] = _.groupBy(pages, 'domain');
      });

      callback(results);
  });
};
