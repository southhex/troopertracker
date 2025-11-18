/**
 * Engagement Header Renderer
 * Renders the collapsible engagement header bar with momentum, TL, cover, space
 */

import { getDifficultyName, getMomentumColorClass, getCoverInfo, getSpaceInfo, getInjuryInfo } from './missionManager.js';

/**
 * Renders the collapsed engagement header
 */
function renderCollapsedHeader(missionState) {
    const { momentum, exchangeCount, threatLevel, cover, space, victoryThreshold } = missionState;
    const difficulty = getDifficultyName(threatLevel);
    const injuryInfo = getInjuryInfo(threatLevel);

    let html = '<div class="engagement-header collapsed">';

    // Top row: Exchange counter and expand button
    html += '<div class="engagement-header-top">';
    html += '<div class="engagement-title-row">';
    html += '<span class="engagement-label">ENGAGEMENT</span>';

    // Exchange counter with environment annotation
    html += '<div class="exchange-counter">';
    html += '<span class="exchange-label">Exchange #:</span>';
    html += '<span class="exchange-number">' + exchangeCount + '</span>';
    html += '<button class="exchange-btn" data-action="increment-exchange" title="Next Exchange">';
    html += '<i data-lucide="plus"></i>';
    html += '</button>';
    html += '<span class="exchange-annotation">C' + cover + '/S' + space + '/TL' + threatLevel + '</span>';
    html += '</div>';

    html += '</div>'; // engagement-title-row

    // Expand button
    html += '<button class="header-toggle-btn" data-action="toggle-header" title="Show Details">';
    html += '<i data-lucide="chevron-down"></i> Details';
    html += '</button>';

    html += '</div>'; // engagement-header-top

    // Momentum scale (clickable)
    html += '<div class="momentum-row">';
    html += '<span class="momentum-label">Momentum:</span>';
    html += '<div class="momentum-scale-compact">';

    for (let i = -3; i <= 5; i++) {
        const isActive = i === momentum;
        const colorClass = getMomentumColorClass(i);
        const classes = ['momentum-pip-compact', colorClass];
        if (isActive) classes.push('active');
        // Grey out momentum beyond victory threshold (positive) or below -3 (negative)
        if (i > victoryThreshold || i < -3) classes.push('beyond-threshold');

        html += `<button class="${classes.join(' ')}" data-action="set-momentum" data-value="${i}" title="Set momentum to ${i >= 0 ? '+' : ''}${i}">`;
        html += `${i >= 0 ? '+' : ''}${i}`;
        html += '</button>';
    }

    html += '</div>'; // momentum-scale-compact
    html += '</div>'; // momentum-row

    // Info line with difficulty, victory threshold, tactics, and injury
    html += '<div class="engagement-info-line">';
    html += `<span><strong>Difficulty</strong>: ${difficulty}</span>`;
    html += `<span><strong>Victory Threshold</strong>: +${victoryThreshold}</span>`;
    html += `<span><strong>Enemy Tactics</strong>: ${threatLevel}-in-6</span>`;
    html += `<span><strong>Injury</strong>: ${injuryInfo}</span>`;
    html += '</div>';

    html += '</div>'; // engagement-header

    return html;
}

/**
 * Renders the expanded engagement header
 */
