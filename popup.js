window.onload = function() {
    var targetAddressInput = document.getElementById('targetAddress');
    var targetAddress = 'https://mcs-leonru-rc.dev.leoncorp.net';
    var notOkResponseBox = document.getElementById('notOkResponse');
    chrome.storage.sync.get(['targetAddress'], function(result) {
        if (result.targetAddress) targetAddress = result.targetAddress;
        targetAddressInput.value = targetAddress;
      });
	var actionButton = document.getElementById('action');
	if (actionButton) {
		actionButton.addEventListener('click', function(evt) {
            notOkResponseBox.innerHTML = '';
            var targetAddress = targetAddressInput.value;
            chrome.storage.sync.set({targetAddress: targetAddress}, function() {});      
			chrome.runtime.sendMessage({
			    method: "button-msg",
                buttonMsg: "select-site",
                targetAddress: targetAddress
		}, function(response) {
            /** DO NOTHING RIGHT NOW, SEPARATE MESSAGE WILL BE HANDLED */
            
    });
		});
    }

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.method === 'button-answer') {
                if (request.status === 'ERROR') {
                    notOkResponseBox.innerHTML = request.msg;
                } else {
                    window.close();
                }
                sendResponse({status: 'OK'})
            }
        }
    );


}