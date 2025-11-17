import { MAX_AMMO, EQUIPMENT_DATABASE } from '../equipment.js';
import { DEFAULT_TROOPER_TEMPLATE } from './config.js';

/**
 * Ensures all equipment counters for a trooper are initialized to their MAX value
 * if they are currently undefined (used for new troopers and data migration).
 */
export function initializeTrooperCounters(trooper) {
    const gearIds = trooper.gear.split(',').map(item => item.trim().toLowerCase()).filter(id => id.length > 0);

    gearIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (!item || !item.counters) return;

        Object.keys(item.counters).forEach(counterId => {
            const currentField = counterId + '_current';
            const counterDef = item.counters[counterId];

            if (trooper[currentField] === undefined) {
                trooper[currentField] = counterDef.max;
            }
        });
    });
    return trooper;
}

/**
 * Removes custom counter properties from the trooper object when an item is unequipped.
 */
export function removeGearCounterProperties(trooper, gearId) {
    const item = EQUIPMENT_DATABASE[gearId];
    if (!item || !item.counters) return;

    Object.keys(item.counters).forEach(counterId => {
        const currentField = counterId + '_current';

        if (trooper.hasOwnProperty(currentField)) {
            delete trooper[currentField];
        }
    });
}

/**
 * Loads the roster from Local Storage and ensures data integrity.
 */
export function loadRoster() {
    const savedRoster = localStorage.getItem('dangerCloseRoster');
    let roster = [];

    if (savedRoster) {
        roster = JSON.parse(savedRoster);
    }

    roster = roster.map(t => {
        const updatedTrooper = {
            ...t,
            gritMax: t.gritMax || 1,
            gritCurrent: Math.min(t.gritCurrent, t.gritMax || 1),
            isActive: t.isActive !== undefined ? t.isActive : true
        };
        return initializeTrooperCounters(updatedTrooper);
    });

    return roster;
}

/**
 * Saves the current roster array to Local Storage.
 */
export function saveRoster(roster) {
    localStorage.setItem('dangerCloseRoster', JSON.stringify(roster));
}

/**
 * Creates a new, blank trooper object.
 */
export function createNewTrooper() {
    const newTrooper = {
        ...DEFAULT_TROOPER_TEMPLATE,
        id: `trooper-${Date.now()}`,
        ammoCurrent: MAX_AMMO,
    };

    return initializeTrooperCounters(newTrooper);
}

/**
 * Updates a specific trooper's data.
 */
export function updateTrooper(roster, id, field, value) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (field === 'gritMax') {
            trooper[field] = parseFloat(value);
        } else {
            trooper[field] = value;
        }

        if (field === 'gritMax' && trooper.gritCurrent > trooper.gritMax) {
            trooper.gritCurrent = trooper.gritMax;
        }
    }
    return roster;
}

/**
 * Deletes a trooper from the roster.
 */
export function deleteTrooper(roster, id) {
    return roster.filter(t => t.id !== id);
}

/**
 * Removes an item from a trooper's gear list.
 */
export function removeGearItem(roster, id, itemKey) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        const currentGearArray = trooper.gear.split(',').map(item => item.trim()).filter(i => i.length > 0);
        trooper.gear = currentGearArray.filter(i => i !== itemKey).join(', ');
    }
    return roster;
}

/**
 * Sets the current grit for a trooper with toggle logic.
 */
export function setGrit(roster, id, amount) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (amount === trooper.gritCurrent) {
            trooper.gritCurrent = Math.max(0, amount - 1);
        } else {
            trooper.gritCurrent = amount;
        }
    }
    return roster;
}

/**
 * Sets the current ammo for a trooper with toggle logic and max limit enforcement.
 */
export function setAmmo(roster, id, amount) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (amount === trooper.ammoCurrent) {
            trooper.ammoCurrent = Math.max(0, amount - 1);
        } else {
            trooper.ammoCurrent = Math.min(amount, MAX_AMMO);
        }
    }
    return roster;
}

/**
 * Sets the current value for an equipment-based counter.
 */
export function setEquipmentCounter(roster, id, counterField, amount) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        if (amount === trooper[counterField]) {
            trooper[counterField] = Math.max(0, amount - 1);
        } else {
            trooper[counterField] = amount;
        }
    }
    return roster;
}
