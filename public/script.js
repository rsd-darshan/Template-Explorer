let currentPage = 1;
const perPage = 4; // Number of templates to show per view
let totalTemplates = 0; // Track the total number of templates
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; // Load bookmarks from local storage

// Event listeners for input focus
document.getElementById('searchKeyword').addEventListener('input', handleSearchInput);
document.getElementById('templateType').addEventListener('change', handleTypeChange);

function handleSearchInput() {
    const searchKeyword = document.getElementById('searchKeyword');
    const templateType = document.getElementById('templateType');
    
    if (searchKeyword.value.trim().length > 0) {
        templateType.disabled = true;
    } else {
        templateType.disabled = false;
    }
}

function handleTypeChange() {
    const searchKeyword = document.getElementById('searchKeyword');
    const templateType = document.getElementById('templateType');

    if (templateType.value !== '') {
        searchKeyword.disabled = true;
    } else {
        searchKeyword.disabled = false;
    }
}

async function fetchTemplates(page = 1) {
    currentPage = page; // Set the current page
    const type = document.getElementById('templateType').value;
    const keyword = document.getElementById('searchKeyword').value.trim();
    const sortOrder = document.getElementById('sortOrder').value;
    const templatesContainer = document.getElementById('templates');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorContainer = document.getElementById('error');
    templatesContainer.innerHTML = '';
    loadingSpinner.style.display = 'block';
    errorContainer.innerHTML = '';

    // Add skeleton cards while fetching data
    showSkeletonCards(templatesContainer);

    let query = '';
    if (keyword) {
        query = `${keyword}+template+in:name`;
    } else {
        query = `${type}+template+in:name`;
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=${sortOrder}&order=desc&page=${page}&per_page=${perPage}`);
        if (!response.ok) {
            throw new Error('Failed to fetch templates. Please try again later.');
        }
        const data = await response.json();
        totalTemplates = data.total_count;
        renderTemplates(data.items);
        updateArrows();
    } catch (error) {
        console.error('Error fetching templates:', error);
        errorContainer.innerHTML = error.message;
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function showSkeletonCards(container) {
    for (let i = 0; i < perPage; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        const skeletonText1 = document.createElement('div');
        skeletonText1.className = 'skeleton-text';
        const skeletonText2 = document.createElement('div');
        skeletonText2.className = 'skeleton-text';
        skeletonCard.appendChild(skeletonText1);
        skeletonCard.appendChild(skeletonText2);
        container.appendChild(skeletonCard);
    }
}

function renderTemplates(templates) {
    const templatesContainer = document.getElementById('templates');
    templatesContainer.innerHTML = '';

    if (templates.length === 0) {
        templatesContainer.innerHTML = 'No templates found.';
        return;
    }

    templates.forEach(template => {
        const templateDiv = document.createElement('div');
        templateDiv.className = 'template';
        
        const name = document.createElement('h3');
        name.textContent = template.name;

        const description = document.createElement('p');
        description.textContent = template.description || 'No description available.';

        const stars = document.createElement('p');
        stars.textContent = `⭐ ${template.stargazers_count}`;

        const forks = document.createElement('p');
        forks.textContent = `🍴 ${template.forks_count}`;

        const viewRepoButton = document.createElement('button');
        viewRepoButton.textContent = 'View Repo';
        viewRepoButton.onclick = () => viewRepo(template.html_url);

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.onclick = () => downloadTemplate(template.html_url);

        const bookmarkButton = document.createElement('button');
        bookmarkButton.textContent = 'Bookmark';
        bookmarkButton.onclick = () => addBookmark(template);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        actionsDiv.appendChild(viewRepoButton);
        actionsDiv.appendChild(downloadButton);
        actionsDiv.appendChild(bookmarkButton);

        // Add View Demo button if demoLink exists
        if (template.homepage) {
            const viewDemoButton = document.createElement('button');
            viewDemoButton.textContent = 'View Demo';
            viewDemoButton.onclick = () => window.open(template.homepage, '_blank');
            actionsDiv.appendChild(viewDemoButton);
        }

        templateDiv.appendChild(name);
        templateDiv.appendChild(description);
        templateDiv.appendChild(stars);
        templateDiv.appendChild(forks);
        templateDiv.appendChild(actionsDiv);
        templatesContainer.appendChild(templateDiv);
    });
}

function viewRepo(link) {
    window.open(link, '_blank');
}

function downloadTemplate(link) {
    window.open(link + '/archive/refs/heads/main.zip', '_blank');
}

function navigateTemplates(direction) {
    if (direction === 'next' && currentPage * perPage < totalTemplates) {
        fetchTemplates(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
        fetchTemplates(currentPage - 1);
    }
}

function updateArrows() {
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');
    leftArrow.disabled = currentPage === 1;
    rightArrow.disabled = currentPage * perPage >= totalTemplates;
}

function addBookmark(template) {
    if (bookmarks.some(bookmark => bookmark.id === template.id)) {
        alert('Template already bookmarked.');
        return;
    }
    bookmarks.push(template);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarks();
}

function updateBookmarks() {
    const bookmarksContainer = document.getElementById('bookmarkedTemplates');
    bookmarksContainer.innerHTML = '';

    bookmarks.forEach(template => {
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.className = 'bookmarked-template';

        const name = document.createElement('h3');
        name.textContent = template.name;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            bookmarks = bookmarks.filter(bookmark => bookmark.id !== template.id);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            updateBookmarks();
        };

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        actionsDiv.appendChild(removeButton);

        bookmarkDiv.appendChild(name);
        bookmarkDiv.appendChild(actionsDiv);
        bookmarksContainer.appendChild(bookmarkDiv);
    });
}

function clearFilters() {
    document.getElementById('templateType').value = 'ecommerce';
    document.getElementById('searchKeyword').value = '';
    document.getElementById('sortOrder').value = 'stars';
    document.getElementById('searchKeyword').disabled = false;
    document.getElementById('templateType').disabled = false;
    fetchTemplates();
}

// Initial fetch on page load
window.onload = () => {
    fetchTemplates();
    updateBookmarks();
};
