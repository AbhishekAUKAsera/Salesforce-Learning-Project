/**
 * @description Utility class for common database operations on Lead records.
 */
public with sharing class DatabaseUtility {

/**
 * @description Retrieves all Lead records accessible to the running user
 * and writes their key details to the debug log. Uses user mode so that
 * CRUD and field-level security are enforced.
 */
public static void getAllLeadRecords() {
    List<Lead> lstLeads = [
        SELECT Id, FirstName, LastName, Company, Status, Email, Phone, Fax
        FROM Lead
        WITH USER_MODE
    ];
    System.debug('Collection Size is ' + lstLeads.size());

    if (!lstLeads.isEmpty()) {
        for (Lead ld : lstLeads) {
            System.debug('Lead Id ' + ld.Id);
            System.debug('Lead Name ' + ld.FirstName + ' ' + ld.LastName);
            System.debug('Company Name is ' + ld.Company);
            System.debug('Lead Status is ' + ld.Status);
            System.debug('Contact Number is ' + ld.Phone);
            System.debug('Fax Number is ' + ld.Fax);
            System.debug('Email id.. ' + ld.Email);
        }
    }
}

/**
     * @description Retrieves all User records and writes each one to the debug log.
*/
public static void getUserRecords() {
    for (User u : [SELECT Id, FirstName, LastName, Email, Username, Profile.Name, IsActive FROM User WITH USER_MODE]) {
        System.debug('User Record is ' + u);
    }
}

    /**
 * @description Retrieves all Position__c records and writes their details
 * to the debug log. Uses user mode so that CRUD and field-level security
 * are enforced for the running user.
 */
public static void getPositionDetails() {
    Map<Id, Position__c> mapPositions = new Map<Id, Position__c>([
        SELECT Id, Hiring_Manager__c, Hiring_Manager__r.Name, Location_Name__c,
                Maximum_Pay__c, Milestone_Date__c, Minimum_Pay__c,
                Number_of_Candidates_related_to_this_Pos__c, Name
        FROM Position__c
        WITH USER_MODE
    ]);

    System.debug('Collections size is ' + mapPositions.size());

    if (!mapPositions.isEmpty()) {
        for (Id recordId : mapPositions.keySet()) {
            System.debug('Position Record Id is ' + recordId + '--Record ' + mapPositions.get(recordId));
            System.debug('Position Name is ' + mapPositions.get(recordId).Name);
        }

        for (Position__c p : mapPositions.values()) {
            System.debug('Position record is.. ' + p);
        }
    }
}

/**
    * @description Retrieves positions for the given city and logs each record.
    * @param cityName The location name used to filter Position__c records.
*/
public static void getPositionsbyLocation(String cityName){
    if(cityName != null && cityName != ''){
        List<Position__c> lstPositions = [SELECT Id, Name, Hiring_Manager__c, Location_Name__c, Maximum_Pay__c, Milestone_Date__c,
        Minimum_Pay__c, Number_of_Candidates_related_to_this_Pos__c FROM Position__c WHERE Location_Name__c =: cityName WITH USER_MODE];

        if(!lstPositions.isEmpty()){
            for(Position__c pos :lstPositions ){
                System.debug('Position Record is ' + pos);
            }
        }
    }
}

/**
 * @description Retrieves and logs all Accounts whose Name starts with the given prefix.
 * Respects the running user's CRUD and field-level security.
 * @param startingChar The starting character(s) to match against Account Name.
 */
public static void getAccountsByStartingChar(String startingChar) {
if (String.isNotBlank(startingChar)) {
    String searchKey = startingChar + '%';

    List<Account> lstAccounts = [
        SELECT Id, Name, Rating, Industry, AnnualRevenue, Active__c
        FROM Account
        WHERE Name LIKE :searchKey
        WITH USER_MODE
    ];

    System.debug('Collection size is : ' + lstAccounts.size());

    for (Account acc : lstAccounts) {
        System.debug('Account Record is ' + acc);
    }
}
}
}