import { LightningElement } from 'lwc';

export default class LifeCycleDemo extends LightningElement {
    constructor(){
        super();
        console.log('constructor Called');//first
    }
    connectedCallback(){
        console.log('Connected Call Back Called'); //second
    }
    renderedCallback(){
        console.log('Rendered Call back called');//third
    }
    disconnectedCallback(){
        console.log('Disconnected Callback Called'); //when removed this get called
    }
}