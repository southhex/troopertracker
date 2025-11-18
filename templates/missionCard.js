// /templates/missionCard.js

// Function to map status to a CSS-friendly class name
const getStatusClass = (status) => {
    // Converts "Bleeding Out" to "bleeding-out"
    return status.toLowerCase().replace(/\s/g, '-');
};

/**
 * Generates the HTML string for a Trooper card in the Mission Roster view.
 * * @param {object} trooper - The trooper data object.
 * @param {string} gritPips - HTML string for Grit pips.
 * @param {string} ammoPips - HTML string for Ammo pips.
 * @param {string} equipmentPips - HTML string for Equipment counters.
 * @param {function} renderChips - Function passed from script.js to render position chips.
 * @param {string} gearListHtml - HTML string for the list of equipped items.
 * @returns {string} The complete HTML string for the mission card.
 */
export function generateMissionCard(trooper, gritPips, ammoPips, offChips, defChips, gearListHtml, equipmentPips) {
    const statusClass = getStatusClass(trooper.status);
    // Add the pulsing class only for 'Bleeding Out' status
    const pulseClass = trooper.status === 'Bleeding Out' ? 'bleeding-pulse' : '';
    
    return `
        <h2>
            ${trooper.name} 
        </h2>

        <div class="form-grid">
            <label for="status-${trooper.id}"><i class="status-icon ${statusClass} ${pulseClass}" data-lucide=activity></i></label>
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

            <label><i data-lucide=crosshair></i></label>
            <div class="position-chips-wrapper">
                ${offChips}
            </div>

            <label><i data-lucide=arrow-left-right></i></label>
            <div class="position-chips-wrapper">
                ${defChips}
            </div>

        <label>Equipment: </label>
        <div class="gear-list">
        ${gearListHtml}
        </div>
        
        ${equipmentPips}    
        </div>
    `;
}