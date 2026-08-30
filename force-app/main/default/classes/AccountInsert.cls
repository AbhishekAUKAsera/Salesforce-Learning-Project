public with sharing class AccountInsert {
   @AuraEnabled
   public static void insertAcc(account acc){
    try {
        insert acc;
        System.debug('ACC ' + acc);
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
   }
}