/**
 * @description       : Comprehensive test class for AccountController verifying positive, negative,
 *                      edge case, bulk, user mode, and exception handling scenarios.
 * @author            : Abhishek Kasera
 * @last modified on  : 08-30-2026
 **/
@IsTest(isParallel=true)
private class AccountControllerTest {

    @TestSetup
    static void setupTestData() {
        List<Account> testAccounts = new List<Account>();

        // Create 15 accounts to test limit 10 in getAccList and search functionality
        for (Integer i = 1; i <= 15; i++) {
            String accName;
            String industryVal;
            if (i <= 5) {
                accName = 'Apex Tech Corp ' + i;
                industryVal = 'Technology';
            } else if (i <= 10) {
                accName = 'Global Apex Finance ' + i;
                industryVal = 'Banking';
            } else {
                accName = 'Universal Healthcare ' + i;
                industryVal = 'Healthcare';
            }

            testAccounts.add(new Account(
                Name = accName,
                Industry = industryVal,
                Phone = '123-456-789' + i
            ));
        }

        // Add special character account to test search queries with apostrophe / ampersand
        testAccounts.add(new Account(
            Name = 'O\'Reilly & Sons Solutions',
            Industry = 'Consulting',
            Phone = '987-654-3210'
        ));

        insert testAccounts;
    }

    /**
     * @description Verifies getAccList returns up to 10 most recent accounts with expected fields.
     **/
    @IsTest
    static void testGetAccListSuccess() {
        Test.startTest();
        List<Account> result = AccountController.getAccList();
        Test.stopTest();

        Assert.isNotNull(result, 'Result list should not be null');
        Assert.areEqual(10, result.size(), 'Should return a maximum of 10 Account records');

        for (Account acc : result) {
            Assert.isNotNull(acc.Id, 'Account Id should be populated');
            Assert.isNotNull(acc.Name, 'Account Name should be populated');
            Assert.isNotNull(acc.Phone, 'Account Phone should be populated');
        }
    }

    /**
     * @description Verifies getAccList handles exceptions and throws AuraHandledException.
     **/
    @IsTest
    static void testGetAccListException() {
        AccountController.forceException = true;

        Test.startTest();
        try {
            AccountController.getAccList();
            Assert.fail('Expected AuraHandledException was not thrown');
        } catch (AuraHandledException e) {
            Assert.isNotNull(e, 'AuraHandledException caught as expected');
        } finally {
            AccountController.forceException = false;
        }
        Test.stopTest();
    }

    /**
     * @description Verifies getAccountRecordMethod returns exact and partial matching accounts.
     **/
    @IsTest
    static void testGetAccountRecordMethodPartialMatch() {
        Test.startTest();
        List<Account> techResults = AccountController.getAccountRecordMethod('Tech');
        List<Account> apexResults = AccountController.getAccountRecordMethod('Apex');
        Test.stopTest();

        Assert.isNotNull(techResults, 'Tech results should not be null');
        Assert.areEqual(5, techResults.size(), 'Should return 5 accounts matching "Tech"');
        for (Account acc : techResults) {
            Assert.isTrue(acc.Name.contains('Tech'), 'Account name should contain "Tech"');
            Assert.areEqual('Technology', acc.Industry, 'Industry should be Technology');
        }

        Assert.isNotNull(apexResults, 'Apex results should not be null');
        Assert.areEqual(10, apexResults.size(), 'Should return 10 accounts matching "Apex"');
    }

    /**
     * @description Verifies search with leading/trailing whitespace is trimmed and matched correctly.
     **/
    @IsTest
    static void testGetAccountRecordMethodWithWhitespaceTrim() {
        Test.startTest();
        List<Account> result = AccountController.getAccountRecordMethod('   Universal   ');
        Test.stopTest();

        Assert.isNotNull(result, 'Result should not be null');
        Assert.areEqual(5, result.size(), 'Should return 5 accounts matching "Universal"');
    }

