/**
 * @description Iterable wrapper around AggregateResultIterator, used as the start()
 *              scope of a batch job that works on Opportunity aggregates.
 */
Global class AggregateResultIterable implements Iterable<AggregateResult>{
    
    /**
     * @description Creates a new iterator over the Opportunity aggregate results.
     * @return A new AggregateResultIterator instance.
     */
    global Iterator<AggregateResult> iterator(){
        return new AggregateResultIterator();
    }
}