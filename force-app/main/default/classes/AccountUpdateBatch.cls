/**
 * @description Batch job that stamps a timestamped description on each Account
 *              in the supplied set of Account Ids.
 */
public with sharing class AccountUpdateBatch implements Database.Batchable<SObject>, Database.Stateful {

    /** @description Running count of Account records processed across all batch chunks. */
    private Integer processedCount = 0;

    /** @description Ids of the Accounts to be updated by this batch. */
    private Set<Id> accountIds;

    /**
     * @description Constructs the batch with the Account Ids to process.
     * @param accountIds The set of Account Ids to update.
     */
    public AccountUpdateBatch(Set<Id> accountIds) {
        this.accountIds = accountIds;
    }

    /**
     * @description Builds the query locator that defines the records in scope.
     * @param bc The batchable context provided by the platform.
     * @return A QueryLocator selecting the target Accounts.
     */
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            [SELECT Id, Name, Description FROM Account WHERE Id IN :accountIds]
        );
    }

    /**
     * @description Updates the Description of each Account in the current chunk.
     * @param bc    The batchable context provided by the platform.
     * @param scope The chunk of Accounts to process.
     */
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            acc.Description = 'Updated by AccountUpdateBatch Class on ' + Datetime.now();
        }
        update scope;
        processedCount += scope.size();
    }

    /**
     * @description Logs the total number of Accounts processed once the batch completes.
     * @param bc The batchable context provided by the platform.
     */
    public void finish(Database.BatchableContext bc) {
        System.debug('Batch finished. Total processed: ' + processedCount);
    }
}