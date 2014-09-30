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
var visitsToURLGraph = function (rootHistoryItems, allVisits) {
  var byUrl = _.groupBy(allVisits, function(v) {return v.historyItem.url;});
  var byId = _.indexBy(allVisits, 'visitId');
  var byParent = _.groupBy(allVisits, 'referringVisitId');

  var url2urlmap = {};

  // populate
  var urlsToExplore = rootHistoryItems;
  while (urlsToExplore.length > 0) {
      var unexploredHistoryItems = [];
      _.each(urlsToExplore, function(p) {

          var roots = byUrl[p.url];

          _.each(roots, function(root) {
            if (url2urlmap[root.historyItem.url] === undefined)
              url2urlmap[root.historyItem.url] = {};
          });

          _.each(roots, function(root) {
            var children = byParent[root.visitId] || [];

            if (url2urlmap[root.historyItem.url] === undefined)
              url2urlmap[root.historyItem.url] = {};

            _.each(children, function(c) {

              if (url2urlmap[root.historyItem.url][c.historyItem.url] === undefined)
                  url2urlmap[root.historyItem.url][c.historyItem.url] = [];

              url2urlmap[root.historyItem.url][c.historyItem.url].push(c);

              if (url2urlmap[c.historyItem.url] === undefined && urlsToExplore)
                  unexploredHistoryItems.push(c.historyItem);

            });

          });
      });

      urlsToExplore = _.uniq(unexploredHistoryItems,function(item){return JSON.stringify(item);});
  }

  return url2urlmap;

};;

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
          console.log( visitsToURLGraph(resultDEBUG['15451'], visits) );
      });

      _.each(results, function(pages, courseId) {
          results[courseId] = _.groupBy(pages, 'domain');
      });

      callback(results);
  });
};
