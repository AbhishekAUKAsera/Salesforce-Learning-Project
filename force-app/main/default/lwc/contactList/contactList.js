import { LightningElement, wire} from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import whatsMyName from '@salesforce/apex/ShadyController.whatsMyName';

export default class ContactList extends LightningElement {

    myName; 

    connectedCallback(){
        whatsMyName()
        .then(name => this.myName = name);
    }

    @wire(getContacts)
    contacts;

    get hasContacts(){
        return this.contacts && this.contacts.data && this.contacts.data.length > 0;
    }

}