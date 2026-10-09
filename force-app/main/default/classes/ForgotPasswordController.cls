/**
 * @description An apex page controller that exposes the site forgot password functionality
 */
public with sharing class ForgotPasswordController {

    /**
     * @description The username entered by the user on the forgot password page
     */
    public String username { get; set; }

    /**
     * @description Sends a password reset request for the entered username and
     * redirects to the confirmation page when the request succeeds.
     * @return PageReference to the ForgotPasswordConfirm page on success, otherwise null
     */
    public PageReference forgotPassword() {
        Boolean success = Site.forgotPassword(username);
        PageReference pr = Page.ForgotPasswordConfirm;
        pr.setRedirect(true);

        if (success) {
            return pr;
        }
        return null;
    }
}