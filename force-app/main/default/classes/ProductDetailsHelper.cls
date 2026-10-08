/**
 * @description Helper class that stores product details and prints them to the debug log.
 */
public with sharing class ProductDetailsHelper {
    private Integer productCode;
    private String productName;
    private String manufacturer;
    private Decimal unitPrice;
    private Date manufacturedDate;
    private Date expiryDate;

    /**
     * @description Creates a helper holding the details of one product.
     * @param pCode Unique product code
     * @param pName Name of the product
     * @param pManufacturer Name of the manufacturer
     * @param pPrice Price per unit
     * @param pmDate Date the product was manufactured
     * @param peDate Date the product expires
     */
    public ProductDetailsHelper(
        Integer pCode,
        String pName,
        String pManufacturer,
        Decimal pPrice,
        Date pmDate,
        Date peDate
    ) {
        productCode = pCode;
        productName = pName;
        manufacturer = pManufacturer;
        unitPrice = pPrice;
        manufacturedDate = pmDate;
        expiryDate = peDate;
    }

    /**
     * @description Writes the product details to the debug log.
     */
    public void showProductsInfo() {
        System.debug('Product Code is ' + productCode);
        System.debug('Product Name is ' + productName);
        System.debug('Manufacturer is ' + manufacturer);
        System.debug('Unit Price is ' + unitPrice);
        System.debug('Manufactured Date is ' + manufacturedDate);
        System.debug('Expiry Date is ' + expiryDate);
    }
}