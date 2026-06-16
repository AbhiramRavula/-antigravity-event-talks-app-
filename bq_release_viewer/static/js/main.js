document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const btnRefresh = document.getElementById('btn-refresh');
    const iconRefresh = document.getElementById('icon-refresh');
    const iconSpinner = document.getElementById('icon-spinner');
    const btnText = document.getElementById('btn-text');
    
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const feedContainer = document.getElementById('feed-container');
    
    const tweetText = document.getElementById('tweet-text');
    const charCount = document.getElementById('char-count');
    const btnTweet = document.getElementById('btn-tweet');
    const selectedCountBadge = document.getElementById('selected-count');
    
    // State
    let selectedUpdates = new Map(); // Key: 'date-index', Value: { date, type, text, link }
    let allReleases = [];
    const MAX_TWEET_LENGTH = 280;

    // Fetch releases from API
    async function fetchReleases() {
        showLoading(true);
        try {
            const response = await fetch('/api/releases');
            const data = await response.json();
            
            if (data.success && data.releases.length > 0) {
                allReleases = data.releases;
                renderFeed(data.releases);
                showLoading(false);
            } else {
                showError(data.error || "No release notes found.");
            }
        } catch (error) {
            showError("Network error. Make sure the server is running and try again.");
            console.error("Fetch error:", error);
        }
    }

    // Show loading state
    function showLoading(isLoading) {
        if (isLoading) {
            loadingState.style.display = 'block';
            emptyState.style.display = 'none';
            errorState.style.display = 'none';
            feedContainer.style.display = 'none';
            
            // Update button state
            btnRefresh.disabled = true;
            iconRefresh.style.display = 'none';
            iconSpinner.style.display = 'block';
            btnText.textContent = "Loading...";
        } else {
            loadingState.style.display = 'none';
            feedContainer.style.display = 'block';
            
            btnRefresh.disabled = false;
            iconRefresh.style.display = 'block';
            iconSpinner.style.display = 'none';
            btnText.textContent = "Refresh Feed";
        }
    }

    // Show error state
    function showError(msg) {
        showLoading(false);
        feedContainer.style.display = 'none';
        errorState.style.display = 'block';
        errorMessage.textContent = msg;
    }

    // Format badge type css class name
    function getBadgeClass(type) {
        const t = type.toLowerCase();
        if (t.includes('feature')) return 'feature';
        if (t.includes('issue') || t.includes('fix')) return 'issue';
        if (t.includes('breaking')) return 'breaking';
        if (t.includes('announcement')) return 'announcement';
        return 'change';
    }

    // Render feed HTML
    function renderFeed(releases) {
        feedContainer.innerHTML = '';
        selectedUpdates.clear();
        updateTweetComposer();
        
        releases.forEach((release, releaseIdx) => {
            const dateGroup = document.createElement('div');
            dateGroup.className = 'date-group';
            
            // Format title
            const titleHtml = `
                <div class="date-title">
                    ${release.date}
                    <span>(${new Date(release.updated).toLocaleDateString()})</span>
                </div>
            `;
            dateGroup.innerHTML = titleHtml;
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'update-cards';
            
            release.updates.forEach((update, updateIdx) => {
                const uniqueId = `${releaseIdx}-${updateIdx}`;
                const card = document.createElement('div');
                card.className = 'update-card';
                
                const badgeClass = getBadgeClass(update.type);
                
                card.innerHTML = `
                    <div class="card-header">
                        <span class="badge ${badgeClass}">${update.type}</span>
                        <div class="card-actions">
                            <label class="checkbox-container">
                                <input type="checkbox" data-id="${uniqueId}" data-release="${releaseIdx}" data-update="${updateIdx}">
                                <span class="checkmark"></span>
                                Select to Tweet
                            </label>
                            <button class="tweet-shortcut" title="Tweet this update immediately" data-release="${releaseIdx}" data-update="${updateIdx}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        ${update.html}
                    </div>
                `;
                cardContainer.appendChild(card);
            });
            
            dateGroup.appendChild(cardContainer);
            feedContainer.appendChild(dateGroup);
        });

        // Set up event listeners for inputs
        document.querySelectorAll('.update-card input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        document.querySelectorAll('.tweet-shortcut').forEach(button => {
            button.addEventListener('click', handleImmediateTweet);
        });
    }

    // Checkbox selection
    function handleCheckboxChange(e) {
        const checkbox = e.target;
        const id = checkbox.dataset.id;
        const releaseIdx = parseInt(checkbox.dataset.release);
        const updateIdx = parseInt(checkbox.dataset.update);
        
        if (checkbox.checked) {
            const release = allReleases[releaseIdx];
            const update = release.updates[updateIdx];
            selectedUpdates.set(id, {
                date: release.date,
                type: update.type,
                text: update.text,
                link: release.link
            });
        } else {
            selectedUpdates.delete(id);
        }
        
        // Highlight card border
        const card = checkbox.closest('.update-card');
        if (checkbox.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }

        updateTweetComposer();
    }

    // Generate formatted Tweet text based on selections
    function updateTweetComposer() {
        const count = selectedUpdates.size;
        selectedCountBadge.textContent = count;
        
        if (count === 0) {
            tweetText.value = '';
            btnTweet.disabled = true;
            updateCharCount();
            return;
        }

        btnTweet.disabled = false;
        
        let tweetBody = '';
        
        if (count === 1) {
            // Detailed formatting for a single selection
            const update = Array.from(selectedUpdates.values())[0];
            const cleanText = update.text;
            
            tweetBody = `🚀 BigQuery Update (${update.date}):\n\n`;
            tweetBody += `[${update.type}] ${cleanText}\n\n`;
            
            if (update.link) {
                tweetBody += `Details: ${update.link}\n`;
            }
            tweetBody += `#GCP #BigQuery #Cloud`;
        } else {
            // Consolidated listing for multiple selections
            tweetBody = `🚀 Latest Google BigQuery Updates:\n\n`;
            
            selectedUpdates.forEach((update) => {
                // Shorten text if needed to fit multi-updates
                let shortText = update.text;
                if (shortText.length > 70) {
                    shortText = shortText.substring(0, 67) + '...';
                }
                tweetBody += `• [${update.type}] ${shortText} (${update.date})\n`;
            });
            
            tweetBody += `\n#GCP #BigQuery #Cloud`;
        }
        
        tweetText.value = tweetBody;
        updateCharCount();
    }

    // Update character remaining indicator
    function updateCharCount() {
        const text = tweetText.value;
        const remaining = MAX_TWEET_LENGTH - text.length;
        
        charCount.textContent = `${remaining} characters remaining`;
        
        // Style changes
        charCount.className = 'char-counter';
        if (remaining < 0) {
            charCount.classList.add('error');
            btnTweet.disabled = true;
        } else if (remaining < 30) {
            charCount.classList.add('warning');
            btnTweet.disabled = false;
        } else {
            btnTweet.disabled = text.trim().length === 0;
        }
    }

    // Input listeners for direct tweet typing
    tweetText.addEventListener('input', updateCharCount);

    // Immediate Tweet button on the card
    function handleImmediateTweet(e) {
        const button = e.currentTarget;
        const releaseIdx = parseInt(button.dataset.release);
        const updateIdx = parseInt(button.dataset.update);
        
        const release = allReleases[releaseIdx];
        const update = release.updates[updateIdx];
        
        const text = `🚀 BigQuery [${update.type}] (${release.date}):\n"${update.text}"\n\n#GCP #BigQuery`;
        const encodedText = encodeURIComponent(text);
        
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    }

    // Primary Tweet Share Action
    btnTweet.addEventListener('click', () => {
        const text = tweetText.value;
        const encodedText = encodeURIComponent(text);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    });

    // Refresh trigger
    btnRefresh.addEventListener('click', fetchReleases);

    // Load initial feed
    fetchReleases();
});
