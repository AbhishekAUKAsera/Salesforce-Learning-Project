/**
 * @description Deactivates a named User and updates an Account in user mode.
 */
public with sharing class MixedDmlExceptionTestClass {

    /**
     * @description Executes the User and Account updates with CRUD/FLS enforcement.
     */
    public static void doDmlOperations() {
        List<User> users = [
            SELECT Id, Username, IsActive
            FROM User
            WHERE Username = 'ishukrs75@ravan.com'
            WITH USER_MODE
            LIMIT 1
        ];
        if (!users.isEmpty()) {
            User u = users[0];
            System.debug('User Record is ' + u);
            u.IsActive = false;
            update as user u;
            System.debug('User record updated successfully is ' + u);
        }

        List<Account> accounts = [
            SELECT Id, Name, Rating, AnnualRevenue
            FROM Account
            WITH USER_MODE
            LIMIT 1
        ];
        if (!accounts.isEmpty()) {
            Account acc = accounts[0];
            acc.AnnualRevenue = 69669696;
            update as user acc;
            System.debug('Account Record updated Successfully is ' + acc);
        }
    }
}