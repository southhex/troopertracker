/**
 * Mission Management Module
 * Handles mission state, momentum tracking, and threat level management
 */

// Default mission state structure
const DEFAULT_MISSION_STATE = {
    isActive: false,
    threatLevel: 2,
    momentum: 0,
    victoryThreshold: 3,  // TL + 1
    cover: 1,  // 0=Exposed, 1=Normal, 2=Dense
    space: 1,  // 0=Tight, 1=Transitional, 2=Open
    exchangeCount: 1,
    isHeaderExpanded: false
};

/**
 * Loads mission state from LocalStorage
 */
export function loadMissionState() {
    const saved = localStorage.getItem('dangerCloseMissionState');
    if (saved) {
        const state = JSON.parse(saved);
        // Ensure new fields have defaults
        return {
            ...DEFAULT_MISSION_STATE,
            ...state
        };
    }
    return { ...DEFAULT_MISSION_STATE };
}

/**
 * Saves mission state to LocalStorage
 */
export function saveMissionState(missionState) {
    localStorage.setItem('dangerCloseMissionState', JSON.stringify(missionState));
}

/**
 * Starts a new mission with the given threat level
 */
export function startMission(threatLevel) {
    const missionState = {
        isActive: true,
        threatLevel: threatLevel,
        momentum: 0,
        victoryThreshold: threatLevel + 1
    };
    saveMissionState(missionState);
    return missionState;
}

/**
 * Ends the current mission and resets state
 */
export function endMission() {
    const missionState = { ...DEFAULT_MISSION_STATE };
    saveMissionState(missionState);
    return missionState;
}

/**
 * Updates the threat level (recalculates victory threshold)
 */
export function setThreatLevel(missionState, threatLevel) {
    missionState.threatLevel = threatLevel;
    missionState.victoryThreshold = threatLevel + 1;
    saveMissionState(missionState);
    return missionState;
}

/**
 * Sets momentum to a specific value (-3 to +5)
 */
export function setMomentum(missionState, momentum) {
    missionState.momentum = Math.max(-3, Math.min(5, momentum));
    saveMissionState(missionState);
    return missionState;
}

/**
 * Adjusts momentum by a delta amount
 */
export function adjustMomentum(missionState, delta) {
    return setMomentum(missionState, missionState.momentum + delta);
}

/**
 * Gets the difficulty name based on threat level
 */
export function getDifficultyName(threatLevel) {
    if (threatLevel <= 2) return 'Routine';
    if (threatLevel === 3) return 'Hazardous';
    return 'Desperate';
}

/**
 * Gets injury information based on threat level
 */
export function getInjuryInfo(threatLevel) {
    if (threatLevel <= 2) return '1 injury';
    if (threatLevel === 3) return '2-in-6 odds of 2 injuries, otherwise 1 injury';
    return '3-in-6 odds of 2 injuries, otherwise 1 injury';
}

/**
 * Checks if the mission is won (momentum >= victory threshold)
 */
export function isMissionWon(missionState) {
    return missionState.momentum >= missionState.victoryThreshold;
}

/**
 * Checks if forced to retreat (momentum <= -3)
 */
export function isForcedRetreat(missionState) {
    return missionState.momentum <= -3;
}

/**
 * Gets the momentum status color class
 */
export function getMomentumColorClass(momentum) {
    if (momentum <= -2) return 'danger';
    if (momentum >= 3) return 'success';
    return 'neutral';
}

/**
 * Sets cover rating (0-2)
 */
export function setCover(missionState, cover) {
    missionState.cover = Math.max(0, Math.min(2, cover));
    saveMissionState(missionState);
    return missionState;
}

/**
 * Sets space rating (0-2)
 */
export function setSpace(missionState, space) {
    missionState.space = Math.max(0, Math.min(2, space));
    saveMissionState(missionState);
    return missionState;
}

/**
 * Sets exchange count
 */
export function setExchangeCount(missionState, count) {
    missionState.exchangeCount = Math.max(1, count);
    saveMissionState(missionState);
    return missionState;
}

/**
 * Increments exchange count
 */
export function incrementExchange(missionState) {
    return setExchangeCount(missionState, missionState.exchangeCount + 1);
}

/**
 * Decrements exchange count (min 1)
 */
export function decrementExchange(missionState) {
    return setExchangeCount(missionState, missionState.exchangeCount - 1);
}

/**
 * Toggles header expansion state
 */
export function toggleHeaderExpanded(missionState) {
    missionState.isHeaderExpanded = !missionState.isHeaderExpanded;
    saveMissionState(missionState);
    return missionState;
}

/**
 * Gets cover name and fortified capacity
 */
export function getCoverInfo(cover) {
    const coverLevels = [
        { name: 'Exposed', maxFortified: 0 },
        { name: 'Normal', maxFortified: 2 },
        { name: 'Dense', maxFortified: Infinity }
    ];
    return coverLevels[cover] || coverLevels[1];
}

/**
 * Gets space name and flanking capacity
 */
export function getSpaceInfo(space) {
    const spaceLevels = [
        { name: 'Tight', maxFlanking: 0 },
        { name: 'Transitional', maxFlanking: 2 },
        { name: 'Open', maxFlanking: Infinity }
    ];
    return spaceLevels[space] || spaceLevels[1];
}

/**
 * Validates if a trooper can be set to Fortified position
 * Returns { valid: boolean, reason: string }
 */
export function canSetFortified(roster, cover) {
    const coverInfo = getCoverInfo(cover);
    if (coverInfo.maxFortified === 0) {
        return { valid: false, reason: `Cannot fortify in ${coverInfo.name} cover. No fortified positions available.` };
    }

    if (coverInfo.maxFortified === Infinity) {
        return { valid: true, reason: '' };
    }

    // Count current fortified troopers
    const fortifiedCount = roster.filter(t => t.isActive && t.defensivePosition === 'Fortified').length;

    if (fortifiedCount >= coverInfo.maxFortified) {
        return { valid: false, reason: `Cannot fortify more troopers. Current cover allows max ${coverInfo.maxFortified} fortified positions.` };
    }

    return { valid: true, reason: '' };
}

/**
 * Validates if a trooper can be set to Flanking position
 * Returns { valid: boolean, reason: string }
 */
export function canSetFlanking(roster, space) {
    const spaceInfo = getSpaceInfo(space);
    if (spaceInfo.maxFlanking === 0) {
        return { valid: false, reason: `Cannot flank in ${spaceInfo.name} space. No flanking positions available.` };
    }

    if (spaceInfo.maxFlanking === Infinity) {
        return { valid: true, reason: '' };
    }

    // Count current flanking troopers
    const flankingCount = roster.filter(t => t.isActive && t.offensivePosition === 'Flanking').length;

    if (flankingCount >= spaceInfo.maxFlanking) {
        return { valid: false, reason: `Cannot flank more troopers. Current space allows max ${spaceInfo.maxFlanking} flanking positions.` };
    }

    return { valid: true, reason: '' };
}
