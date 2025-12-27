// Admin Dashboard JavaScript
// Drag-and-Drop Editor for Landing Page

// ===================================
// Supabase Configuration
// ===================================

const SUPABASE_URL = 'https://sesftfsjfzknaioqajtq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlc2Z0ZnNqZnprbmFpb3FhanRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3ODY3OTQsImV4cCI6MjA4MjM2Mjc5NH0.pKpGYHxIU3MTHhPbsR8u2F9LV1V5xznwtS_rq9UXis0';

let supabase = null;

// Initialize Supabase client
function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized');
        return true;
    }
    console.warn('⚠️ Supabase SDK not loaded');
    return false;
}

// Save config to Supabase
async function saveToSupabase(configData) {
    if (!supabase) {
        console.warn('Supabase not initialized, skipping cloud save');
        return false;
    }

    try {
        const { data, error } = await supabase
            .from('site_config')
            .upsert({ id: 1, config: configData, updated_at: new Date().toISOString() })
            .select();

        if (error) {
            console.error('Error saving to Supabase:', error);
            return false;
        }

        console.log('✅ Config saved to Supabase');
        return true;
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        return false;
    }
}

// Load config from Supabase
async function loadFromSupabase() {
    if (!supabase) {
        console.warn('Supabase not initialized, skipping cloud load');
        return null;
    }

    try {
        const { data, error } = await supabase
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
        image: 'profile.png',
        bannerImage: ''
    },
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
                thumbnail: 'https://via.placeholder.com/400x225/8B5CF6/FFFFFF?text=Mais+Videos'
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
function initAdmin() {
    console.log('🚀 Initializing Admin Dashboard...');

    // Initialize Supabase first
    initSupabase();

    loadExistingConfig();
    initializeEventListeners();
    initializeDeleteModal();
    renderAll();

    // Add config file selection button (Chrome/Edge only)
    if ('showOpenFilePicker' in window) {
        addConfigFileButton();
    }

    console.log('✅ Admin Dashboard initialized!');
}

// Handle initialization - works even if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    // DOM is already ready
    initAdmin();
}

// ===================================
// Load Existing Config
// ===================================

async function loadExistingConfig() {
    let supabaseConfig = null;
    let localConfig = null;
    let fileConfig = null;

    // Try to load from Supabase first (cloud storage - highest priority)
    supabaseConfig = await loadFromSupabase();
    if (supabaseConfig) {
        console.log('✅ Using config from Supabase (cloud)');
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

    // Also save to Supabase (async, don't block UI)
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

    // Image uploads
    setupImageUpload('profileImageUpload', 'profileImageInput', 'profileImagePreview', 'image');
    setupImageUpload('bannerImageUpload', 'bannerImageInput', 'bannerImagePreview', 'bannerImage');

    // Add buttons
    document.getElementById('addSocialBtn').addEventListener('click', () => openModal('socialModal'));
    document.getElementById('addVideoBtn').addEventListener('click', () => openModal('videoModal'));
    document.getElementById('addMusicBtn').addEventListener('click', () => openModal('musicModal'));

    // Modal buttons
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

    // Click to upload
    uploadArea.addEventListener('click', () => input.click());

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
        previewElement.innerHTML = '';
        previewElement.appendChild(img);
        previewElement.classList.add('active');

        // Save base64 to config (so it works with localStorage)
        config.profile[configKey] = base64Image;

        // Save to localStorage
        saveToLocalStorage();

        // Update preview
        updatePreview();

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

function addSocialMedia() {
    const platform = document.getElementById('socialPlatform').value;
    const title = document.getElementById('socialTitle').value || platformTitles[platform];
    const description = document.getElementById('socialDescription').value;
    const url = document.getElementById('socialUrl').value;

    if (!url) {
        alert('Por favor, insira a URL');
        return;
    }

    const social = {
        platform,
        title,
        description,
        url,
        icon: platformIcons[platform]
    };

    config.socialMedia.push(social);
    saveToLocalStorage();
    renderSocialMedia();
    updatePreview();

    // Clear form
    document.getElementById('socialTitle').value = '';
    document.getElementById('socialDescription').value = '';
    document.getElementById('socialUrl').value = '';
}

function addVideo() {
    const url = document.getElementById('videoUrl').value;
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;

    if (!url || !title) {
        alert('Por favor, preencha a URL e o título do vídeo');
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

    config.youtube.videos.push(video);
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
    const url = document.getElementById('musicUrl').value;

    if (!url) {
        alert('Por favor, insira a URL');
        return;
    }

    const music = {
        platform,
        title,
        description,
        url,
        icon: platformIcons[platform]
    };

    config.musicPlatforms.push(music);
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
    renderSocialMedia();
    renderVideos();
    renderMusicPlatforms();
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

function editItem(type, index) {
    let item;
    let modalId;

    if (type === 'social') {
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

    // Remove the old item before opening modal
    removeItem(type, index, false); // false = don't confirm

    // Open modal
    openModal(modalId);
}

// ===================================
// Drag and Drop
// ===================================

function setupDragAndDrop(listId, type) {
    const list = document.getElementById(listId);
    const items = list.querySelectorAll('.sortable-item');

    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', (e) => handleDrop(e, type));
        item.addEventListener('dragend', handleDragEnd);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e, type) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const fromIndex = parseInt(draggedElement.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        // Reorder array
        let array;
        if (type === 'social') array = config.socialMedia;
        else if (type === 'video') array = config.youtube.videos;
        else if (type === 'music') array = config.musicPlatforms;

        const item = array.splice(fromIndex, 1)[0];
        array.splice(toIndex, 0, item);

        // Save and re-render
        saveToLocalStorage();

        if (type === 'social') renderSocialMedia();
        else if (type === 'video') renderVideos();
        else if (type === 'music') renderMusicPlatforms();

        updatePreview();
    }

    return false;
}

function handleDragEnd() {
    this.classList.remove('dragging');
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

function removeItem(type, index) {
    // Get item name for confirmation message
    let itemName = 'este item';
    if (type === 'social' && config.socialMedia[index]) {
        itemName = config.socialMedia[index].title;
    } else if (type === 'video' && config.youtube.videos[index]) {
        itemName = config.youtube.videos[index].title;
    } else if (type === 'music' && config.musicPlatforms[index]) {
        itemName = config.musicPlatforms[index].title;
    }

    // Open confirmation modal
    openDeleteModal(type, index, itemName);
}

function executeDelete(type, index) {
    if (type === 'social') {
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

    // Wait for iframe to load if not ready
    if (!iframe.contentWindow) {
        iframe.addEventListener('load', () => {
            sendConfigToPreview(iframe);
        }, { once: true });
    } else {
        sendConfigToPreview(iframe);
    }
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
