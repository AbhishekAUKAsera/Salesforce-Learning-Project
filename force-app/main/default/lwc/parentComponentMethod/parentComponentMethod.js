import { LightningElement } from 'lwc';

export default class ParentComponentMethod extends LightningElement {

    callChildMethod()
    {
        this.template.querySelector('c-child-component-method').showAlert();
    }
}