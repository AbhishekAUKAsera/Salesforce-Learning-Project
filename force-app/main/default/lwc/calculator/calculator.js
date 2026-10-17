import { LightningElement } from 'lwc';

const MAX_INPUT_DIGITS = 12;

/** Internal (keyboard-friendly) operator values mapped to display symbols. */
const OPERATOR_SYMBOLS = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷',
};

const OPERATION_MAP = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

const KEY_DEFINITIONS = [
    { label: 'AC', value: 'clear', type: 'function', ariaLabel: 'All clear' },
    { label: '±', value: 'sign', type: 'function', ariaLabel: 'Toggle sign' },
    { label: '%', value: 'percent', type: 'function', ariaLabel: 'Percent' },
    { label: '÷', value: '/', type: 'operator', ariaLabel: 'Divide' },
    { label: '7', value: '7', type: 'digit', ariaLabel: '7' },
    { label: '8', value: '8', type: 'digit', ariaLabel: '8' },
    { label: '9', value: '9', type: 'digit', ariaLabel: '9' },
    { label: '×', value: '*', type: 'operator', ariaLabel: 'Multiply' },
    { label: '4', value: '4', type: 'digit', ariaLabel: '4' },
    { label: '5', value: '5', type: 'digit', ariaLabel: '5' },
    { label: '6', value: '6', type: 'digit', ariaLabel: '6' },
    { label: '−', value: '-', type: 'operator', ariaLabel: 'Subtract' },
    { label: '1', value: '1', type: 'digit', ariaLabel: '1' },
    { label: '2', value: '2', type: 'digit', ariaLabel: '2' },
    { label: '3', value: '3', type: 'digit', ariaLabel: '3' },
    { label: '+', value: '+', type: 'operator', ariaLabel: 'Add' },
    { label: '0', value: '0', type: 'digit', ariaLabel: '0' },
    { label: '.', value: '.', type: 'digit', ariaLabel: 'Decimal point' },
    { label: '⌫', value: 'backspace', type: 'function', ariaLabel: 'Backspace' },
    { label: '=', value: 'equals', type: 'equals', ariaLabel: 'Equals' },
];

/**
 * A self-contained keypad calculator built with Lightning Web Components.
 * All math runs client side — no Apex controller is required.
 */
export default class Calculator extends LightningElement {
    /** Raw string currently shown in the main display (e.g. '-12.5'). */
    display = '0';
    /** Small history line above the display (e.g. '12 + 7 ='). */
    expression = '';
    previousValue = null;
    operator = null;
    waitingForOperand = false;
    hasError = false;

    connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    // ---------------------------------------------------------------------
    // Template getters
    // ---------------------------------------------------------------------

    get formattedDisplay() {
        if (this.hasError) {
            return 'Error';
        }
        return this.formatNumber(this.display);
    }

    get displayClass() {
        const digitCount = this.formattedDisplay.replace(/[^0-9.]/g, '').length;
        const sizeClass = digitCount > 9 ? ' display-value--small' : '';
        const errorClass = this.hasError ? ' display-value--error' : '';
        return `display-value${sizeClass}${errorClass}`;
    }

    get keys() {
        return KEY_DEFINITIONS.map((key) => ({
            ...key,
            className: `key key--${key.type}${this.operator === key.value ? ' key--active' : ''}`,
        }));
    }

    // ---------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------

    handleKeyPress(event) {
        const { value } = event.currentTarget.dataset;
        switch (value) {
            case 'clear':
                this.handleClear();
                break;
            case 'sign':
                this.toggleSign();
                break;
            case 'percent':
                this.handlePercent();
                break;
            case 'backspace':
                this.handleBackspace();
                break;
            case 'equals':
                this.handleEquals();
                break;
            default:
                if (OPERATION_MAP[value]) {
                    this.handleOperator(value);
                } else {
                    this.handleDigit(value);
                }
        }
    }

