/**
 * Controller for retrieving Contact records associated with an Account.
 * Provides remote action methods for Visualforce pages.
 */
public with sharing class AccountContactController {
    /**
     * Returns a list of Contacts for the given Account Id.
     * Must be public/global and static to be callable from Visualforce JavaScript.
     *
     * @param accountId The Id of the Account to retrieve Contacts for
     * @return List of Contact records (Id, FirstName, LastName, Email, Phone) ordered by LastName, limited to 200
     */
    @RemoteAction
    public static List<Contact> getContacts(String accountId) {
        if(String.isBlank(accountId)){
            return new List<Contact>();
        }
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Contact WHERE accountId =: accountId
        WITH SECURITY_ENFORCED ORDER BY LastName LIMIT 200];

    }
    /**
     * Returns a list of SelectOption for Account selection.
     * Includes a default '-- Select --' option and up to 100 Accounts ordered by Name.
     *
     * @return List of SelectOption containing Account Id and Name
     */
    public List<SelectOption> getAccountOptions() {
        List<SelectOption> options = new List<SelectOption>();
        options.add(new SelectOption('', '-- Select --'));
        for (Account a : [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED ORDER BY Name LIMIT 100]) {
            options.add(new SelectOption(a.Id, a.Name));
        }
        return options;
    }
}