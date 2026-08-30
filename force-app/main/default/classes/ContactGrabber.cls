/*
It does two specific things:
1.Retrieves a list of all Contacts that belong to a specific Account.
2.Retrieves the Account's profile details (Name, Revenue, Industry, etc.) alongside its first file attachment, converted into an image format so it can be displayed as a profile picture or logo on the screen.
*/
public with sharing class ContactGrabber {
    /**
     * Retrieves all contacts related to a given account.
     * @param acctId The Id of the account for which to retrieve related contacts.
     * @return A list of Contact records related to the specified account.
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllRelatedContacts(Id acctId){
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Contact WHERE AccountId =: acctId];
    }
    /**
     * Retrieves details of an account including its name, description, industry,
     * annual revenue, phone number, and the first attachment as a base64 encoded string.
     * @param acctId The Id of the account to retrieve details for.
     * @return A map containing account details and the first attachment in base64 format.
     */
    @AuraEnabled
    public static Map<String, Object> getAccountDetails(Id acctId){
        // Query account details
        Account account = [SELECT Name, Description, Industry, AnnualRevenue, Phone FROM Account WHERE Id=:acctId LIMIT 1];
        //Initialize response map
        Map<String, Object> accountDetails = new Map<String, Object>();
        accountDetails.put('Name', account.Name);
        accountDetails.put('Description', account.Description);
        accountDetails.put('Industry', account.Industry);
        accountDetails.put('AnnualRevenue', account.AnnualRevenue);
        accountDetails.put('Phone', account.Phone);
            // Query the first attachment separately
        List<Attachment> attachments = [SELECT Id, Body FROM Attachment WHERE ParentId =: acctId LIMIT 1];
        if(!attachments.isEmpty()){
            //EncodingUtil.base64Encode(...): It takes the raw binary data (Body) of the attachment and converts it into a Base64 string.
            //It formats that string as a Data URI. This is a clever trick that allows a frontend component to render an image directly from text data without needing a separate image URL.
            accountDetails.put('ImageBase64', 'data:image/jpeg;base64,' +  EncodingUtil.base64Encode(attachments[0].Body));
        }
        System.debug('accountDetails+++'+accountDetails);
        return accountDetails;
    }
}