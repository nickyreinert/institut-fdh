const ALL_TAG = '__all__';

let projectsData = [];
let activeTags = new Set();
let searchQuery = '';
let currentSection = 'analysisSection';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    await fetchProjects();
    setupEventListeners();
    setupSectionToggles();
    setupSectionNav();
    setupStickyFilterHeight();

    restoreStateFromUrl();
});

async function fetchProjects() {
    try {
        const [site, analysis, tools, nerdenz] = await Promise.all([
            fetch('data-site.json').then((r) => r.json()),
            fetch('data-analysis.json').then((r) => r.json()),
            fetch('data-tools.json').then((r) => r.json()),
            fetch('data-nerdenz.json').then((r) => r.json()),
        ]);

        projectsData = [...analysis.projects, ...tools.projects, ...nerdenz.projects];

        renderTags(site.tags);
        renderSocialLinks(site.site.socials);
        renderProjects();

    } catch (error) {
        console.error('Failed to fetch projects data:', error);
        document.getElementById('analysisGrid').innerHTML = '<p class="error">Failed to load projects.</p>';
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProjects();
        updateUrl();
    });
}

function setupSectionToggles() {
    document.querySelectorAll('.section-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.projects-section');
            const collapsed = section.classList.toggle('collapsed');
            btn.setAttribute('aria-expanded', String(!collapsed));
        });
    });
}

function setupSectionNav() {
    document.querySelectorAll('.header-nav-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.sectionNav;
            const section = document.getElementById(sectionId);
            if (!section) return;

            currentSection = sectionId;
            section.classList.remove('collapsed');
            const toggle = section.querySelector('.section-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');

            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateUrl();
        });
    });
}

function setupStickyFilterHeight() {
    const filterNav = document.querySelector('.register-nav');
    if (!filterNav) return;

    const syncHeight = () => {
        document.documentElement.style.setProperty('--filter-nav-height', `${filterNav.offsetHeight}px`);
    };

    syncHeight();
    window.addEventListener('resize', syncHeight);

    if (window.ResizeObserver) {
        new ResizeObserver(syncHeight).observe(filterNav);
    }
}

function syncTagButtons() {
    document.querySelectorAll('.tag-btn').forEach((btn) => {
        const tag = btn.dataset.tag;
        if (tag === ALL_TAG) {
            btn.classList.toggle('active', activeTags.size === 0);
        } else {
            btn.classList.toggle('active', activeTags.has(tag));
        }
    });
}

function handleAllClick() {
    activeTags.clear();
    syncTagButtons();
    renderProjects();
    updateUrl();
}

function handleTagClick(tag) {
    if (activeTags.has(tag)) {
        activeTags.delete(tag);
    } else {
        activeTags.add(tag);
    }
    syncTagButtons();
    renderProjects();
    updateUrl();
}

function renderTags(tags) {
    const container = document.getElementById('tagFilters');
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'tag-btn active';
    allBtn.textContent = 'Alle';
    allBtn.dataset.tag = ALL_TAG;
    allBtn.type = 'button';
    allBtn.addEventListener('click', handleAllClick);
    container.appendChild(allBtn);

    tags.forEach((tag) => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.textContent = tag;
        btn.dataset.tag = tag;
        btn.type = 'button';
        btn.addEventListener('click', () => handleTagClick(tag));
        container.appendChild(btn);
    });
}

