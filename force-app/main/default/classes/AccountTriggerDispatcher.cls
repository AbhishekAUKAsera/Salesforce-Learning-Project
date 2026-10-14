/**
 * @description Routes Account trigger context operations to the appropriate
 *              AccountTriggerHandler methods.
 */
public with sharing class AccountTriggerDispatcher {

    /**
     * @description Dispatches the Account trigger logic based on the current
     *              trigger operation type.
     * @param operationType The System.TriggerOperation of the current trigger
     *                      execution (for example, BEFORE_INSERT or AFTER_UPDATE).
     */
    public static void dispatch(System.TriggerOperation operationType) {
        switch ON operationType {
            WHEN BEFORE_INSERT {
                AccountTriggerHandler.handleBeforeInsert(Trigger.new);
            }
            WHEN BEFORE_UPDATE {
                AccountTriggerHandler.handleBeforeUpdate(Trigger.new);
            }
            WHEN BEFORE_DELETE {
                System.debug(LoggingLevel.DEBUG, 'AccountTriggerDispatcher: BEFORE_DELETE received. No handler implemented yet.');
            }
            WHEN AFTER_INSERT {
                AccountTriggerHandler.handleAfterInsert(Trigger.new);
            }
            WHEN AFTER_UPDATE {
                AccountTriggerHandler.handleAfterUpdate();
            }
            WHEN AFTER_DELETE {
                System.debug(LoggingLevel.DEBUG, 'AccountTriggerDispatcher: AFTER_DELETE received. No handler implemented yet.');
            }
            WHEN AFTER_UNDELETE {
                System.debug(LoggingLevel.DEBUG, 'AccountTriggerDispatcher: AFTER_UNDELETE received. No handler implemented yet.');
            }
            WHEN ELSE {
                System.debug(LoggingLevel.DEBUG, 'AccountTriggerDispatcher: Unhandled operation type: ' + operationType);
            }
        }
    }
}