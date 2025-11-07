// script.js

// Import data
import { MAX_AMMO, EQUIPMENT_DATABASE } from './equipment.js';

// Import template generation functions
import { generateMissionCard } from './templates/missionCard.js';
import { generateBarracksCard } from './templates/barracksCard.js';


// --- Constants and Global State ---
const appContainer = document.getElementById('app-container'); 
const rosterContainer = document.getElementById('roster-container');
const barracksContainer = document.getElementById('barracks-roster-container');
const addTrooperBtn = document.getElementById('add-trooper-btn');

const missionTabBtn = document.getElementById('mission-tab-btn');
const barracksTabBtn = document.getElementById('barracks-tab-btn');
const missionView = document.getElementById('mission-view');
const barracksView = document.getElementById('barracks-view');

// MODAL CONSTANTS
const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const trooperNameSpan = document.getElementById('trooper-name-to-delete');

let roster = [];
let currentView = 'mission'; 
let trooperToDeleteId = null; 


// --- Core Data Management Functions ---
/**
 * Ensures all equipment counters for a trooper are initialized to their MAX value
 * if they are currently undefined (used for new troopers and data migration).
 */
function initializeTrooperCounters(trooper) {
    // Convert gear string to a clean array of IDs
    const gearIds = trooper.gear.split(',').map(item => item.trim().toLowerCase()).filter(id => id.length > 0);

    gearIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (!item || !item.counters) return;

        Object.keys(item.counters).forEach(counterId => {
            const currentField = counterId + '_current';
            const counterDef = item.counters[counterId];

            // If the current value is UNDEFINED (new data/trooper), set it to the maximum value
            if (trooper[currentField] === undefined) {
                trooper[currentField] = counterDef.max;
            }
        });
    });
    return trooper;
}
/**
 * Loads the roster from Local Storage and ensures data integrity.
 */
function loadRoster() {
    const savedRoster = localStorage.getItem('dangerCloseRoster');
    if (savedRoster) {
        roster = JSON.parse(savedRoster);
    }
    
    // Data Migration Check & Initialization
    roster = roster.map(t => {
        const updatedTrooper = {
            ...t,
            gritMax: t.gritMax || 1, 
            gritCurrent: Math.min(t.gritCurrent, t.gritMax || 1), 
            offensivePosition: t.offensivePosition || "N/A", 
            defensivePosition: t.defensivePosition || "N/A",
            // NOTE: Removed hardcoded initialization for armor_absorbed_current and pack_ammo_current
        };
        // NEW: Initialize all equipment counters to their max value if they are missing
        return initializeTrooperCounters(updatedTrooper); 
    });

    renderApp();
}

/**
 * Saves the current roster array to Local Storage.
 */
function saveRoster() {
    localStorage.setItem('dangerCloseRoster', JSON.stringify(roster));
}

/**
 * Creates a new, blank trooper object and adds it to the roster.
 */
/**
 * Creates a new, blank trooper object and adds it to the roster.
 */
function createNewTrooper() {
    const newTrooperTemplate = {
        id: `trooper-${Date.now()}`, 
        name: "New Trooper",
        status: "OK", 
        gear: "assault_rifle, medium_armor", // Default gear
        gritCurrent: 1, 
        gritMax: 1,     
        ammoCurrent: MAX_AMMO, 
        offensivePosition: "N/A", 
        defensivePosition: "N/A", 
        notes: "",
        
        // REMOVED: Initial counter values were here.
    };

    // NEW: Initialize counters based on default gear ("assault_rifle, medium_armor")
    const fullyInitializedTrooper = initializeTrooperCounters(newTrooperTemplate); 

    roster.push(fullyInitializedTrooper);
    saveRoster();
    requestAnimationFrame(renderApp); // Use rAF to re-render
}

/**
 * Updates a specific trooper's data and schedules a re-render.
 */
