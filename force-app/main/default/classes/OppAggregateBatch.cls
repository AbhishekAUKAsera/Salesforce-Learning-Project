/**
 * @description Batch job that rolls up Opportunity Amount per Account and writes the
 *              summed value to the Total_Opp_Amount__c field on each Account.
 */
Global class OppAggregateBatch implements Database.Batchable<AggregateResult> {

    /**
     * @description Supplies the batch its input: the iterable of Opportunity aggregates.
     * @param bc The batchable context provided by the platform.
     * @return An iterable over the AccountId-grouped Opportunity aggregates.
     */
    global Iterable<AggregateResult> start(Database.BatchableContext bc){
        return new AggregateResultIterable();
    }

    /**
     * @description Updates Total_Opp_Amount__c on each Account in the current chunk with
     *              the Opportunity Amount total for that Account.
     * @param bc    The batchable context provided by the platform.
     * @param scope The chunk of aggregate results to process.
     */
    global void execute(Database.BatchableContext bc, List<AggregateResult> scope){
        List<Account> accsToUpdate = new List<Account>();
        for(AggregateResult ar : scope){
            accsToUpdate.add(new Account(Id = (Id)ar.get('AccountId'), Total_Opp_Amount__c=(Decimal) ar.get('total')));
        }
        update accsToUpdate;
    }


}