/**
 * @description       : Controller class exposing Contact and Account query methods to Lightning Web
 *                      Components (LWC) and Aura Components. Enforces sharing rules so users only
 *                      see records they have access to.
 * @author            : Abhishek Kasera
 * @last modified on  : 08-30-2026
 **/
public with sharing class ContactController {
    
    /**
     * @description Retrieves every Contact record with its basic identity fields.
     *              This method is cacheable, making it optimized for @wire adapters in LWC.
     *
     * @return      List<Contact> - All contacts with Id, FirstName, LastName and Email.
     **/
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() 
    {
        return [SELECT Id, FirstName, LastName, Email FROM Contact WITH USER_MODE];
    }

    /**
     * @description Retrieves up to 10 Contact records ordered by name for picklists and lists.
     *              Not cacheable because it is intended for imperative Apex calls.
     *
     * @return      List<Contact> - The first 10 contacts sorted by Name ascending.
     * @throws      AuraHandledException if a query or system error occurs.
     **/
    @AuraEnabled
    Public Static List<Contact> fetchContact()
    {
        try{
            List<Contact> contactList = [SELECT Id, FirstName, LastName, Name FROM Contact WITH USER_MODE ORDER BY Name ASC LIMIT 10];
            return contactList;
        }
        catch(Exception e)
        {
             throw new AuraHandledException(e.getMessage());
        }
    }
    /**
     * @description Searches Contacts by a partial name match (LIKE %name%).
     *              This method is cacheable, making it optimized for @wire adapters in LWC.
     *
     * @param       name - Text used to filter contacts by Name; wrapped in '%' wildcards.
     * @return      List<sobject> - Matching contacts with Id, Name, Email and Phone.
     **/
    @AuraEnabled(cacheable=true)
    public static List<sobject> getContactList(String name)
    {
        String key = '%' + name + '%';
        String query = 'SELECT Id, Name, Email, Phone FROM Contact WHERE Name LIKE :key WITH USER_MODE';
        return Database.query(query, AccessLevel.USER_MODE);
    }
    /**
     * @description Searches Accounts by a partial name match (LIKE %name%).
     *              This method is cacheable, making it optimized for @wire adapters in LWC.
     *
     * @param       name - Text used to filter accounts by Name; wrapped in '%' wildcards.
     * @return      List<sobject> - Matching accounts with Id, Name, Industry and Phone.
     **/
    @AuraEnabled(cacheable=true)
    public static List<sobject> getAccounttList(String name)
    {
        String key = '%' + name + '%';
        String query = 'SELECT Id, Name, Industry, Phone FROM Account WHERE Name LIKE :key WITH USER_MODE';
        return Database.query(query, AccessLevel.USER_MODE);
    }
    /**
     * @description Retrieves the Contacts of one Account filtered by a partial name match.
     *              This method is cacheable, making it optimized for @wire adapters in LWC.
     *
     * @param       accountId - Id of the Account whose contacts are returned.
     * @param       key - Text used to filter the contacts by Name; appended inside '%' wildcards.
     * @return      List<Contact> - Matching contacts with Id, Name, Phone and Email.
     **/
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContactsByFilter(Id accountId,String key){
        // Bind variable instead of string concatenation prevents SOQL injection.
        String searchKey = '%' + key + '%';
        String query = 'SELECT Id, Name, Phone, Email FROM Contact WHERE AccountId = :accountId AND Name LIKE :searchKey WITH USER_MODE';
        return Database.query(query, AccessLevel.USER_MODE);
    }

    /**
     * @description Retrieves the 10 most recently created Contact records.
     *              This method is cacheable, making it optimized for @wire adapters in LWC.
     *
     * @return      List<Contact> - Up to 10 contacts with Id, Name and CreatedDate, newest first.
     **/
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRecentContacts(){
        return [SELECT Id, Name, CreatedDate FROM Contact WITH USER_MODE ORDER BY CreatedDate DESC LIMIT 10];
    }
}
