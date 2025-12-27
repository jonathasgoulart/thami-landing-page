// Admin Dashboard JavaScript
// Drag-and-Drop Editor for Landing Page
console.log('📜 admin.js script starting to load...');

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
        console.log('✅ Supabase client initialized');
        return true;
    }
    console.warn('⚠️ Supabase SDK not loaded');
    return false;
}

// Save config to Supabase
async function saveToSupabase(configData) {
    if (!supabaseClient) {
        console.warn('Supabase not initialized, skipping cloud save');
        return false;
    }

    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .upsert({ id: 1, config: configData, updated_at: new Date().toISOString() })
            .select();

        if (error) {
            console.error('Error saving to supabaseClient:', error);
            return false;
        }

        console.log('✅ Config saved to supabaseClient');
        return true;
    } catch (error) {
        console.error('Error saving to supabaseClient:', error);
        return false;
    }
}

// Load config from Supabase
async function loadFromSupabase() {
    if (!supabaseClient) {
        console.warn('Supabase not initialized, skipping cloud load');
        return null;
    }

    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .select('config')
            .eq('id', 1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('No config found in Supabase (first time)');
                return null;
            }
            console.error('Error loading from Supabase:', error);
            return null;
        }

        console.log('✅ Config loaded from Supabase');
        return data?.config || null;
    } catch (error) {
        console.error('Error loading from Supabase:', error);
        return null;
    }
}

// ===================================
// State Management
// ===================================

// Default config with THAMI data (fallback when CORS blocks config.json)
const DEFAULT_CONFIG = {
    profile: {
        name: 'THAMI',
        subtitle: 'Cantora • Compositora • Artista',
        image: 'profile_optimized.jpg',
        bannerImage: ''
    },
    featuredLinks: [
        // Example structure (empty by default):
        // {
        //     icon: 'fas fa-ticket-alt',
        //     title: 'Ingressos Show SP',
        //     description: '25 de Janeiro - Espaço das Américas',
        //     url: 'https://...'
        // }
    ],
    socialMedia: [
        {
            platform: 'instagram',
            title: 'Instagram',
            description: '@oficialthami',
            url: 'https://www.instagram.com/oficialthami',
            icon: 'fab fa-instagram'
        },
        {
            platform: 'tiktok',
            title: 'TikTok',
            description: '@oficialthami',
            url: 'https://www.tiktok.com/@oficialthami',
            icon: 'fab fa-tiktok'
        },
        {
            platform: 'twitter',
            title: 'Twitter / X',
            description: '@oficialthamii',
            url: 'https://twitter.com/oficialthamii',
            icon: 'fab fa-twitter'
        },
        {
            platform: 'facebook',
            title: 'Facebook',
            description: 'Curta a página oficial',
            url: 'https://www.facebook.com/oficialthami',
            icon: 'fab fa-facebook'
        }
    ],
    youtube: {
        channelUrl: 'https://www.youtube.com/@oficialthami',
        channelTitle: 'Canal do YouTube',
        channelDescription: 'Inscreva-se para não perder nenhum vídeo!',
        videos: [
            {
                title: 'Show Completo - Labirinto',
                description: 'Assista ao show completo',
                url: 'https://www.youtube.com/watch?v=sWi1pWUtyG4',
                thumbnail: 'https://i.ytimg.com/vi/sWi1pWUtyG4/hqdefault.jpg'
            },
            {
                title: 'Talvez / Caminhando em ré',
                description: 'Videoclipe oficial',
                url: 'https://www.youtube.com/watch?v=spCDRRciRdY',
                thumbnail: 'https://i.ytimg.com/vi/spCDRRciRdY/hqdefault.jpg'
            },
            {
                title: 'Ver Mais Vídeos',
                description: 'Acesse o canal completo',
                url: 'https://www.youtube.com/@oficialthami',
                thumbnail: ''
            }
        ]
    },
    musicPlatforms: [
        {
            platform: 'spotify',
            title: 'Spotify',
            description: 'Perfil do Artista',
            url: 'https://open.spotify.com/intl-pt/artist/6fupiyOvfbI12eijANkwZL',
            icon: 'fab fa-spotify'
        },
        {
            platform: 'spotify',
            title: 'Álbum Labirinto',
            description: 'Ouça no Spotify',
            url: 'https://open.spotify.com/intl-pt/album/1p9ksUAGTlV9BPI7fqs5j2',
            icon: 'fab fa-spotify'
        },
        {
            platform: 'deezer',
            title: 'Deezer',
            description: 'Perfil THAMI',
            url: 'https://deezer.page.link/RmSPPqfGdJ82jbkK6',
            icon: 'fab fa-deezer'
        },
        {
            platform: 'deezer',
            title: 'Álbum Labirinto',
            description: 'Ouça no Deezer',
            url: 'https://deezer.page.link/tbbaovRgoGATxTz49',
            icon: 'fab fa-deezer'
        }
    ],
    canvaEmbed: {
        enabled: false,
        url: '',
        title: 'Apresentação / Release',
        description: 'Conheça mais sobre o projeto'
    },
    footer: {
        copyright: '© 2024 Todos os direitos reservados',
        links: [
            { text: 'Política de Privacidade', url: '#' },
            { text: 'Termos de Uso', url: '#' }
        ]
    }
};

