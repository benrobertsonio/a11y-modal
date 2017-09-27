import 'wicg-inert';


/**
 * Get all focusable elements inside of the specifed context.
 * @param  {String} [context='document'] The DOM context you want to search in.
 * @return {Array}                      Array of focusable elements
 */
export function getFocusable(context = 'document') {
    let focusable = Array.from(context.querySelectorAll('button, [href],  select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'));
    return focusable;
}


/**
 * Get the first focusabl element inside of the specified context.
 * @param  {String} [context='document'] The DOM context you want to search in.
 * @return {Object}                      A DOM element
 */
export function getFirstFocusable(context = 'document') {
    let focusable = getFocusable(context);
    return focusable[0];
}


/**
 * Traps the tab key inside of the context, so the user can't accidentally get
 * stuck behind it.
 *
 * Note that this does not work for VoiceOver users who are navigating with
 * the VoiceOver commands, only for default tab actions. We would need to
 * implement something like the inert attribute for that (see https://github.com/WICG/inert)
 * @param  {object} e the Event object
 */
export function trapTabKey(e, context) {
    if (e.key !== 'Tab') return;

    let focusableItems = getFocusable(context);
    let focusedItem = document.activeElement;

    let focusedItemIndex = focusableItems.indexOf(focusedItem);

    if (e.shiftKey) {
        if (focusedItemIndex == 0) {
            focusableItems[focusableItems.length - 1].focus();
            e.preventDefault();
        }
    } else {
        if (focusedItemIndex == focusableItems.length - 1) {
            focusableItems[0].focus();
            e.preventDefault();
        }
    }
}


/**
 * Toggles an 'inert' attribute on all direct children of the <body> that are not
 * the element you passed in. The element you pass in needs to be a direct child
 * of the <body>.
 *
 * Most useful when displaying a dialog/modal/overlay and you need to prevent screen-reader users
 * from escaping the modal to content that is hidden behind the modal.
 *
 * Requires the wicg-inert polyfill.
 * See https://github.com/WICG/inert for more information about the inert attribute.
 *
 * Inspired by Rob Dodson's a11ycasts video: https://www.youtube.com/watch?v=JS68faEUduk&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=5
 *
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
export function toggleInert(element) {
    Array.from(document.body.children).forEach(child => {
        if (child !== element && child.tagName !== 'LINK' && child.tagName !== 'SCRIPT') {
            child.inert = !child.inert;
        }
    });
}

export function removeInert(element) {
    Array.from(document.body.children).forEach(child => {
        if (child !== element && child.tagName !== 'LINK' && child.tagName !== 'SCRIPT') {
            child.inert = false;
        }
    });
}