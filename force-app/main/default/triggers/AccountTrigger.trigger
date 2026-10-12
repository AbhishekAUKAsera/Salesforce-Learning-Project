trigger AccountTrigger on Account (after insert, after update) {

    if(TriggerHandler.isBatchRunning){
        return;
    }
    Set<Id> idsToProcess = new Set<Id>();
    for(Account acc : Trigger.New){
        //Only Process when record is inserted or When Industry changed
        if(Trigger.isInsert || acc.Industry != Trigger.oldMap.get(acc.Id).Industry){
            idsToProcess.add(acc.Id);
        }
    }
    if(!idsToProcess.isEmpty()){
        TriggerHandler.isBatchRunning = true;
        Database.executeBatch(new AccountUpdateBatch(idsToProcess), 200);
    }

}