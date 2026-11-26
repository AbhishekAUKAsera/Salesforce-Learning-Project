import { LightningElement, wire, track} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountDetails from '@salesforce/apex/AccountController.getAccountDetails';

export default class PageReferenceExample extends LightningElement {

    @track recordId; // Using @track to make the property reactive
    @track account; // To hold account details
    @track error; // To hold any error message

    @wire(CurrentPageReference)
    getPageReference(pageRef){
        if(pageRef?.state?.recordId){
            this.recordId = pageRef.state.recordId;
            this.fetchAccountDetails();
        }
    }

    fetchAccountDetails(){
        getAccountDetails({accountId : this.recordId})
        .then(result => {
            this.account = result;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error.body.message;
            this.account = undefined;
        });
    }
}
