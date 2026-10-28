trigger CaseTrigger on Case (after update) {
    Set<Id> escalatedCaseIds  = new Set<Id>();

    for(Case c : Trigger.New){
        Case oldCase = Trigger.oldMap.get(c.Id);
        if(c.Status == 'Escalated' && oldCase.Status != 'Escalated'){
            escalatedCaseIds.add(c.Id);
        }
    }
    if(!escalatedCaseIds.isEmpty()){
        CustomNotificationService.sendCaseEscalationNotification(escalatedCaseIds, 'CustomNotification');
    }
}