function updateTrooper(id, field, value) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (field === 'gritMax') {
            trooper[field] = parseFloat(value);
        } else {
            trooper[field] = value;
        }
        
        // Clamping current grit if max is reduced
        if (field === 'gritMax' && trooper.gritCurrent > trooper.gritMax) {
            trooper.gritCurrent = trooper.gritMax;
        }

        saveRoster();
        requestAnimationFrame(renderApp); 
    }
}

/**
 * Shows the confirmation modal instead of using browser confirm().
 */
function deleteTrooper(id) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        trooperToDeleteId = id;
        trooperNameSpan.textContent = trooper.name;
        confirmationModal.classList.remove('hidden');
    }
}

/**
 * Performs the deletion after the user confirms via the modal.
 */
function confirmDeletion() {
    if (trooperToDeleteId) {
        // Perform the actual deletion
        roster = roster.filter(t => t.id !== trooperToDeleteId);
        saveRoster();
        
        // Reset and hide the modal
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


// --- GEAR MANAGEMENT FUNCTIONS ---

/**
 * Adds an item to a trooper's gear list when selected from the dropdown.
 */
function addGearItem(id, itemKey) {
    const trooper = roster.find(t => t.id === id);
    if (trooper && itemKey) {
        // Clean and split current gear, filtering out empty strings
        const currentGearArray = trooper.gear.split(',').map(item => item.trim()).filter(i => i.length > 0);
        
        if (!currentGearArray.includes(itemKey)) {
            currentGearArray.push(itemKey);
            trooper.gear = currentGearArray.join(', ');
            saveRoster();
            requestAnimationFrame(renderApp);
        }
    }
}

/**
 * Removes an item from a trooper's gear list. 
 */
function removeGearItem(id, itemKey) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        const currentGearArray = trooper.gear.split(',').map(item => item.trim()).filter(i => i.length > 0);
        trooper.gear = currentGearArray.filter(i => i !== itemKey).join(', ');
        saveRoster();
        requestAnimationFrame(renderApp);
    }
}

/**
 * Handles clicks on the remove gear button using delegation.
 */
function handleGearListClick(event) {
    const removeBtn = event.target.closest('.remove-gear-btn');
    if (!removeBtn) return;

    const trooperId = removeBtn.dataset.id;
    const itemKey = removeBtn.dataset.item;
    
    if (trooperId && itemKey) {
        removeGearItem(trooperId, itemKey);
    }
}


// --- VIEW HELPER FUNCTIONS ---
/**
 * Sets the current grit for a trooper and re-renders, with toggle logic.
 */
function setGrit(id, amount) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (amount === trooper.gritCurrent) {
            trooper.gritCurrent = Math.max(0, amount - 1); 
        } else {
            trooper.gritCurrent = amount;
        }
        saveRoster();
        requestAnimationFrame(renderApp);
    }
}

/**
 * Sets the current ammo for a trooper and re-renders, with toggle logic and max limit enforcement.
 */
function setAmmo(id, amount) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (amount === trooper.ammoCurrent) {
            trooper.ammoCurrent = Math.max(0, amount - 1); 
        } else {
            trooper.ammoCurrent = Math.min(amount, MAX_AMMO);
        }
        saveRoster();
        requestAnimationFrame(renderApp);
    }
}

/**
 * Sets the current value for an equipment-based counter.
 */
function setEquipmentCounter(id, counterField, amount) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (amount === trooper[counterField]) {
            trooper[counterField] = Math.max(0, amount - 1);
        } else {
            trooper[counterField] = amount;
        }
        saveRoster();
        requestAnimationFrame(renderApp);
    }
}

/**
 * Generates the HTML for the Grit icons.
 */
function renderGritPips(trooper) {
    let html = `<div class="icon-pips" data-resource="grit" data-id="${trooper.id}">`;
    
    for (let i = 1; i <= trooper.gritMax; i++) {
        const filledClass = (i <= trooper.gritCurrent) ? 'filled' : '';
        html += `<i data-lucide="flame" class="${filledClass}" data-value="${i}"></i>`;
    }
    html += `</div>`;
    return html;
}

