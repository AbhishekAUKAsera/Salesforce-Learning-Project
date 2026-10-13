public with sharing class LeadConversionService {

    // Choose 1, 2, 3, or 4 (see approaches above)
    public static Integer CONVERSION_APPROACH = 1;

    public static void convertLeads(List<Lead> leads) {
        if (leads == null || leads.isEmpty()) return;

        LeadStatus convertedStatus = [
            SELECT MasterLabel
            FROM LeadStatus
            WHERE IsConverted = true
            LIMIT 1
        ];

        Boolean createOpp = (CONVERSION_APPROACH == 3 || CONVERSION_APPROACH == 4);
        Boolean useExistingAccount = (CONVERSION_APPROACH == 2 || CONVERSION_APPROACH == 4);

        // For approaches 2 and 4, look up existing Accounts by Company name
        Map<String, Id> accountByName = new Map<String, Id>();
        if (useExistingAccount) {
            Set<String> companyNames = new Set<String>();
            for (Lead l : leads) {
                if (String.isNotBlank(l.Company)) companyNames.add(l.Company);
            }
            if (!companyNames.isEmpty()) {
                for (Account acc : [
                    SELECT Id, Name FROM Account WHERE Name IN :companyNames
                ]) {
                    // Keep first match per name
                    if (!accountByName.containsKey(acc.Name)) {
                        accountByName.put(acc.Name, acc.Id);
                    }
                }
            }
        }

        // For approaches 2 and 4, look up existing Contacts by Email
        Map<String, Id> contactByEmail = new Map<String, Id>();
        if (CONVERSION_APPROACH == 2) {
            Set<String> emails = new Set<String>();
            for (Lead l : leads) {
                if (String.isNotBlank(l.Email)) emails.add(l.Email);
            }
            if (!emails.isEmpty()) {
                for (Contact c : [
                    SELECT Id, Email FROM Contact WHERE Email IN :emails
                ]) {
                    if (!contactByEmail.containsKey(c.Email)) {
                        contactByEmail.put(c.Email, c.Id);
                    }
                }
            }
        }

        List<Database.LeadConvert> converts = new List<Database.LeadConvert>();

        for (Lead l : leads) {
            Database.LeadConvert lc = new Database.LeadConvert();
            lc.setLeadId(l.Id);
            lc.setConvertedStatus(convertedStatus.MasterLabel);
            lc.setDoNotCreateOpportunity(!createOpp);

            if (CONVERSION_APPROACH == 2 || CONVERSION_APPROACH == 4) {
                if (String.isNotBlank(l.Company) && accountByName.containsKey(l.Company)) {
                    lc.setAccountId(accountByName.get(l.Company));
                }
            }

            if (CONVERSION_APPROACH == 2) {
                if (String.isNotBlank(l.Email) && contactByEmail.containsKey(l.Email)) {
                    lc.setContactId(contactByEmail.get(l.Email));
                }
            }

            if (createOpp) {
                lc.setOpportunityName(
                    (String.isNotBlank(l.Company) ? l.Company : 'Lead') + ' - Opportunity'
                );
            }

            converts.add(lc);
        }

        if (converts.isEmpty()) return;

        List<Database.LeadConvertResult> results = Database.convertLead(converts, false);

        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                for (Database.Error err : results[i].getErrors()) {
                    System.debug(LoggingLevel.ERROR,
                        'Lead ' + leads[i].Id + ' conversion failed: ' + err.getMessage());
                }
            }
        }
    }
}