    handleKeyDown = (event) => {
        // Never hijack keys while the user is typing in another component.
        const tagName = event.target && event.target.tagName;
        if (['INPUT', 'TEXTAREA', 'LIGHTNING-INPUT', 'LIGHTNING-TEXTAREA', 'LIGHTNING-COMBOBOX'].includes(tagName)) {
            return;
        }

        const { key } = event;
        if (/^[0-9]$/.test(key) || key === '.') {
            this.handleDigit(key);
        } else if (OPERATION_MAP[key]) {
            event.preventDefault(); // e.g. "/" opens Quick Find in Lightning Experience
            this.handleOperator(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.handleEquals();
        } else if (key === 'Backspace') {
            this.handleBackspace();
        } else if (key === 'Escape') {
            this.handleClear();
        } else if (key === '%') {
            this.handlePercent();
        }
    };

    // ---------------------------------------------------------------------
    // Calculator operations
    // ---------------------------------------------------------------------

    handleDigit(digit) {
        if (this.hasError) {
            this.handleClear();
        }

        if (this.waitingForOperand) {
            // Starting a fresh number right after an operator or "=".
            this.display = digit === '.' ? '0.' : digit;
            this.waitingForOperand = false;
            if (this.operator === null) {
                this.expression = '';
            }
            return;
        }

        if (digit === '.') {
            if (!this.display.includes('.')) {
                this.display += '.';
            }
            return;
        }

        if (this.display === '0') {
            this.display = digit;
            return;
        }
        if (this.display === '-0') {
            this.display = `-${digit}`;
            return;
        }
        if (this.countDigits(this.display) >= MAX_INPUT_DIGITS) {
            return;
        }
        this.display += digit;
    }

    handleOperator(nextOperator) {
        if (this.hasError) {
            return;
        }
        const current = parseFloat(this.display);

        if (this.operator !== null && !this.waitingForOperand) {
            // Chain: compute the pending operation first (2 + 3 × → 5 ×).
            const result = this.compute(this.previousValue, current, this.operator);
            if (!Number.isFinite(result)) {
                this.setError(this.operator === '/' ? 'Cannot divide by zero' : 'Result is too large');
                return;
            }
            this.previousValue = this.round(result);
            this.display = String(this.previousValue);
        } else if (this.previousValue === null) {
            this.previousValue = current;
        }

        this.operator = nextOperator;
        this.waitingForOperand = true;
        this.expression = `${String(this.previousValue)} ${OPERATOR_SYMBOLS[nextOperator]}`;
    }

    handleEquals() {
        if (this.hasError || this.operator === null || this.previousValue === null) {
            return;
        }
        const current = parseFloat(this.display);
        const result = this.compute(this.previousValue, current, this.operator);
        if (!Number.isFinite(result)) {
            this.setError(this.operator === '/' ? 'Cannot divide by zero' : 'Result is too large');
            return;
        }

        const rounded = this.round(result);
        this.expression = `${String(this.previousValue)} ${OPERATOR_SYMBOLS[this.operator]} ${String(current)} =`;
        this.display = String(rounded);
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = true;
    }

    handlePercent() {
        if (this.hasError) {
            return;
        }
        const current = parseFloat(this.display);
        this.display = String(this.round(current / 100));
    }

    toggleSign() {
        if (this.hasError || this.display === '0') {
            return;
        }
        this.display = this.display.startsWith('-') ? this.display.slice(1) : `-${this.display}`;
    }

    handleBackspace() {
        if (this.hasError || this.waitingForOperand) {
            return;
        }
        this.display = this.display.length > 1 ? this.display.slice(0, -1) : '0';
    }

    handleClear() {
        this.display = '0';
        this.expression = '';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.hasError = false;
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    compute(a, b, operator) {
        return OPERATION_MAP[operator](a, b);
    }

    round(value) {
        // Removes floating point noise (0.1 + 0.2 → 0.3, not 0.30000000000000004).
        return Math.round((value + Number.EPSILON) * 1e10) / 1e10;
    }

    countDigits(value) {
        return value.replace('-', '').replace('.', '').length;
    }

    formatNumber(value) {
        const [integerPart, decimalPart] = value.split('.');
        const isNegative = integerPart.startsWith('-');
        const digits = isNegative ? integerPart.slice(1) : integerPart;
        const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const sign = isNegative ? '-' : '';
        const decimals = decimalPart !== undefined ? `.${decimalPart}` : '';
        return `${sign}${grouped}${decimals}`;
    }

    setError(message) {
        this.hasError = true;
        this.display = 'Error';
        this.expression = message;
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
    }
}
