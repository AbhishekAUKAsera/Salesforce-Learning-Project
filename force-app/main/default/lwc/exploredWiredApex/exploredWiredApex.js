import { LightningElement, api, wire} from 'lwc';
import foobar from '@salesforce/apex/ExploreAccountController.fetchAccounts';

const accNamesMap = {
    name : 'Teja',
    profession : 'Salesforce developer',
    location : 'World'
};

const accountsArray = ['united group', 'sforce', 'salesforce casts'];

export default class ExploredWiredApex extends LightningElement {

    @wire(foobar, {searchText : 'United', accArray : accountsArray, accNameIndustriesMap : accNamesMap})
    account({error, data}){
        if(data){
            console.log('DATA --> ' + data);
        }else if(error){
            console.log(error);
        }
    }
}