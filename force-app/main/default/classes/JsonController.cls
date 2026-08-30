/*
This is a solid, straightforward Salesforce Apex controller. It successfully takes an object passed from a Lightning Web Component (LWC), 
serializes it into a JSON string, and saves it as a Salesforce File (ContentVersion) attached to the current user's record.
*/
/**
 * @description Controller class responsible for handling JSON data sent from 
 *              Lightning Web Components (LWC) and persisting it as a Salesforce File.
 */
public with sharing class JsonController {
    /**
     * @description Serializes an incoming object into a JSON string and saves it 
     *              as a ContentVersion (Salesforce File) attached to the current user.
     * @param obj The generic object or data structure passed from the LWC.
     * @return String The ID of the newly created ContentVersion record.
     * @throws AuraHandledException If an error occurs during serialization or DML insertion.
     */
    @AuraEnabled
    public static string saveJsonAsFile(object obj){
        try {
            ContentVersion contverfile = new ContentVersion();
            contverfile.versionData = Blob.valueOf(JSON.serialize(obj));
            contverfile.Title = 'JSON from LWC';
            contverfile.ContentLocation = 's';
            contverfile.PathonClient = 'JSON from LWC.txt';
            contverfile.FirstPublishLocationId = UserInfo.getUserId();

            database.insert(contverfile, AccessLevel.USER_MODE); //or you can write insert as user contverfile;
            //insert contverfile;
            return contverfile.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}