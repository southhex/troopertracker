import {
    loadRoster,
    saveRoster,
    createNewTrooper,
    deleteTrooper,
    updateTrooper
} from './modules/dataManager.js';

import {
    renderMissionRoster,
    renderBarracksRoster
} from './modules/renderer.js';

import {
    handlePipClick,
    handlePositionClick,
    handleGearListClick,
    handleInputChange
} from './modules/eventHandlers.js';

const appContainer = document.getElementById('app-container');
const rosterContainer = document.getElementById('roster-container');
const barracksContainer = document.getElementById('barracks-roster-container');
const addTrooperBtn = document.getElementById('add-trooper-btn');

const missionTabBtn = document.getElementById('mission-tab-btn');
const barracksTabBtn = document.getElementById('barracks-tab-btn');
const missionView = document.getElementById('mission-view');
const barracksView = document.getElementById('barracks-view');

let roster = [];
let currentView = 'mission';
let trooperToDeleteId = null;

const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const trooperNameSpan = document.getElementById('trooper-name-to-delete');

/**
 * Shows the confirmation modal for trooper deletion.
 */
function showDeleteModal(id) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        trooperToDeleteId = id;
        trooperNameSpan.textContent = trooper.name;
        confirmationModal.classList.remove('hidden');
    }
}

/**
 * Performs the deletion after user confirmation.
 */
function confirmDeletion() {
    if (trooperToDeleteId) {
        roster = deleteTrooper(roster, trooperToDeleteId);
        saveRoster(roster);

        trooperToDeleteId = null;
        confirmationModal.classList.add('hidden');

        requestAnimationFrame(renderApp);
    }
}

/**
 * Hides the modal if the user cancels.
 */
function cancelDeletion() {
    trooperToDeleteId = null;
    confirmationModal.classList.add('hidden');
}

/**
 * Switches the active view and re-renders the app.
 */
function switchView(viewName) {
    currentView = viewName;
    renderApp();
}

/**
 * The main render function that decides what to draw.
 */
function renderApp() {
    if (currentView === 'mission') {
        missionTabBtn.classList.add('active');
        barracksTabBtn.classList.remove('active');
        missionView.classList.remove('hidden');
        barracksView.classList.add('hidden');
        renderMissionRoster(roster, rosterContainer);
    } else {
        missionTabBtn.classList.remove('active');
        barracksTabBtn.classList.add('active');
        missionView.classList.add('hidden');
        barracksView.classList.remove('hidden');
        renderBarracksRoster(roster, barracksContainer);
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * Handles adding a new trooper.
 */
function handleAddTrooper() {
    const newTrooper = createNewTrooper();
    roster.push(newTrooper);
    saveRoster(roster);
    requestAnimationFrame(renderApp);
}

/**
 * Unified event handler for clicks (pips, positions, gear, delete, deploy).
 */
function handleClick(event) {
    const deleteBtn = event.target.closest('.delete-button');
    if (deleteBtn) {
        const trooperId = deleteBtn.dataset.id;
        if (trooperId) {
            showDeleteModal(trooperId);
            return;
        }
    }

    const deployBtn = event.target.closest('.deploy-button');
    if (deployBtn) {
        const trooperId = deployBtn.dataset.id;
        const action = deployBtn.dataset.action;
        if (trooperId) {
            const newIsActiveValue = action === 'deploy';
            roster = updateTrooper(roster, trooperId, 'isActive', newIsActiveValue);
            saveRoster(roster);
            requestAnimationFrame(renderApp);
            return;
        }
    }

    handlePipClick(roster, event, renderApp);
    handlePositionClick(roster, event, renderApp);
    handleGearListClick(roster, event, renderApp);
}

appContainer.addEventListener('click', handleClick);
appContainer.addEventListener('change', (event) => handleInputChange(roster, event, renderApp));

addTrooperBtn.addEventListener('click', handleAddTrooper);
missionTabBtn.addEventListener('click', () => switchView('mission'));
barracksTabBtn.addEventListener('click', () => switchView('barracks'));

confirmDeleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    confirmDeletion();
});

cancelDeleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    cancelDeletion();
});

confirmationModal.addEventListener('click', (event) => {
    if (event.target === confirmationModal) {
        cancelDeletion();
    }
});

// Ensure modal is hidden on initial load
if (confirmationModal) {
    confirmationModal.classList.add('hidden');
}

roster = loadRoster();
renderApp();
