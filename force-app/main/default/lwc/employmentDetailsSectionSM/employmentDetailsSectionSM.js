import { LightningElement, api} from 'lwc';

export default class EmploymentDetailsSectionSM extends LightningElement {

    @api stateManagerRecord;

    get employmentType(){
        return this.stateManagerRecord ?. application ?. value ?. employmentInfo ?. employmentType;
    }

    get yearsEmployed(){
        return this.stateManagerRecord ?. application ?. value ?. employmentInfo ?. yearsEmployed;
    }

    get employmentTypeOptions(){
        return [
            {label : 'Full-time', value : 'full-time'},
            {label : 'Part-time', value : 'part-time'},
            {label : 'Self-employed', value : 'self-employed'}
        ];
    }

    handleEmploymentTypeChange(event){
        if(!this.stateManagerRecord){
            console.error('stateManagerRecord is not available');
            return;
        }
        try{
            this.stateManagerRecord.updateEmploymentInfo({
                employmentType : event.target.value
            });
        }catch(error){
            console.error('Error updating employment type: ', error);
        }
    }

}