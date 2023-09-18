
// Function to check if the website is a WordPress site by checking if the WordPress REST API is available
async function isWordPressSite() {
    const apiUrl = '/wp-json/';
    try {
        const response = await fetch(apiUrl);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Check if it's a WordPress site
isWordPressSite().then(isWordPress => {
    chrome.runtime.sendMessage({ cmd: isWordPress ? 'addContextMenu' : 'removeContextMenu' });
}).catch(error => {
    console.error('Error checking REST API availability:', error);
});


// Function to open the edit screen for a WordPress page or post
function openEditScreen(pageId, pt = 'pages') {
	//console.log("Open edit page");
    const domain = window.location.protocol + '//' + window.location.host;
    const go_to_url = `${domain}/wp-admin/post.php?post=${pageId}&action=edit`;
    window.open(go_to_url, '_blank');
}

// Handle different messages from the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.storage.sync.get('wp_cpts', function (data) {
        const cpt = data.wp_cpts || [];

        // Go to the WordPress admin dashboard
        if (request === "openDashboard") {
            const dashboard = window.location.protocol + '//' + window.location.host + '/wp-admin';
            window.open(dashboard, '_blank');
        }

        // Go to the current page's editor
        if (request === "openEditor") {
			const classList = document.body.classList;
            for (const className of classList) {
                if (className.includes("page-id") || className.includes("postid")) {
                    const pageId = className.split("-").pop();
                    openEditScreen(pageId);
                }
            }
        }

        // Get page ID from page
        if (request === "getID") {
			const classList = document.body.classList;
            for (const className of classList) {
                if (className.includes("page-id") || className.includes("postid")) {
                    const pageId = className.split("-").pop();
                    const dummy = document.createElement('input');
                    dummy.className = "kc-getID";
                    dummy.value = pageId;
                    document.body.appendChild(dummy);
                    dummy.select();
                    document.execCommand('copy');
                    document.body.removeChild(dummy);
                }
            }
        }

        // Get permalink from page
        if (request === "getPermalink") {
            const domain = window.location.protocol + '//' + window.location.host;
            const link = document.activeElement.href || window.location.href;
            const fullSlug = link.replace(domain, '');
            const fullSlugParse = fullSlug.replace(/\/$/, ''); // Remove trailing slash
            const dummy = document.createElement('input');
            dummy.className = "kc-getID";
            dummy.value = fullSlugParse;
            document.body.appendChild(dummy);
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
        }

        // Get page ID from menu link
        if (request === "openReferencedEditor" || request === "getReferencedID") {
            // Handle menu link or generic link click
            const domain = window.location.protocol + '//' + window.location.host;
            const link = document.activeElement.href || window.location.href;
            const fullSlug = link.replace(domain, '');
            const fullSlugParse = fullSlug.replace(/\/$/, ''); // Remove trailing slash
            const slug = fullSlugParse.split('/').pop();
            let pt = 'pages'; // Default value for pt

            for (const customPt of cpt) {
                if (link.includes(customPt)) {
                    console.log(customPt);
                    pt = customPt;
                    break;
                }
            }

            fetch(`${domain}/wp-json/wp/v2/${pt}?slug=${slug}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        //console.log(data[0].id);
                        const pageID = data[0].id;
                        openEditScreen(pageID, pt);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        
    });
});




// Function to update CSS based on checkbox state
function updateCSS(isChecked) {
    if (isChecked) {
        const link = document.createElement("link");
        link.href = chrome.runtime.getURL("style.css");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.id = "hideAdminBar"; 
        document.head.appendChild(link);
        //console.log("hide admin bar");
    } else {
        console.log('remove styles');
    }
}

// Function to load the checkbox state from Chrome Storage
function loadCheckboxState() {
    chrome.storage.sync.get('hide_front_bar', function (data) {
        const isChecked = data['hide_front_bar'];
        updateCSS(isChecked); // Call updateCSS when the page loads
    });
}

// Load the initial state of the checkbox when the content script is executed
loadCheckboxState();




chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.toggleContent !== undefined) {
        // Handle the message here, for example:
        if (message.toggleContent) {
            // Checkbox is checked, perform some action in content.js
            console.log('checked');
        } else {
            // Checkbox is unchecked, undo the action if needed.
            console.log('unchecked');
            const stylesheet = document.getElementById("hideAdminBar");
            if (stylesheet) {
                stylesheet.parentNode.removeChild(stylesheet);
            }
        }
    }

    // Rest of your content.js code...
});