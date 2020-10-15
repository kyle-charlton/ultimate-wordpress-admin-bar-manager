'use strict';
var query = { active: true, currentWindow: true};
var btn;
var go_to_url;
var cpt = [];
var general_opt = [];
var context_opt = [];


// get current domain
chrome.tabs.query(query, function (tabs) {
    var url = tabs[0].url;
	var patt = '^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)';
	var domain = url.match(patt);
	go_to_url = domain[0];
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


// Set general options checkbox list
chrome.storage.sync.get('wp_gen_opts', function(data) {
    if(data.wp_gen_opts) {
    	general_opt = data.wp_gen_opts;
    } else {
    	general_opt = [];
    }

	var i;
	for (i = 0; i < general_opt.length; i++) {
		document.getElementById(general_opt[i]).checked = true;
	}
});



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

