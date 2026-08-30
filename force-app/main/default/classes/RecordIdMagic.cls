/**
 * @description A utility class that provides dynamic operations based on Salesforce Record IDs. 
 *              It includes methods to identify the SObject type of a given ID and to dynamically 
 *              retrieve records.
 * @author      Abhishek Kasera
 * @date        2026-08-21
 * @group       Utility
 */
public with sharing class RecordIdMagic {
    /**
        * @description This method retrieves a record based on the ID.
        * @param recordId The ID of the record to retrieve.
        * @return Returns Name of Sobject if successful.
    */
    public String getObjectType(Id recordId){
        return recordId.getSobjectType().getDescribe().getName();
    }
    /**
        * @description This method retrieves a record based on the ID.
        * @param recordId The ID of the record to retrieve.
        * @return Returns Sobject if successful.
    */
    public sobject getRecord(Id recordId){
        String objectType = recordId.getSobjectType().getDescribe().getName();

    }
}