/**
 * @description Apex controller for Project Task Lightning components.
 * Provides read access to Project Tasks and allows updating a task's stage.
 */
public with sharing class ProjectTaskController {

    /**
     * @description Retrieves all Project Task records, ordered by due date (earliest first).
     * Marked cacheable so it can be used with Lightning Data Service and wire adapters.
     *
     * @return List of Project_Tasks__c records containing Id, Name, Stage__c and Due_Date__c.
     */
    @AuraEnabled(cacheable=true)
    public static List<Project_Tasks__c> getTasks() {
        return [
            SELECT Id, Name, Stage__c, Due_Date__c, OwnerId, Owner.Name
            FROM Project_Tasks__c WITH USER_MODE
            ORDER BY Due_Date__c ASC
        ];
    }

    /**
     * @description Updates the Stage__c value of a single Project Task.
     *
     * @param taskId   The Id of the Project_Tasks__c record to update.
     * @param newStage The new stage value to assign to the task.
     *
     * @throws AuraHandledException If the task cannot be found or the update fails.
     */
    @AuraEnabled
    public static void updateTaskStage(Id taskId, String newStage) {
        List<Project_Tasks__c> tasks = [
            SELECT Id, Stage__c
            FROM Project_Tasks__c
            WHERE Id = :taskId WITH USER_MODE
            LIMIT 1
        ];

        if (tasks.isEmpty()) {
            throw new AuraHandledException('Project task not found.');
        }

        Project_Tasks__c task = tasks[0];
        task.Stage__c = newStage;

        try {
            Database.update(task, AccessLevel.USER_MODE);
        } catch (DmlException e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}