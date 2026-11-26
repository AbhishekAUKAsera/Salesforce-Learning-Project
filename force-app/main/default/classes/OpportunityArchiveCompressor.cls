/**
 * Service class responsible for creating a compressed ZIP archive of closed-won opportunities
 * from the previous quarter and storing it as a Salesforce File (ContentVersion).
 */
public with sharing class OpportunityArchiveCompressor {
    
    /**
     * Creates a ZIP archive containing a CSV of closed-won opportunities from last quarter
     * and saves it as a ContentVersion record.
     * @return The Id of the created ContentVersion record, or null if no opportunities found.
     */
    public static Id createZippedOpportunityArchive(){

        String header = 'Opportunity Name, Close Date, Amount, Account Name\n';
        String csvdata = header;

        for(Opportunity opp : [SELECT Id, Name, CloseDate, Amount, Account.Name FROM Opportunity WHERE StageName = 'Closed Won' AND CloseDate = LAST_QUARTER 
        LIMIT 10000]){
            csvdata += opp.Name + ',' + String.valueOf(opp.closeDate) + ',' + String.valueOf(opp.Amount) + ',' + opp.Account.Name + '\n';

            Blob csvBlob = Blob.valueOf(csvdata);

            //Create a Zip archive With Compression.ZipWriter
            Compression.ZipWriter writer = new Compression.ZipWriter();
            // Add the CSV file into the ZIP archive
            writer.addEntry('ClosedWonOpportunities.csv', csvBlob);
            // Finalize and get the ZIP Blob
            Blob zipBlob = writer.getArchive();

            //Save the Zip as Salesforce File (Content Version)
            ContentVersion zipFile = new ContentVersion();
                zipFile.title = 'Q3-Closed-Won-Opps-Archive';
                zipFile.PathOnClient = 'Q3-Closed-Won-Opps-Archive.zip';
                zipFile.VersionData = zipBlob;

                // You must scope this to a valid record -- here using an example Account ID
            zipFile.FirstPublishLocationId = '001g700000d7ERBAA2';

            insert zipFile;

            System.debug('Created ZIP ContentVersion with ID: ' + zipFile.Id);
            return zipFile.Id;
        }
    }
}