// ===================================
// Supabase Configuration
// ===================================

const SUPABASE_URL = 'https://sesftfsjfzknaioqajtq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlc2Z0ZnNqZnprbmFpb3FhanRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3ODY3OTQsImV4cCI6MjA4MjM2Mjc5NH0.pKpGYHxIU3MTHhPbsR8u2F9LV1V5xznwtS_rq9UXis0';

let supabaseClient = null;

// Initialize Supabase client
function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized');
        return true;
    }
    console.warn('⚠️ Supabase SDK not loaded');
    return false;
}

// Load config from Supabase
async function loadFromSupabase() {
    if (!supabaseClient) {
        return null;
    }

    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .select('config')
            .eq('id', 1)
            .single();

        if (error) {
            console.log('Could not load from Supabase:', error.message);
            return null;
        }

        console.log('✅ Config loaded from Supabase');
        return data?.config || null;
    } catch (error) {
        console.log('Error loading from Supabase:', error);
        return null;
    }
}

// ===================================
// Configuration Loading
// ===================================

let config = null;

async function loadConfig() {
    // Initialize Supabase first
    initSupabase();

    // Try to load from Supabase first (cloud storage - highest priority)
    const supabaseConfig = await loadFromSupabase();
    if (supabaseConfig) {
        config = supabaseConfig;
        console.log('✅ Using config from Supabase (cloud)');
        populatePage();
        return;
    }

    // Fallback: Try to load from localStorage (admin edits)
    const savedConfig = localStorage.getItem('adminConfig');

    if (savedConfig) {
        try {
            config = JSON.parse(savedConfig);
            console.log('✅ Loaded config from admin (localStorage)');
            populatePage();
            return;
        } catch (error) {
            console.error('Error parsing saved config:', error);
        }
    }

    // Fallback to config.json
    try {
        const response = await fetch('config.json');
        const data = await response.json();
        config = { ...config, ...data };
        console.log('✅ Loaded config from config.json');
    } catch (error) {
        console.log('⚠️ Using default config');
    }

    populatePage();
}

// Populate page with configuration data
function populatePage() {
    if (!config) return;

    // Profile section
    if (config.profile) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const profileImage = document.getElementById('profileImage');
        const heroBanner = document.getElementById('heroBanner');
        const heroBannerImage = document.getElementById('heroBannerImage');

        if (heroTitle) heroTitle.textContent = config.profile.name;
        if (heroSubtitle) heroSubtitle.textContent = config.profile.subtitle;
        if (profileImage && config.profile.image) profileImage.src = config.profile.image;

        // Banner image
        if (heroBanner && heroBannerImage && config.profile.bannerImage) {
            heroBannerImage.src = config.profile.bannerImage;
            heroBanner.style.display = 'block';
        }
    }

    // Update social media links
    if (config.socialMedia && config.socialMedia.length > 0) {
        const socialGrid = document.querySelector('#social-media .links-grid');
        if (socialGrid) {
            socialGrid.innerHTML = config.socialMedia.map(social => `
                <a href="${social.url}" target="_blank" class="link-card" data-platform="${social.platform}">
                    <div class="link-icon">
                        <i class="${social.icon}"></i>
                    </div>
                    <div class="link-content">
                        <h3 class="link-title">${social.title}</h3>
                        <p class="link-description">${social.description}</p>
                    </div>
                    <i class="fas fa-arrow-right link-arrow"></i>
                </a>
            `).join('');
        }
    }

    // Update YouTube section
    if (config.youtube) {
        // Update channel link
        const channelLink = document.querySelector('#youtube .link-card.featured');
        if (channelLink) {
            channelLink.href = config.youtube.channelUrl;
            const channelTitle = channelLink.querySelector('.link-title');
            const channelDesc = channelLink.querySelector('.link-description');
            if (channelTitle) channelTitle.textContent = config.youtube.channelTitle;
            if (channelDesc) channelDesc.textContent = config.youtube.channelDescription;
        }

        // Update videos
        const videosGrid = document.querySelector('.videos-grid');
        if (videosGrid && config.youtube.videos && config.youtube.videos.length > 0) {
            videosGrid.innerHTML = config.youtube.videos.map(video => `
                <a href="${video.url}" target="_blank" class="video-card">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                </a>
            `).join('');
        }
    }

    // Update music platforms
    if (config.musicPlatforms && config.musicPlatforms.length > 0) {
        const musicGrid = document.querySelector('#music-platforms .links-grid');
        if (musicGrid) {
            musicGrid.innerHTML = config.musicPlatforms.map(platform => `
                <a href="${platform.url}" target="_blank" class="link-card" data-platform="${platform.platform}">
                    <div class="link-icon">
                        <i class="${platform.icon}"></i>
                    </div>
                    <div class="link-content">
                        <h3 class="link-title">${platform.title}</h3>
                        <p class="link-description">${platform.description}</p>
                    </div>
                    <i class="fas fa-arrow-right link-arrow"></i>
                </a>
            `).join('');
        }
    }

    // Update Canva Embed section
    if (config.canvaEmbed) {
        const canvaSection = document.getElementById('canva-embed');
        const canvaTitle = document.getElementById('canvaTitle');
        const canvaDescription = document.getElementById('canvaDescription');
        const canvaWrapper = document.getElementById('canvaEmbedWrapper');

        if (canvaSection && config.canvaEmbed.enabled && config.canvaEmbed.url) {
            canvaSection.style.display = 'block';

            if (canvaTitle) canvaTitle.textContent = config.canvaEmbed.title || 'Apresentação / Release';
            if (canvaDescription) canvaDescription.textContent = config.canvaEmbed.description || '';

            if (canvaWrapper) {
                // Extract embed URL from Canva share link
                const embedUrl = getCanvaEmbedUrl(config.canvaEmbed.url);
                canvaWrapper.innerHTML = `
                    <iframe 
                        src="${embedUrl}" 
                        allowfullscreen="true" 
                        allow="fullscreen"
                        loading="lazy"
                        style="width: 100%; aspect-ratio: 16/9; min-height: 500px;">
                    </iframe>
                `;
            }
        } else if (canvaSection) {
            canvaSection.style.display = 'none';
        }
    }

    // Update footer
    if (config.footer) {
        const footerContent = document.querySelector('.footer-content p');
        if (footerContent) footerContent.textContent = config.footer.copyright;

        const footerLinks = document.querySelector('.footer-links');
        if (footerLinks && config.footer.links) {
            footerLinks.innerHTML = config.footer.links.map((link, index) =>
                `${index > 0 ? '<span>•</span>' : ''}<a href="${link.url}">${link.text}</a>`
            ).join('');
        }
    }
}