// Current config (will be loaded from localStorage or defaults)
let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

// Platform icons mapping
const platformIcons = {
    instagram: 'fab fa-instagram',
    tiktok: 'fab fa-tiktok',
    twitter: 'fab fa-twitter',
    facebook: 'fab fa-facebook',
    youtube: 'fab fa-youtube',
    linkedin: 'fab fa-linkedin',
    whatsapp: 'fab fa-whatsapp',
    spotify: 'fab fa-spotify',
    deezer: 'fab fa-deezer',
    'apple-music': 'fab fa-apple',
    'youtube-music': 'fab fa-youtube',
    soundcloud: 'fab fa-soundcloud',
    'amazon-music': 'fab fa-amazon',
    tickets: 'fas fa-ticket'
};

// Platform titles for auto-fill
const platformTitles = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    twitter: 'Twitter / X',
    facebook: 'Facebook',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    spotify: 'Spotify',
    deezer: 'Deezer',
    'apple-music': 'Apple Music',
    'youtube-music': 'YouTube Music',
    soundcloud: 'SoundCloud',
    'amazon-music': 'Amazon Music',
    tickets: 'Ingressos'
};

// ===================================
// Initialize
// ===================================

// Initialize the admin dashboard
async function initAdmin() {
    // Prevent double initialization
    if (window._adminInitialized) {
        console.log('⚠️ Admin already initialized, skipping');
        return;
    }

    try {
        console.log('🚀 Initializing Admin Dashboard...');

        // Initialize supabaseClient first
        initSupabase();

        // Wait for config to load before rendering
        await loadExistingConfig();

        initializeEventListeners();
        initializeDeleteModal();

        // Now render - config is guaranteed to be loaded
        renderAll();

        // Add config file selection button (Chrome/Edge only)
        if ('showOpenFilePicker' in window) {
            addConfigFileButton();
        }

        // Mark as initialized
        window._adminInitialized = true;
        console.log('✅ Admin Dashboard initialized!');
    } catch (error) {
        console.error('❌ Error initializing Admin Dashboard:', error);
    }
}

// Robust initialization - handles all possible DOM states
console.log('📜 admin.js IIFE starting...');
(function () {
    console.log('📜 Inside IIFE, document.readyState:', document.readyState);

    // Expose functions to global scope immediately
    // This must happen before any DOM operations
    window.initAdmin = initAdmin;

    function tryInit() {
        console.log('📜 tryInit called');
        try {
            initAdmin();
        } catch (e) {
            console.error('Init error:', e);
        }
    }

    if (document.readyState === 'loading') {
        console.log('📜 Document still loading, adding DOMContentLoaded listener');
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        // DOM is already ready - run immediately
        console.log('📜 DOM ready, calling tryInit immediately');
        tryInit();
    }

    // Fallback: if for some reason the above didn't work, try again after 500ms
    setTimeout(function () {
        console.log('📜 Fallback timeout fired, _adminInitialized:', window._adminInitialized);
        if (!window._adminInitialized) {
            console.log('⚠️ Fallback initialization triggered');
            try {
                initAdmin();
                window._adminInitialized = true;
            } catch (e) {
                console.error('Fallback init error:', e);
            }
        }
    }, 500);
})();
console.log('📜 admin.js IIFE completed');


// ===================================
// Load Existing Config
// ===================================

