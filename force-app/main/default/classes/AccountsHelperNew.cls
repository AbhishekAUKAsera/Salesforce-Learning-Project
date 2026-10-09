public class AccountsHelperNew {

    public void CreateAccountRecord(){
        Account acc = new Account();
        acc.Name = 'Parent Account Record';
        acc.Rating = 'Warm';
        acc.Industry = 'Engineering';
        acc.AnnualRevenue = 908900;
        acc.Type = 'Channel Partner / Reseller';
        acc.Ownership = 'Subsidiary';
        acc.Phone = '67393933443';
        acc.Fax = '364839393939';
        acc.Active__c = 'No';
        acc.CustomerPriority__c = 'Medium';
        acc.Website = 'www.gmail.com';
        
        insert acc;
        
        if(acc.Id != null){
            System.debug('Account record inserted with id ' + acc.Id);
            CreateRelatedCase(acc.Id);
        }
    }
    public static void CreateRelatedCase(Id accId){
        Case cs = new Case();
        cs.Status = 'New';
        cs.Priority = 'Low';
        cs.Origin = 'Email';
        cs.Type = 'Structural';
        cs.Reason = 'Breakdown';
        cs.Subject = 'My Water RO is not working';
        cs.Description = 'Dear Customer Support, I am unable to fix the RO find someone else';
        
        cs.AccountId = accId;
        
        insert cs;
        
        if(cs.Id != null){
            System.debug('Case record is ' + cs.Id);
        }
    }
}