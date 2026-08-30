import { LightningElement } from 'lwc';
import loanAppStateManager from 'c/loanAppStateManagerRecord';
/*
This import statement is used in Salesforce Lightning Web Components (LWC) to tap into the Refresh API. It allows your custom component to listen for standard refresh events on the page and update its data accordingly—without requiring a full page reload.

Here is a breakdown of how the two functions work and how to implement them.
*/
import { registerRefreshHandler, unregisterRefreshHandler } from "lightning/refresh";
/*
Your EmploymentInfoStepSM component acts as a state-aware view for an employment information form in a loan application.

Singleton State Management: It imports a custom state manager (loanAppStateManagerRecord) to share data across different components without relying heavily on complex component events.
*/
export default class EmploymentInfoStepSM extends LightningElement {
    state = loanAppStateManager();

    refreshHandlerID;

    connectedCallback() {
        /*
        The Core Functions
registerRefreshHandler(context, callback): Tells the framework to execute a specific function (your callback) whenever a refresh event is triggered in the component's container.

unregisterRefreshHandler(handlerId): Removes the listener. You must always do this when the component is destroyed to prevent memory leaks.
        */
        this.refreshHandlerID = registerRefreshHandler(this, this.refreshHandler);
        console.log('Employment Info Step SM connected to state manager');
    }
    disconnectedCallback() {
        unregisterRefreshHandler(this.refreshHandlerID);
    }
    refreshHandler() {
        this.state = loanAppStateManager();
        console.log('Employment Info Step SM refreshed state:', this.state);
    }
    
    get stateManagerRecord() {
        // State manager is now a true singleton - returns same instance
        return this.state?.value;
    }

    get applicationRecord() {
        // Helper to access the applicationRecord for updates
        return this.stateManagerRecord?.applicationRecord;
    }

    get isLoading() {
        const status = this.applicationRecord?.status;
        return status === 'loading' || !status;
    }

    get recordData() {
        // Access applicationRecord.data - only available when loaded
        return this.applicationRecord?.data;
    }

    get fields() {
        // Return empty object if still loading or no data
        if (this.isLoading || !this.recordData) {
            return {};
        }
        return this.recordData.fields || {};
    }

    get employerName() {
        if (this.isLoading) return '';
        return this.fields['Employer_Name__c']?.value || '';
    }

    get jobTitle() {
        return this.fields['Job_Title__c']?.value || '';
    }

    get employmentType() {
        return this.fields['Employment_Type__c']?.value || 'full-time';
    }

    get monthlyIncome() {
        return this.fields['Monthly_Income__c']?.value || '';
    }

    get yearsEmployed() {
        return this.fields['Years_Employed__c']?.value || '';
    }

    get employerPhone() {
        return this.fields['Employer_Phone__c']?.value || '';
    }

}