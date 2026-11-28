import { createElement } from 'lwc';
import getRecentContacts from '@salesforce/apex/ContactController.getRecentContacts';
import ContactQuickList from 'c/contactQuickList';

jest.mock(
    '@salesforce/apex/ContactController.getRecentContacts',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

const MOCK_CONTACTS = [
    { Id: '0031', Name: 'Alpha', Title: 'Lead' },
    { Id: '0032', Name: 'Beta', Title: 'Manager' }
];

const flushPromises = () => Promise.resolve();

const createComponent = () => {
    const element = createElement('c-contact-quick-list', { is: ContactQuickList });
    document.body.appendChild(element);
    return element;
};

describe('c-contact-quick-list', () => {
    beforeEach(() => {
        getRecentContacts.mockResolvedValue(MOCK_CONTACTS);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // resetAllMocks also clears mockResolvedValue / mockRejectedValue
        jest.resetAllMocks();
    });

    it('loads and renders contacts from Apex', async () => {
        const element = createComponent();
        await flushPromises();

        const items = element.shadowRoot.querySelectorAll('.contact-item');
        expect(getRecentContacts).toHaveBeenCalledTimes(1);
        expect(items).toHaveLength(2);
        expect(items[0].dataset.id).toBe('0031');
        expect(items[0].textContent).toContain('Alpha');
        // spinner hidden once loading is false
        expect(element.shadowRoot.querySelector('lightning-spinner')).toBeFalsy();
    });

    it('shows the empty state when Apex returns no contacts', async () => {
        getRecentContacts.mockResolvedValue([]);
        const element = createComponent();
        await flushPromises();

        const empty = element.shadowRoot.querySelector('.empty-state');
        expect(empty).not.toBeNull();
        expect(empty.textContent.trim()).toBe('No recent Contacts found.');
        expect(element.shadowRoot.querySelectorAll('.contact-item')).toHaveLength(0);
    });

    it('shows the empty state instead of an error when Apex fails', async () => {
        getRecentContacts.mockRejectedValue(new Error('boom'));
        const element = createComponent();
        await flushPromises();

        expect(element.shadowRoot.querySelector('lightning-spinner')).toBeFalsy();
        expect(element.shadowRoot.querySelector('.empty-state')).not.toBeNull();
        expect(element.shadowRoot.querySelectorAll('.contact-item')).toHaveLength(0);
    });

    it('dispatches contactSelect with the contact id on click', async () => {
        const element = createComponent();
        await flushPromises();

        const handler = jest.fn();
        element.addEventListener('contactSelect', handler);
        element.shadowRoot.querySelector('.contact-item').click();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toBe('0031');
    });
});
