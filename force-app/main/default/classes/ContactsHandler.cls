/**
 * @description Handler class that contains helper methods for working with Contact records.
 */
public with sharing class ContactsHandler {

    /**
     * @description Creates and inserts the requested number of sample Contact records.
     * The insert runs in user mode, so the running user's CRUD, FLS and sharing
     * permissions are enforced.
     * @param noOfContacts The number of Contact records to create. Values of 0 or less create nothing.
     */
    public static void insertBulkContacts(Integer noOfContacts) {

        List<Contact> lstContacts = new List<Contact>();

        if (noOfContacts > 0) {
            for (Integer counter = 1; counter <= noOfContacts; counter++) {
                Contact con = new Contact();

                con.FirstName = 'Apex';
                con.LastName = 'Contact ~ ' + counter;
                con.Email = 'apexcontact' + counter + '@gmail.com';
                con.Title = 'Sales Representative';
                con.Department = 'Sales';
                con.Phone = '7125689033';
                con.Fax = '9103004000';
                con.MobilePhone = '9384900365';
                con.MailingCity = 'Hyderabad';
                con.MailingState = 'Telangana';

                lstContacts.add(con);
            }

            if (!lstContacts.isEmpty()) {
                insert as user lstContacts;
            }
        }
    }
}