/**
 * @description Handler class for Account trigger events. Delegates field updates to
 * AccountTriggerHelper and creates follow-up Tasks for newly inserted Accounts.
 */
public with sharing class AccountTriggerHandler {

    /**
     * @description Handles the before insert trigger context by updating the shipping address
     * on the incoming Accounts.
     *
     * @param accountList The list of Account records being inserted.
     */
    public static void handleBeforeInsert(List<Account> accountList) {
        AccountTriggerHelper.updateAccountShippingAddress(accountList);
    }

    /**
     * @description Handles the before update trigger context by updating the shipping address
     * on the modified Accounts.
     *
     * @param accountList The list of Account records being updated.
     */
    public static void handleBeforeUpdate(List<Account> accountList) {
        AccountTriggerHelper.updateAccountShippingAddress(accountList);
    }

    /**
     * @description Handles the after insert trigger context by creating a follow-up Task
     * for each inserted Account. The Task is assigned to the Account owner and due in 7 days.
     * Task creation is skipped if the running user does not have create access to Task.
     *
     * @param accountList The list of Account records that were inserted.
     */
    public static void handleAfterInsert(List<Account> accountList) {

        List<Task> taskRecordToInsertList = new List<Task>();

        for (Account acc : accountList) {
            Task t = new Task();
            t.Subject = 'Created From Apex Trigger';
            t.Description = 'Created From Apex Trigger';
            t.Status = 'Not Started';
            t.Priority = 'High';
            t.ActivityDate = System.today().addDays(7);
            t.WhatId = acc.Id;
            t.OwnerId = acc.OwnerId;
            taskRecordToInsertList.add(t);
        }

        if (!taskRecordToInsertList.isEmpty() && Schema.sObjectType.Task.isCreateable()) {
            insert taskRecordToInsertList;
        }
    }

    /**
     * @description Handles the after update trigger context. No logic is currently required
     * for this context; this method is a placeholder for future after-update behavior.
     */
    public static void handleAfterUpdate() {
        return;
    }
}