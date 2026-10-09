/**
 * Provides server-side mathematical calculation services for the mathCalculator LWC.
 *
 * Supports addition, subtraction, multiplication, division, modulo, and exponentiation.
 * All user-facing errors are surfaced via AuraHandledException to prevent internal
 * details from leaking to the UI.
 */
public with sharing class MathCalculatorController {

    private static final Set<String> ALLOWED_OPERATORS = new Set<String>{
        'add', 'subtract', 'multiply', 'divide', 'modulo', 'power'
    };

    /**
     * Performs a mathematical calculation on two Decimal operands.
     *
     * @param operandA  The first number
     * @param operandB  The second number
     * @param operator  One of: add, subtract, multiply, divide, modulo, power
     * @return CalculationResult containing the computed value and status
     * @throws AuraHandledException on invalid input, division by zero, or unsupported operator
     * @example
     * MathCalculatorController.calculate(10, 3, 'divide'); // returns CalculationResult(3.333...)
     */
    @AuraEnabled
    public static CalculationResult calculate(Decimal operandA, Decimal operandB, String operator) {
        try {
            if (operandA == null || operandB == null) {
                throw new AuraHandledException('Both operands are required.');
            }

            String normalizedOp = operator == null ? '' : operator.toLowerCase().trim();

            if (String.isBlank(normalizedOp) || !ALLOWED_OPERATORS.contains(normalizedOp)) {
                throw new AuraHandledException(
                    'Invalid operator. Allowed values: add, subtract, multiply, divide, modulo, power.'
                );
            }

            Decimal result = performCalculation(operandA, operandB, normalizedOp);
            return new CalculationResult(result, true, null);

        } catch (AuraHandledException ahe) {
            throw ahe;
        } catch (Exception e) {
            throw new AuraHandledException('Calculation failed: ' + e.getMessage());
        }
    }

    private static Decimal performCalculation(Decimal a, Decimal b, String op) {
        if (op == 'add') {
            return a + b;
        }
        if (op == 'subtract') {
            return a - b;
        }
        if (op == 'multiply') {
            return a * b;
        }
        if (op == 'divide') {
            if (b == 0) {
                throw new AuraHandledException('Division by zero is not allowed.');
            }
            return a / b;
        }
        if (op == 'modulo') {
            if (b == 0) {
                throw new AuraHandledException('Modulo by zero is not allowed.');
            }
            return Math.mod(a.longValue(), b.longValue());
        }
        if (op == 'power') {
            Integer exponent = b.intValue();
            return a.pow(exponent);
        }
        throw new AuraHandledException('Unsupported operator: ' + op);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Wrapper classes
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Response wrapper returned to the LWC after each calculation.
     */
    public class CalculationResult {
        @AuraEnabled public Decimal result;
        @AuraEnabled public Boolean isSuccess;
        @AuraEnabled public String errorMessage;

        public CalculationResult(Decimal result, Boolean isSuccess, String errorMessage) {
            this.result = result;
            this.isSuccess = isSuccess;
            this.errorMessage = errorMessage;
        }
    }
}