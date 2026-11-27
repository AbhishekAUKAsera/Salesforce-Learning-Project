import { LightningElement, track} from 'lwc';
import getRecentContacts from '@salesforce/apex/ContactController.getRecentContacts';
import {NavigationMixin} from 'lightning/navigation';

export default class ContactQuickList extends NavigationMixin(LightningElement) {
    @track contacts = [];
    @track loading = true;

    connectedCallback(){
        getRecentContacts()
         .then(result => {
            this.contacts = result;
            console.log('Contacts From Apex in Js ' + JSON.stringify(this.contacts));
            this.loading = false;
         })
         .catch(() => {
            this.contacts = [];
            this.loading = false;
         })
    }

    handleClick(event){
        const id = event.currentTarget.dataset.id;
        console.log('Selected Contact Id ' + id);
        this.dispatchEvent(new CustomEvent('contactSelect', {detail : id}));
        this[NavigationMixin.Navigate]({
            type : 'standard__recordPage',
            attributes : {recordId : id, objectApiName : 'Contact', actionName : 'view'}
        });
    }
}