import { EQUIPMENT_DATABASE } from '../equipment.js';
import {
    updateTrooper,
    setGrit,
    setAmmo,
    setEquipmentCounter,
    removeGearItem,
    initializeTrooperCounters,
    removeGearCounterProperties,
    saveRoster
} from './dataManager.js';

/**
 * Handles all pip/icon clicks via event delegation.
 */
export function handlePipClick(roster, event, renderCallback) {
    const icon = event.target.closest('svg');
    const pipsContainer = event.target.closest('.icon-pips');

    if (!icon || !pipsContainer) return;

    const trooperId = pipsContainer.dataset.id;
    const resourceType = pipsContainer.dataset.resource;
    const value = parseFloat(icon.dataset.value);

    if (!trooperId || isNaN(value)) return;

    if (resourceType === 'grit') {
        setGrit(roster, trooperId, value);
    } else if (resourceType === 'ammo') {
        setAmmo(roster, trooperId, value);
    } else if (resourceType === 'counter') {
        const counterField = pipsContainer.dataset.field;
        if (counterField) {
            setEquipmentCounter(roster, trooperId, counterField, value);
        }
    }

    saveRoster(roster);
    requestAnimationFrame(renderCallback);
}

/**
 * Handles clicks on position chips.
 */
export function handlePositionClick(roster, event, renderCallback) {
    const chip = event.target.closest('.position-chip');
    if (!chip) return;

    const trooperId = chip.dataset.id;
    const field = chip.dataset.field;
    const position = chip.dataset.position;

    if (!trooperId || !field || !position) return;

    const trooper = roster.find(t => t.id === trooperId);
    if (!trooper) return;

    const newValue = trooper[field] === position ? 'N/A' : position;

    updateTrooper(roster, trooperId, field, newValue);
    saveRoster(roster);
    requestAnimationFrame(renderCallback);
}

/**
 * Handles clicks on remove gear buttons.
 */
export function handleGearListClick(roster, event, renderCallback) {
    const removeBtn = event.target.closest('.remove-gear-btn');
    if (!removeBtn) return;

    const trooperId = removeBtn.dataset.id;
    const itemKey = removeBtn.dataset.item;

    if (trooperId && itemKey) {
        removeGearItem(roster, trooperId, itemKey);
        saveRoster(roster);
        requestAnimationFrame(renderCallback);
    }
}

/**
 * Handles all changes to trooper input fields via event delegation.
 */
export function handleInputChange(roster, event, renderCallback) {
    const input = event.target.closest('.trooper-input');
    if (!input) return;

    const trooperId = input.dataset.id;
    const field = input.dataset.field;
    const newItemKey = input.value;

    const gearSwapFields = {
        'gear_armor': ['basic_armor'],
        'gear_weapon': ['basic_weapon'],
        'gear_special': ['special_weapon', 'special_equipment']
    };

    if (gearSwapFields[field]) {
        const typesToReplace = gearSwapFields[field];
        const trooper = roster.find(t => t.id === trooperId);
        if (!trooper) return;

        let gearArray = trooper.gear.split(',').map(item => item.trim()).filter(id => id.length > 0);

        const oldItemKey = gearArray.find(id => {
            const item = EQUIPMENT_DATABASE[id];
            return item && typesToReplace.includes(item.type);
        });

        if (oldItemKey) {
            gearArray = gearArray.filter(id => id !== oldItemKey);
            removeGearCounterProperties(trooper, oldItemKey);
        }

        if (newItemKey) {
            gearArray.push(newItemKey);
        }

        trooper.gear = gearArray.join(', ');

        initializeTrooperCounters(trooper);

        saveRoster(roster);
        requestAnimationFrame(renderCallback);

    } else if (trooperId && field) {
        updateTrooper(roster, trooperId, field, input.value);
        saveRoster(roster);
        requestAnimationFrame(renderCallback);
    }
}
