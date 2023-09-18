console.log("Kyle's Service worker");

// Context menu item definitions
const contextMenuItems = [
	{
		id: 'dashboard_link',
	  	title: '🛠 Open Dashboard',
	  	contexts: ['all'],
	},
	{
		id: 'separator1',
	 	type: 'separator',
	  	contexts: ['all'],
	},
	{
	  	id: 'kc_edit_page_trigger',
	  	title: '✏ Open Editor',
	  	contexts: ['page'],
	},
	{
	  	id: 'kc_get_page_ID_trigger',
	  	title: '🆔 Copy ID',
	  	contexts: ['page'],
	},
	{
	  	id: 'kc_copy_permalink',
	  	title: '✂ Copy Permalink',
	  	contexts: ['all'],
	},
	{
		id: 'kc_open_link_editor',
		title: '✏ Edit Linked WordPress Page',
		contexts: ['link'],
  },
  {
		id: 'kc_get_linked_page_ID_trigger',
		title: '🆔 Copy Linked Page/Post ID',
		contexts: ['link'],
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







/**
 * @see https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-focus-mode/
 * Working test code
 *

chrome.runtime.onInstalled.addListener(() => {
	chrome.action.setBadgeText({
	  	text: "OFF",
	});
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith('https://vanilla.local') ) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id }); // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const nextState = prevState === 'ON' ? 'OFF' : 'ON' // Next state will always be the opposite

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
	if (nextState === "ON") {
		// Insert the CSS file when the user turns the extension on
		console.log("on")
		await chrome.scripting.insertCSS({
		  files: ["style.css"],
		  target: { tabId: tab.id },
		});
	  } else if (nextState === "OFF") {
		console.log("off")
		// Remove the CSS file when the user turns the extension off
		await chrome.scripting.removeCSS({
		  files: ["style.css"],
		  target: { tabId: tab.id },
		});
	  }
	}
  });
  */



  // Check the value of "hide_front_bar" in storage
// chrome.storage.sync.get("hide_front_bar", function(data) {
// 	if (chrome.runtime.lastError) {
// 	  // Handle storage retrieval error
// 	  console.error(chrome.runtime.lastError);
// 	  return;
// 	}
  
// 	// Check the value and perform an action
// 	if (data.hide_front_bar === true) {
// 	  console.log("The 'hide_front_bar' setting is enabled.");
// 	  // Perform your action here
// 	} else {
// 	  console.log("The 'hide_front_bar' setting is not enabled.");
// 	}
//   });


/*
// Function to update CSS based on checkbox state
function updateCSS(tabId, isChecked) {
    if (isChecked) {
        chrome.scripting.insertCSS({
            target: { tabId },
            files: ["style.css"],
        }, () => {
            console.log("Style added");
        });
    } else {
        chrome.scripting.removeCSS({
            target: { tabId },
            files: ["style.css"],
        }, () => {
            console.log("Style removed");
        });
    }
}

// Load the initial state of the checkbox when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get('hide_front_bar', function (data) {
        const isChecked = data.hide_front_bar;
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
                updateCSS(tab.id, isChecked);
            });
        });
    });
});

// Message listener for managing the checkbox state
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'toggle_hide_front_bar') {
        const isChecked = request.value;
        chrome.storage.sync.set({ hide_front_bar: isChecked }, function () {
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(tab => {
                    updateCSS(tab.id, isChecked);
                });
            });
        });
    }
});
*/