function renderSocialLinks(socials) {
    const container = document.getElementById('socialLinks');
    container.innerHTML = '';
    
    if (socials.blog) {
        container.innerHTML += `<a href="${socials.blog}" target="_blank" rel="noopener noreferrer">Blog</a>`;
    }
    if (socials.ministerium) {
        container.innerHTML += `<a href="${socials.ministerium}" target="_blank" rel="noopener noreferrer">Das Ministerium</a>`;
    }
    if (socials.github) {
        container.innerHTML += `<a href="${socials.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
    }
}

function renderProjects() {
    const analysisGrid = document.getElementById('analysisGrid');
    const toolsGrid = document.getElementById('toolsGrid');
    const nerdenzGrid = document.getElementById('nerdenzGrid');
    
    analysisGrid.innerHTML = '';
    toolsGrid.innerHTML = '';
    nerdenzGrid.innerHTML = '';
    
    let analysisCount = 0;
    let nerdenzCount = 0
    let toolsCount = 0;

    
    projectsData.forEach((project) => {
        const matchesSearch = !searchQuery || 
            project.title.toLowerCase().includes(searchQuery) ||
            project.description.toLowerCase().includes(searchQuery) ||
            project.tags.some((t) => t.toLowerCase().includes(searchQuery));
            
        const matchesTags = activeTags.size === 0 || 
            project.tags.some((t) => activeTags.has(t));
            
        if (!matchesSearch || !matchesTags) return;
        
        const imgSrc = (project.image || `gfx/screenshots/${project.category}/${project.id}.jpg`)
            .replace(/^docs\//, '');

        const cardHtml = `
            <article class="card">
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="card-link" aria-label="Open: ${project.title}">Open</a>
                
                <!-- 2. Image Wrapper -->
                <div class="card-img-wrapper">
                    <img src="${imgSrc}" alt="${project.title}" class="card-img" loading="lazy" 
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    
                    <!-- 3. Fallback placeholder (hidden by default, shown if image fails) -->
                    <div class="card-img-placeholder" aria-hidden="true" style="display: none;">
                        <span class="card-aktenzeichen">${project.id}</span>
                    </div>
                </div>

                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${project.title}</h3>
                        <span class="card-year">${project.year}</span>
                    </div>
                    <p class="card-desc">${project.description}</p>
                    <div class="card-tags">
                        ${project.tags.map((t) => `<span class="card-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </article>
        `;        
        if (project.category.toLowerCase() === 'analysis') {
            analysisGrid.innerHTML += cardHtml;
            analysisCount++;
        } else if (project.category.toLowerCase() === 'nerdenz') {
            nerdenzGrid.innerHTML += cardHtml;
            nerdenzCount++;
        } else {
            toolsGrid.innerHTML += cardHtml;
            toolsCount++;
        }
    });
    
    if (analysisCount === 0) {
        analysisGrid.innerHTML = '<p class="text-secondary">Keine Einträge.</p>';
    }
    if (toolsCount === 0) {
        toolsGrid.innerHTML = '<p class="text-secondary">Keine Einträge.</p>';
    }
    if (nerdenzCount === 0) {
        nerdenzGrid.innerHTML = '<p class="text-secondary">Keine Einträge.</p>';
    }

    updateCountFor('analysis', analysisCount);
    updateCountFor('tools', toolsCount);
    updateCountFor('nerdenz', nerdenzCount);
}

function updateCountFor(key, count) {
    document.querySelectorAll(`[data-count-for="${key}"]`).forEach((el) => {
        el.textContent = count;
    });
}

function updateUrl() {
    const params = new URLSearchParams();

    if (currentSection !== 'analysisSection') {
        params.set('section', currentSection);
    }

    if (searchQuery) {
        params.set('search', searchQuery);
    }

    if (activeTags.size > 0) {
        const tagsArray = Array.from(activeTags).sort();
        params.set('tags', tagsArray.join(','));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
}

function restoreStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const search = params.get('search');
    const tagsParam = params.get('tags');

    if (search) {
        searchQuery = search.toLowerCase();
        document.getElementById('searchInput').value = search;
    }

    if (tagsParam) {
        activeTags = new Set(tagsParam.split(',').filter(Boolean));
    }

    syncTagButtons();
    renderProjects();

    if (section && document.getElementById(section)) {
        currentSection = section;
        const sectionEl = document.getElementById(section);
        setTimeout(() => {
            sectionEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 0);
    }
}
