trigger LeadTrigger on Lead (after Update) {

    /*
    I’ll write the trigger with all four conversion approaches, selectable in one place. Here’s the design:

Approach 1: New Account + new Contact (standard convertLead with no target IDs)
Approach 2: Attach to existing Account + Contact (match by Email or Company name, pass IDs to convertLead)
Approach 3: New Account + new Contact + Opportunity (createOpportunity = true)
Approach 4: Attach to existing Account + new Contact + Opportunity (match Account, create Opportunity)
    */
    List<Lead> toConvert = new List<Lead>();

    for(Lead newLead : trigger.New){
        Lead oldLead = trigger.OldMap.get(newLead.Id);

        Boolean statusChanged = newLead.Status != oldLead.Status;
        Boolean nowClosedConverted = newLead.Status == 'Closed - Converted';
        Boolean notAlreadyConverted = !newLead.isConverted;

        if(statusChanged && nowClosedConverted && notAlreadyConverted){
            toConvert.add(newLead);
        }
    }

    if(!toConvert.isEmpty()){
        LeadConversionService.convertLeads(toConvert);
    }

}