var leonUrl = '';
var targetUrl = '';
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
            chrome.tabs.create({ url: targetUrl + "/?tid=" + xhr.response });
        } else {
            chrome.runtime.sendMessage({
                method: "button-answer",
                status: 'ERROR',
                msg: "Couldn't connect to builder server: error " + xhr.status
            }, function(response) {
                /** NO RESPONSE EXPECTED YET */
            });
            console.log('The request failed!');
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var response = {status: 'OK'};
        if (request.method === 'button-msg' && request.buttonMsg === 'select-site') {
            targetUrl = request.targetAddress;
            chrome.tabs.getSelected(null, function(tab){
                var leonUrlFull = tab.url;
                var match = leonUrlFull.match(/^.+?[^\/:](?=[?\/]|$)/);
                leonUrl = match[0] ? match[0] : leonUrlFull;    
                getCookieAndFetchToken();

            });
        }
        sendResponse(response); 
        
    }
);

function getTokenUrl() {
    return leonUrl +  '/rest/mcs/tokens/';
}


function getCookieAndFetchToken() {
        xhr.open('GET', getTokenUrl());
        xhr.setRequestHeader("accept", "text/plain")
        xhr.send();
        // xhr.setRequestHeader("cookie", "JSESSIONID=" + cookie.value)
}


