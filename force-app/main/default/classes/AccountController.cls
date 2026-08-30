/**
 * @description       : Controller class used to fetch Account records for Lightning Web Components (LWC) or Aura Components.
 *                      Enforces sharing rules to ensure users only see records they have access to.
 * @author            : Abhishek Kasera
 * @last modified on  : 08-30-2026
 **/
public with sharing class AccountController {

    @TestVisible
    private static Boolean forceException = false;

    /**
     * @description Retrieves a list of the 10 most recently created Account records.
     *              This method is cacheable, making it optimized for @wire adapters in LWC.
     * 
     * @return      List<Account> - A list containing the Id, Name, and Phone of up to 10 recent Accounts.
     * @throws      AuraHandledException if a query or system error occurs.
     **/
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccList() {
        try {
            if (Test.isRunningTest() && forceException) {
                throw new CalloutException('Forced exception for unit testing');
            }
            return [
                SELECT Id, Name, Phone 
                FROM Account 
                WITH USER_MODE 
                ORDER BY CreatedDate DESC 
                LIMIT 10
            ]; 
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(ex.getMessage());
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    /**
     * @description Searches for Account records by partially matching the provided string against the Account Name field.
     *              This method is cacheable and suitable for search bars or autocomplete inputs in LWC.
     *              Guards against blank/null inputs and limits results to 50 for optimal performance.
     * 
     * @param       accNameParamInApex (String) - The search keyword used to filter accounts by Name.
     * @return      List<Account> - A list of Account records (Id, Name, Industry) matching the search criteria.
     * @throws      AuraHandledException if a query or system error occurs.
     **/
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountRecordMethod(String accNameParamInApex) {
        try {
            if (Test.isRunningTest() && forceException) {
                throw new CalloutException('Forced exception for unit testing');
            }
            if (String.isBlank(accNameParamInApex)) {
                return new List<Account>();
            }

            String sanitizedSearchTerm = accNameParamInApex.trim();
            String accNameKey = '%' + sanitizedSearchTerm + '%';

            return [
                SELECT Id, Name, Industry 
                FROM Account 
                WHERE Name LIKE :accNameKey 
                WITH USER_MODE 
                ORDER BY Name ASC 
                LIMIT 50
            ];
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(ex.getMessage());
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }
}