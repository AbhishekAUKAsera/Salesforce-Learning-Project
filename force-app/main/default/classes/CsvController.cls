/**
 * @description       : Controller class to fetch Account records for export functionality
 *                       in Lightning Web Components (LWC). Used to retrieve Account data
 *                       (Id, Name, Website, Industry, Phone) which is then exported to
 *                       CSV/Excel format on the client side — either for all fetched
 *                       records or only the records selected by the user in the LWC data table.
 * @author             : Abhishek Kasera
 * @group               : Account
 * @last modified on   : 28-08-2026
 * @last modified by    : Your Name
**/
public with sharing class CsvController {
    /**
     * @description       : Fetches a list of Account records with selected fields
     *                       (Id, Name, Website, Industry, Phone) to be displayed in
     *                       an LWC data table. The LWC component uses this data to
     *                       export either all records or only the records selected
     *                       by the user (via checkbox selection) into a CSV/Excel file.
     *                       Method is marked cacheable so it can be used with the
     *                       Lightning Data Service wire adapter for efficient client-side caching.
     * @return             : List<Account> - List of Account records with Id, Name,
     *                       Website, Industry, and Phone fields populated.
     * @throws              AuraHandledException if any error occurs while querying records.
    **/
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchRecords(){
        try {
            return [SELECT Id, Name, Website, Industry, Phone FROM Account WITH USER_MODE]; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}