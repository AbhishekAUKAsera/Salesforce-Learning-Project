public with sharing class MixedDmlExceptionTestClass {
    
    public static void DoDMLOperations(){

        User u = [SELECT Id, Username, IsActive FROM User Where username = 'ishukrs75@ravan.com' Limit 1];
        if(u != null){
            System.debug('User Record is ' + u);
            u.isActive = false;
            update u; 

            System.debug('User record updated successfully is ' + u);
        }

        Account acc = [SELECT Id, Name, rating, AnnualRevenue FROM Account Limit 1];
        if(acc != null){
            acc.AnnualRevenue = 69669696;

            update acc;

            System.debug('Account Record updated Successfully is  ' + acc);
        }
    }
}