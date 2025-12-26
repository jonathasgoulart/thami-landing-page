
// ===================================
// Config File Selection
// ===================================

function addConfigFileButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) {
        console.error('Header actions not found');
        return;
    }

    const selectBtn = document.createElement('button');
    selectBtn.className = 'btn btn-secondary';
    selectBtn.innerHTML = '<i class="fas fa-folder-open"></i> Abrir config.json';
    selectBtn.onclick = selectConfigFile;

    // Insert as first button
    headerActions.insertBefore(selectBtn, headerActions.firstChild);
}

async function selectConfigFile() {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }],
            multiple: false
        });

        // Store the file handle for saving
        fileHandle = handle;

        // Load the config from selected file
        const file = await handle.getFile();
        const content = await file.text();
        config = JSON.parse(content);

        // Update UI
        populateForm();
        renderAll();
        updatePreview();

        showNotification('✅ Config carregado! Agora as alterações serão salvas automaticamente neste arquivo.', 'success');
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error selecting file:', error);
            showNotification('❌ Erro ao abrir arquivo', 'error');
        }
    }
}
