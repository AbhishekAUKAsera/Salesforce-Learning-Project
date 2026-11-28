/**
 * @description Iterator over Opportunity aggregate results, grouped by AccountId.
 *              Holds the summed Amount per Account so that a batch job can consume
 *              the aggregates chunk by chunk.
 */
global class AggregateResultIterator implements Iterator<AggregateResult>{
   
    /** @description Opportunity aggregates grouped by AccountId, with the summed Amount as 'total'. */
    private List<AggregateResult> results = [SELECT AccountId, Sum(Amount) total FROM Opportunity WHERE AccountId != null GROUP By AccountId];

    /** @description Current position in the results list. */
    private integer index = 0;

    /**
     * @description Checks whether more aggregate results remain to be read.
     * @return True when the current index is still inside the results list.
     */
    global boolean hasNext(){
        return index < results.size();
    }

    /**
     * @description Returns the aggregate result at the current position and advances the index.
     * @return The next AggregateResult in the results list.
     */
    global AggregateResult next(){
        return results[index++];
    }
} 