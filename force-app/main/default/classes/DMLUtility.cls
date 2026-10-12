/**
 * @description Utility class for performing DML operations on Salesforce records.
 */
public with sharing class DMLUtility {

    /**
     * @description Deletes Contacts whose LastName starts with the given character.
     * Only records the running user can access are queried and deleted.
     * @param startingChar The first character(s) of the Contact LastName to match.
     */
    public static void removeContactsByStartingChar(String startingChar) {
        if (startingChar != null && startingChar != '') {
            startingChar += '%';

            List<Contact> contactsToRemove = [
                SELECT Id, LastName
                FROM Contact
                WHERE LastName LIKE :startingChar
                WITH USER_MODE
            ];
            if (!contactsToRemove.isEmpty()) {
                Database.DeleteResult[] deletedRecordsList =
                    Database.delete(contactsToRemove, false, AccessLevel.USER_MODE);
            }
        }
    }
}