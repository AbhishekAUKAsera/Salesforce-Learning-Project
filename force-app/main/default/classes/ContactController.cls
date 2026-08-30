public with sharing class ContactController {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() 
    {
        return [SELECT Id, FirstName, LastName, Email FROM Contact];
    }

    @AuraEnabled
    Public Static List<Contact> fetchContact()
    {
        try{
            List<Contact> ContactList = new List<Contact>();
            ContactList = [Select id, FirstName, LastName, Name From Contact order by Name ASC Limit 10];
            return ContactList;
        }
        catch(Exception e)
        {
             throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<sobject> getContactList(String name)
    {
        String key = '%' + name + '%';
        String query = 'Select id, Name, email, phone from Contact where Name like : key';
        return Database.query(query);
    }
    @AuraEnabled(cacheable=true)
    public static List<sobject> getAccounttList(String name)
    {
        String key = '%' + name + '%';
        String query = 'Select Id, Name, Industry, Phone from Account where name like : key';
        return Database.query(query);
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContactsByFilter(Id accountId,String key){
        String query='select Id,Name, Phone, Email from Contact where AccountId=:accountId and Name like \'%'+key+'%\'';
        return Database.query(query);
    }
}