import { LightningElement, api, wire, track} from 'lwc';
import getAccountData from '@salesforce/apex/AccountController.getAccountRecordMethod';

export default class WiredFunctionExample extends LightningElement {

    @api accName;
    @track accountRecord;
    @track error;

    handleChange(event){
        const userInput = event.target.value;
        this.accName = userInput;
    }

    @wire(getAccountData, {accNameParamInApex : '$accName'})
    accountsData({error, data}){
        if(data){
            this.accountRecord = data;
            console.log('Account Record on the basis of Search Param ' + JSON.stringify(this.accountRecord));
            this.error = undefined;
        }else if(error){
            this.error = error;
            this.accountRecord = undefined;
        }
    }
}