/**
 * Generates the HTML for the Ammo icons.
 */
function renderAmmoPips(trooper) {
    let html = `<div class="icon-pips" data-resource="ammo" data-id="${trooper.id}">`;

    for (let i = 1; i <= MAX_AMMO; i++) {
        const filledClass = (i <= trooper.ammoCurrent) ? 'filled' : '';
        html += `<i data-lucide="box" class="${filledClass}" data-value="${i}"></i>`;
    }
    html += `</div>`;
    return html;
}

/**
 * Generates the HTML for equipment-based custom counters using data-driven color.
 */
function renderEquipmentPips(trooper) {
    let html = '';
    
    // Ensure all IDs are clean
    const equipmentIds = trooper.gear.split(',').map(item => item.trim().toLowerCase()).filter(id => id.length > 0);

    equipmentIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (!item || !item.counters) return; 

        Object.keys(item.counters).forEach(counterId => {
            const counterDef = item.counters[counterId];
            const currentVal = trooper[counterId + '_current']; 
            
            // Determine the fill color, defaulting to light gray if none is specified
            const counterColor = counterDef.color || '#f0f0f0'; // Default light gray fallback
            
            html += `<label class="equipment-label">${counterDef.name}:</label>`;
            
            // MODIFICATION: Inject CSS variable style into the icon-pips container
            html += `<div 
                class="icon-pips counter-pips" 
                data-resource="counter" 
                data-id="${trooper.id}" 
                data-field="${counterId}_current"
                style="--counter-fill-color: ${counterColor};"
            >`; 
            
            for (let i = 1; i <= counterDef.max; i++) {
                const filledClass = (i <= currentVal) ? 'filled' : '';
                // Lucide icon tag remains the same
                html += `<i data-lucide="${counterDef.icon}" class="${filledClass}" data-value="${i}"></i>`;
            }
            
            html += `</div>`;
        });
    });

    return html;
}

// --- Position Chip Helper Function  ---

const POSITION_DEFS = {
    // [Position Name]: { category: 'offensivePosition' | 'defensivePosition', colorClass: 'green' | 'yellow' | 'red', modifier: 'Modifier description for tooltip' }
    'Flanking':    { colorClass: 'green', modifier: '+2d6 Offense / All Attack Rolls' },
    'Engaged':     { colorClass: 'yellow', modifier: '+1d6 Offense / Range 1' },
    'Limited':     { colorClass: 'red', modifier: '-1d6 Offense / Visibility Blocked' },
    
    'Fortified':   { colorClass: 'green', modifier: '+2d6 Defense / Cannot Move' },
    'In Cover':    { colorClass: 'yellow', modifier: '+1d6 Defense' },
    'Flanked':     { colorClass: 'red', modifier: '-1d6 Defense / No Cover' },
};

/**
 * Generates the HTML for a set of position chips (Offensive or Defensive).
 */
function renderPositionChips(trooper, fieldName) {
    const positions = Object.keys(POSITION_DEFS).filter(key => 
        // Filter based on whether the position is Offensive (Flanking, Engaged, Limited) or Defensive
        (fieldName === 'offensivePosition' && ['Flanking', 'Engaged', 'Limited'].includes(key)) ||
        (fieldName === 'defensivePosition' && ['Fortified', 'In Cover', 'Flanked'].includes(key))
    );

    let html = `<div class="position-chips-group" data-field="${fieldName}" data-id="${trooper.id}">`;

    positions.forEach(position => {
        const def = POSITION_DEFS[position];
        const isActive = trooper[fieldName] === position;
        const activeClass = isActive ? 'active' : '';

        html += `
            <button 
                class="position-chip ${def.colorClass} ${activeClass}" 
                data-id="${trooper.id}" 
                data-field="${fieldName}" 
                data-position="${position}"
            >
                ${position}
                <div class="tooltip tooltip-position">
                    ${position}: ${def.modifier}
                </div>
            </button>
        `;
    });
    html += `</div>`;
    return html;
}

