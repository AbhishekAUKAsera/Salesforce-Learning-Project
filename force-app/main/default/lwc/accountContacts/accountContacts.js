import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class AccountContacts extends LightningElement {
    @api recordId; // received input from Parent

    // fieldName must match the flattened keys built in wiredContacts (below).
    columns = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Email', fieldName: 'email' }
    ];

    // Start as an empty array: lightning-datatable needs an array, and this makes
    // the "no contacts" state distinguishable from "not loaded yet".
    contacts = [];
    error;
    isLoaded = false;

    get hasContacts() {
        return this.contacts.length > 0;
    }

    get showEmpty() {
        return this.isLoaded && !this.error && this.contacts.length === 0;
    }

    get showError() {
        return Boolean(this.error);
    }

    get errorMessage() {
        const body = this.error && this.error.body;
        return (body && body.message) || 'Unable to load contacts.';
    }

    @wire(getRelatedListRecords, {
        // Pass the recordId reactively with $ so the wire fires once the parent
        // has actually passed the record id (avoids binding an undefined id).
        parentRecordId : '$recordId',
        relatedListId : 'Contacts',
        fields : ['Contact.Name', 'Contact.Email']
    })
    wiredContacts({ error, data }) {
        if (data) {
            console.log('Data from getRelatedListRecords' + JSON.stringify(data));
            this.error = undefined;
            this.isLoaded = true;
            // Each entry is { Id, fields: { Name: { value }, Email: { value } } }.
            // Flatten it so the datatable's fieldName paths actually resolve.
            this.contacts = (data.records || []).map((record) => ({
                id: record.Id,
                name: record.fields && record.fields.Name ? record.fields.Name.value : '',
                email: record.fields && record.fields.Email ? record.fields.Email.value : ''
            }));
            console.log('CONTACTS from getRelatedListRecords' + JSON.stringify(this.contacts));
        } else if (error) {
            this.contacts = [];
            this.error = error;
            this.isLoaded = true;
            console.error('Error fetching contacts', error);
        }
    }
}