async function loadExistingConfig() {
    let supabaseConfig = null;
    let localConfig = null;
    let fileConfig = null;

    // Try to load from supabaseClient first (cloud storage - highest priority)
    supabaseConfig = await loadFromSupabase();
    if (supabaseConfig) {
        console.log('✅ Using config from supabaseClient (cloud)');
        config = supabaseConfig;
        // Also save to localStorage for offline access
        localStorage.setItem('adminConfig', JSON.stringify(config));
        populateForm();
        console.log('Loaded config:', config);
        return;
    }

    // Try to load from localStorage (admin edits - local backup)
    const savedConfig = localStorage.getItem('adminConfig');
    if (savedConfig) {
        try {
            localConfig = JSON.parse(savedConfig);
            console.log('Found config in localStorage');
        } catch (error) {
            console.error('Error parsing saved config:', error);
        }
    }

    // Try to load from config.json (may fail due to CORS when using file://)
    try {
        const response = await fetch('config.json');
        fileConfig = await response.json();
        console.log('Found config in config.json');
    } catch (error) {
        console.log('Could not load config.json (CORS restriction on file://). Using defaults.');
    }

    // Decide which config to use
    if (localConfig) {
        // Check if localStorage has empty lists - if so, merge with file or defaults
        const hasEmptyLists = (!localConfig.socialMedia || localConfig.socialMedia.length === 0) &&
            (!localConfig.youtube?.videos || localConfig.youtube.videos.length === 0) &&
            (!localConfig.musicPlatforms || localConfig.musicPlatforms.length === 0);

        if (hasEmptyLists) {
            // Merge with fileConfig or DEFAULT_CONFIG
            const sourceConfig = fileConfig || DEFAULT_CONFIG;
            localConfig.socialMedia = sourceConfig.socialMedia;
            localConfig.youtube = sourceConfig.youtube;
            localConfig.musicPlatforms = sourceConfig.musicPlatforms;
            if (!localConfig.profile?.name) {
                localConfig.profile = sourceConfig.profile;
            }
            console.log('Merged empty localStorage with source config');
        }
        config = localConfig;
    } else if (fileConfig) {
        config = { ...JSON.parse(JSON.stringify(DEFAULT_CONFIG)), ...fileConfig };
        console.log('Using config.json');
    } else {
        // Use DEFAULT_CONFIG as fallback
        config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        console.log('Using DEFAULT_CONFIG as fallback');
    }

    // Ensure canvaEmbed exists
    if (!config.canvaEmbed) {
        config.canvaEmbed = DEFAULT_CONFIG.canvaEmbed;
    }

    // Save merged config to localStorage
    localStorage.setItem('adminConfig', JSON.stringify(config));

    populateForm();
    console.log('Loaded config:', config);
}

function populateForm() {
    document.getElementById('profileName').value = config.profile.name || '';
    document.getElementById('profileSubtitle').value = config.profile.subtitle || '';
    document.getElementById('youtubeChannel').value = config.youtube.channelUrl || '';

    // Show image previews if they exist
    if (config.profile.image) {
        const preview = document.getElementById('profileImagePreview');
        const img = document.createElement('img');
        img.src = config.profile.image;
        preview.innerHTML = '';
        preview.appendChild(img);
        preview.classList.add('active');
    }

    if (config.profile.bannerImage) {
        const preview = document.getElementById('bannerImagePreview');
        const img = document.createElement('img');
        img.src = config.profile.bannerImage;
        preview.innerHTML = '';
        preview.appendChild(img);
        preview.classList.add('active');
    }

    // Populate Canva Embed section
    if (config.canvaEmbed) {
        document.getElementById('canvaEnabled').checked = config.canvaEmbed.enabled || false;
        document.getElementById('canvaTitle').value = config.canvaEmbed.title || 'Apresentação / Release';
        document.getElementById('canvaDescription').value = config.canvaEmbed.description || '';
        document.getElementById('canvaUrl').value = config.canvaEmbed.url || '';
    }
}

// Save to localStorage on every change
function saveToLocalStorage() {
    localStorage.setItem('adminConfig', JSON.stringify(config));
    console.log('Config saved to localStorage');

    // Also save to supabaseClient (async, don't block UI)
    saveToSupabase(config);
}

// ===================================
// Event Listeners
// ===================================

