import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import calculate from '@salesforce/apex/MathCalculatorController.calculate';

const OPERATOR_OPTIONS = [
    { label: 'Add  ( A + B )',           value: 'add'      },
    { label: 'Subtract  ( A − B )',      value: 'subtract' },
    { label: 'Multiply  ( A × B )',      value: 'multiply' },
    { label: 'Divide  ( A ÷ B )',        value: 'divide'   },
    { label: 'Modulo  ( A mod B )',      value: 'modulo'   },
    { label: 'Power  ( A ^ B )',         value: 'power'    },
];

const OPERATOR_SYMBOLS = {
    add:      '+',
    subtract: '−',
    multiply: '×',
    divide:   '÷',
    modulo:   'mod',
    power:    '^',
};

export default class MathCalculator extends LightningElement {
    operandA = null;
    operandB = null;
    selectedOperator = 'add';

    @track result = null;
    @track errorMessage = null;
    @track isLoading = false;

    get operatorOptions() {
        return OPERATOR_OPTIONS;
    }

    get hasResult() {
        return this.result !== null && !this.errorMessage;
    }

    get formattedResult() {
        if (this.result === null) return '';
        const num = Number(this.result);
        return Number.isInteger(num) ? num.toString() : num.toFixed(6).replace(/\.?0+$/, '');
    }

    get equation() {
        const sym = OPERATOR_SYMBOLS[this.selectedOperator] ?? this.selectedOperator;
        return `${this.operandA ?? '?'} ${sym} ${this.operandB ?? '?'} =`;
    }

    handleOperandAChange(event) {
        this.operandA = event.detail.value !== '' ? Number(event.detail.value) : null;
        this.clearResult();
    }

    handleOperandBChange(event) {
        this.operandB = event.detail.value !== '' ? Number(event.detail.value) : null;
        this.clearResult();
    }

    handleOperatorChange(event) {
        this.selectedOperator = event.detail.value;
        this.clearResult();
    }

    async handleCalculate() {
        if (!this.validateInputs()) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        this.result = null;

        try {
            const response = await calculate({
                operandA: this.operandA,
                operandB: this.operandB,
                operator: this.selectedOperator,
            });

            if (response?.isSuccess) {
                this.result = response.result;
                this.dispatchEvent(
                    new ShowToastEvent({ title: 'Success', message: 'Calculation complete.', variant: 'success' })
                );
            } else {
                this.errorMessage = response?.errorMessage ?? 'An unexpected error occurred.';
            }
        } catch (error) {
            this.errorMessage = this.extractErrorMessage(error);
            this.dispatchEvent(
                new ShowToastEvent({ title: 'Calculation Error', message: this.errorMessage, variant: 'error' })
            );
        } finally {
            this.isLoading = false;
        }
    }

    handleClear() {
        this.operandA = null;
        this.operandB = null;
        this.selectedOperator = 'add';
        this.clearResult();

        this.template.querySelectorAll('lightning-input').forEach(input => {
            input.value = null;
        });
    }

    clearResult() {
        this.result = null;
        this.errorMessage = null;
    }

    validateInputs() {
        const inputs = this.template.querySelectorAll('lightning-input');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.reportValidity()) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.errorMessage = 'Please fill in both number fields before calculating.';
            return false;
        }

        if (this.operandA === null || this.operandB === null || isNaN(this.operandA) || isNaN(this.operandB)) {
            this.errorMessage = 'Both fields must contain valid numbers.';
            return false;
        }

        return true;
    }

    extractErrorMessage(error) {
        if (typeof error === 'string') return error;
        if (error?.body?.message) return error.body.message;
        if (error?.message) return error.message;
        return 'An unknown error occurred.';
    }
}