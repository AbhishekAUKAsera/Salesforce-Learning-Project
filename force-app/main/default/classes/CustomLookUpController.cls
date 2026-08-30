/**
 * @description       : Controller class for the Custom Lookup Lightning Web Component.
 *                       Provides server-side logic to search records dynamically
 *                       based on a search key and object API name.
 * @author             : Abhishek Kasera
 * @group              : Custom Lookup
 * @last modified on   : 08-27-2026
 * @last modified by   : Abhishek Kasera
 **/
public with sharing class CustomLookUpController {
     /**
     * @description Fetches a list of SObject records that match the given search key
     *              for the specified object API name. Used by the custom lookup component
     *              to dynamically search across any object.
     * @author Abhishek Kasera | 08-27-2026
     * @param searchKey     The text entered by the user to search records by Name (or another
     *                      identifying field). Wildcards are appended automatically.
     * @param objectApiName The API name of the SObject to query (e.g., 'Account', 'Contact').
     * @return List<SObject> A list of matching SObject records (max 5), including Id and Name.
     * @throws AuraHandledException If the search fails due to invalid input or a query exception.
     * 
     * @example
     * // Called from LWC:
     * fetchLookUpData({ searchKey: 'Acme', objectApiName: 'Account' })
     */
    @AuraEnabled(cacheable=true)
    public static List<Sobject> fetchLookUpData(String searchKey, String objectApiName){
        try{
            List<Sobject> sObjectList = new List<Sobject>();
            if(String.isBlank(searchKey) || String.isBlank(objectApiName)){
                return sObjectList;
            }else{
                // Validate that the object exists and is accessible
                Schema.SobjectType objectType= Schema.getGlobalDescribe().get(objectApiName);
                if(objectType == null || !objectType.getDescribe().isAccessible()){
                    throw new AuraHandledException('Invalid or inaccessible object: ' + objectApiName);
                }
                // Sanitize search key to prevent SOQL injection
                String sanitizedSearchKey = '%' + String.escapeSingleQuotes(searchKey) + '%';
                String query = 'SELECT Id, Name FROM ' + objectApiName + ' Where name like : sanitizedSearchKey order by Name limit 5';
                sObjectList = Database.Query(query, AccessLevel.USER_MODE);
                return sObjectList;
            }
        }catch(Exception ex){
             throw new AuraHandledException('Error fetching look up data ' + ex.getMessage());
        }
    }
}