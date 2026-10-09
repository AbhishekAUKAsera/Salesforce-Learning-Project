/**
 * @description Helper class that holds a customer's basic details and
 * prints them to the debug log.
 */
public with sharing class CustomerDetailsHelper {
    private Integer customerCode;
    private String customerName;
    private String address;
    private String phoneNumber;
    private Decimal balanceAmount;

    /**
     * @description Constructor that initializes the customer details
     * with default values.
     */
    public CustomerDetailsHelper() {
        customerCode = 12001;
        customerName = 'Aryan Mehta';
        address = 'Tancret Street Christchurch NZ';
        phoneNumber = '6546398901';
        balanceAmount = 238000.90;
    }

    /**
     * @description Writes the customer details to the debug log.
     */
    public void showCustomerDetails() {
        System.debug('Customer Code is.. ' + customerCode);
        System.debug('Customer Name is.. ' + customerName);
        System.debug('Customer Address is.. ' + address);
        System.debug('Customer Phone Number is.. ' + phoneNumber);
        System.debug('Customer Balance Amount is.. ' + balanceAmount);
    }
}