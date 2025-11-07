// Get references to HTML elements
const rosterContainer = document.getElementById('roster-container');
const addTrooperBtn = document.getElementById('add-trooper-btn');

// This is our main data store
let roster = [];

// --- Event Listeners ---
addTrooperBtn.addEventListener('click', createNewTrooper);

// --- Core Functions ---

/**
 * Loads the roster from Local Storage when the page starts.
 */
function loadRoster() {
    const savedRoster = localStorage.getItem('dangerCloseRoster');
    if (savedRoster) {
        roster = JSON.parse(savedRoster);
    }
    renderRoster();
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
function createNewTrooper() {
    const newTrooper = {
        id: `trooper-${Date.now()}`, // Unique ID
        name: "New Trooper",
        status: "OK", // From [cite: 82]
        gear: "Assault Rifle, Medium Armor", // From [cite: 83]
        gritCurrent: 1, // From [cite: 85]
        gritMax: 1, // From [cite: 86]
        ammoCurrent: 3, // From [cite: 87]
        ammoMax: 3, // From [cite: 87]
        offensivePosition: "N/A", // From [cite: 197]
        defensivePosition: "N/A", // From [cite: 197]
        notes: "" // For Bonds [cite: 381] or recovery [cite: 377]
    };

    roster.push(newTrooper);
    saveRoster();
    renderRoster(); // Re-draw the entire roster
}

/**
 * Updates a specific trooper's data.
 * This is called by the 'onchange' event in the HTML.
 */
function updateTrooper(id, field, value) {
    const trooper = roster.find(t => t.id === id);
    if (trooper) {
        trooper[field] = value;
        saveRoster();
        // We re-render to update the card's visual status (e.g., border color)
        renderRoster(); 
    }
}

/**
 * Deletes a trooper from the roster.
 */
function deleteTrooper(id) {
    if (confirm("Are you sure you want to delete this trooper?")) {
        roster = roster.filter(t => t.id !== id);
        saveRoster();
        renderRoster();
    }
}

/**
 * Clears the roster container and re-draws all trooper cards.
 */
function renderRoster() {
    rosterContainer.innerHTML = ''; // Clear existing cards

    if (roster.length === 0) {
        rosterContainer.innerHTML = "<p>No troopers in the roster. Add one to get started!</p>";
        return;
    }

    roster.forEach(trooper => {
        const card = document.createElement('div');
        card.className = 'trooper-card';
        card.setAttribute('data-status', trooper.status); // For CSS styling
        
        // This is a long string of HTML that creates the card
        card.innerHTML = `
            <h2>
                <input type="text" value="${trooper.name}" onchange="updateTrooper('${trooper.id}', 'name', this.value)">
                <button class="delete-button" onclick="deleteTrooper('${trooper.id}')">X</button>
            </h2>

            <div class="form-grid">
                <label for="status-${trooper.id}">Status:</label>
                <select id="status-${trooper.id}" onchange="updateTrooper('${trooper.id}', 'status', this.value)">
                    <option value="OK" ${trooper.status === 'OK' ? 'selected' : ''}>OK</option>
                    <option value="Grazed" ${trooper.status === 'Grazed' ? 'selected' : ''}>Grazed</option>
                    <option value="Wounded" ${trooper.status === 'Wounded' ? 'selected' : ''}>Wounded</option>
                    <option value="Bleeding Out" ${trooper.status === 'Bleeding Out' ? 'selected' : ''}>Bleeding Out</option>
                    <option value="Dead" ${trooper.status === 'Dead' ? 'selected' : ''}>Dead</option>
                    <option value="Inactive" ${trooper.status === 'Inactive' ? 'selected' : ''}>Inactive/Recovering</option>
                </select>

                <label for="grit-${trooper.id}">Grit:</label>
                <div>
                    <input type="number" min="0" max="${trooper.gritMax}" value="${trooper.gritCurrent}" onchange="updateTrooper('${trooper.id}', 'gritCurrent', this.value)" style="width: 50px;"> / 
                    <input type="number" min="1" max="3" value="${trooper.gritMax}" onchange="updateTrooper('${trooper.id}', 'gritMax', this.value)" style="width: 50px;">
                </div>

                <label for="ammo-${trooper.id}">Ammo:</label>
                <div>
                    <input type="number" min="0" max="${trooper.ammoMax}" value="${trooper.ammoCurrent}" onchange="updateTrooper('${trooper.id}', 'ammoCurrent', this.value)" style="width: 50px;"> / 
                    <input type="number" min="0" value="${trooper.ammoMax}" onchange="updateTrooper('${trooper.id}', 'ammoMax', this.value)" style="width: 50px;">
                </div>

                <label>Off. Position:</label>
                <select onchange="updateTrooper('${trooper.id}', 'offensivePosition', this.value)">
                    <option value="N/A" ${trooper.offensivePosition === 'N/A' ? 'selected' : ''}>N/A</option>
                    <option value="Limited" ${trooper.offensivePosition === 'Limited' ? 'selected' : ''}>Limited</option>
                    <option value="Engaged" ${trooper.offensivePosition === 'Engaged' ? 'selected' : ''}>Engaged</option>
                    <option value="Flanking" ${trooper.offensivePosition === 'Flanking' ? 'selected' : ''}>Flanking</option>
                </select>

                <label>Def. Position:</label>
                <select onchange="updateTrooper('${trooper.id}', 'defensivePosition', this.value)">
                    <option value="N/A" ${trooper.defensivePosition === 'N/A' ? 'selected' : ''}>N/A</soption>
                    <option value="Flanked" ${trooper.defensivePosition === 'Flanked' ? 'selected' : ''}>Flanked</option>
                    <option value="In Cover" ${trooper.defensivePosition === 'In Cover' ? 'selected' : ''}>In Cover</option>
                    <option value="Fortified" ${trooper.defensivePosition === 'Fortified' ? 'selected' : ''}>Fortified</option>
                </select>
                
                <label for="gear-${trooper.id}">Gear:</label>
                <textarea id="gear-${trooper.id}" onchange="updateTrooper('${trooper.id}', 'gear', this.value)">${trooper.gear}</textarea>

                <label for="notes-${trooper.id}">Notes:</label>
                <textarea id="notes-${trooper.id}" onchange="updateTrooper('${trooper.id}', 'notes', this.value)">${trooper.notes}</textarea>
            </div>
        `;
        
        rosterContainer.appendChild(card);
    });
}

// Initial load
loadRoster();
