import { LightningElement, api} from 'lwc';

export default class ChildComponent extends LightningElement {

    @api receivedMessage;
    sendData(){
        const event = new CustomEvent('message', {
            detail : {text : 'Hello from child!'}
        });
        this.dispatchEvent(event);
    }
}