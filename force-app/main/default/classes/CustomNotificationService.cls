/**
 * @description Sends custom notifications to case owners when a case is escalated.
 * Notifications are only sent to cases owned by a User (key prefix 005); queue-owned
 * cases are skipped.
 */
public with sharing class CustomNotificationService {

    /**
     * @description Sends an escalation notification for each case in the given set
     * whose owner is a User.
     *
     * @param caseIds                 Set of Case record Ids to notify about.
     * @param notifTypeDeveloperName  DeveloperName of the CustomNotificationType to use.
     */
    public static void sendCaseEscalationNotification(Set<Id> caseIds, String notifTypeDeveloperName) {

        if (caseIds == null || caseIds.isEmpty()) {
            return;
        }

        List<CustomNotificationType> notifTypes = [
            SELECT Id
            FROM CustomNotificationType
            WHERE DeveloperName = :notifTypeDeveloperName
            WITH USER_MODE LIMIT 1];

        if (notifTypes.isEmpty()) {
            System.debug(LoggingLevel.ERROR, 'Custom Notification Type Nahi Mila ' + notifTypeDeveloperName);
        }
        Id notifTypeId = notifTypes[0].Id;

        List<Case> lstCases = [
            SELECT Id, CaseNumber, OwnerId
            FROM Case
            WHERE Id IN :caseIds
            WITH USER_MODE
        ];

        Id senderId = UserInfo.getUserId();

        for (Case cs : lstCases) {
            if (!String.valueOf(cs.OwnerId).startsWith('005')) {
                System.debug('Case Owner Can be Queue as well, Skip ' + cs.CaseNumber);
                continue;
            }

            Messaging.CustomNotification notif = new Messaging.CustomNotification();
            notif.setTitle('Case got Escalated !!');
            notif.setBody('Case ' + cs.CaseNumber + ' Ki Details check karein');
            notif.setNotificationTypeId(notifTypeId);
            notif.setSenderId(senderId);
            notif.setTargetId(cs.Id);

            try {
                notif.send(new Set<String> { String.valueOf(cs.OwnerId) });
            } catch (Exception e) {
                System.debug(LoggingLevel.ERROR, 'Failed to send notification for Case ' + cs.CaseNumber + ': ' + e.getMessage());
            }
        }
    }
}