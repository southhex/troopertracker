/**
 * Toast Notification System
 * Displays temporary notifications at the bottom of the screen
 */

let toastContainer = null;
let activeToasts = [];

/**
 * Initializes the toast container
 */
export function initToastContainer() {
    if (!toastContainer) {
        toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }
}

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
    initToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add icon based on type
    const icon = document.createElement('i');
    icon.className = 'toast-icon';

    switch(type) {
        case 'success':
            icon.setAttribute('data-lucide', 'check-circle');
            break;
        case 'error':
            icon.setAttribute('data-lucide', 'alert-circle');
            break;
        case 'warning':
            icon.setAttribute('data-lucide', 'alert-triangle');
            break;
        case 'info':
            icon.setAttribute('data-lucide', 'info');
            break;
    }

    toast.prepend(icon);
    toastContainer.appendChild(toast);
    activeToasts.push(toast);

    // Initialize Lucide icons for the new toast
    if (window.lucide) {
        lucide.createIcons();
    }

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto-remove after duration
    const timeoutId = setTimeout(() => {
        removeToast(toast);
    }, duration);

    // Allow manual dismissal
    toast.addEventListener('click', () => {
        clearTimeout(timeoutId);
        removeToast(toast);
    });
}

/**
 * Removes a toast from the display
 */
function removeToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        activeToasts = activeToasts.filter(t => t !== toast);
    }, 300);
}

/**
 * Shows a success toast
 */
export function showSuccess(message, duration = 3000) {
    showToast(message, 'success', duration);
}

/**
 * Shows an error toast
 */
export function showError(message, duration = 3000) {
    showToast(message, 'error', duration);
}

/**
 * Shows a warning toast
 */
export function showWarning(message, duration = 3000) {
    showToast(message, 'warning', duration);
}

/**
 * Shows an info toast
 */
export function showInfo(message, duration = 3000) {
    showToast(message, 'info', duration);
}

/**
 * Clears all active toasts
 */
export function clearAllToasts() {
    activeToasts.forEach(toast => removeToast(toast));
}
