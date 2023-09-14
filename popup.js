'use strict';
var query = { active: true, currentWindow: true};
var btn;
var go_to_url;
var cpt = [];
var general_opt = [];
var context_opt = [];


// get current domain
chrome.tabs.query(query, function (tabs) {
    if (tabs.length > 0) {
        var url = tabs[0].url;
        var patt = '^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)';
        var domain = url.match(patt);
        go_to_url = domain[0];
    }
});


// Set buttons
chrome.storage.sync.get('wp_buttons', function(data) {
    if(data.wp_buttons) {
    	btn = data.wp_buttons;	
    } else {
    	btn = {};
    }
    const buttons = Object.entries(btn);

    if(Object.keys(btn).length == 0) {
    	chrome.storage.sync.set({ wp_buttons: btn });
    	document.getElementById("load_btns").innerHTML = "<p>No buttons found - add new button below.</p>";
    } else {
    	document.getElementById("load_btns").innerHTML = '';
    }

    for (const [title, url] of buttons) {
    	document.getElementById("load_btns").innerHTML += `<button class="open-link" data-url="${url}">${title}</button><button class="remove-link" data-remove="${title}">X</button>`;
	}
});


// Set custom post type list
chrome.storage.sync.get('wp_cpts', function(data) {
    if(data.wp_cpts) {
    	cpt = data.wp_cpts;
    } else {
    	cpt = [];
    }

	if(cpt.length == 0) {
		document.getElementById("load_cpts").innerHTML = "<p>No custom post types found - add new CPTs below.</p>";
	} else {
		document.getElementById("load_cpts").innerHTML = '<br>';
	}

	var i;
	for (i = 0; i < cpt.length; i++) {
		document.getElementById("load_cpts").innerHTML += '<button disabled>'+cpt[i]+'</button><button class="remove-cpt" data-remove="'+cpt[i]+'">X</button>';
	}
});











// Function to save the checkbox state to Chrome Storage
function saveCheckboxState() {
	const checkbox = document.getElementById('hide_front_bar');
	const isChecked = checkbox.checked;
	
	chrome.storage.sync.set({ 'hide_front_bar': isChecked }, function () {
	  console.log('Checkbox state saved');
	});
  }
  
  // Function to load the checkbox state from Chrome Storage
  function loadCheckboxState() {
	const checkbox = document.getElementById('hide_front_bar');
	
	chrome.storage.sync.get('hide_front_bar', function (data) {
	  const isChecked = data['hide_front_bar'];
	  checkbox.checked = isChecked;
	  console.log('Checkbox state loaded');
	});
  }
  
  // Event listener for when the checkbox is changed
  const checkbox = document.getElementById('hide_front_bar');
  checkbox.addEventListener('change', saveCheckboxState);
  checkbox.addEventListener('change', testChanges);
  
  // Load the initial state of the checkbox when the popup is opened
  loadCheckboxState();

function testChanges() {
	//console.log(chrome.tabs);
	const body = document.body;
	body.style.backgroundColor = checkbox.checked ? 'green' : 'red';
}



// Function to update CSS based on checkbox state
async function updateCSS() {
  console.log("run");
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (checkbox.checked) {
    console.log("checked");
    try {
      await chrome.scripting.insertCSS({
        target: {
          tabId: tab.id,
        },
        files: ["style.css"],
      });
    } catch (err) {
      console.error(`failed to insert option 1 CSS: ${err}`);
    }
  } else {
    console.log("NOT CHECKED");
    try {
      await chrome.scripting.removeCSS({
        target: {
          tabId: tab.id,
        },
        files: ["style.css"],
      });
    } catch (err) {
      console.error(`failed to remove option 1 CSS: ${err}`);
    }
  }
}


// Add an event listener to the checkbox for click events
checkbox.addEventListener("click", updateCSS);

// Call the updateCSS function when the page loads
window.addEventListener("load", updateCSS);



  














