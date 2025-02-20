console.log("Dovetail search extension loaded");

// Function to analyze page structure
function analyzePageStructure() {
    console.log("Analyzing page structure...");
    
    // Look for iframes
    const iframes = Array.from(document.getElementsByTagName('iframe'));
    console.log("Iframes found:", iframes.map(f => ({src: f.src, id: f.id})));
    
    // Look for all elements with data attributes
    const dataElements = Array.from(document.querySelectorAll('[data-*]'));
    console.log("Elements with data attributes:", 
        dataElements.map(el => ({
            tag: el.tagName,
            dataAttrs: Array.from(el.attributes)
                .filter(attr => attr.name.startsWith('data-'))
                .map(attr => `${attr.name}=${attr.value}`)
        }))
    );
    
    // Look for common app structures
    const appRoot = document.querySelector('#root, #app, [data-reactroot]');
    console.log("App root:", appRoot);
    
    // Look for React devtools
    const reactElements = Array.from(document.querySelectorAll('[data-reactid], [data-react-checksum]'));
    console.log("React elements found:", reactElements.length);
}

// Modified search function to handle shadow DOM
function searchShadowDOM(root) {
    const results = [];
    
    function searchNode(node) {
        // Check if node has shadow root
        if (node.shadowRoot) {
            console.log("Found shadow root:", node);
            searchNode(node.shadowRoot);
        }
        
        // Search regular children
        const children = node.children;
        if (children) {
            for (const child of children) {
                searchNode(child);
            }
        }
        
        // Check text content
        if (node.textContent && node.textContent.trim().length > 20) {
            results.push({
                element: node,
                text: node.textContent.trim()
            });
        }
    }
    
    searchNode(root);
    return results;
}

// Run analysis on page load and when content changes
window.addEventListener('load', analyzePageStructure);

// Observe DOM changes
const observer = new MutationObserver((mutations) => {
    console.log("DOM changed, reanalyzing...");
    analyzePageStructure();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// The rest of your search UI code remains the same...