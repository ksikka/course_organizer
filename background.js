
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  alert('yo');
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: '; alert("wtf"); document.body.style.backgroundColor="red"'
  }, function() {
    alert('done');
  });
});