// Set context options checkbox list
chrome.storage.sync.get('wp_context_opts', function(data) {
    if(data.wp_context_opts) {
    	context_opt = data.wp_context_opts;
    } else {
    	context_opt = [];
    }

	var i;
	for (i = 0; i < context_opt.length; i++) {
		document.getElementById(context_opt[i]).checked = true;
	}
});



document.addEventListener('DOMContentLoaded', function (event) {
	// Save button trigger
	document.getElementById("saveButton").addEventListener("click", function() {
		var key = document.getElementById("new_button_title").value;
		var value = document.getElementById("new_button_url").value;
		if(key != '' && value != '') {
			btn[key] = value;
			chrome.storage.sync.set({ wp_buttons: btn });
			window.location.reload();
		}
	});


	// Save CPT trigger
	document.getElementById("saveCPT").addEventListener("click", function() {
		var new_type = document.getElementById("new_cpt").value;
		if(new_type != '') {
			cpt.push(new_type);
			chrome.storage.sync.set({ wp_cpts: cpt });
			window.location.reload();
		}
	});


	// Remove button trigger
	document.addEventListener('click', function (event) {
		if (!event.target.matches('.remove-link')) return; // If clicked element doesn't have the right selector, bail
		var msg = confirm("Remove Button?");
		if (msg == true) {
		    chrome.storage.sync.get('wp_buttons', function(data) {
				var key = event.target.dataset.remove;
			    var btn_array = data.wp_buttons;
			    delete btn_array[key]
			    chrome.storage.sync.set({ wp_buttons: btn_array });
			});
			window.location.reload();
		} else {
		    window.location.reload();
		}
	}, false);


	// Remove CPT trigger
	document.addEventListener('click', function (event) {
		if (!event.target.matches('.remove-cpt')) return; // If clicked element doesn't have the right selector, bail
		var msg = confirm("Remove Custom Post Type?");
		if (msg == true) {
			chrome.storage.sync.get('wp_cpts', function(data) {
				var type = event.target.dataset.remove;
			    var cpt_array = data.wp_cpts.filter(function(e) { return e !== type })
			    chrome.storage.sync.set({ wp_cpts: cpt_array });
			});
			window.location.reload();
		} else {
			window.location.reload();
		}
	}, false);


	// Open link trigger
	document.addEventListener('click', function (event) {		
		if (!event.target.matches('.open-link')) return; // If clicked element doesn't have the right selector, bail
		var path = event.srcElement.dataset.url;
		var link = go_to_url+path;
		window.open(link, '_blank');
	}, false);


	// Save options trigger
	document.addEventListener('click', function (event) {
		// General Options
		if(event.target.className == 'general-checkboxes' && event.target.checked == true) { // Add to opt
			general_opt.push(event.target.value);
			chrome.storage.sync.set({ wp_gen_opts: general_opt });
		} else if(event.target.className == 'general-checkboxes' && event.target.checked == false) { // Remove from opt
			chrome.storage.sync.get('wp_gen_opts', function(data) {
				var unchecked = event.target.value;
			    var gen_opt_array = data.wp_gen_opts.filter(function(e) { return e !== unchecked })
			    chrome.storage.sync.set({ wp_gen_opts: gen_opt_array });
			});
		}

		// Context Menu Options 
		if(event.target.className == 'context-checkboxes' && event.target.checked == true) { // Add to opt
			context_opt.push(event.target.value);
			chrome.storage.sync.set({ wp_context_opts: context_opt });
		} else if(event.target.className == 'context-checkboxes' && event.target.checked == false) { // Remove from opt
			chrome.storage.sync.get('wp_context_opts', function(data) {
				var unchecked = event.target.value;
			    var opt_array = data.wp_context_opts.filter(function(e) { return e !== unchecked })
			    chrome.storage.sync.set({ wp_context_opts: opt_array });
			});
		}
	});


});