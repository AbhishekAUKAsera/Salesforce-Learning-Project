/**
 * @description Queueable job that stamps a fixed description onto the Account
 * records whose Ids are supplied at construction time.
 */
public with sharing class AccountUpdater implements Queueable {
    private List<Id> accountIds;

    /**
     * @description Creates the job for a set of Account records.
     * @param accountIds The Ids of the Accounts to process.
     */
    public AccountUpdater(List<Id> accountIds) {
        this.accountIds = accountIds;
    }

    /**
     * @description Queries the target Accounts and sets their Description to
     * "Processed By Queueable", then saves the changes.
     * @param context The QueueableContext supplied by the Apex runtime.
     */
    public void execute(QueueableContext context) {
        List<Account> accList = [SELECT Id, Description FROM Account WHERE Id IN :accountIds];
        for (Account acc : accList) {
            acc.Description = 'Processed By Queueable';
        }
        update accList;
    }
}