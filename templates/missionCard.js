// /templates/missionCard.js

/**
 * Generates the HTML string for a Trooper card in the Mission Roster view.
 * * @param {object} trooper - The trooper data object.
 * @param {string} gritPips - HTML string for Grit pips.
 * @param {string} ammoPips - HTML string for Ammo pips.
 * @param {string} equipmentPips - HTML string for Equipment counters.
 * @param {function} renderChips - Function passed from script.js to render position chips.
 * @param {string} gearListHtml - NEW: HTML string for the list of equipped items.
 * @returns {string} The complete HTML string for the mission card.
 */
export function generateMissionCard(trooper, gritPips, ammoPips, equipmentPips, offChips, defChips,gearListHtml) {
    return `
        <h2>
            ${trooper.name}
        </h2>

        <div class="form-grid">
            <label for="status-${trooper.id}">Status:</label>
            <select id="status-${trooper.id}" class="trooper-input" data-id="${trooper.id}" data-field="status">
                <option value="OK" ${trooper.status === 'OK' ? 'selected' : ''}>OK</option>
                <option value="Grazed" ${trooper.status === 'Grazed' ? 'selected' : ''}>Grazed</option>
                <option value="Wounded" ${trooper.status === 'Wounded' ? 'selected' : ''}>Wounded</option>
                <option value="Bleeding Out" ${trooper.status === 'Bleeding Out' ? 'selected' : ''}>Bleeding Out</option>
                <option value="Dead" ${trooper.status === 'Dead' ? 'selected' : ''}>Dead</option>
                <option value="Inactive" ${trooper.status === 'Inactive' ? 'selected' : ''}>Inactive/Recovering</option>
            </select>

            <label>Grit:</label>
            ${gritPips}

            <label>Ammo:</label>
            ${ammoPips}

            <label>Off. Position:</label>
            <div class="position-chips-wrapper">
                ${offChips}
            </div>

            <label>Def. Position:</label>
            <div class="position-chips-wrapper">
                ${defChips}
            </div>
            
            <label>Equipment:</label>
            <div class="gear-list">${gearListHtml}</div>
            
            ${equipmentPips}
        </div>
    `;
}