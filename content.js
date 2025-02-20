// Log that extension is loaded
console.log("Dovetail search extension loaded");

// Function to find text content that looks like a highlight
function findHighlightContent() {
    // Walk through all nodes in the document
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                const text = node.textContent.trim();
                if (text.length > 20 && node.parentElement) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        }
    );

    let textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push({
            text: node.textContent,
            element: node.parentElement
        });
    }
    return textNodes;
}

function performSearch() {
    const searchTerm = document.getElementById('dt-search-input').value.toLowerCase();
    console.log("Searching for:", searchTerm);
    
    const textNodes = findHighlightContent();
    console.log("Found text nodes:", textNodes);
    
    let matchCount = 0;
    
    // Clear previous highlights
    document.querySelectorAll('.dt-highlight-match').forEach(el => {
        el.classList.remove('dt-highlight-match');
        el.style.backgroundColor = '';
    });
    
    // Search and highlight matches
    textNodes.forEach(({text, element}) => {
        if (text.toLowerCase().includes(searchTerm)) {
            console.log("Found match:", text);
            element.classList.add('dt-highlight-match');
            element.style.backgroundColor = 'yellow';
            matchCount++;
            
            // Also highlight any parent cards/containers
            let parent = element.parentElement;
            for (let i = 0; i < 3; i++) {
                if (parent) {
                    parent.classList.add('dt-highlight-match');
                    parent = parent.parentElement;
                }
            }
        }
    });
    
    document.getElementById('dt-search-count').textContent = `${matchCount} matches`;
}

function createSearchUI() {
    const container = document.createElement('div');
    container.id = 'dt-search-container';
    
    const searchInput = document.createElement('input');
    searchInput.id = 'dt-search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search highlights...';
    
    const countLabel = document.createElement('span');
    countLabel.id = 'dt-search-count';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.onclick = closeSearch;
    
    container.appendChild(searchInput);
    container.appendChild(countLabel);
    container.appendChild(closeButton);
    document.body.appendChild(container);
    
    searchInput.addEventListener('input', performSearch);
}

function initializeSearch() {
    if (!document.getElementById('dt-search-container')) {
        createSearchUI();
    }
    document.getElementById('dt-search-input').focus();
}

function closeSearch() {
    const container = document.getElementById('dt-search-container');
    if (container) {
        container.remove();
    }
    
    document.querySelectorAll('.dt-highlight-match').forEach(el => {
        el.classList.remove('dt-highlight-match');
        el.style.backgroundColor = '';
    });
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .dt-highlight-match {
        background-color: rgba(255, 255, 0, 0.3) !important;
        border: 2px solid #FFD700 !important;
        border-radius: 4px !important;
    }
`;
document.head.appendChild(style);

// Single event listener for Ctrl+F
document.addEventListener('keydown', function(e) {
    console.log("Key pressed:", e.key);
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        console.log("Ctrl+F detected!");
        e.preventDefault();
        initializeSearch();
    }
});