function initializeEventListeners() {
    // Profile inputs
    document.getElementById('profileName').addEventListener('input', (e) => {
        config.profile.name = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    document.getElementById('profileSubtitle').addEventListener('input', (e) => {
        config.profile.subtitle = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    document.getElementById('youtubeChannel').addEventListener('input', (e) => {
        config.youtube.channelUrl = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    // Canva Embed inputs
    document.getElementById('canvaEnabled').addEventListener('change', (e) => {
        config.canvaEmbed.enabled = e.target.checked;
        saveToLocalStorage();
        updatePreview();
    });

    document.getElementById('canvaTitle').addEventListener('input', (e) => {
        config.canvaEmbed.title = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    document.getElementById('canvaDescription').addEventListener('input', (e) => {
        config.canvaEmbed.description = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    document.getElementById('canvaUrl').addEventListener('input', (e) => {
        config.canvaEmbed.url = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    // Canva Apply button - saves and shows preview
    document.getElementById('applyCanvaBtn').addEventListener('click', () => {
        const url = document.getElementById('canvaUrl').value.trim();
        if (!url) {
            showNotification('⚠️ Por favor, insira uma URL do Canva', 'warning');
            return;
        }

        config.canvaEmbed.url = url;
        config.canvaEmbed.enabled = true;
        document.getElementById('canvaEnabled').checked = true;
        saveToLocalStorage();
        updatePreview();

        // Show preview
        showCanvaPreview(url);
        showNotification('✅ Link do Canva aplicado!', 'success');
    });

    // Canva Clear button - clears the URL and hides preview
    document.getElementById('clearCanvaBtn').addEventListener('click', () => {
        document.getElementById('canvaUrl').value = '';
        config.canvaEmbed.url = '';
        config.canvaEmbed.enabled = false;
        document.getElementById('canvaEnabled').checked = false;
        saveToLocalStorage();
        updatePreview();

        // Hide preview
        const previewContainer = document.getElementById('canvaPreviewContainer');
        if (previewContainer) previewContainer.style.display = 'none';
        showNotification('Link do Canva removido', 'info');
    });

    // Image uploads
    setupImageUpload('profileImageUpload', 'profileImageInput', 'profileImagePreview', 'image');
    setupImageUpload('bannerImageUpload', 'bannerImageInput', 'bannerImagePreview', 'bannerImage');

    // Add buttons
    document.getElementById('addFeaturedBtn').addEventListener('click', () => openModal('featuredModal'));
    document.getElementById('addSocialBtn').addEventListener('click', () => openModal('socialModal'));
    document.getElementById('addVideoBtn').addEventListener('click', () => openModal('videoModal'));
    document.getElementById('addMusicBtn').addEventListener('click', () => openModal('musicModal'));

    // Modal buttons
    setupModal('featuredModal', 'closeFeaturedModal', 'cancelFeaturedBtn', 'confirmFeaturedBtn', addFeaturedLink);
    setupModal('socialModal', 'closeSocialModal', 'cancelSocialBtn', 'confirmSocialBtn', addSocialMedia);
    setupModal('videoModal', 'closeVideoModal', 'cancelVideoBtn', 'confirmVideoBtn', addVideo);
    setupModal('musicModal', 'closeMusicModal', 'cancelMusicBtn', 'confirmMusicBtn', addMusicPlatform);

    // Auto-fill platform title when platform is selected
    document.getElementById('socialPlatform').addEventListener('change', (e) => {
        const titleInput = document.getElementById('socialTitle');
        if (!titleInput.value || Object.values(platformTitles).includes(titleInput.value)) {
            titleInput.value = platformTitles[e.target.value] || '';
        }
    });

    document.getElementById('musicPlatform').addEventListener('change', (e) => {
        const titleInput = document.getElementById('musicTitle');
        if (!titleInput.value || Object.values(platformTitles).includes(titleInput.value)) {
            titleInput.value = platformTitles[e.target.value] || '';
        }
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', saveConfig);

    // Preview buttons
    document.getElementById('refreshPreviewBtn').addEventListener('click', updatePreview);

    // Import config button
    document.getElementById('importConfigBtn').addEventListener('click', importConfig);

    // Reset config button
    document.getElementById('resetConfigBtn').addEventListener('click', resetConfig);
}

// ===================================
// Image Upload with Drag-and-Drop
// ===================================

function setupImageUpload(uploadId, inputId, previewId, configKey) {
    const uploadArea = document.getElementById(uploadId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!uploadArea || !input || !preview) {
        console.warn('Missing elements for image upload:', uploadId);
        return;
    }

    // Click to upload - but not if clicking on the preview image
    uploadArea.addEventListener('click', (e) => {
        // Only trigger if clicking the upload area itself, not on an img inside
        if (e.target === uploadArea || e.target.classList.contains('upload-icon') ||
            e.target.classList.contains('upload-text') || e.target.tagName === 'I') {
            input.click();
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file, preview, configKey);
        }
    });

    // File input change
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file, preview, configKey);
            // Reset input so same file can be selected again
            input.value = '';
        }
    });
}

function handleImageFile(file, previewElement, configKey) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Image = e.target.result;

        // Show preview
        const img = document.createElement('img');
        img.src = base64Image;
        img.style.cursor = 'pointer';
        img.title = 'Clique para trocar a imagem';
        img.addEventListener('click', (evt) => {
            evt.stopPropagation();
            // Find the input for this preview
            const uploadArea = previewElement.closest('.upload-area');
            if (uploadArea) {
                const input = uploadArea.querySelector('input[type="file"]');
                if (input) input.click();
            }
        });

        previewElement.innerHTML = '';
        previewElement.appendChild(img);
        previewElement.classList.add('active');

        // Save base64 to config (so it works with localStorage)
        if (configKey === 'bannerImage') {
            config.profile.bannerImage = base64Image;
        } else {
            config.profile[configKey] = base64Image;
        }

        // Save to localStorage
        saveToLocalStorage();

        // Update preview iframe
        updatePreview();

        showNotification('✅ Imagem atualizada!', 'success');
        console.log('Image uploaded:', configKey);
    };
    reader.readAsDataURL(file);
}

// ===================================
// Modal Management
// ===================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Clear form fields
    clearModalFields(modalId);
    // Clear editing state (if user cancels edit, item is NOT deleted)
    editingItem = null;
}

function clearModalFields(modalId) {
    const modal = document.getElementById(modalId);
    const inputs = modal.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
}

function setupModal(modalId, closeId, cancelId, confirmId, confirmCallback) {
    document.getElementById(closeId).addEventListener('click', () => closeModal(modalId));
    document.getElementById(cancelId).addEventListener('click', () => closeModal(modalId));
    document.getElementById(confirmId).addEventListener('click', () => {
        confirmCallback();
        closeModal(modalId);
    });
}

// ===================================
// Add Items
// ===================================

function addFeaturedLink() {
    const icon = document.getElementById('featuredIcon').value;
    const title = document.getElementById('featuredTitle').value;
    const description = document.getElementById('featuredDescription').value;
    const url = ensureUrlProtocol(document.getElementById('featuredUrl').value);

    if (!title || !url) {
        showNotification('⚠️ Por favor, preencha o título e a URL', 'warning');
        return;
    }

    // Ensure array exists
    if (!config.featuredLinks) {
        config.featuredLinks = [];
    }

    const link = {
        icon,
        title,
        description,
        url
    };

    // Check if we're editing or adding
    if (editingItem && editingItem.type === 'featured') {
        // Update existing item
        config.featuredLinks[editingItem.index] = link;
        showNotification('✅ Link atualizado!', 'success');
        editingItem = null;
    } else {
        // Add new item
        config.featuredLinks.push(link);
        showNotification('✅ Link em destaque adicionado!', 'success');
    }

    saveToLocalStorage();
    renderFeaturedLinks();
    updatePreview();

    // Clear form
    document.getElementById('featuredTitle').value = '';
    document.getElementById('featuredDescription').value = '';
    document.getElementById('featuredUrl').value = '';
}

function addSocialMedia() {
    const platform = document.getElementById('socialPlatform').value;
    const title = document.getElementById('socialTitle').value || platformTitles[platform];
    const description = document.getElementById('socialDescription').value;
    const url = ensureUrlProtocol(document.getElementById('socialUrl').value);

    if (!url) {
        showNotification('⚠️ Por favor, insira a URL', 'warning');
        return;
    }

    const social = {
        platform,
        title,
        description,
        url,
        icon: platformIcons[platform]
    };

    // Check if we're editing or adding
    if (editingItem && editingItem.type === 'social') {
        config.socialMedia[editingItem.index] = social;
        showNotification('✅ Rede social atualizada!', 'success');
        editingItem = null;
    } else {
        config.socialMedia.push(social);
        showNotification('✅ Rede social adicionada!', 'success');
    }

    saveToLocalStorage();
    renderSocialMedia();
    updatePreview();

    // Clear form
    document.getElementById('socialTitle').value = '';
    document.getElementById('socialDescription').value = '';
    document.getElementById('socialUrl').value = '';
}

function addVideo() {
    const url = ensureUrlProtocol(document.getElementById('videoUrl').value);
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;

    if (!url || !title) {
        showNotification('⚠️ Por favor, preencha a URL e o título do vídeo', 'warning');
        return;
    }

    // Extract video ID from YouTube URL
    const videoId = extractYouTubeId(url);
    const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';

    const video = {
        title,
        description,
        url,
        thumbnail
    };

    // Check if we're editing or adding
    if (editingItem && editingItem.type === 'video') {
        config.youtube.videos[editingItem.index] = video;
        showNotification('✅ Vídeo atualizado!', 'success');
        editingItem = null;
    } else {
        config.youtube.videos.push(video);
        showNotification('✅ Vídeo adicionado!', 'success');
    }

    saveToLocalStorage();
    renderVideos();
    updatePreview();

    // Clear form
    document.getElementById('videoUrl').value = '';
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoDescription').value = '';
}

function addMusicPlatform() {
    const platform = document.getElementById('musicPlatform').value;
    const title = document.getElementById('musicTitle').value || platformTitles[platform];
    const description = document.getElementById('musicDescription').value;
    const url = ensureUrlProtocol(document.getElementById('musicUrl').value);

    if (!url) {
        showNotification('⚠️ Por favor, insira a URL', 'warning');
        return;
    }

    const music = {
        platform,
        title,
        description,
        url,
        icon: platformIcons[platform]
    };

    // Check if we're editing or adding
    if (editingItem && editingItem.type === 'music') {
        config.musicPlatforms[editingItem.index] = music;
        showNotification('✅ Plataforma atualizada!', 'success');
        editingItem = null;
    } else {
        config.musicPlatforms.push(music);
        showNotification('✅ Plataforma adicionada!', 'success');
    }

    saveToLocalStorage();
    renderMusicPlatforms();
    updatePreview();

    // Clear form
    document.getElementById('musicTitle').value = '';
    document.getElementById('musicDescription').value = '';
    document.getElementById('musicUrl').value = '';
}

// ===================================
// Render Lists
// ===================================

function renderAll() {
    renderFeaturedLinks();
    renderSocialMedia();
    renderVideos();
    renderMusicPlatforms();
}

function renderFeaturedLinks() {
    const list = document.getElementById('featuredLinksList');
    if (!list) return;

    // Ensure featuredLinks array exists
    if (!config.featuredLinks) {
        config.featuredLinks = [];
    }

    if (config.featuredLinks.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhum link em destaque. Adicione links para shows, eventos ou promoções.</p>';
        return;
    }

    list.innerHTML = config.featuredLinks.map((item, index) => `
        <div class="sortable-item" draggable="true" data-index="${index}" data-type="featured">
            <i class="fas fa-grip-vertical drag-handle"></i>
            <div class="item-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
                <i class="${item.icon}"></i>
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description || item.url}</div>
            </div>
            <div class="item-actions">
                <button class="item-action edit-btn" onclick="editItem('featured', ${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-action delete-btn" onclick="removeItem('featured', ${index})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    setupDragAndDrop('featuredLinksList', 'featured');
}

function renderSocialMedia() {
    const list = document.getElementById('socialMediaList');

    if (!config.socialMedia || config.socialMedia.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhuma rede social adicionada. Clique em "Adicionar" para começar.</p>';
        return;
    }

    list.innerHTML = config.socialMedia.map((item, index) => `
        <div class="sortable-item" draggable="true" data-index="${index}" data-type="social">
            <i class="fas fa-grip-vertical drag-handle"></i>
            <div class="item-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description || item.url}</div>
            </div>
            <div class="item-actions">
                <button class="item-action edit-btn" onclick="editItem('social', ${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-action delete-btn" onclick="removeItem('social', ${index})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    setupDragAndDrop('socialMediaList', 'social');
}

function renderVideos() {
    const list = document.getElementById('videosList');

    if (!config.youtube.videos || config.youtube.videos.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhum vídeo adicionado. Clique em "Adicionar Vídeo" para começar.</p>';
        return;
    }

    list.innerHTML = config.youtube.videos.map((item, index) => `
        <div class="sortable-item" draggable="true" data-index="${index}" data-type="video">
            <i class="fas fa-grip-vertical drag-handle"></i>
            <div class="item-icon">
                <i class="fab fa-youtube"></i>
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description || 'Sem descrição'}</div>
            </div>
            <div class="item-actions">
                <button class="item-action edit-btn" onclick="editItem('video', ${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-action delete-btn" onclick="removeItem('video', ${index})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    setupDragAndDrop('videosList', 'video');
}

function renderMusicPlatforms() {
    const list = document.getElementById('musicPlatformsList');

    if (!config.musicPlatforms || config.musicPlatforms.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhuma plataforma adicionada. Clique em "Adicionar" para começar.</p>';
        return;
    }

    list.innerHTML = config.musicPlatforms.map((item, index) => `
        <div class="sortable-item" draggable="true" data-index="${index}" data-type="music">
            <i class="fas fa-grip-vertical drag-handle"></i>
            <div class="item-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description || item.url}</div>
            </div>
            <div class="item-actions">
                <button class="item-action edit-btn" onclick="editItem('music', ${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-action delete-btn" onclick="removeItem('music', ${index})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    setupDragAndDrop('musicPlatformsList', 'music');
}

// ===================================
// Edit Items
// ===================================

// Store editing state
let editingItem = null; // { type: 'social', index: 0 }

function editItem(type, index) {
    console.log('✏️ editItem called with:', type, index);
    let item;
    let modalId;

    // Store what we're editing
    editingItem = { type, index };

    if (type === 'featured') {
        item = config.featuredLinks[index];
        modalId = 'featuredModal';
        document.getElementById('featuredIcon').value = item.icon;
        document.getElementById('featuredTitle').value = item.title;
        document.getElementById('featuredDescription').value = item.description || '';
        document.getElementById('featuredUrl').value = item.url;
    } else if (type === 'social') {
        item = config.socialMedia[index];
        modalId = 'socialModal';
        document.getElementById('socialPlatform').value = item.platform;
        document.getElementById('socialTitle').value = item.title;
        document.getElementById('socialDescription').value = item.description || '';
        document.getElementById('socialUrl').value = item.url;
    } else if (type === 'video') {
        item = config.youtube.videos[index];
        modalId = 'videoModal';
        document.getElementById('videoUrl').value = item.url;
        document.getElementById('videoTitle').value = item.title;
        document.getElementById('videoDescription').value = item.description || '';
    } else if (type === 'music') {
        item = config.musicPlatforms[index];
        modalId = 'musicModal';
        document.getElementById('musicPlatform').value = item.platform;
        document.getElementById('musicTitle').value = item.title;
        document.getElementById('musicDescription').value = item.description || '';
        document.getElementById('musicUrl').value = item.url;
    }

    // Open modal (DON'T delete the item!)
    openModal(modalId);
}

// Clear editing state when modal is closed
function clearEditingState() {
    editingItem = null;
}

// ===================================
// Drag and Drop
// ===================================

function setupDragAndDrop(listId, type) {
    const list = document.getElementById(listId);
    if (!list) return;

    const items = list.querySelectorAll('.sortable-item');

    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedElement = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            console.log('🔄 Drag started:', item.dataset.index);
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            item.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });

        item.addEventListener('dragleave', (e) => {
            item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            item.classList.remove('drag-over');

            if (draggedElement && draggedElement !== item) {
                const fromIndex = parseInt(draggedElement.dataset.index);
                const toIndex = parseInt(item.dataset.index);

                console.log('🔄 Drop: moving from', fromIndex, 'to', toIndex);

                // Reorder array
                let array;
                if (type === 'featured') array = config.featuredLinks;
                else if (type === 'social') array = config.socialMedia;
                else if (type === 'video') array = config.youtube.videos;
                else if (type === 'music') array = config.musicPlatforms;

                if (array && !isNaN(fromIndex) && !isNaN(toIndex)) {
                    const movedItem = array.splice(fromIndex, 1)[0];
                    array.splice(toIndex, 0, movedItem);

                    // Save and re-render
                    saveToLocalStorage();
                    saveToSupabase(config);

                    if (type === 'featured') renderFeaturedLinks();
                    else if (type === 'social') renderSocialMedia();
                    else if (type === 'video') renderVideos();
                    else if (type === 'music') renderMusicPlatforms();

                    updatePreview();
                    showNotification('✅ Ordem atualizada!', 'success');
                }
            }
        });

        item.addEventListener('dragend', (e) => {
            item.classList.remove('dragging');
            // Clean up all drag-over classes
            list.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
            draggedElement = null;
        });
    });
}

let draggedElement = null;

function handleDrop(e, type) {
    console.log('🔄 handleDrop called, type:', type);

    if (e.stopPropagation) {
        e.stopPropagation();
    }

    // Remove drag-over class from this element
    this.classList.remove('drag-over');

    if (draggedElement !== this) {
        const fromIndex = parseInt(draggedElement.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        console.log('🔄 Moving from index', fromIndex, 'to index', toIndex);

        // Reorder array
        let array;
        if (type === 'social') array = config.socialMedia;
        else if (type === 'video') array = config.youtube.videos;
        else if (type === 'music') array = config.musicPlatforms;

        if (!array) {
            console.error('❌ Array not found for type:', type);
            return false;
        }

        console.log('🔄 Array before:', array.map(i => i.title));

        const item = array.splice(fromIndex, 1)[0];
        array.splice(toIndex, 0, item);

        console.log('🔄 Array after:', array.map(i => i.title));

        // Save and re-render
        saveToLocalStorage();

        // Also save to Supabase for persistence
        saveToSupabase(config);

        if (type === 'social') renderSocialMedia();
        else if (type === 'video') renderVideos();
        else if (type === 'music') renderMusicPlatforms();

        updatePreview();
        showNotification('✅ Ordem atualizada!', 'success');
    }

    return false;
}

function handleDragEnd() {
    this.classList.remove('dragging');
    // Clean up any drag-over classes
    document.querySelectorAll('.sortable-item.drag-over').forEach(item => {
        item.classList.remove('drag-over');
    });
}

// ===================================
// Remove Item
// ===================================

// Store pending delete info
let pendingDelete = null;

// Initialize delete modal
function initializeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const closeBtn = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const confirmBtn = document.getElementById('confirmDeleteBtn');

    if (!deleteModal) return;

    closeBtn.addEventListener('click', () => {
        closeDeleteModal();
    });

    cancelBtn.addEventListener('click', () => {
        closeDeleteModal();
    });

    confirmBtn.addEventListener('click', () => {
        if (pendingDelete) {
            executeDelete(pendingDelete.type, pendingDelete.index);
        }
        closeDeleteModal();
    });

    // Close on background click
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

function openDeleteModal(type, index, itemName) {
    pendingDelete = { type, index };
    const message = document.getElementById('deleteMessage');
    message.textContent = `Tem certeza que deseja remover "${itemName}"?`;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    pendingDelete = null;
}

function removeItem(type, index, skipConfirm = false) {
    console.log('🗑️ removeItem called with:', type, index, 'skipConfirm:', skipConfirm);

    // If skipConfirm is true, delete silently (used by editItem)
    if (skipConfirm) {
        console.log('🗑️ Skipping confirmation, executing delete directly');
        executeDelete(type, index);
        return;
    }

    // Get item name for confirmation message
    let itemName = 'este item';
    if (type === 'featured' && config.featuredLinks && config.featuredLinks[index]) {
        itemName = config.featuredLinks[index].title;
    } else if (type === 'social' && config.socialMedia[index]) {
        itemName = config.socialMedia[index].title;
    } else if (type === 'video' && config.youtube.videos[index]) {
        itemName = config.youtube.videos[index].title;
    } else if (type === 'music' && config.musicPlatforms[index]) {
        itemName = config.musicPlatforms[index].title;
    }
    console.log('🗑️ Opening delete modal for:', itemName);

    // Open confirmation modal
    openDeleteModal(type, index, itemName);
}

function executeDelete(type, index) {
    if (type === 'featured') {
        config.featuredLinks.splice(index, 1);
        renderFeaturedLinks();
    } else if (type === 'social') {
        config.socialMedia.splice(index, 1);
        renderSocialMedia();
    } else if (type === 'video') {
        config.youtube.videos.splice(index, 1);
        renderVideos();
    } else if (type === 'music') {
        config.musicPlatforms.splice(index, 1);
        renderMusicPlatforms();
    }

    saveToLocalStorage();
    updatePreview();
    showNotification('✅ Item removido com sucesso!', 'success');
}

// ===================================
// Preview Update
// ===================================

function updatePreview() {
    const iframe = document.getElementById('previewFrame');

    if (!iframe) return;

    // First, try to send config via postMessage
    if (iframe.contentWindow) {
        try {
            iframe.contentWindow.postMessage({
                type: 'updateConfig',
                config: config
            }, '*');
            console.log('📤 Sent config to preview iframe');
        } catch (error) {
            console.log('Could not send postMessage, reloading iframe');
        }
    }

    // Also reload the iframe to ensure latest changes are applied
    // This is needed because postMessage might not work for file:// URLs
    const currentSrc = iframe.src;
    iframe.src = '';
    setTimeout(() => {
        iframe.src = currentSrc;
    }, 100);
}

function sendConfigToPreview(iframe) {
    try {
        // Send config to iframe
        iframe.contentWindow.postMessage({
            type: 'updateConfig',
            config: config
        }, '*');
    } catch (error) {
        console.log('Preview update will happen when iframe loads');
    }
}

// ===================================
// Save Configuration
// ===================================

function saveConfig() {
    // Save to localStorage
    localStorage.setItem('adminConfig', JSON.stringify(config));

    // Show success message
    showNotification('✅ Configuração salva! A landing page já está atualizada.', 'success');

    console.log('✅ Config saved to localStorage:', config);
    console.log('💡 Recarregue a landing page (index.html) para ver as mudanças!');
}

// ===================================
// Notifications
// ===================================

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===================================
// Utilities
// ===================================

function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Helper function to ensure URL has protocol (https://)
function ensureUrlProtocol(url) {
    if (!url) return url;
    url = url.trim();

    // If URL doesn't start with http:// or https://, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
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

// Show Canva preview in admin panel
function showCanvaPreview(url) {
    const previewContainer = document.getElementById('canvaPreviewContainer');
    const preview = document.getElementById('canvaPreview');

    if (!previewContainer || !preview) return;

    const embedUrl = getCanvaEmbedUrl(url);

    preview.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            allowfullscreen="true" 
            allow="fullscreen"
            loading="lazy"
            style="width: 100%; height: 100%; border: none;">
        </iframe>
    `;

    previewContainer.style.display = 'block';
}

// Add config file button (for browsers that support it)
function addConfigFileButton() {
    // This would allow selecting actual files on disk
    // For now, it's just a placeholder
}

// ===================================
// Import & Reset Config
// ===================================

// Import config from a JSON file
function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedConfig = JSON.parse(event.target.result);

                // Validate the imported config has expected structure
                if (!importedConfig.profile || !importedConfig.socialMedia) {
                    throw new Error('Arquivo config.json inválido');
                }

                // Merge with defaults to ensure all fields exist
                config = {
                    ...JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
                    ...importedConfig
                };

                // Ensure arrays exist
                if (!config.socialMedia) config.socialMedia = [];
                if (!config.youtube?.videos) config.youtube.videos = [];
                if (!config.musicPlatforms) config.musicPlatforms = [];

                // Ensure canvaEmbed exists
                if (!config.canvaEmbed) {
                    config.canvaEmbed = DEFAULT_CONFIG.canvaEmbed;
                }

                // Save to localStorage
                saveToLocalStorage();

                // Update UI
                populateForm();
                renderAll();
                updatePreview();

                showNotification('✅ Configuração importada com sucesso!', 'success');
                console.log('Imported config:', config);
            } catch (error) {
                console.error('Error importing config:', error);
                showNotification('❌ Erro ao importar: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// Reset config to defaults
function resetConfig() {
    if (!confirm('Tem certeza que deseja restaurar os dados padrão? Todas as alterações serão perdidas.')) {
        return;
    }

    // Reset to default config
    config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    // Clear localStorage
    localStorage.removeItem('adminConfig');

    // Save new config
    saveToLocalStorage();

    // Update UI
    populateForm();
    renderAll();
    updatePreview();

    showNotification('✅ Configuração restaurada para os dados padrão!', 'success');
    console.log('Config reset to defaults:', config);
}

// ===================================
// Expose functions to global scope
// ===================================
// Required for onclick handlers in HTML to work
// Must be at the end of the file, after all functions are defined
window.editItem = editItem;
window.removeItem = removeItem;
window.openModal = openModal;
window.closeModal = closeModal;
window.addFeaturedLink = addFeaturedLink;
window.addSocialMedia = addSocialMedia;
window.addVideo = addVideo;
window.addMusicPlatform = addMusicPlatform;
window.saveConfig = saveConfig;
window.updatePreview = updatePreview;
window.importConfig = importConfig;
window.resetConfig = resetConfig;
window.renderFeaturedLinks = renderFeaturedLinks;

console.log('📜 admin.js FULLY LOADED - all functions exposed to window');
