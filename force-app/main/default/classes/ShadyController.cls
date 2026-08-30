public with sharing class ShadyController {
    @AuraEnabled
    public static String whatsMyName(){
        return 'My Name is Slim Shady!';
    }
}