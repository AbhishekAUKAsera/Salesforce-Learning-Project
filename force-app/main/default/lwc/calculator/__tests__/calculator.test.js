import { createElement } from 'lwc';
import Calculator from 'c/calculator';

function buildElement() {
    const element = createElement('c-calculator', {
        is: Calculator
    });
    document.body.appendChild(element);
    return element;
}

function press(element, value) {
    const button = element.shadowRoot.querySelector(`button[data-value="${value}"]`);
    button.click();
}

function pressSequence(element, values) {
    values.forEach((value) => press(element, value));
}

function getDisplay(element) {
    return element.shadowRoot.querySelector('[data-id="display"]').textContent.trim();
}

function getExpression(element) {
    return element.shadowRoot.querySelector('[data-id="expression"]').textContent.trim();
}

describe('c-calculator', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('shows zero on initial render', () => {
        const element = buildElement();
        expect(getDisplay(element)).toBe('0');
        expect(getExpression(element)).toBe('');
    });

    it('enters multiple digits and a decimal point', () => {
        const element = buildElement();
        pressSequence(element, ['1', '2', '.', '5']);
        expect(getDisplay(element)).toBe('12.5');
    });

    it('ignores a repeated decimal point', () => {
        const element = buildElement();
        pressSequence(element, ['3', '.', '.', '5']);
        expect(getDisplay(element)).toBe('3.5');
    });

    it('performs addition', () => {
        const element = buildElement();
        pressSequence(element, ['1', '2', '+', '7', 'equals']);
        expect(getExpression(element)).toBe('12 + 7 =');
        expect(getDisplay(element)).toBe('19');
    });

    it('performs subtraction, multiplication and division', () => {
        const element = buildElement();

        pressSequence(element, ['9', '-', '4', 'equals']);
        expect(getDisplay(element)).toBe('5');

        pressSequence(element, ['6', '*', '8', 'equals']);
        expect(getDisplay(element)).toBe('48');

        pressSequence(element, ['1', '0', '0', '/', '4', 'equals']);
        expect(getDisplay(element)).toBe('25');
    });

    it('rounds floating point results (0.1 + 0.2 = 0.3)', () => {
        const element = buildElement();
        pressSequence(element, ['0', '.', '1', '+', '0', '.', '2', 'equals']);
        expect(getDisplay(element)).toBe('0.3');
    });

    it('chains operations left to right (2 + 3 × 4 = 20)', () => {
        const element = buildElement();
        pressSequence(element, ['2', '+', '3', '*', '4', 'equals']);
        expect(getExpression(element)).toBe('5 × 4 =');
        expect(getDisplay(element)).toBe('20');
    });

    it('shows an error when dividing by zero and recovers on clear', () => {
        const element = buildElement();
        pressSequence(element, ['5', '/', '0', 'equals']);
        expect(getDisplay(element)).toBe('Error');
        expect(getExpression(element)).toBe('Cannot divide by zero');

        press(element, 'clear');
        expect(getDisplay(element)).toBe('0');
        expect(getExpression(element)).toBe('');
    });

    it('converts the current value to a percentage', () => {
        const element = buildElement();
        pressSequence(element, ['5', '0', 'percent']);
        expect(getDisplay(element)).toBe('0.5');
    });

    it('toggles the sign of the current value', () => {
        const element = buildElement();
        pressSequence(element, ['5', 'sign']);
        expect(getDisplay(element)).toBe('-5');

        press(element, 'sign');
        expect(getDisplay(element)).toBe('5');
    });

    it('removes the last entered digit with backspace', () => {
        const element = buildElement();
        pressSequence(element, ['1', '2', '3', 'backspace']);
        expect(getDisplay(element)).toBe('12');

        pressSequence(element, ['backspace', 'backspace']);
        expect(getDisplay(element)).toBe('0');
    });

    it('resets everything with all clear', () => {
        const element = buildElement();
        pressSequence(element, ['8', '+', '2', 'clear']);
        expect(getDisplay(element)).toBe('0');
        expect(getExpression(element)).toBe('');
    });

    it('highlights the pending operator', () => {
        const element = buildElement();
        pressSequence(element, ['2', '+']);
        const addButton = element.shadowRoot.querySelector('button[data-value="+"]');
        expect(addButton.className).toContain('key--active');
    });

    it('supports keyboard input', () => {
        const element = buildElement();

        window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '7' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(getExpression(element)).toBe('12 + 7 =');
        expect(getDisplay(element)).toBe('19');
    });
});
