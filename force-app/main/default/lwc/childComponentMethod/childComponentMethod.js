import { LightningElement, api} from 'lwc';

export default class ChildComponentMethod extends LightningElement {
    @api showAlert(){
        alert('Method called From Parent!');
    }
}