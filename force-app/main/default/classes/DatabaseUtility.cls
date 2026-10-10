public with sharing class DatabaseUtility {
    public static void GetAllLeadRecords(){
        List<Lead> lstLeads = [SELECT Id, FirstName, LastName, Company, Status, Email, Phone, Fax FROM Lead];
        System.debug('Collection Size is ' + lstLeads.size());

        if(!lstLeads.isEmpty()){
            for(Lead ld : lstLeads){
                System.debug('Lead Id ' + ld.Id);
                System.debug('Lead Name ' + ld.FirstName + ' ' + ld.LastName);
                System.debug('Company Name is ' + ld.Company);
                System.debug('Lead Status is ' + ld.Status);
                System.debug('Contact Number is ' + ld.Phone);
                System.debug('Fax Number is ' + ld.Fax);
                System.debug('Email id.. ' + ld.Email)
            }
        }
    }
}