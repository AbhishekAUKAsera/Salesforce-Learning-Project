public class AccountsHelper {
    public void CreateNewAccount(){
        Account acc = new Account();
        acc.Name = 'Apex Account Record';
        acc.Rating = 'Cold';
        acc.Industry = 'Energy';
        acc.AnnualRevenue = 760039;
        acc.Type = 'Installation Partner';
        acc.Phone = '9973930331';
        acc.Fax = '7683920210';
        acc.Website = 'www.gmail.com';
        acc.BillingCity = 'San Frasciso';
        acc.Active__c = 'Yes';
        
        insert acc;
        
        if(acc.Id != null){
            System.debug('Account Record inserted Successfully with id ' + acc.Id);
            
            Case cs = new Case();
            cs.Subject = 'Unable to log in';
            cs.Description = 'Customer reports an error when logging in to the portal.';
            cs.Priority = 'Medium';
            cs.Status = 'New';
            cs.Origin = 'Web';
            
            cs.AccountId = acc.Id;
            
            insert cs;
            if(cs.Id != null){
             	System.debug('Created Case Id: ' + cs.Id);   
            }
        }
    }
}