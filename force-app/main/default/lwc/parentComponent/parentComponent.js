import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    messageFromchild; 
    messageFromParent = 'Hello From Parent';
    getMessageFromChild(event){
        this.messageFromchild = event.detail.text;
    }
}