// https://chrome-apps-doc2.appspot.com/extensions/contextMenus.html#method-create

chrome.runtime.onMessage.addListener(function(request) {

	if(request.cmd == 'addContextMenu') {
		chrome.contextMenus.removeAll(function() {
			chrome.contextMenus.create({
				title: '🛠 WordPress Dashboard',
				contexts: ['all'],
				onclick: kc_dashboard_trigger,
			});
			chrome.contextMenus.create({
				type: 'separator',
			    contexts: ['all']
			});
			chrome.contextMenus.create({
				title: '✏ Edit WordPress Page',
				contexts: ['all'],
				onclick: kc_edit_page_trigger,
			});
			chrome.contextMenus.create({
				title: '🆔 Copy Page/Post ID',
				contexts: ['all'],
				onclick: kc_get_page_ID_trigger,
			});
			chrome.contextMenus.create({
				title: '✄ Copy Permalink',
				contexts: ['all'],
				onclick: kc_copy_permalink,
			});
		});

	} else if(request.cmd == 'addLinkContextMenu') {
		chrome.contextMenus.removeAll(function() {
			chrome.contextMenus.create({
				title: '🛠 WordPress Dashboard',
				contexts: ['all'],
				onclick: kc_dashboard_trigger,
			});
			chrome.contextMenus.create({
				type: 'separator',
			    contexts: ['all']
			});
			chrome.contextMenus.create({
				title: '✏ Edit Linked WordPress Page',
				contexts: ['all'],
				onclick: kc_edit_linked_page_trigger,
			});
			chrome.contextMenus.create({
				title: '🆔 Copy Linked Page/Post ID',
				contexts: ['all'],
				onclick: kc_get_linked_page_ID_trigger,
			});
			chrome.contextMenus.create({
				title: '✄ Copy Permalink',
				contexts: ['all'],
				onclick: kc_copy_permalink,
			});
		});

	} else if(request.cmd == 'removeContextMenu') {
		chrome.contextMenus.removeAll();
	}

});

function kc_dashboard_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl0");
}

function kc_edit_linked_page_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl1");
}

function kc_edit_page_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl2");
}

function kc_get_linked_page_ID_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl3");
}

function kc_get_page_ID_trigger(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl4");
}

function kc_copy_permalink(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl5");
}