function renderExpandedHeader(missionState) {
    const { momentum, threatLevel, victoryThreshold, cover, space, exchangeCount } = missionState;
    const difficulty = getDifficultyName(threatLevel);
    const injuryInfo = getInjuryInfo(threatLevel);
    const coverInfo = getCoverInfo(cover);
    const spaceInfo = getSpaceInfo(space);

    let html = '<div class="engagement-header expanded">';

    // Header top bar
    html += '<div class="engagement-header-title">';
    html += '<h3>ENGAGEMENT DETAILS</h3>';
    html += '<button class="header-toggle-btn" data-action="toggle-header" title="Collapse">';
    html += '<i data-lucide="chevron-up"></i> Collapse';
    html += '</button>';
    html += '</div>';

    // Exchange counter section
    html += '<div class="engagement-section">';
    html += '<div class="exchange-controls">';
    html += '<span class="section-label">Exchange #:</span>';
    html += '<button class="exchange-btn" data-action="decrement-exchange" title="Previous Exchange">';
    html += '<i data-lucide="minus"></i>';
    html += '</button>';
    html += '<span class="exchange-number-large">' + exchangeCount + '</span>';
    html += '<button class="exchange-btn" data-action="increment-exchange" title="Next Exchange">';
    html += '<i data-lucide="plus"></i>';
    html += '</button>';
    html += '<button class="exchange-reset-btn" data-action="reset-exchange" title="Reset to Exchange 1">';
    html += '<i data-lucide="rotate-ccw"></i>';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    // Threat Level section
    html += '<div class="engagement-section">';
    html += '<div class="tl-selector-inline">';

    for (let tl = 1; tl <= 4; tl++) {
        const isActive = tl === threatLevel;
        html += `<button class="tl-btn-inline ${isActive ? 'active' : ''}" data-action="set-threat-level" data-value="${tl}">`;
        html += `TL ${tl}`;
        html += '</button>';
    }

    html += '</div>'; // tl-selector-inline
    html += '<div class="tl-info-inline">';
    html += `<span><strong>Difficulty:</strong> ${difficulty}</span>`;
    html += `<span><strong>Victory Threshold:</strong> +${victoryThreshold}</span>`;
    html += `<span><strong>Enemy Tactics:</strong> ${threatLevel}-in-6</span>`;
    html += `<span><strong>Injury:</strong> ${injuryInfo}</span>`;
    html += '</div>';
    html += '</div>'; // engagement-section

    // Momentum section
    html += '<div class="engagement-section">';
    html += '<h4 class="section-label">Momentum</h4>';
    html += '<div class="momentum-scale-expanded">';

    for (let i = -3; i <= 5; i++) {
        const isActive = i === momentum;
        const isVictory = i === victoryThreshold;
        const isRetreat = i === -3;
        const colorClass = getMomentumColorClass(i);

        const classes = ['momentum-pip-expanded', colorClass];
        if (isActive) classes.push('active');
        if (isVictory) classes.push('victory-threshold');
        if (isRetreat) classes.push('retreat-threshold');

        html += `<button class="${classes.join(' ')}" data-action="set-momentum" data-value="${i}">`;
        html += `<span class="momentum-value">${i >= 0 ? '+' : ''}${i}</span>`;
        if (isVictory) html += '<span class="threshold-label">Victory</span>';
        if (isRetreat) html += '<span class="threshold-label">Retreat</span>';
        html += '</button>';
    }

    html += '</div>'; // momentum-scale-expanded

    // Quick adjust buttons
    html += '<div class="momentum-adjust-buttons">';
    html += '<button class="momentum-adjust-btn" data-action="adjust-momentum" data-delta="-1">';
    html += '<i data-lucide="minus"></i> Pushed Back';
    html += '</button>';
    html += '<button class="momentum-adjust-btn" data-action="adjust-momentum" data-delta="1">';
    html += '<i data-lucide="plus"></i> Success';
    html += '</button>';
    html += '</div>';

    html += '</div>'; // engagement-section

    // Environment section
    html += '<div class="engagement-section">';
    html += '<h4 class="section-label">Environment</h4>';

    // Cover selector
    html += '<div class="environment-row">';
    html += '<span class="env-label">Cover:</span>';
    html += '<div class="env-selector">';

    const coverLevels = ['Exposed', 'Normal', 'Dense'];
    for (let c = 0; c <= 2; c++) {
        const isActive = c === cover;
        html += `<button class="env-btn ${isActive ? 'active' : ''}" data-action="set-cover" data-value="${c}">`;
        html += coverLevels[c];
        html += '</button>';
    }

    html += '</div>'; // env-selector
    html += '<span class="env-capacity">';
    if (coverInfo.maxFortified === Infinity) {
        html += '(Unlimited Fortified)';
    } else if (coverInfo.maxFortified === 0) {
        html += '(No Fortified)';
    } else {
        html += `(Max ${coverInfo.maxFortified} Fortified)`;
    }
    html += '</span>';
    html += '</div>'; // environment-row

    // Space selector
    html += '<div class="environment-row">';
    html += '<span class="env-label">Space:</span>';
    html += '<div class="env-selector">';

    const spaceLevels = ['Tight', 'Transitional', 'Open'];
    for (let s = 0; s <= 2; s++) {
        const isActive = s === space;
        html += `<button class="env-btn ${isActive ? 'active' : ''}" data-action="set-space" data-value="${s}">`;
        html += spaceLevels[s];
        html += '</button>';
    }

    html += '</div>'; // env-selector
    html += '<span class="env-capacity">';
    if (spaceInfo.maxFlanking === Infinity) {
        html += '(Unlimited Flanking)';
    } else if (spaceInfo.maxFlanking === 0) {
        html += '(No Flanking)';
    } else {
        html += `(Max ${spaceInfo.maxFlanking} Flanking)`;
    }
    html += '</span>';
    html += '</div>'; // environment-row

    html += '</div>'; // engagement-section

    // Hard Targets placeholder
    html += '<div class="engagement-section">';
    html += '<h4 class="section-label">Hard Targets</h4>';
    html += '<button class="hard-target-btn" disabled>';
    html += '<i data-lucide="plus"></i> Add Hard Target (Coming Soon)';
    html += '</button>';
    html += '</div>';

    html += '</div>'; // engagement-header

    return html;
}

/**
 * Main render function for engagement header
 */
export function renderEngagementHeader(missionState) {
    if (missionState.isHeaderExpanded) {
        return renderExpandedHeader(missionState);
    } else {
        return renderCollapsedHeader(missionState);
    }
}
