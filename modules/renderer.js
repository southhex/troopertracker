import { MAX_AMMO, EQUIPMENT_DATABASE } from '../equipment.js';
import { POSITION_DEFS } from './config.js';
import { getEquippedItem } from './utilities.js';
import { generateMissionCard } from '../templates/missionCard.js';
import { generateBarracksCard } from '../templates/barracksCard.js';

/**
 * Generates the HTML for the Grit icons.
 */
export function renderGritPips(trooper) {
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
export function renderAmmoPips(trooper) {
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
export function renderEquipmentPips(trooper) {
    let html = '';

    const equipmentIds = trooper.gear.split(',').map(item => item.trim().toLowerCase()).filter(id => id.length > 0);

    equipmentIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (!item || !item.counters) return;

        Object.keys(item.counters).forEach(counterId => {
            const counterDef = item.counters[counterId];
            const currentVal = trooper[counterId + '_current'];

            const counterColor = counterDef.color || 'var(--main-accent)';

            html += `<label class="equipment-label">${counterDef.name}:</label>`;

            html += `<div
                class="icon-pips counter-pips"
                data-resource="counter"
                data-id="${trooper.id}"
                data-field="${counterId}_current"
                style="--counter-fill-color: ${counterColor};"
            >`;

            for (let i = 1; i <= counterDef.max; i++) {
                const filledClass = (i <= currentVal) ? 'filled' : '';
                html += `<i data-lucide="${counterDef.icon}" class="${filledClass}" data-value="${i}"></i>`;
            }

            html += `</div>`;
        });
    });

    return html;
}

/**
 * Generates the HTML for a set of position chips (Offensive or Defensive).
 */
export function renderPositionChips(trooper, fieldName) {
    const positions = Object.keys(POSITION_DEFS).filter(key =>
        (fieldName === 'offensivePosition' && ['Flanking', 'Engaged', 'Limited'].includes(key)) ||
        (fieldName === 'defensivePosition' && ['Fortified', 'In Cover', 'Flanked'].includes(key))
    );

    let chipsHtml = `<div class="position-chips-group" data-field="${fieldName}" data-id="${trooper.id}">`;
    let modifierText = '';

    positions.forEach(position => {
        const def = POSITION_DEFS[position];
        const isActive = trooper[fieldName] === position;
        const activeClass = isActive ? 'active' : '';

        if (isActive) {
            modifierText = def.modifier;
        }

        chipsHtml += `
            <button
                class="position-chip ${def.colorClass} ${activeClass}"
                data-id="${trooper.id}"
                data-field="${fieldName}"
                data-position="${position}"
            >
                ${position}
            </button>
        `;
    });
    chipsHtml += `</div>`;

    if (trooper[fieldName] !== 'N/A' && modifierText) {
        chipsHtml += `<div class="position-modifier position-modifier-${fieldName}">
            ${modifierText}
        </div>`;
    }
    return chipsHtml;
}

/**
 * Renders the Armor selection dropdown.
 */
export function renderArmorSelect(trooper) {
    const fieldName = 'gear_armor';
    const armorTypes = ['basic_armor'];
    const currentArmor = getEquippedItem(trooper, armorTypes);

    let html = `<select class="trooper-input item-select" data-id="${trooper.id}" data-field="${fieldName}">`;
    html += `<option value="">None</option>`;

    Object.keys(EQUIPMENT_DATABASE).forEach(key => {
        const item = EQUIPMENT_DATABASE[key];
        if (item.type === 'basic_armor') {
            const selected = (key === currentArmor) ? 'selected' : '';
            html += `<option value="${key}" ${selected}>${item.name}</option>`;
        }
    });

    html += `</select><div class="tooltip">Select Armor (Max 1)</div>`;
    return html;
}

/**
 * Renders the Primary Weapon selection dropdown.
 */
export function renderWeaponSelect(trooper) {
    const fieldName = 'gear_weapon';
    const weaponTypes = ['basic_weapon'];
    const currentWeapon = getEquippedItem(trooper, weaponTypes);

    let html = `<select class="trooper-input item-select" data-id="${trooper.id}" data-field="${fieldName}">`;
    html += `<option value="">None</option>`;

    Object.keys(EQUIPMENT_DATABASE).forEach(key => {
        const item = EQUIPMENT_DATABASE[key];
        if (item.type === 'basic_weapon') {
            const selected = (key === currentWeapon) ? 'selected' : '';
            html += `<option value="${key}" ${selected}>${item.name}</option>`;
        }
    });

    html += `</select><div class="tooltip">Select Weapon (Max 1)</div>`;
    return html;
}

/**
 * Renders the Special Item selection dropdown.
 */
export function renderSpecialSelect(trooper) {
    const fieldName = 'gear_special';
    const specialTypes = ['special_weapon', 'special_equipment'];
    const currentSpecial = getEquippedItem(trooper, specialTypes);

    let html = `<select class="trooper-input item-select" data-id="${trooper.id}" data-field="${fieldName}">`;
    html += `<option value="">None</option>`;

    Object.keys(EQUIPMENT_DATABASE).forEach(key => {
        const item = EQUIPMENT_DATABASE[key];
        if (specialTypes.includes(item.type)) {
            const selected = (key === currentSpecial) ? 'selected' : '';
            html += `<option value="${key}" ${selected}>${item.name}</option>`;
        }
    });

    html += `</select><div class="tooltip">Select Special Gear (Max 1)</div>`;
    return html;
}

/**
 * Generates the HTML list of currently equipped gear for the Mission Card.
 */
export function renderGearList(trooper) {
    const gearIds = trooper.gear.split(',').map(item => item.trim()).filter(id => id.length > 0);

    let html = '';

    gearIds.forEach(id => {
        const item = EQUIPMENT_DATABASE[id];
        if (item) {
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
export function renderBarracksGearList(trooper) {
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

/**
 * Renders the Mission Roster view.
 */
export function renderMissionRoster(roster, container) {
    container.innerHTML = '';

    const activeTroopers = roster.filter(trooper => trooper.isActive);

    if (activeTroopers.length === 0) {
        container.innerHTML = "<p>No active troopers deployed. Go to Barracks to deploy troopers!</p>";
        return;
    }

    activeTroopers.forEach(trooper => {
        const card = document.createElement('div');
        card.className = 'trooper-card mission-card';
        card.setAttribute('data-status', trooper.status);

        card.innerHTML = generateMissionCard(
            trooper,
            renderGritPips(trooper),
            renderAmmoPips(trooper),
            renderPositionChips(trooper, 'offensivePosition'),
            renderPositionChips(trooper, 'defensivePosition'),
            renderGearList(trooper),
            renderEquipmentPips(trooper)
        );

        container.appendChild(card);
    });
}

/**
 * Renders the Barracks Roster view.
 */
export function renderBarracksRoster(roster, container) {
    container.innerHTML = '';

    if (roster.length === 0) {
        container.innerHTML = "<p>No troopers. Click 'Add New Trooper' above.</p>";
        return;
    }

    roster.forEach(trooper => {
        const card = document.createElement('div');
        card.className = 'trooper-card barracks-card';
        card.setAttribute('data-status', trooper.status);

        card.innerHTML = generateBarracksCard(
            trooper,
            renderArmorSelect(trooper),
            renderWeaponSelect(trooper),
            renderSpecialSelect(trooper),
            renderBarracksGearList(trooper)
        );

        container.appendChild(card);
    });
}
