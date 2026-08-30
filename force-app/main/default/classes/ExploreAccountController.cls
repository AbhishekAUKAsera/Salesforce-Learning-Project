public with sharing class ExploreAccountController {
    
    public ExploreAccountController(){
    }

    //IF we send Array in LWC then it wil be received as a List in Apex, Likewise if we send an object in LWC thenit will be received as a Map in the Apex method.

    @AuraEnabled(cacheable=true)
    public static List<Account> fetchAccounts(String searchText, List<String> accArray, Map<Object, String> accNameIndustriesMap){

       String wildCharSearchText = '%' + searchText + '%';

       return [SELECT Id, Name, Industry, Rating FROM Account WHERE Name LIKE : wildCharSearchText];
    }
}