// Helper function to convert Canva share URL to embed URL
function getCanvaEmbedUrl(url) {
    if (!url) return '';

    // If it already has ?embed parameter, return as is
    if (url.includes('?embed')) {
        return url;
    }

    // Extract design ID and access token from Canva URL
    // Format: https://www.canva.com/design/DESIGN_ID/ACCESS_TOKEN/view
    const designMatch = url.match(/canva\.com\/design\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)/);

    if (designMatch && designMatch[1] && designMatch[2]) {
        const designId = designMatch[1];
        const accessToken = designMatch[2];
        // Canva embed URL format: https://www.canva.com/design/DESIGN_ID/ACCESS_TOKEN/view?embed
        return `https://www.canva.com/design/${designId}/${accessToken}/view?embed`;
    }

    // If URL has /view at the end, just add ?embed
    if (url.endsWith('/view')) {
        return url + '?embed';
    }

    // Return original URL with ?embed if format not recognized
    return url + (url.includes('?') ? '&embed' : '?embed');
}

// Load config when page loads
document.addEventListener('DOMContentLoaded', loadConfig);

// Listen for config updates from admin dashboard
window.addEventListener('message', (event) => {
    if (event.data.type === 'updateConfig') {
        config = event.data.config;
        populatePage();
    }
});

// ===================================
// Form Handling & Validation
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('fanRegistrationForm');
    const formMessage = document.getElementById('formMessage');

    if (!form) return;

    // Form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            city: document.getElementById('city').value.trim(),
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toISOString()
        };

        // Validate form data
        if (!validateForm(formData)) {
            return;
        }

        // Save to localStorage (temporary storage until backend integration)
        saveToLocalStorage(formData);

        // Show success message
        showMessage('success', '✓ Cadastro realizado com sucesso! Obrigado por se juntar a nós!');

        // Reset form
        form.reset();
    });

    // Form validation
    function validateForm(data) {
        // Name validation
        if (data.name.length < 3) {
            showMessage('error', 'Por favor, insira seu nome completo.');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('error', 'Por favor, insira um e-mail válido.');
            return false;
        }

        // City validation
        if (data.city.length < 2) {
            showMessage('error', 'Por favor, insira sua cidade.');
            return false;
        }

        // Phone validation (optional field, but if filled, must be valid)
        if (data.phone && data.phone.length > 0) {
            const phoneRegex = /^[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(data.phone) || data.phone.length < 8) {
                showMessage('error', 'Por favor, insira um telefone válido.');
                return false;
            }
        }

        return true;
    }

    // Save to localStorage
    function saveToLocalStorage(data) {
        try {
            // Get existing registrations
            let registrations = JSON.parse(localStorage.getItem('fanRegistrations')) || [];

            // Add new registration
            registrations.push(data);

            // Save back to localStorage
            localStorage.setItem('fanRegistrations', JSON.stringify(registrations));

            console.log('Registration saved:', data);
            console.log('Total registrations:', registrations.length);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            showMessage('error', 'Erro ao salvar cadastro. Por favor, tente novamente.');
        }
    }

    // Show message to user
    function showMessage(type, message) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }, 5000);
    }
});

// ===================================
// Scroll Animations
// ===================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// ===================================
// Phone Number Formatting
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone');

    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        // Format: (00) 00000-0000
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }

        e.target.value = value;
    });
});

// ===================================
// Link Analytics (Optional)
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const linkCards = document.querySelectorAll('.link-card');

    linkCards.forEach(card => {
        card.addEventListener('click', function (e) {
            const platform = this.getAttribute('data-platform');
            const title = this.querySelector('.link-title')?.textContent;

            // Log click event
            console.log('Link clicked:', {
                platform: platform,
                title: title,
                timestamp: new Date().toISOString()
            });
        });
    });
});

// ===================================
// Utility Functions
// ===================================

// Get all registrations from localStorage
function getAllRegistrations() {
    try {
        return JSON.parse(localStorage.getItem('fanRegistrations')) || [];
    } catch (error) {
        console.error('Error reading registrations:', error);
        return [];
    }
}

// Clear all registrations (for testing)
function clearAllRegistrations() {
    localStorage.removeItem('fanRegistrations');
    console.log('All registrations cleared');
}

// Export registrations as JSON (for backup/migration)
function exportRegistrations() {
    const registrations = getAllRegistrations();
    const dataStr = JSON.stringify(registrations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fan-registrations-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Make utility functions available globally for console access
window.fanRegistrationUtils = {
    getAllRegistrations,
    clearAllRegistrations,
    exportRegistrations
};