/**
 * Generates the HTML for the Barracks gear dropdown.
 */
function renderGearSelect(trooper) {
    // The dropdown itself is now the delegated input
    let html = `<select id="gear-select-${trooper.id}" class="trooper-input item-select" data-id="${trooper.id}" data-field="gear_add">`;
    
    html += `<option value="" disabled selected>Select equipment...</option>`;

    // Get all items, sort by name
    const sortedItems = Object.keys(EQUIPMENT_DATABASE)
        .map(key => ({ key, ...EQUIPMENT_DATABASE[key] }))
        .sort((a, b) => a.name.localeCompare(b.name));

    sortedItems.forEach(item => {
        html += `<option value="${item.key}">${item.name}</option>`;
    });

    html += `</select>`;
    
    // Tooltip for the select box
    html += `<div class="tooltip">Select an item to add it to the trooper's gear list.</div>`;
    
    return html;
}

/**
 * Generates the HTML list of currently equipped gear for the Mission Card.
 */
function renderGearList(trooper) {
    const gearIds = trooper.gear.split(',').map(item => item.trim()).filter(id => id.length > 0);
    
    let html = '';
    
    gearIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (item) {
            // Use gear-list-item for styling and gear-item as the tooltip container
            html += `
                <span class="gear-list-item gear-item">
                    ${item.name}
                    <div class="tooltip">${item.description || 'No description available.'}</div>
                </span>
            `;
        }
    });

    return html;
}

/**
 * Generates the HTML list of currently equipped gear for the Barracks Card (includes removal buttons).
 */
function renderBarracksGearList(trooper) {
    const gearIds = trooper.gear.split(',').map(item => item.trim()).filter(id => id.length > 0);
    
    let html = '';
    
    gearIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (item) {
            html += `
                <span class="gear-list-item gear-item">
                    ${item.name}
                    <button class="remove-gear-btn" data-id="${trooper.id}" data-item="${id}">X</button>
                    <div class="tooltip">${item.description || 'No description available.'}</div>
                </span>
            `;
        }
    });

    return html || 'No equipment added.';
}

// --- View Control Functions ---

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
        renderMissionRoster(); 
    } else {
        missionTabBtn.classList.remove('active');
        barracksTabBtn.classList.add('active');
        missionView.classList.add('hidden');
        barracksView.classList.remove('hidden');
        renderBarracksRoster(); 
    }
    
    // Re-run Lucide after DOM manipulation
    if (window.lucide) {
        lucide.createIcons();
    }
}


// --- Modular Render Functions ---

/**
 * Renders the Roster view optimized for in-mission use (status, position, pips).
 */
function renderMissionRoster() {
    rosterContainer.innerHTML = ''; 

    if (roster.length === 0) {
        rosterContainer.innerHTML = "<p>No troopers in the roster. Go to Barracks to add one!</p>";
        return;
    }

    roster.forEach(trooper => {
        const card = document.createElement('div');
        card.className = 'trooper-card mission-card';
        card.setAttribute('data-status', trooper.status); 
        
        // Pass the rendered gear list to the card template
        card.innerHTML = generateMissionCard(
            trooper, 
            renderGritPips(trooper), 
            renderAmmoPips(trooper), 
            renderEquipmentPips(trooper),
            renderGearList(trooper),
            renderPositionChips(trooper, 'offensivePosition'), 
            renderPositionChips(trooper, 'defensivePosition') 
        );
        
        rosterContainer.appendChild(card);
    });
}


/**
 * Renders the Roster view optimized for barracks/management use.
 */
