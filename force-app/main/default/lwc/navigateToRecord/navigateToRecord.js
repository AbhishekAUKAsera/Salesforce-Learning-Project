import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class NavigateToRecord extends NavigationMixin(LightningElement) {

    handleNavigate(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes : {
                recordId : 'a016g00000br9GMAAY', //// Replace with dynamic ID
                actionName: 'view'
            }
        })
    }
    NavigateToListView(){
        this[NavigationMixin.Navigate]({
            type : 'standard__objectPage',
            attributes : {
                objectApiName : 'Account',
                actionName : 'list'
            },
            state : {
                filterName : 'Recent'
            }
        });
    }
    NavigateToGoogle(){
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes : {
                url : 'https://www.google.com'
            }
        });
    }
    NavigateToAppPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Sales' // Replace with the API name of your tab
            }
        });
    }
}