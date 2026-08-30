public with sharing class ContactHandler {

    @AuraEnabled
    public static Contact createContactRecords(String contactJSON){
        try{
            ContactWrapper contactWrapperRec = (ContactWrapper)JSON.deserialize(contactJSON, ContactWrapper.class);
            if(contactWrapperRec != null){
                Contact conRec = new Contact();
                conRec.FirstName = contactWrapperRec.firstName;
                conRec.LastName = contactWrapperRec.lastName;
                conRec.Email = contactWrapperRec.email;
                conRec.AccountId = contactWrapperRec.accountId;

                insert conRec;

                return conRec;
            }
            return null;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Account updateAccountRecords(String accountJSON){
        try{
            AccountWrapper accountWrapperRec = (AccountWrapper)JSON.deserialize(accountJSON, AccountWrapper.class);
            System.debug('Account Records which i am going to Update on apex Side :::: ' + accountWrapperRec);
            if(accountWrapperRec != null && accountWrapperRec.accountId != null){
                Account accRec = new Account(Id =accountWrapperRec.accountId);
                accRec.Name = accountWrapperRec.accountName;
                accRec.Website = accountWrapperRec.accountWebsite;
                accRec.Phone = accountWrapperRec.accountPhone;
                accRec.NumberOfEmployees = accountWrapperRec.accountNoOfEmployees;

                update accRec;

                return accRec;
            }
            return null;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean deleteContactRecord(String contactId){
        try {
            if(!String.isBlank(contactId)){
                Contact con = new Contact(Id = contactId);
                Delete con;
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class ContactWrapper{
        public string firstName;
        public string lastName;
        public String accountId;
        public String email;
    }

    public class AccountWrapper{
        public String accountId;
        public String accountName;
        public String accountWebsite;
        public String accountPhone;
        public Integer accountNoOfEmployees;
    }
}