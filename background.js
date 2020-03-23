chrome.runtime.onMessage.addListener(function(request) {

	if(request.cmd == 'addContextMenu') {
		chrome.contextMenus.removeAll(function() {
			chrome.contextMenus.create({
				title: 'Edit WordPress Page',
				contexts: ['all'],
				onclick: kc_edit_page_trigger,
			});
		});

	} else if(request.cmd == 'addLinkContextMenu') {
		chrome.contextMenus.removeAll(function() {
			chrome.contextMenus.create({
				title: 'Edit Linked WordPress Page',
				contexts: ['all'],
				onclick: kc_edit_linked_page_trigger,
			});
		});

	} else if(request.cmd == 'removeContextMenu') {
		chrome.contextMenus.removeAll();
	}

});


function kc_edit_linked_page_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl1");
}

function kc_edit_page_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl2");
}