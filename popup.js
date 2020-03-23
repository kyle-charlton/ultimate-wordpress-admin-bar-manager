'use strict';
var query = { active: true, currentWindow: true};
var btn;
var go_to_url;
var cpt = [];

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
    	document.getElementById("load_btns").innerHTML += `<p><button class="open-link" data-url="${url}">${title}</button><button class="remove-link" data-remove="${title}">X</button></p>`;
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
		document.getElementById("load_cpts").innerHTML = '';
	}

	var i;
	for (i = 0; i < cpt.length; i++) {
		document.getElementById("load_cpts").innerHTML += '<p><button disabled>'+cpt[i]+'</button><button class="remove-cpt" data-remove="'+cpt[i]+'">X</button></p>';
	}
});

document.addEventListener('DOMContentLoaded', function () {

	// Add button trigger
	document.getElementById("addButton").addEventListener("click", function() {
		const cpt = document.querySelector("#new_cpt_fields");
		if(cpt.classList.contains("js-active")) {
			document.querySelector("#new_cpt_fields.js-active").classList.remove("js-active");	
			document.getElementById("addCPT").style.display = 'block';
			document.getElementById("cancelAddCPT").style.display = 'none';
		}
		document.getElementById("new_button_fields").classList.add("js-active");
		
		this.style.display = 'none';
		document.getElementById("cancelAddButton").style.display = 'block';
	});

	// Cancel button trigger 
	document.getElementById("cancelAddButton").addEventListener("click", function() {
		this.style.display = 'none';
		document.getElementById("addButton").style.display = 'block';
		document.querySelector("#new_button_fields.js-active").classList.remove("js-active");
	});	

	// Add CPT trigger
	document.getElementById("addCPT").addEventListener("click", function() {
		const new_btn = document.querySelector("#new_button_fields");
		if(new_btn.classList.contains("js-active")) {
			document.querySelector("#new_button_fields.js-active").classList.remove("js-active");	
			document.getElementById("addButton").style.display = 'block';
			document.getElementById("cancelAddButton").style.display = 'none';
		}
		document.getElementById("new_cpt_fields").classList.add("js-active");

		this.style.display = 'none';
		document.getElementById("cancelAddCPT").style.display = 'block';
	});

	// Cancel CPT trigger 
	document.getElementById("cancelAddCPT").addEventListener("click", function() {
		this.style.display = 'none';
		document.getElementById("addCPT").style.display = 'block';
		document.querySelector("#new_cpt_fields.js-active").classList.remove("js-active");
	});

	// Show CPT trigger
	document.getElementById("showCPT").addEventListener("click", function() {
		 document.getElementById("load_cpts").classList.add("js-active");
		 this.style.display = 'none';
		document.getElementById("hideCPT").style.display = 'block';
	});

	// Hide CPT trigger 
	document.getElementById("hideCPT").addEventListener("click", function() {
		this.style.display = 'none';
		document.getElementById("showCPT").style.display = 'block';
		document.getElementById("load_cpts").classList.remove("js-active");
	});

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
			chrome.storage.sync.get('wp_buttons', function(data) {
			var key = event.target.dataset.remove;
		    var btn_array = data.wp_buttons;
		    delete btn_array[key]
		    chrome.storage.sync.set({ wp_buttons: btn_array });
		});
		window.location.reload();
	}, false);

	// Remove CPT trigger
	document.addEventListener('click', function (event) {
		if (!event.target.matches('.remove-cpt')) return; // If clicked element doesn't have the right selector, bail
			chrome.storage.sync.get('wp_cpts', function(data) {
			var type = event.target.dataset.remove;
		    var cpt_array = data.wp_cpts.filter(function(e) { return e !== type })
		    chrome.storage.sync.set({ wp_cpts: cpt_array });
		});
		window.location.reload();
	}, false);

	// Open link trigger
	document.addEventListener('click', function (event) {		
		if (!event.target.matches('.open-link')) return; // If clicked element doesn't have the right selector, bail
		var path = event.srcElement.dataset.url;
		var link = go_to_url+path;
		window.open(link, '_blank');
	}, false);

});

