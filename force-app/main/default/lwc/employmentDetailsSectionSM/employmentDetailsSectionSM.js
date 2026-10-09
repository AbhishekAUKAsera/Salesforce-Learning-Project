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

    handleEmploymentTypeChange(){
        
    }

}