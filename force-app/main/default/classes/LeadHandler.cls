/**
     * @description Handler class for Lead Conversion Process on Lead records.
     */
public with sharing class LeadHandler {
    
    /**
     * @description Convert all the Lead records whose status is closed converted and they are not yet converted one .
     * Uses user mode so that
     * CRUD and field-level security are enforced
     * @param lstLeads List of Lead records to be converted
     */
    public static void afterUpdate(List<Lead> lstLeads){
         
        LeadStatus lStatus = [SELECT Id, MasterLabel, IsConverted FROM LeadStatus WHERE IsConverted = true WITH USER_MODE LIMIT 1];

        List<Database.LeadConvert> lstLeadsToConvert = new List<Database.LeadConvert>();

        for(Lead ld : lstLeads){
            if(ld.status == 'Closed-Converted' && ld.IsConverted == false){
                Database.LeadConvert lc = new Database.LeadConvert();
                lc.setLeadId(ld.Id);
                lc.setDoNotCreateOpportunity(ld.Do_Not_Create_Opportunity__c);
                lc.setSendNotificationEmail(true);
                lc.setConvertedStatus(lStatus.MasterLabel);
                lstLeadsToConvert.add(lc);
            }
        }
        if(!lstLeadsToConvert.isEmpty()){
            List<Database.LeadConvertResult> lcr = Database.convertLead(lstLeadsToConvert, true);
        }
    }
}