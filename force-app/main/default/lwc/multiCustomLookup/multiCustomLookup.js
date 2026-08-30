import { LightningElement, api, wire} from 'lwc';
import fetchLookUpData from '@salesforce/apex/CustomLookUpController.fetchLookUpData';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
const DELAY = 300; //300 milliseconds
export default class MultiCustomLookup extends LightningElement {

    searchKey;
    hasRecords=false;
    searchOutput = [];
    delayTimeout;
    selectedRecords=[];

    @api label='Account';
    @api placeHolder='Search Account';
    @api objectApiName = 'Account';
    @api iconName='standard:account';
    

    @wire(fetchLookUpData, {searchKey : '$searchKey', objectApiName : '$objectApiName'})
    searchResult({data, error}){
        if(data){
            console.log('DATA ' + JSON.stringify(data));
            this.hasRecords = data.length > 0 ? true : false;
            this.searchOutput = data;
        }else if(error){
            console.log('ERROR ' + JSON.stringify(error));
        }
    }

    //we dont want our wire decorator to we executed immediately as soon as we change something as part of best practice adding some delay to our server call
    //Settimeout method takes 2 things delay and callback function
    changeHandler(event){
        //this we are doing beacuse for every change we dont want to have the server call so for that we are introducing the delay..
       clearTimeout(this.delayTimeout);
       let value = event.target.value;
       this.searchKey = value;
       this.delayTimeout = setTimeout(()=> {
        this.searchKey = value;
       }, DELAY);
    }

    clickHandler(event){
        let recId = event.target.getAttribute('data-recid');
        console.log('SELECTED OR CLICKED RECORD ID ' + JSON.stringify(recId));
        if(this.validateDuplicate(recId)){
            let selectedRecord = this.searchOutput.find((currItem) => currItem.Id === recId);
            console.log('SELECTED RECORD ' + JSON.stringify(selectedRecord)); //SELECTED RECORD {"Id":"001g700000d7ERIAA2","Name":"University of Arizona"}
            let pill = {
                type :'icon',
                label : selectedRecord.Name,
                name : recId,
                iconName : this.iconName,
                alternativeText : selectedRecord.Name
            };
            this.selectedRecords = [...this.selectedRecords, pill];
            console.log('SELECTED RECORDS for PILL' + JSON.stringify(this.selectedRecords));//[{"type":"icon","label":"University of Arizona","name":"001g700000d7ERIAA2","iconName":"standard:account","alternativeText":"University of Arizona"}]

            //With this we are  closing the dropdown and clear search results if you dont want to close comment this code
            this.hasRecords = false;
            this.searchOutput = [];
            this.searchKey = '';
        }
    }

    get showPillContainer(){
        return this.selectedRecords.length > 0 ? true : false;
    }

    handleItemRemove(event) {
        const name = event.detail.item.name;
        console.log(name + " pill was removed!"); //001g700000d7ERIAA2 pill was removed!
        const index = event.detail.index;
        this.selectedRecords.splice(index, 1);
    }
    //Checks for duplicates via validateDuplicate
    validateDuplicate(selectedRecord){
        let isValid = true;
        let isRecordAlreadySelected = this.selectedRecords.find(currItem => currItem.name === selectedRecord);
        if(isRecordAlreadySelected){
            isValid = false;
            this.dispatchEvent(new ShowToastEvent({
                title: "Error!!",
                message: "Pill is already Selected",
                variant: "error"
            }));
        }else{
            isValid=true;
        }
        return isValid;
    }
    
}