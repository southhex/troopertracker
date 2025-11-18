/**
 * Mission Control View Renderer
 * Handles rendering the Mission Control interface
 */

import { getDifficultyName, getMomentumColorClass } from './missionManager.js';

/**
 * Renders the momentum tracker UI
 */
function renderMomentumTracker(missionState) {
    const { momentum, victoryThreshold } = missionState;

    let html = '<div class="momentum-tracker">';
    html += '<h3>Momentum</h3>';
    html += '<div class="momentum-scale">';

    // Render momentum scale from -3 to +5
    for (let i = -3; i <= 5; i++) {
        const isActive = i === momentum;
        const isVictory = i === victoryThreshold;
        const isRetreat = i === -3;

        let classes = ['momentum-pip'];
        if (isActive) classes.push('active');
        if (isVictory) classes.push('victory-threshold');
        if (isRetreat) classes.push('retreat-threshold');

        const colorClass = getMomentumColorClass(i);
        classes.push(colorClass);

        html += `<button class="${classes.join(' ')}" data-action="set-momentum" data-value="${i}">`;
        html += `<span class="momentum-value">${i >= 0 ? '+' : ''}${i}</span>`;
        if (isVictory) html += '<span class="threshold-label">Victory</span>';
        if (isRetreat) html += '<span class="threshold-label">Retreat</span>';
        html += '</button>';
    }

    html += '</div>'; // momentum-scale

    // Momentum adjustment buttons
    html += '<div class="momentum-controls">';
    html += '<button class="momentum-adjust" data-action="adjust-momentum" data-delta="-1">';
    html += '<i data-lucide="minus"></i> Pushed Back';
    html += '</button>';
    html += '<button class="momentum-adjust" data-action="adjust-momentum" data-delta="1">';
    html += '<i data-lucide="plus"></i> Success';
    html += '</button>';
    html += '</div>';

    html += '</div>'; // momentum-tracker

    return html;
}

/**
 * Renders the threat level selector
 */
function renderThreatLevelSelector(missionState) {
    const { threatLevel } = missionState;
    const difficulty = getDifficultyName(threatLevel);

    let html = '<div class="threat-level-section">';
    html += '<h3>Threat Level</h3>';
    html += '<div class="threat-level-selector">';

    for (let tl = 1; tl <= 4; tl++) {
        const isActive = tl === threatLevel;
        const tlDifficulty = getDifficultyName(tl);

        html += `<button class="threat-level-btn ${isActive ? 'active' : ''}" data-action="set-threat-level" data-value="${tl}">`;
        html += `<span class="tl-number">TL ${tl}</span>`;
        html += `<span class="tl-difficulty">${tlDifficulty}</span>`;
        html += '</button>';
    }

    html += '</div>'; // threat-level-selector

    html += `<div class="threat-info">`;
    html += `<p><strong>Current Difficulty:</strong> ${difficulty}</p>`;
    html += `<p><strong>Victory Threshold:</strong> +${missionState.victoryThreshold}</p>`;
    html += `<p><strong>Enemy Tactics Chance:</strong> ${threatLevel} in 6</p>`;
    html += '</div>';

    html += '</div>'; // threat-level-section

    return html;
}

/**
 * Renders mission control buttons (start/end mission)
 */
function renderMissionControls(missionState) {
    const { isActive } = missionState;

    let html = '<div class="mission-controls">';

    if (!isActive) {
        html += '<button class="mission-btn start-mission" data-action="start-mission">';
        html += '<i data-lucide="play"></i> Start Mission';
        html += '</button>';
        html += '<p class="mission-status">No active mission. Configure settings and start when ready.</p>';
    } else {
        html += '<button class="mission-btn end-mission" data-action="end-mission">';
        html += '<i data-lucide="square"></i> End Mission';
        html += '</button>';
        html += '<p class="mission-status active">Mission in progress. Track momentum and manage engagement.</p>';
    }

    html += '</div>';

    return html;
}

/**
 * Main render function for Mission Control view
 */
export function renderMissionControl(missionState, container) {
    let html = '<div class="mission-control-content">';

    html += '<div class="mission-header">';
    html += '<h2>Mission Control</h2>';
    html += '<p class="mission-subtitle">Phase 1: Basic Mission State & Momentum Tracking</p>';
    html += '</div>';

    // Mission controls at top
    html += renderMissionControls(missionState);

    // Main content grid
    html += '<div class="mission-control-grid">';

    // Left column: Threat Level
    html += '<div class="mc-section">';
    html += renderThreatLevelSelector(missionState);
    html += '</div>';

    // Right column: Momentum Tracker
    html += '<div class="mc-section">';
    html += renderMomentumTracker(missionState);
    html += '</div>';

    html += '</div>'; // mission-control-grid

    // Instructions/help text
    html += '<div class="mission-help">';
    html += '<h4>Quick Reference</h4>';
    html += '<ul>';
    html += '<li><strong>Momentum:</strong> Ranges from -3 (forced retreat) to +5. Win when you reach Victory Threshold (TL+1).</li>';
    html += '<li><strong>Threat Level:</strong> Mission difficulty (1-4). Higher TL means tougher enemies and higher victory threshold.</li>';
    html += '<li><strong>Offense Roll Results:</strong> 1-3 = Pushed Back (-1), 4-5 = Hold Position, 6 = Success (+1, or +2 if multiple 6s).</li>';
    html += '<li>Switch to <strong>Mission</strong> tab to manage trooper positions and status during combat.</li>';
    html += '</ul>';
    html += '</div>';

    html += '</div>'; // mission-control-content

    container.innerHTML = html;
}
