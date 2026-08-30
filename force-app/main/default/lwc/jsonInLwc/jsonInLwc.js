import { LightningElement } from 'lwc';
import saveJsonAsFile from '@salesforce/apex/JsonController.saveJsonAsFile';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class JsonInLwc extends LightningElement {

    blogDetail = {
        name : 'salesforce Diaries',
        author : 'Sanket',
        url : 'https://salesforcediaries.com/',
        focus : 'LWC',
        startedIn : '2020',
        numberOfPost : '100',
        motive : 'help developers'
    };

    //format the json object to show it on ui
    get jsonString() {
        return JSON.stringify(this.blogdetail, null, 2);
    }

    handleSave(){
        saveJsonAsFile({obj :  this.blogDetail})
        .then(result => {
            const event = new ShowToastEvent({
                title : 'File Uploaded',
                message : 'File has been Uploaded Successfully, With Id: ' + result,
                variant : 'success'
            });
            this.dispatchEvent(event);
        })
        .catch(error => {
            console.log('error in catch ' + error);
        });
    }
}