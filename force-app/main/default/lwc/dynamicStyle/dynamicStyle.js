import { LightningElement } from 'lwc';

export default class DynamicStyle extends LightningElement {
    handleClick() {
        this.template.querySelector('button').style.backgroundColor = 'red';
    }
}