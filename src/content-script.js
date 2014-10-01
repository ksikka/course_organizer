alert('hi');
chrome.runtime.sendMessage('alabkejlnnhepmgjpdeigipimeghlaej', {message:'getPages',courseId:'15451'}, function(response) {alert(response)});
