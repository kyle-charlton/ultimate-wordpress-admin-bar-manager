// Remove margin top when admin bar removed
var original_style = document.querySelector('html').getAttribute('style') ? document.querySelector('html').getAttribute('style') : '';
document.querySelector('html').setAttribute('style', 'margin-top: 0 !important;'+original_style);




// Function to check if the website is a WordPress site by checking if the WordPress REST API is available 
function isWordPressSite() {
	const apiUrl = '/wp-json/';
	return fetch(apiUrl)
	  	.then(response => response.ok)
	  	.catch(() => false);
}


// On right click and if visiting a WordPress site add context menu
//document.addEventListener("mousedown", function(event){
//document.addEventListener('DOMContentLoaded', () => {	
    //if(event.button == 2) { // If right click
		// Check if it's a WordPress site
		isWordPressSite().then(isWordPress => {
			if (isWordPress) {
				console.log('This is a WordPress site.');
				//var target = event.target;
				//var menuParents = target.closest(".menu-item");
				//chrome.runtime.sendMessage(menuParents ? { cmd: 'addLinkContextMenu' } : { cmd: 'addContextMenu' });
				chrome.runtime.sendMessage({ cmd: 'addContextMenu' });
			} else {
				chrome.runtime.sendMessage({cmd: 'removeContextMenu'});
				console.log('This is not a WordPress site.');
			}
		}).catch(error => {
			console.error('Error checking REST API availability:', error);
		});
    //}
//}, true);








chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
/*	var general_opt = []; // set custom post type 
	chrome.storage.sync.get('wp_gen_opts', function(data) {
	    if(data.wp_gen_opts) {
	    	general_opt = data.wp_opts;
	    } else {
	    	general_opt = [];
	    }

	    //for (i = 0; i < opt.length; i++) {
	    //	chrome.contextMenus.remove(opt[i]);
		//}
		console.log(wp_opts)
		if(general_opt.indexOf('hide_front_bar')){
			console.log('true')
		}
	});*/


	var cpt = []; // set custom post type 
	chrome.storage.sync.get('wp_cpts', function(data) {
	    if(data.wp_cpts) {
	    	cpt = data.wp_cpts;
	    } else {
	    	cpt = [];
	    }

	    if(request == "getClickedEl0") { // Go to current page edit screen if body right clicked
	    	var domain = window.location.protocol + "//" + window.location.host + "/";
	        var go_to_url = domain+'wp-admin';
	        window.open(go_to_url, '_blank');
	    }

	    // if(request == "getClickedEl1") { // Go to menu page's edit screen if link in menu right clicked
		// 	var domain = window.location.protocol + "//" + window.location.host; // get domain
		// 	var link = document.activeElement.href; // get link href
		// 	var full_slug = link.replace(domain, ""); // remove domain
		// 	var full_slug_parse = full_slug.substring(0, full_slug.length-1); // remove back slash from end of url
		// 	var slug = full_slug_parse.split("/").pop(); // get the slug
		// 	var i;
		// 	for (i = 0; i < cpt.length; i++) {
		// 		if(link.includes(cpt[i]) ) {
		// 			console.log(cpt[i]);
		// 			pt = cpt[i];
		// 		} else {
		// 			pt = 'pages';
		// 		}
		// 	}
		// 	jQuery.get(domain+'/wp-json/wp/v2/'+pt+'?slug='+slug, function(data) {
		// 		console.log(data[0]['id']);
		// 		var pageID = data[0]['id'];
		// 		var go_to_url = domain+'/wp-admin/post.php?post='+pageID+'&action=edit';
		// 	    window.open(go_to_url, '_blank');
		// 	});			
	    // }

		if (request === "getClickedEl1") {
			// Go to menu page's edit screen if link in menu is right-clicked
			var domain = window.location.protocol + "//" + window.location.host; // Get domain
			var link = document.activeElement.href; // Get link href
			var full_slug = link.replace(domain, ""); // Remove domain
			var full_slug_parse = full_slug.substring(0, full_slug.length - 1); // Remove backslash from the end of the URL
			var slug = full_slug_parse.split("/").pop(); // Get the slug
			var pt = 'pages'; // Default value for pt
		  
			for (var i = 0; i < cpt.length; i++) {
			  if (link.includes(cpt[i])) {
				console.log(cpt[i]);
				pt = cpt[i];
				break; // Exit the loop when a match is found
			  }
			}
		  
			fetch(domain + '/wp-json/wp/v2/' + pt + '?slug=' + slug)
			  .then(function (response) {
				return response.json();
			  })
			  .then(function (data) {
				console.log(data[0]['id']);
				var pageID = data[0]['id'];
				var go_to_url = domain + '/wp-admin/post.php?post=' + pageID + '&action=edit';
				window.open(go_to_url, '_blank');
			  })
			  .catch(function (error) {
				console.error('Error:', error);
			  });
		  }
		  


	    if(request == "getClickedEl2") { // Go to current page edit screen if body right clicked
			var classList = document.getElementsByTagName('body')[0].classList;
			for (var i = 0; i < classList.length; i++) {
			    if (classList[i].includes("page-id") || classList[i].includes("postid")) {
			    	var domain = window.location.protocol + "//" + window.location.host + "/";
			        var pageId = classList[i].split("-").pop(); 
			        var go_to_url = domain+'wp-admin/post.php?post='+pageId+'&action=edit';
			        //console.log(sender);
			        window.open(go_to_url, '_blank');
			        /*jQuery("body").keypress(function (e) {
				        if (e.keyCode == 17) { // Ctrl
				        	window.open(go_to_url, '_blank');
				        } else {
				        	window.open(go_to_url, '_self'); // _blank
				        }
				    });*/
			    }
			}
	    }


	    // if(request == "getClickedEl3") { // GET PAGE ID FROM MENU LINK
	    // 	var domain = window.location.protocol + "//" + window.location.host; // get domain
		// 	var link = document.activeElement.href; // get link href
		// 	var full_slug = link.replace(domain, ""); // remove domain
		// 	var full_slug_parse = full_slug.substring(0, full_slug.length-1); // remove back slash from end of url
		// 	var slug = full_slug_parse.split("/").pop(); // get the slug
		// 	var i;
		// 	for (i = 0; i < cpt.length; i++) {
		// 		if(link.includes(cpt[i]) ) {
		// 			console.log(cpt[i]);
		// 			pt = cpt[i];
		// 		} else {
		// 			pt = 'pages';
		// 		}
		// 	}
		// 	jQuery.get(domain+'/wp-json/wp/v2/'+pt+'?slug='+slug, function(data) {
		// 		console.log(data[0]['id']);
		// 		var pageID = data[0]['id'];
 		// 		var dummy = $('<input class="kc-getID">').val(pageID).appendTo('body').select()
 		// 		document.execCommand('copy')
 		// 		$('.kc-getID').remove();
		// 	});	
	    // }

		if (request == "getClickedEl3") {
			var domain = window.location.protocol + "//" + window.location.host; // get domain
			var link = document.activeElement.href; // get link href
			var full_slug = link.replace(domain, ""); // remove domain
			var full_slug_parse = full_slug.substring(0, full_slug.length - 1); // remove backslash from the end of the URL
			var slug = full_slug_parse.split("/").pop(); // get the slug
			var pt = 'pages'; // Default value for pt
			for (var i = 0; i < cpt.length; i++) {
				if (link.includes(cpt[i])) {
					console.log(cpt[i]);
					pt = cpt[i];
					break; // Exit the loop once a match is found
				}
			}
			var xhr = new XMLHttpRequest();
			xhr.open('GET', domain + '/wp-json/wp/v2/' + pt + '?slug=' + slug, true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					var data = JSON.parse(xhr.responseText);
					if (data.length > 0) {
						console.log(data[0].id);
						var pageID = data[0].id;
						var dummyInput = document.createElement('input');
						dummyInput.className = 'kc-getID';
						dummyInput.value = pageID;
						document.body.appendChild(dummyInput);
						dummyInput.select();
						document.execCommand('copy');
						document.body.removeChild(dummyInput);
					}
				}
			};
			xhr.send();
		}
		


	    // if(request == "getClickedEl4") { // Get current page ID if right click menu option selected
		// 	var classList = document.getElementsByTagName('body')[0].classList;
		// 	for (var i = 0; i < classList.length; i++) {
		// 	    if (classList[i].includes("page-id") || classList[i].includes("postid")) {
		// 	    	var domain = window.location.protocol + "//" + window.location.host + "/";
		// 	        var pageId = classList[i].split("-").pop(); 
		// 	        var dummy = $('<input class="kc-getID">').val(pageId).appendTo('body').select()
 		// 			document.execCommand('copy')
 		// 			$('.kc-getID').remove();
		// 	    }
		// 	}
	    // }


	    // if(request == "getClickedEl5") { // GET PAGE ID FROM MENU LINK
	    // 	var domain = window.location.protocol + "//" + window.location.host; // get domain
	    // 	var link = (document.activeElement.href) ? document.activeElement.href : window.location.href; // if menu link right clicked get link href else get page href
		// 	var full_slug = link.replace(domain, ""); // remove domain
		// 	console.log(full_slug);
		// 	var dummy = $('<input class="kc-getID">').val(full_slug).appendTo('body').select() // add permalink to input and select
		// 	document.execCommand('copy') // copy permalink
		// 	$('.kc-getID').remove(); // remove input
	    // }

		if (request === "getClickedEl4") {
			// Get current page ID if right-click menu option selected
			var classList = document.getElementsByTagName('body')[0].classList;
			for (var i = 0; i < classList.length; i++) {
			  if (classList[i].includes("page-id") || classList[i].includes("postid")) {
				var domain = window.location.protocol + "//" + window.location.host + "/";
				var pageId = classList[i].split("-").pop();
				var dummy = document.createElement('input');
				dummy.className = "kc-getID";
				dummy.value = pageId;
				document.body.appendChild(dummy);
				dummy.select();
				document.execCommand('copy');
				document.body.removeChild(dummy);
			  }
			}
		  }
		  
		  if (request === "getClickedEl5") {
			// GET PAGE ID FROM MENU LINK
			var domain = window.location.protocol + "//" + window.location.host; // Get domain
			var link = (document.activeElement.href) ? document.activeElement.href : window.location.href; // If menu link right-clicked, get link href; else, get page href
			var full_slug = link.replace(domain, ""); // Remove domain
			console.log(full_slug);
			var dummy = document.createElement('input');
			dummy.className = "kc-getID";
			dummy.value = full_slug;
			document.body.appendChild(dummy);
			dummy.select();
			document.execCommand('copy');
			document.body.removeChild(dummy);
		  }
		  


	});
});
