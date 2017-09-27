import {
    getFirstFocusable,
    trapTabKey,
    toggleInert,
    removeInert
} from './A11yUtilities';

export default class Modal {

    constructor(buttonHook = '.modal__button', modalHook = '.modal') {
        this.button = document.querySelector(buttonHook);
        this.modal = document.querySelector(modalHook);

        if (!this.modal) return;
        if (!this.button) return;

        this.modalMask = this.modal.querySelector('.modal__mask');
        this.previousActiveElement = '';

        // listen for clicks
        this.button.addEventListener('click', this.openModal.bind(this));
    }

    openModal() {
        // Get the last active element and save it, so we can focus it when the
        // modal closes
        this.previousActiveElement = document.activeElement;

        // Make the modal a direct sibling of the body.
        this.extractModal();
        // Then we can set everything else to inert easily.
        toggleInert(this.modal);

        // display the modal
        this.modal.classList.add('modal--active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.querySelector('body').classList.add('fixed');

        // Focus the first focusable item in the modal.
        getFirstFocusable(this.modal).focus();

        // Listen for things that should close the dialog
        Array.from(this.modal.querySelectorAll('.js-modal__close')).forEach(item => item.addEventListener('click', this.closeModal.bind(this)));
        this.modalMask ? this.modalMask.addEventListener('click', this.closeModal.bind(this)) : '';
        document.addEventListener('keydown', this.checkCloseModal.bind(this));
        document.addEventListener('keydown', this.tabTrap.bind(this));
    }

    closeModal() {
        // remove event listeners
        this.modal.querySelectorAll('.js-modal__close').forEach(item => item.removeEventListener('click', this.closeModal.bind(this)));
        this.modalMask ? this.modalMask.removeEventListener('click', this.closeModal.bind(this)) : '';
        document.removeEventListener('keydown', this.checkCloseModal.bind(this));
        document.removeEventListener('keydown', this.tabTrap.bind(this));

        // De-inertify all the siblings.
        removeInert(this.modal);
        document.querySelector('body').classList.remove('fixed');

        // Hide the modal.
        this.modal.classList.remove('modal--active');
        this.modal.setAttribute('aria-hidden', 'true');

        // Restore focus to the previous active element
        this.previousActiveElement.focus();
    }

    checkCloseModal(e) {
        if (e.keyCode === 27) {
            this.closeModal();
        }
    }

    tabTrap(e) {
        trapTabKey(e, this.modal);
    }


    // extract modal from wherever it is and make it a direct sibling of the <body>
    // This lets us set all siblings to inert, for a friendly screen reader experience.
    extractModal() {
        let body = document.querySelector('body');
        body.appendChild(this.modal);
    }
}