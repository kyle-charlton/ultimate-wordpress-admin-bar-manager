// Context menu item definitions
const contextMenuItems = [
	{
		id: 'dashboard_link',
	  	title: '🛠 WordPress Dashboard',
	  	contexts: ['all'],
	},
	{
		id: 'separator1',
	 	type: 'separator',
	  	contexts: ['all'],
	},
	{
	  	id: 'kc_edit_page_trigger',
	  	title: '✏ Edit WordPress Page',
	  	contexts: ['all'],
	},
	{
	  	id: 'kc_get_page_ID_trigger',
	  	title: '🆔 Copy Page/Post ID',
	  	contexts: ['all'],
	},
	{
	  	id: 'kc_copy_permalink',
	  	title: '✂ Copy Permalink',
	  	contexts: ['all'],
	},
	// Add more menu items here as needed
];
  
// Function to create context menu items
function createContextMenus() {
	contextMenuItems.forEach((item) => {
  		chrome.contextMenus.create(item);
	});
}
  
// Function to remove all context menu items
function removeAllContextMenus() {
	chrome.contextMenus.removeAll();
}
  
// Handle menu item clicks using chrome.contextMenus.onClicked event
chrome.contextMenus.onClicked.addListener(function (info, tab) {
	switch (info.menuItemId) {
		case 'dashboard_link':
			kc_dashboard_trigger(info, tab);
			break;
	  	case 'kc_edit_page_trigger':
			kc_edit_page_trigger(info, tab);
			break;
	  	case 'kc_get_page_ID_trigger':
			kc_get_page_ID_trigger(info, tab);
			break;
	  	case 'kc_copy_permalink':
			kc_copy_permalink(info, tab);
			break;
	  	case 'kc_edit_linked_page_trigger':
			kc_edit_linked_page_trigger(info, tab);
			break;
	  	case 'edit_linked_page':
			kc_get_linked_page_ID_trigger(info, tab);
			break;
	  	// Handle more menu items here as needed
	}
});
  
// Message listener for managing context menus
chrome.runtime.onMessage.addListener(function (request) {
	if (request.cmd == 'addContextMenu') {
	  	removeAllContextMenus();
	  	createContextMenus();
	} else if (request.cmd == 'addLinkContextMenu') {
	  	removeAllContextMenus();
	  	createContextMenus();
	} else if (request.cmd == 'removeContextMenu') {
	  	removeAllContextMenus();
	}
  
	const context_opt = []; // Set custom post type
	chrome.storage.sync.get('wp_context_opts', function (data) {
		const contextOpt = data.wp_context_opts || [];
  
	  	contextOpt.forEach((item) => {
			chrome.contextMenus.remove(item);
	  	});
	});
});

// Define your click event handlers here
function kc_dashboard_trigger(info, tab) {
	chrome.tabs.sendMessage(tab.id, 'getClickedEl0');
}

function kc_edit_page_trigger(info, tab) {
	chrome.tabs.sendMessage(tab.id, 'getClickedEl2');
}

function kc_get_page_ID_trigger(info, tab) {
	chrome.tabs.sendMessage(tab.id, 'getClickedEl4');
}

function kc_copy_permalink(info, tab) {
	chrome.tabs.sendMessage(tab.id, 'getClickedEl5');
}

function kc_edit_linked_page_trigger(info, tab) {
	chrome.tabs.sendMessage(tab.id, 'getClickedEl1');
}

function kc_get_linked_page_ID_trigger(info, tab) {
	chrome.tabs.sendMessage(tab.id, 'getClickedEl3');
}