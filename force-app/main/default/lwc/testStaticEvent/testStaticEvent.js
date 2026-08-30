import { LightningElement } from 'lwc';

export default class TestStaticEvent extends LightningElement {

    modeOptions = [
        {label : 'Click Mode', value : 'click'},
        {label : 'Hover Mode', value : 'hover'}
    ];
    eventMode = 'hover';

    handleModeChange(event){

        this.eventMode = event.detail.value;
        console.log('MODE ' + JSON.stringify(this.eventMode));
    }

    handleClick() {
        if (this.eventMode === 'click') {
            this.message = '<img draggable="false" role="img" class="emoji" alt="🖱️" src="https://s0.wp.com/wp-content/mu-plugins/wpcom-smileys/twemoji/2/svg/1f5b1.svg"> You clicked!';
        }
    }
 
    handleMouseEnter() {
        if (this.eventMode === 'hover') {
            this.message = '<img draggable="false" role="img" class="emoji" alt="✨" src="https://s0.wp.com/wp-content/mu-plugins/wpcom-smileys/twemoji/2/svg/2728.svg"> Mouse entered!';
        }
    }
 
    handleMouseLeave() {
        if (this.eventMode === 'hover') {
            this.message = '<img draggable="false" role="img" class="emoji" alt="👋" src="https://s0.wp.com/wp-content/mu-plugins/wpcom-smileys/twemoji/2/svg/1f44b.svg"> Mouse left!';
        }
    }

    get boxClass(){
        const modeClass = `${this.eventMode}-mode`;
        return `slds-box slds-box_small slds-text-align_center interactive-box ${modeClass}`;
    }
    get hintText(){
        return this.eventMode === 'click'
        ? '<img draggable="false" role="img" class="emoji" alt="👆" src="https://s0.wp.com/wp-content/mu-plugins/wpcom-smileys/twemoji/2/svg/1f446.svg"> Click here'
        : '🖐️ Hover over me';
    }
}