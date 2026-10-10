/**
 * @description Utility class for common database operations on Lead records.
 */
public with sharing class DatabaseUtility {

    /**
     * @description Retrieves all Lead records accessible to the running user
     * and writes their key details to the debug log. Uses user mode so that
     * CRUD and field-level security are enforced.
     */
    public static void getAllLeadRecords() {
        List<Lead> lstLeads = [
            SELECT Id, FirstName, LastName, Company, Status, Email, Phone, Fax
            FROM Lead
            WITH USER_MODE
        ];
        System.debug('Collection Size is ' + lstLeads.size());

        if (!lstLeads.isEmpty()) {
            for (Lead ld : lstLeads) {
                System.debug('Lead Id ' + ld.Id);
                System.debug('Lead Name ' + ld.FirstName + ' ' + ld.LastName);
                System.debug('Company Name is ' + ld.Company);
                System.debug('Lead Status is ' + ld.Status);
                System.debug('Contact Number is ' + ld.Phone);
                System.debug('Fax Number is ' + ld.Fax);
                System.debug('Email id.. ' + ld.Email);
            }
        }
    }
}