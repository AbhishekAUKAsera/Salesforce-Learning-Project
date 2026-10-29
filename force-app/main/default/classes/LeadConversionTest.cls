@IsTest
public with sharing class LeadConversionTest {
    
    @IsTest
    static void testLeadConversion(){
        // Step 1: Naya Lead record banao
        Lead ld = new Lead(FirstName = 'Rahul', LastName='Sharma', Company='Apex hours', Status = 'Open - Not Contacted');
        insert ld;

         // Step 2: Lead ko qualify karo (status update karo)
        ld.Status = 'Qualified';
        update ld;

        //Step 3: Lead ko convert Karo
        Database.LeadConvert lc = new Database.LeadConvert();
        lc.setLeadId(ld.Id);
        lc.setConvertedStatus('Closed - Converted');

        Database.LeadConvertResult res = Database.ConvertLead(lc);

        // Step 4: Check karo ki conversion successful hua ya nahi
        System.assert(res.isSuccess(), 'Lead conversion fail hua');

        // Step 5: Check karo ki Lead ko converted mark kiya gaya hai
        Lead convertedLead = [SELECT isConverted FROM Lead WHERE Id =: ld.Id];
        System.assertEquals(true, convertedLead.IsConverted, 'Lead converted mark nahi hua');

        // Step 6: Check karo ki Account bana ya nahi
        System.assertNotEquals(null, res.getAccountId(), 'Account nahi bana');

    }
}