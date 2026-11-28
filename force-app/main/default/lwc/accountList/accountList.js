import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends LightningElement {
    industry = 'Energy';
    accounts;
    error;

    // IMPORTANT: a wire *function* receives a SINGLE argument:
    //   { data, error }  (or { data, error, loaded }) -> { error, loaded } on refresh
    // Passing two parameters (data, error) and deconstructing them as the wire result
    // is the classic source of "e[xx] is not a function" / undefined data in an App Page.
    @wire(getAccounts, { industryValue: '$industry' })
    wiredAccounts({ data, error }) {
        if (data) {
            console.log('ACCOUNTS FOR INDUSTRY ' + this.industry + '*** ' + JSON.stringify(data));
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            console.error('Error while loading accounts*** ' + JSON.stringify(error));
            this.error = error;
            this.accounts = undefined;
        }
    }

    get hasAccounts() {
        return Array.isArray(this.accounts) && this.accounts.length > 0;
    }

    get hasError() {
        return !!this.error;
    }

    // Apex errors arrive as an object (status/text/body), so render something readable
    get errorMessage() {
        if (!this.error) {
            return '';
        }
        if (Array.isArray(this.error.body) && this.error.body.length) {
            return this.error.body.map((e) => e.message).join(', ');
        }
        return this.error.message || this.error.status || 'Unknown error';
    }

    get errorTitle() {
        return (this.error && this.error.status) || 'Error';
    }
}