import {
    loadRoster,
    saveRoster,
    createNewTrooper,
    deleteTrooper,
    updateTrooper,
    resetAllPositions
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

import {
    loadMissionState,
    saveMissionState,
    startMission,
    endMission,
    setThreatLevel,
    setMomentum,
    adjustMomentum,
    setCover,
    setSpace,
    incrementExchange,
    decrementExchange,
    toggleHeaderExpanded,
    canSetFortified,
    canSetFlanking,
    isMissionWon,
    isForcedRetreat
} from './modules/missionManager.js';

import {
    renderMissionControl
} from './modules/missionControlRenderer.js';

import {
    showToast,
    showWarning,
    showSuccess,
    initToastContainer
} from './modules/toastNotifications.js';

const appContainer = document.getElementById('app-container');
const rosterContainer = document.getElementById('roster-container');
const barracksContainer = document.getElementById('barracks-roster-container');
const missionControlContainer = document.getElementById('mission-control-container');
const addTrooperBtn = document.getElementById('add-trooper-btn');

const missionTabBtn = document.getElementById('mission-tab-btn');
const missionControlTabBtn = document.getElementById('mission-control-tab-btn');
const barracksTabBtn = document.getElementById('barracks-tab-btn');
const missionView = document.getElementById('mission-view');
const missionControlView = document.getElementById('mission-control-view');
const barracksView = document.getElementById('barracks-view');

let roster = [];
let missionState = null;
let currentView = 'mission';
let trooperToDeleteId = null;
let selectedTrooperId = null;
let previousMomentum = null; // Track momentum for victory/retreat notifications

// Make validation functions available globally for eventHandlers
window.validateFortified = function(roster, trooperId, cover) {
    // Exclude the trooper being changed from the count
    const otherTroopers = roster.filter(t => t.id !== trooperId);
    return canSetFortified(otherTroopers, cover);
};

window.validateFlanking = function(roster, trooperId, space) {
    // Exclude the trooper being changed from the count
    const otherTroopers = roster.filter(t => t.id !== trooperId);
    return canSetFlanking(otherTroopers, space);
};

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

        // If we deleted the selected trooper, select the first one
        if (selectedTrooperId === trooperToDeleteId && roster.length > 0) {
            selectedTrooperId = roster[0].id;
        } else if (roster.length === 0) {
            selectedTrooperId = null;
        }

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
 * Selects a trooper in Barracks view and re-renders.
 */
function selectTrooper(id) {
    selectedTrooperId = id;
    renderApp();
}

/**
 * Switches the active view and re-renders the app.
 */
function switchView(viewName) {
    currentView = viewName;

    // Auto-select first trooper when entering Barracks view
    if (viewName === 'barracks' && roster.length > 0) {
        if (!selectedTrooperId || !roster.find(t => t.id === selectedTrooperId)) {
            selectedTrooperId = roster[0].id;
        }
    }

    renderApp();
}

/**
 * The main render function that decides what to draw.
 */
function renderApp() {
    // Update tab button states
    missionTabBtn.classList.toggle('active', currentView === 'mission');
    missionControlTabBtn.classList.toggle('active', currentView === 'mission-control');
    barracksTabBtn.classList.toggle('active', currentView === 'barracks');

    // Update view visibility
    missionView.classList.toggle('hidden', currentView !== 'mission');
    missionControlView.classList.toggle('hidden', currentView !== 'mission-control');
    barracksView.classList.toggle('hidden', currentView !== 'barracks');

    // Render the appropriate view
    if (currentView === 'mission') {
        renderMissionRoster(roster, rosterContainer, missionState);
    } else if (currentView === 'mission-control') {
        renderMissionControl(missionState, missionControlContainer);
    } else if (currentView === 'barracks') {
        renderBarracksRoster(roster, barracksContainer, selectedTrooperId);
    }

    if (window.lucide) {
        lucide.createIcons();
    }

    // Check for victory/retreat notifications
    checkMomentumNotifications();
}

/**
 * Checks if momentum has reached victory or retreat thresholds and shows notifications
 */
function checkMomentumNotifications() {
    if (previousMomentum === null || previousMomentum === missionState.momentum) {
        previousMomentum = missionState.momentum;
        return;
    }

    // Check for victory
    if (isMissionWon(missionState) && !isMissionWon({...missionState, momentum: previousMomentum})) {
        showSuccess(`VICTORY! Engagement won at momentum +${missionState.momentum}`, 5000);
    }

    // Check for forced retreat
    if (isForcedRetreat(missionState) && !isForcedRetreat({...missionState, momentum: previousMomentum})) {
        showToast('FORCED RETREAT! Squad must fall back', 'error', 5000);
    }

    previousMomentum = missionState.momentum;
}

/**
 * Handles adding a new trooper.
 */
function handleAddTrooper() {
    const newTrooper = createNewTrooper();
    roster.push(newTrooper);
    saveRoster(roster);

    // Auto-select the newly added trooper
    selectedTrooperId = newTrooper.id;

    requestAnimationFrame(renderApp);
}

/**
 * Handles engagement/mission control button clicks
 */
function handleMissionControlClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return false;

    const action = target.dataset.action;

    switch (action) {
        case 'start-mission':
            missionState = startMission(missionState.threatLevel);
            requestAnimationFrame(renderApp);
            return true;

        case 'end-mission':
            missionState = endMission();
            requestAnimationFrame(renderApp);
            return true;

        case 'set-threat-level':
            const threatLevel = parseInt(target.dataset.value);
            missionState = setThreatLevel(missionState, threatLevel);
            requestAnimationFrame(renderApp);
            return true;

        case 'set-momentum':
            const momentum = parseInt(target.dataset.value);
            missionState = setMomentum(missionState, momentum);
            requestAnimationFrame(renderApp);
            return true;

        case 'adjust-momentum':
            const delta = parseInt(target.dataset.delta);
            missionState = adjustMomentum(missionState, delta);
            requestAnimationFrame(renderApp);
            return true;

        case 'set-cover':
            const cover = parseInt(target.dataset.value);
            missionState = setCover(missionState, cover);
            requestAnimationFrame(renderApp);
            return true;

        case 'set-space':
            const space = parseInt(target.dataset.value);
            missionState = setSpace(missionState, space);
            requestAnimationFrame(renderApp);
            return true;

        case 'increment-exchange':
            missionState = incrementExchange(missionState);
            requestAnimationFrame(renderApp);
            return true;

        case 'decrement-exchange':
            missionState = decrementExchange(missionState);
            requestAnimationFrame(renderApp);
            return true;

        case 'toggle-header':
            missionState = toggleHeaderExpanded(missionState);
            requestAnimationFrame(renderApp);
            return true;

        case 'reset-exchange':
            missionState = { ...missionState, exchangeCount: 1 };
            saveMissionState(missionState);
            showSuccess('Exchange counter reset to 1');
            requestAnimationFrame(renderApp);
            return true;

        case 'reset-positions':
            roster = resetAllPositions(roster);
            saveRoster(roster);
            showSuccess('All trooper positions reset to Engaged/In Cover');
            requestAnimationFrame(renderApp);
            return true;
    }

    return false;
}

/**
 * Unified event handler for clicks (pips, positions, gear, delete, deploy, mission control).
 */
function handleClick(event) {
    // Handle mission control actions
    if (handleMissionControlClick(event)) {
        return;
    }

    // Handle trooper list item selection
    const listItem = event.target.closest('.trooper-list-item');
    if (listItem) {
        const trooperId = listItem.dataset.id;
        if (trooperId) {
            selectTrooper(trooperId);
            return;
        }
    }

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
    handlePositionClick(roster, event, renderApp, missionState, showWarning);
    handleGearListClick(roster, event, renderApp);
}

appContainer.addEventListener('click', handleClick);
appContainer.addEventListener('change', (event) => handleInputChange(roster, event, renderApp));

addTrooperBtn.addEventListener('click', handleAddTrooper);
missionTabBtn.addEventListener('click', () => switchView('mission'));
missionControlTabBtn.addEventListener('click', () => switchView('mission-control'));
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

// Initialize toast notification system
initToastContainer();

// Load data from LocalStorage
roster = loadRoster();
missionState = loadMissionState();
previousMomentum = missionState.momentum; // Initialize momentum tracking

// Initial render
renderApp();
