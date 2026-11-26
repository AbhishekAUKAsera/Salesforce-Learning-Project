public with sharing class PricingUtils {
    
    // Customers CAN call this from their own code in their org
    @NamespaceAccessible
    public static Decimal calculateDiscount(Decimal amount, String stageName){
            if(stageName == 'Closed Won'){
                return amount * 0.10;
            }
            return 0;
    }

     // Customers CANNOT call this. It stays internal to your package.
    private static void recalculateInternalLedger(Id oppId) {
        // Your proprietary logic here
    }
}