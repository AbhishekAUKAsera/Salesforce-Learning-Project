/**
 * @description Helper class for Account trigger logic. Populates the shipping
 * address from the billing address when any shipping field is missing, and
 * flags Accounts that have no Industry value.
 */
public with sharing class AccountTriggerHelper {

    /**
     * @description Sets a default Description when Industry is blank, and copies
     * the Billing address into the Shipping address when any Shipping field is null.
     * @param accountList The list of Account records to process.
     */
    public static void updateAccountShippingAddress(List<Account> accountList) {
        for (Account acc : accountList) {
            if (acc.Industry == null) {
                acc.Description = 'Account Industry was Blank';
            }

            System.debug(acc.ShippingAddress);
            if (acc.ShippingAddress == null) {
                System.debug('ShippingAddress is null ');
            }

            if (acc.ShippingStreet == null || acc.ShippingCity == null || acc.ShippingCountry == null || acc.ShippingState == null || acc.ShippingPostalCode == null) {
                acc.ShippingStreet = acc.BillingStreet;
                acc.ShippingCity = acc.BillingCity;
                acc.ShippingCountry = acc.BillingCountry;
                acc.ShippingState = acc.BillingState;
                acc.ShippingPostalCode = acc.BillingPostalCode;
            }
        }
    }
}