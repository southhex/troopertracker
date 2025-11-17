// /templates/barracksCard.js

/**
 * Generates the HTML string for a Trooper card in the Barracks Management view.
 * @param {object} trooper - The trooper data object.
 * @param {string} armorSelectHtml - HTML for Armor dropdown.
 * @param {string} weaponSelectHtml - HTML for Weapon dropdown.
 * @param {string} specialSelectHtml - HTML for Special dropdown.
 * @param {string} gearListHtml - HTML string for the list of equipped items with remove buttons.
 * @returns {string} The complete HTML string for the barracks card.
 */
export function generateBarracksCard(trooper, armorSelectHtml, weaponSelectHtml, specialSelectHtml, gearListHtml) {
    return `
        <h2>
            <input type="text" value="${trooper.name}" class="trooper-input" data-id="${trooper.id}" data-field="name">
            <button class="delete-button" data-id="${trooper.id}">Dismiss</button> 
        </h2>

        <div class="form-grid">
            <label>Max Grit:</label>
            <input type="number" min="1" value="${trooper.gritMax}" class="trooper-input" data-id="${trooper.id}" data-field="gritMax">
            <label>Equipment:</label>
            <div></div>
            <label>Armor:</label>
            ${armorSelectHtml}

            <label>Weapon:</label>
            ${weaponSelectHtml}

            <label>Special:</label>
            ${specialSelectHtml}
            

            <div class="gear-list barracks-gear-list">${gearListHtml}</div>

            <label for="status-${trooper.id}">Status:</label>
            <select id="status-${trooper.id}" class="trooper-input" data-id="${trooper.id}" data-field="status">
                <option value="OK" ${trooper.status === 'OK' ? 'selected' : ''}>OK</option>
                <option value="Grazed" ${trooper.status === 'Grazed' ? 'selected' : ''}>Grazed</option>
                <option value="Wounded" ${trooper.status === 'Wounded' ? 'selected' : ''}>Wounded</option>
                <option value="Bleeding Out" ${trooper.status === 'Bleeding Out' ? 'selected' : ''}>Bleeding Out</option>
                <option value="Dead" ${trooper.status === 'Dead' ? 'selected' : ''}>Dead</option>
                <option value="Inactive" ${trooper.status === 'Inactive' ? 'selected' : ''}>Inactive/Recovering</option>
            </select>
            <label for="notes-${trooper.id}">Notes:</label>
            <textarea id="notes-${trooper.id}" class="trooper-input" data-id="${trooper.id}" data-field="notes">${trooper.notes}</textarea>
        </div>
        <button class="deploy-button" data-id="${trooper.id}" data-action="${trooper.isActive ? 'return' : 'deploy'}">
            ${trooper.isActive ? 'Return' : 'Deploy'}
        </button>
    `;
}