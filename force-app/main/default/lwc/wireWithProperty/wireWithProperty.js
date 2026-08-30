import { LightningElement, wire} from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccList';

export default class WireWithProperty extends LightningElement {
    @wire(getAccountList) accounts;
}