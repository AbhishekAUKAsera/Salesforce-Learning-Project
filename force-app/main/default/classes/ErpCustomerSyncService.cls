/**
 * Service class for syncing Account records to the ERP system.
 * Performs asynchronous callouts to create customers in ERP and updates
 * the local Account with the returned ERP customer ID.
 */
public with sharing class ErpCustomerSyncService {
    
    //---------OUTBOUND DTO : Salesforce --> ERP ----------
    // Apex Builds this and serializes it. Apex never reads it back from JSON
    /**
     * Payload DTO for outbound ERP customer creation.
     * Serialized to JSON and sent to ERP; never deserialized.
     */
    class ErpCustomerPayload {
        public String externalId;
        public String customerName;
        public String billingCity;
        public String billingCountry;
        public String ownerEmail;
    }

    //---------OUTBOUND DTO : Salesforce --> ERP ----------
    // Apex Builds this and serializes it. Apex never reads it back from JSON

    /**
     * Response DTO for inbound ERP sync response.
     * Deserialized from JSON returned by ERP; never serialized.
     */
    class ErpSyncResponse {
        public String erpCustomerId;
        public String status;
        public String errorMessage;
    }

    //---------OUTBOUND DTO : Salesforce --> ERP ----------
    // Apex Builds this and serializes it. Apex never reads it back from JSON
    /**
     * Asynchronously syncs the given Accounts to the ERP system.
     * For each Account, sends a create-customer callout to ERP.
     * On success, updates the Account with the returned ERP customer ID.
     *
     * @param accountIds Set of Account Ids to sync
     */
    @Future(callout=true)
    public static void syncAccounts(Set<Id> accountIds) {
        // Validate CRUD permission before SOQL query
        if (!Schema.sObjectType.Account.isAccessible()) {
            System.debug(LoggingLevel.ERROR, 'Insufficient permissions to read Account records');
            return;
        }
        List<Account> accounts = [SELECT Id, Name, BillingCity, BillingCountry, Owner.Email, ERP_Customer_Id__c, Internal_Margin__c FROM Account WHERE Id IN : accountIds];

        List<Account> toUpdate = new List<Account>();

        for(Account acc : accounts){
            ErpCustomerPayload payload = new ErpCustomerPayload();
            payload.externalId = acc.Id;
            payload.customerName = acc.Name;
            payload.billingCity = acc.BillingCity;
            payload.billingCountry = acc.BillingCountry;
            payload.ownerEmail = acc.Owner.Email;

            HttpRequest req = new HttpRequest();
            req.setEndPoint('callout:ERP_API/customers');
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setTimeout(20000);
            req.setBody(JSON.serialize(payload)); 
        HttpResponse res = new Http().send(req);

            if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
                // JSON -> Apex (deserializable='always')
                ErpSyncResponse erp = (ErpSyncResponse)
                    JSON.deserialize(res.getBody(), ErpSyncResponse.class);

                acc.ERP_Customer_Id__c = erp.erpCustomerId;
                toUpdate.add(acc);
            } else {
                System.debug(LoggingLevel.ERROR,
                    'ERP sync failed for ' + acc.Id + ': ' + res.getStatusCode() + ' ' + res.getBody());
            }
        }

        // DML happens after all callouts. Salesforce does not allow a callout
        // after uncommitted DML in the same transaction, so this order matters.
        if (!toUpdate.isEmpty()) {
            // Validate CRUD permission before DML
            if (Schema.sObjectType.Account.isUpdateable()) {
                update toUpdate;
            } else {
                System.debug(LoggingLevel.ERROR, 'Insufficient permissions to update Account records');
            }
        }
    }
}