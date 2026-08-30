import { LightningElement, wire} from 'lwc';
import {getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
import FIRST_NAME_FIELD from '@salesforce/schema/User.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/User.LastName';
import IS_GUEST from '@salesforce/user/isGuest';
import hasPermission from '@salesforce/userPermission/ViewAllData';
import hasCustomPermission from '@salesforce/customPermission/My_Custom_Permission';

export default class QuickTipLwc extends LightningElement {
    userId = USER_ID;

    @wire(getRecord, {recordId : USER_ID, fields : [NAME_FIELD, EMAIL_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD]})
    user;

    get name() {
        return getFieldValue(this.user.data, NAME_FIELD);
    }
    get email() {
        return getFieldValue(this.user.data, EMAIL_FIELD);
    }
    get firstName(){
        return getFieldValue(this.user.data, FIRST_NAME_FIELD);
    }
    get lastName(){
        return getFieldValue(this.user.data, LAST_NAME_FIELD);
    }
}