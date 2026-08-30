import { LightningElement, api, track, wire} from 'lwc';
import createContactRecords from '@salesforce/apex/ContactHandler.createContactRecords';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {getRecord, getFieldValue } from 'lightning/uiRecordApi';

//Account Fields
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_WEBSITE from '@salesforce/schema/Account.Website';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';
import ACCOUNT_NO_OF_EMPLOYEES from '@salesforce/schema/Account.NumberOfEmployees';

import updateAccountRecords from '@salesforce/apex/ContactHandler.updateAccountRecords';

export default class CrudExample extends LightningElement {
    contactRecord;
    inputForm={};
    @api recordId;
    @api objectApiName;

    accountName;
    accountWebsite;
    accountPhone;
    accountNoOfEmployees;

    handleChange(event){
        this.inputForm[event.target.name] = event.target.value;
        console.log('INPUT FORM --> ' + JSON.stringify(this.inputForm));//{"firstName":"gfhf","lastName":"jnk","email":"ghjgj"}

        if(event.target.name == 'accountName'){
            this.accountName = event.target.value;
        }
        if(event.target.name == 'accountWebsite'){
            this.accountWebsite = event.target.value;
        }
        if(event.target.name == 'accountPhone'){
            this.accountPhone = event.target.value;
        }
        if(event.target.name == 'accountNoOfEmployees'){
            this.accountNoOfEmployees = event.target.value;
        }
    }
    submitForm(event){
        let contactSubmitForm = {
            firstName : this.inputForm.firstName,
            lastName : this.inputForm.lastName,
            email : this.inputForm.email,
            accountId : this.recordId
        }
        //Coverting the Whole JSON into String and passing as a parameter
        let contactString = JSON.stringify(contactSubmitForm);

        createContactRecords({contactJSON : contactString})
        .then((contact) => {
            this.contactRecord = contact;
            console.log('COMPLETE CONTACT --> ' + JSON.stringify(this.contactRecord));
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Success',
                    message : 'Contact Created Successfully!',
                    variant : 'success'
                })
            );
        })
        .catch((error) => {
            console.log('ERROR--> ', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error',
                    message : error.body.message,
                    variant : 'error'
                })
            );
        });
    }

    //We will first get the Account Record to populate in the UI, using getRecord wire adapter
    @wire(getRecord, {recordId : '$recordId', fields : [ACCOUNT_NAME, ACCOUNT_WEBSITE, ACCOUNT_PHONE, ACCOUNT_NO_OF_EMPLOYEES]})
    record({data, error}){
        if(data){
            console.log('DATA ' + JSON.stringify(data));
            
            this.accountName = getFieldValue(data, ACCOUNT_NAME);
            console.log('Prepopulated ACCOUNT Name ' + JSON.stringify(this.accountName));
            this.accountWebsite = getFieldValue(data, ACCOUNT_WEBSITE);
            console.log('Prepopulated ACCOUNT Website ' + JSON.stringify(this.accountWebsite));
            this.accountPhone = getFieldValue(data, ACCOUNT_PHONE);
            console.log('Prepopulated ACCOUNT Phone ' + JSON.stringify(this.accountPhone));
            this.accountNoOfEmployees = getFieldValue(data, ACCOUNT_NO_OF_EMPLOYEES);
            console.log('Prepopulated ACCOUNT Number of Employees ' + JSON.stringify(this.accountNoOfEmployees));
        }else if(error){
            console.log('error ', error);
        }
    }

    UpdateAccountRecords(){
        console.log('UPDATE RECORDS OF ACCOUNT');
        let accountSubmitForm = {
            accountId : this.recordId,
            accountName : this.accountName,
            accountWebsite : this.accountWebsite,
            accountPhone : this.accountPhone,
            accountNoOfEmployees : this.accountNoOfEmployees
        }

        let accountString = JSON.stringify(accountSubmitForm);

        updateAccountRecords({accountJSON : accountString})
        .then((account) => {
            console.log('UPDATED ACCOUNT ' + JSON.stringify(account));
            this.dispatchEvent(new ShowToastEvent({
                title : 'Success',
                message : 'Account Updated Successfully!',
                variant : 'success'
            }));
        })
        .catch((error) => {
            console.log('error ' + error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error',
                    message : error.body.message,
                    variant : 'error'
                })
            );
        })
        .finally(() => {
            this.isLoading = false;
        });
    }
}