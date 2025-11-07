// /templates/barracksCard.js

/**
 * Generates the HTML string for a Trooper card in the Barracks Management view.
 * @param {object} trooper - The trooper data object.
 * @param {string} gearSelectHtml - HTML string for the gear selection dropdown.
 * @param {string} gearListHtml - NEW: HTML string for the list of equipped items with remove buttons.
 * @returns {string} The complete HTML string for the barracks card.
 */
export function generateBarracksCard(trooper, gearSelectHtml, gearListHtml) {
    return `
        <h2>
            <input type="text" value="${trooper.name}" class="trooper-input" data-id="${trooper.id}" data-field="name">
            <button class="delete-button" data-id="${trooper.id}">X</button> 
        </h2>

        <div class="form-grid">
            <label>Max Grit:</label>
            <input type="number" min="1" value="${trooper.gritMax}" class="trooper-input" data-id="${trooper.id}" data-field="gritMax">

            <label for="gear-select-${trooper.id}">Add Gear:</label>
            ${gearSelectHtml}
            
            <label>Current Gear:</label>
            <div class="gear-list barracks-gear-list">${gearListHtml}</div>

            <label for="notes-${trooper.id}">Notes:</label>
            <textarea id="notes-${trooper.id}" class="trooper-input" data-id="${trooper.id}" data-field="notes">${trooper.notes}</textarea>

            <label>Current Status:</label>
            <span class="status-display">${trooper.status}</span>
        </div>
    `;
}