/**
 * Queueable Apex class that processes Account records and updates their Rating to 'Hot'.
 * Implements the Finalizer interface to handle job completion and retry logic.
 */
public with sharing class AccountRatingProcessor implements Queueable, Finalizer {

    /** List of Account IDs to process */
    private List<Id> accountIds;

    /**
     * Constructor that initializes the processor with a list of Account IDs.
     * @param accountIds List of Account IDs to be processed
     */
    public AccountRatingProcessor(List<Id> accountIds){
        this.accountIds = accountIds;
    }

    /**
     * Executes the queueable job to update Account ratings.
     * Attaches this class as a finalizer to handle post-execution logic.
     * @param context The QueueableContext for the current job execution
     */
    public void execute(QueueableContext context) {

        // Attach the Same class as Finalizer
        System.attachFinalizer(this);
        
        List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN : accountIds];

        for(Account acc : accounts){
            acc.Rating = 'Hot';
        }
        update accounts;

    }

    /**
     * Finalizer callback executed after the queueable job completes.
     * Handles success logging and automatic retry on unhandled exceptions.
     * @param fc The FinalizerContext containing the parent job result
     */
    public void execute(FinalizerContext fc) {
        if (fc.getResult() == ParentJobResult.SUCCESS) {
           System.debug('Account Rating Updated Successfully');
        } else if(fc.getResult() == ParentJobResult.UNHANDLED_EXCEPTION){
            System.debug('Queueable failed. Retrying job...');

            System.enqueueJob(new AccountRatingProcessor(accountIds));
        }
    }
}
