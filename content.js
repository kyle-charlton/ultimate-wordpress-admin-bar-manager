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
isWordPressSite()
    .then(isWordPress => {
        if (isWordPress) {
            console.log('This is a WordPress site.');
            chrome.runtime.sendMessage({ cmd: 'addContextMenu' });
        } else {
            console.log('This is not a WordPress site.');
        }
    })
    .catch(error => {
        console.error('Error checking REST API availability:', error);
    });

// Function to open the edit screen for a WordPress page or post
function openEditScreen(pageId, pt = 'pages') {
	console.log("Open edit page");
    const domain = window.location.protocol + '//' + window.location.host;
    const go_to_url = `${domain}/wp-admin/post.php?post=${pageId}&action=edit`;
    window.open(go_to_url, '_blank');
}

// Handle different messages from the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.storage.sync.get('wp_cpts', function (data) {
        const cpt = data.wp_cpts || [];

        if (request === "getClickedEl0") {
            // Go to the WordPress admin dashboard
            const domain = window.location.protocol + '//' + window.location.host + '/';
            const go_to_url = `${domain}wp-admin`;
            window.open(go_to_url, '_blank');
        }

        if (request === "getClickedEl1" || request === "getClickedEl3") {
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
                        console.log(data[0].id);
                        const pageID = data[0].id;
                        openEditScreen(pageID, pt);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        if (request === "getClickedEl2" || request === "getClickedEl4") {
            // Get the current page ID if the right-click menu option is selected
            console.log("getClickedEl2");
			const classList = document.body.classList;
			console.log(classList);
            for (const className of classList) {
                if (className.includes("page-id") || className.includes("postid")) {
                    const domain = window.location.protocol + '//' + window.location.host + '/';
                    const pageId = className.split("-").pop();
                    openEditScreen(pageId);
                }
            }
        }

        if (request === "getClickedEl5") {
            // GET PAGE ID FROM MENU LINK
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
    });
});

// Function to update CSS based on checkbox state
async function updateCSS(isChecked) {
    if (isChecked) {
        const link = document.createElement("link");
        link.href = chrome.runtime.getURL("style.css");
        link.type = "text/css";
        link.rel = "stylesheet";
        console.log(link);
        document.head.appendChild(link);
        console.log("hide admin bar");
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