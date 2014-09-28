chrome.history.onVisited.addListener(function(result) {
    /* result is a HistoryItem: https://developer.chrome.com/extensions/history#type-HistoryItem */
    // ask, is this a course page?
});


chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('getting history');
  // get entire history
  chrome.history.search({
      text:'',
      startTime: 0,
      endTime: new Date().getTime(),
      maxResults: 6000
  }, function(results) {
      console.log(JSON.stringify(results));
  });
});