function renderBarracksRoster() {
    barracksContainer.innerHTML = '';

    if (roster.length === 0) {
        barracksContainer.innerHTML = "<p>No troopers. Click 'Add New Trooper' above.</p>";
        return;
    }

    roster.forEach(trooper => {
        const card = document.createElement('div');
        card.className = 'trooper-card barracks-card';
        card.setAttribute('data-status', trooper.status); 
        
        // Pass the rendered gear selector and the NEW Barracks Gear List
        card.innerHTML = generateBarracksCard(
            trooper, 
            renderGearSelect(trooper), 
            renderBarracksGearList(trooper) // <-- NEW ARGUMENT
        );
        
        barracksContainer.appendChild(card);
    });
}


// --- Event Delegation Functions ---

/**
 * Handles all pip/icon and delete button clicks via event delegation.
 */
function handlePipClick(event) {
    const deleteBtn = event.target.closest('.delete-button');
    const icon = event.target.closest('svg');
    const pipsContainer = event.target.closest('.icon-pips');

    // 1. Handle Delete Button Click 
    if (deleteBtn) {
        const trooperId = deleteBtn.dataset.id;
        if (trooperId) {
            deleteTrooper(trooperId);
            return; 
        }
    }

    // 2. Handle Pip Click
    if (!icon || !pipsContainer) return;

    const trooperId = pipsContainer.dataset.id;
    const resourceType = pipsContainer.dataset.resource;
    const value = parseFloat(icon.dataset.value);

    if (!trooperId || isNaN(value)) return;

    if (resourceType === 'grit') {
        setGrit(trooperId, value);
    } else if (resourceType === 'ammo') {
        setAmmo(trooperId, value);
    } else if (resourceType === 'counter') {
        const counterField = pipsContainer.dataset.field;
        if (counterField) {
            setEquipmentCounter(trooperId, counterField, value);
        }
    }
}

/**
 * Handles all changes to trooper input fields (input, select, textarea) via event delegation.
 */
function handleInputChange(event) {
    const input = event.target.closest('.trooper-input');
    
    if (!input) return; 

    const trooperId = input.dataset.id;
    const field = input.dataset.field;
    const value = input.value;

    if (field === 'gear_add') {
        // This is the new gear select dropdown
        addGearItem(trooperId, value);
        // Reset the dropdown after selection for clean UX
        input.value = ""; 
    } else if (trooperId && field) {
        updateTrooper(trooperId, field, value);
    }
}
/**
 * Handles clicks on Offensive and Defensive position chips.
 */
function handlePositionClick(event) {
    const chip = event.target.closest('.position-chip');
    if (!chip) return;

    const trooperId = chip.dataset.id;
    const field = chip.dataset.field; // offensivePosition or defensivePosition
    const position = chip.dataset.position;

    if (!trooperId || !field || !position) return;

    const trooper = roster.find(t => t.id === trooperId);
    if (!trooper) return;

    // Toggle logic: If the clicked position is already active, set it to "N/A" (unselected).
    // Otherwise, set it to the new position.
    const newValue = trooper[field] === position ? 'N/A' : position;
    
    updateTrooper(trooperId, field, newValue);
}

// --- INITIALIZATION ---

// Event Listeners are moved here (after function definitions) to resolve ReferenceError
appContainer.addEventListener('click', handlePipClick); 
appContainer.addEventListener('change', handleInputChange);
appContainer.addEventListener('click', handleGearListClick); 
appContainer.addEventListener('click', handlePositionClick);

addTrooperBtn.addEventListener('click', createNewTrooper);
missionTabBtn.addEventListener('click', () => switchView('mission'));
barracksTabBtn.addEventListener('click', () => switchView('barracks'));

confirmDeleteBtn.addEventListener('click', confirmDeletion);
cancelDeleteBtn.addEventListener('click', cancelDeletion);

// Initial load (This must be the very last instruction to kick off the application)
loadRoster();