import { EQUIPMENT_DATABASE } from '../equipment.js';

/**
 * Helper to get the currently equipped item of a specific type.
 */
export function getEquippedItem(trooper, types) {
    const gearIds = trooper.gear.split(',').map(item => item.trim().toLowerCase()).filter(id => id.length > 0);
    return gearIds.find(id => {
        const item = EQUIPMENT_DATABASE[id];
        return item && types.includes(item.type);
    });
}

/**
 * Parses gear string into clean array of IDs.
 */
export function parseGearArray(gearString) {
    return gearString.split(',').map(item => item.trim().toLowerCase()).filter(id => id.length > 0);
}