    /**
     * @description Verifies getAccountRecordMethod returns empty list for null input.
     **/
    @IsTest
    static void testGetAccountRecordMethodNullInput() {
        Test.startTest();
        List<Account> result = AccountController.getAccountRecordMethod(null);
        Test.stopTest();

        Assert.isNotNull(result, 'Result list should not be null');
        Assert.isTrue(result.isEmpty(), 'Result should be empty when search term is null');
    }

    /**
     * @description Verifies getAccountRecordMethod returns empty list for empty or whitespace-only input.
     **/
    @IsTest
    static void testGetAccountRecordMethodBlankInput() {
        Test.startTest();
        List<Account> emptyResult = AccountController.getAccountRecordMethod('');
        List<Account> whitespaceResult = AccountController.getAccountRecordMethod('     ');
        Test.stopTest();

        Assert.isNotNull(emptyResult, 'Result list should not be null');
        Assert.isTrue(emptyResult.isEmpty(), 'Result should be empty when search term is empty string');

        Assert.isNotNull(whitespaceResult, 'Result list should not be null');
        Assert.isTrue(whitespaceResult.isEmpty(), 'Result should be empty when search term is whitespace only');
    }

    /**
     * @description Verifies getAccountRecordMethod returns empty list when no account matches the keyword.
     **/
    @IsTest
    static void testGetAccountRecordMethodNoMatch() {
        Test.startTest();
        List<Account> result = AccountController.getAccountRecordMethod('NonExistentAccountQueryTermXYZ');
        Test.stopTest();

        Assert.isNotNull(result, 'Result list should not be null');
        Assert.isTrue(result.isEmpty(), 'Result should be empty when no matching account is found');
    }

    /**
     * @description Verifies getAccountRecordMethod handles apostrophes and special characters safely.
     **/
    @IsTest
    static void testGetAccountRecordMethodSpecialCharacters() {
        Test.startTest();
        List<Account> result = AccountController.getAccountRecordMethod('O\'Reilly');
        List<Account> ampersandResult = AccountController.getAccountRecordMethod('& Sons');
        Test.stopTest();

        Assert.isNotNull(result, 'Result should not be null');
        Assert.areEqual(1, result.size(), 'Should find 1 account with apostrophe/special character in name');
        Assert.areEqual('O\'Reilly & Sons Solutions', result[0].Name, 'Account name should match');

        Assert.isNotNull(ampersandResult, 'Ampersand result should not be null');
        Assert.areEqual(1, ampersandResult.size(), 'Should find 1 account with ampersand in name');
    }

    /**
     * @description Verifies getAccountRecordMethod handles exceptions and throws AuraHandledException.
     **/
    @IsTest
    static void testGetAccountRecordMethodException() {
        AccountController.forceException = true;

        Test.startTest();
        try {
            AccountController.getAccountRecordMethod('Apex');
            Assert.fail('Expected AuraHandledException was not thrown');
        } catch (AuraHandledException e) {
            Assert.isNotNull(e, 'AuraHandledException caught as expected');
        } finally {
            AccountController.forceException = false;
        }
        Test.stopTest();
    }

    /**
     * @description Verifies execution under a Standard User profile respecting sharing and USER_MODE
     *              without performing DML on User (to support parallel Apex test execution).
     **/
    @IsTest
    static void testExecutionAsStandardUser() {
        List<User> standardUsers = [
            SELECT Id 
            FROM User 
            WHERE IsActive = true 
              AND Profile.UserType = 'Standard' 
              AND Id != :UserInfo.getUserId() 
            LIMIT 1
        ];

        User runUser = !standardUsers.isEmpty() 
            ? standardUsers[0] 
            : new User(Id = UserInfo.getUserId());

        System.runAs(runUser) {
            Test.startTest();
            List<Account> accList = AccountController.getAccList();
            List<Account> searchList = AccountController.getAccountRecordMethod('Apex');
            Test.stopTest();

            Assert.isNotNull(accList, 'User should be able to query accounts');
            Assert.isNotNull(searchList, 'User should be able to search accounts');
        }
    }
}