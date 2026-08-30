/**
 * @description Controller class responsible for fetching available currencies 
 *              from an external currency API (Frankfurter app).
 * @group Controllers
 * @author Abhishek Kasera
 * @since 2026
 */
public with Sharing class CurrencyController {
    /**
     * @description Makes a GET request to the Frankfurter API to retrieve a list 
     *              of all supported currencies. Designed to be called from Lightning 
     *              Web Components (LWC) with caching enabled.
     * @return String The JSON response body containing currency codes and names if successful; 
     *         otherwise, returns null if the HTTP status code is not 200.
     * @example
     * // Called from LWC JS:
     * // import getCurrencies from '@salesforce/apex/CurrencyController.getCurrencies';
     */
    @AuraEnabled(cacheable=true)
    public static List<String> getCurrencies() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://api.frankfurter.app/currencies');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        List<String> currencyList = new List<String>();
        if (response.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            for (String key : result.keySet()) {
                currencyList.add(key);
            }
        }
        return currencyList;
    }
}