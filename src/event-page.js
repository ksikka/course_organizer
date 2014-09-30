var courses = ['15-451', '02-512'];


// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(suggester);

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
    if (text.indexOf('http://') === 0 || text.indexOf('https://') == 0) {
        window.open(text);
    } else {
        alert('Input ignored because it wasn\'t a URL.');
    }
});























/* DEBUG
chrome.history.onVisited.addListener(function(result) {
    // result is a HistoryItem: https://developer.chrome.com/extensions/history#type-HistoryItem
    // ask, is this a course page?
    if (result.url.toLowerCase().endsWith('.pdf')) {
        alert('this might be a pdf');
    }
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
}); */
