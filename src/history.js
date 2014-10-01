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

var getAllVisits = function(allHistoryItems, callback) {
    var visitListList = [];
    var done = 0;
    _.each(allHistoryItems, function(r) {
        chrome.history.getVisits({url:r.url}, function(visits) {

            // Add a backreference from VisitItem to HistoryItem
            _.each(visits, function(v) {
                v.historyItem = r;
            });

            visitListList.push(visits);

            done ++;
            if (done == allHistoryItems.length) {
                var visits = _.flatten(visitListList);
                callback(visits);
            }
        });
    });
};

/*
 * rootHistoryItems are the history items we which to start exploring from
 * allVisits are all the VisitItems in the entire history.
 *  Note that they must have a "historyItem" backreference to the HistoryItem from which they came. */
var visitsToURLGraph = function (rootHistoryItems, allVisits) {
  var visitsByUrl = _.groupBy(allVisits, function(v) {return v.historyItem.url;});
  var visitsByParent = _.groupBy(allVisits, 'referringVisitId');

  /* url -> (url -> visit[]) OPTIONAL */
  // Existence of the first url means the URL must have been visited once.
  // Existence of the inner map means other URLs were visited from that URL.
  var url2urlmap = {};

  // populate
  var historyItemsToExplore = rootHistoryItems;
  while (historyItemsToExplore.length > 0) {
      var unexploredHistoryItems = [];
      _.each(historyItemsToExplore, function(p) {

          var roots = visitsByUrl[p.url];

          _.each(roots, function(root) {
            if (url2urlmap[root.historyItem.url] === undefined)
              url2urlmap[root.historyItem.url] = {};
          });

          _.each(roots, function(root) {
            var children = visitsByParent[root.visitId] || [];

            if (url2urlmap[root.historyItem.url] === undefined)
              url2urlmap[root.historyItem.url] = {};

            _.each(children, function(c) {

              if (url2urlmap[root.historyItem.url][c.historyItem.url] === undefined)
                  url2urlmap[root.historyItem.url][c.historyItem.url] = [];

              url2urlmap[root.historyItem.url][c.historyItem.url].push(c);

              if (url2urlmap[c.historyItem.url] === undefined && historyItemsToExplore)
                  unexploredHistoryItems.push(c.historyItem);
            });
          });
      });

      historyItemsToExplore = _.uniq(unexploredHistoryItems,function(item){return JSON.stringify(item);});
  }

  return url2urlmap;

};;

var getPagesFromHistory = function (courseIds, callback) {
  chrome.history.search({
      text:'',
      startTime: 0,
      endTime: new Date().getTime(),
      maxResults: 6000
  }, function(allHistoryItems) {
      // TODO Look at Visit Graph to find addl pages referred to by history pages.

      // tag each history item with at most one course
      _.each(allHistoryItems, function(r) {
          _.each(courseIds, function(c) {
            if (isHistoryItemACourse(r,c)) {
                r.courseId = c;
                r.domain = urlDomain(r.url);
            }
          });
      });

      // filter out history items which are not tagged with a course
      allRootCourseHistoryItems = _.filter(allHistoryItems, function (r) {
          return r.courseId !== undefined;
      });
      // turn into a map from course to list of pages
      allRootCourseHistoryItems = _.groupBy(allRootCourseHistoryItems, 'courseId');

      var historyItemsByUrl = _.indexBy(allHistoryItems, 'url');

      getAllVisits(allHistoryItems, function(visits) {
          var courseToInfoMap = {};
          _.each(allRootCourseHistoryItems, function(rootCourseHistItems, courseId) {
              var url2urlMap = visitsToURLGraph(rootCourseHistItems, visits);

              var relevantUrls = _.keys(url2urlMap);
              var relevantHistoryItems = _.map(relevantUrls, function(url) {return historyItemsByUrl[url];});

              courseToInfoMap[courseId] = {
                  recent: _.sortBy(relevantHistoryItems, function(h) {
                      return -h.lastVisitTime;
                  }),
                  frequent: _.sortBy(relevantHistoryItems, function(h) {
                      return -h.visitCount;
                  }),
              };
          });
          callback(courseToInfoMap);
      });

  });
};
