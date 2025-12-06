document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const languageSelect = document.getElementById('language');
    const domainSelect = document.getElementById('google-domain');
    const searchInput = document.getElementById('search-query');
    const cityInput = document.getElementById('city');
    const searchBtn = document.getElementById('search-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const searchTypeSelect = document.getElementById('search-type');
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Populate Dropdowns
    if (typeof countries !== 'undefined') {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    }

    if (typeof languages !== 'undefined') {
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            languageSelect.appendChild(option);
        });
    }

    if (typeof googleDomains !== 'undefined') {
        googleDomains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain.value;
            option.textContent = domain.label;
            domainSelect.appendChild(option);
        });
    }

    // Set Defaults (Germany / German / google.de)
    countrySelect.value = 'de';
    languageSelect.value = 'de';
    if (domainSelect) domainSelect.value = 'google.de';

    // Load History and Autocomplete
    const loadHistory = () => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        historyList.innerHTML = '';

        // Autocomplete Sets
        const uniqueQueries = new Set();
        const uniqueCities = new Set();

        history.forEach((item, index) => {
            // Add to autocomplete
            if (item.query) uniqueQueries.add(item.query);
            if (item.city) uniqueCities.add(item.city);

            // Render History Item
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            let details = `${item.country.toUpperCase()} | ${item.lang.toUpperCase()}`;
            if (item.domain && item.domain !== 'google.com') details += ` | ${item.domain}`; // Added domain to history display
            if (item.city) details += ` | ${item.city}`;

            const typeMap = {
                'isch': 'Bilder',
                'lcl': 'Orte',
                'nws': 'News',
                'shop': 'Shopping',
                'vid': 'Videos'
            };
            if (item.type) details += ` | ${typeMap[item.type] || item.type}`;

            // Add Device Badge
            const deviceLabel = item.device === 'mobile' ? 'Mobil' : 'Desktop';
            details += ` | ${deviceLabel}`;

            if (item.adTest) details += ` | AdTest`;

            historyItem.innerHTML = `
                <div class="history-content">
                    <span class="history-query">${item.query}</span>
                    <span class="history-details">${details}</span>
                </div>
            `;

            historyItem.addEventListener('click', () => {
                searchInput.value = item.query;
                cityInput.value = item.city || '';
                countrySelect.value = item.country;
                languageSelect.value = item.lang;
                if (domainSelect && item.domain) domainSelect.value = item.domain; // Set domain from history
                document.getElementById('device').value = item.device || 'desktop';
                document.getElementById('adtest-toggle').checked = item.adTest || false;
                searchTypeSelect.value = item.type || '';
            });

            historyList.appendChild(historyItem);
        });

        // Populate Datalists
        const queryDatalist = document.getElementById('history-queries');
        const cityDatalist = document.getElementById('history-cities');

        if (queryDatalist && cityDatalist) {
            queryDatalist.innerHTML = '';
            cityDatalist.innerHTML = '';

            uniqueQueries.forEach(q => {
                const option = document.createElement('option');
                option.value = q;
                queryDatalist.appendChild(option);
            });

            uniqueCities.forEach(c => {
                const option = document.createElement('option');
                option.value = c;
                cityDatalist.appendChild(option);
            });
        }

        if (history.length > 0) {
            historySection.style.display = 'block';
        } else {
            historySection.style.display = 'none';
        }
    };

    // UULE Generation
    const generateUULE = (canonicalName) => {
        if (!canonicalName) return '';

        const length = canonicalName.length;
        const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        const lenChar = table[length % 64];
        const enc = btoa(canonicalName);

        return `w+CAIQICI${lenChar}${enc}`;
    };

    const saveHistory = (query, city, country, lang, type, device, domain, adTest) => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const newEntry = { query, city, country, lang, type, device, domain, adTest, timestamp: Date.now() };

        // Remove exact duplicate if exists
        const filteredHistory = history.filter(item =>
            !(item.query === query &&
                item.city === city &&
                item.country === country &&
                item.lang === lang &&
                item.type === type &&
                item.device === device &&
                item.domain === domain &&
                item.adTest === adTest)
        );

        filteredHistory.unshift(newEntry);
        if (filteredHistory.length > 10) filteredHistory.pop();

        localStorage.setItem('searchHistory', JSON.stringify(filteredHistory));
        loadHistory();
    };

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('searchHistory');
        loadHistory();
    });

    // --- Search Function ---
    const performSearch = () => {
        const query = searchInput.value.trim();
        const city = cityInput.value.trim();
        const country = countrySelect.value;
        const language = languageSelect.value;
        const device = document.getElementById('device').value;
        const domain = domainSelect ? domainSelect.value : 'google.com';
        const adTestEnabled = document.getElementById('adtest-toggle').checked;
        const currentSearchType = searchTypeSelect.value;

        if (!query) {
            searchInput.focus();
            searchInput.style.borderColor = '#ff4444';
            setTimeout(() => searchInput.style.borderColor = '', 2000);
            return;
        }

        saveHistory(query, city, country, language, currentSearchType, device, domain, adTestEnabled);

        // Construct URL
        let url = `https://www.${domain}/search?q=${encodeURIComponent(query)}`; // Use selected domain
        url += `&gl=${country}`;
        url += `&hl=${language}`;
        url += `&pws=0`; // De-personalize

        if (city) {
            url += `&near=${encodeURIComponent(city)}`;
            // Add UULE
            const uule = generateUULE(city);
            if (uule) {
                url += `&uule=${uule}`;
            }
        }

        if (currentSearchType) {
            url += `&tbm=${currentSearchType}`;
        }

        // Device / AdTest Logic
        if (adTestEnabled) {
            url += `&adtest=on`;

            if (device === 'mobile') {
                url += `&adtest-useragent=Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%2014_4%20like%20Mac%20OS%20X)%20AppleWebKit%2F605.1.15%20(KHTML%2C%20like%20Gecko)%20Version%2F14.0.3%20Mobile%2F15E148%20Safari%2F604.1`;
            } else {
                // Desktop UA for AdTest (optional, but good for consistency)
                url += `&adtest-useragent=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F142.0.0.0%20Safari%2F537.36`;
            }
        }

        // GLP (Always ON)
        url += `&glp=1`;

        window.open(url, '_blank');
    };

    // --- Init ---
    loadHistory();

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
});
