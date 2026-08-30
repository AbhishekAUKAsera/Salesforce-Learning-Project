/**
 * @description Controller class to demonstrate returning various Map data structures 
 *              (Simple Map, List of Maps, and Nested Maps) to Lightning Web Components (LWC) or Aura.
 * @author      [Your Name]
 * @date        2026-08-22
 */
public with sharing class ApexMapController {
    /**
     * @description Fetches a simple key-value pair map containing strings.
     * @return      `Map<String, String>` A map containing sample fruit and vegetable data.
     * @example
     * // Expected Output: {'Fruit' => 'Apple', 'Vegetable' => 'Potato'}
     */
    @AuraEnabled
    public static Map<String, String> fetchSimpleMap(){
       try{
        Map<String, String> simpleMap = new Map<String, String>();
        simpleMap.put('Fruit', 'Apple');
        simpleMap.put('Vegetable', 'Potato');
        return simpleMap;
       }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
       }
    }

    /**
     * @description Fetches a list containing multiple string-based map structures.
     * @return      `List<Map<String, String>>` A list of maps, where each map contains a fruit and a vegetable.
     * @example
     * // Expected Output: [{'fruit' => 'apple', 'vegetable' => 'potato'}, {'fruit' => 'mango', 'vegetable' => 'Cabbage'}]
     */
    @AuraEnabled
    public static List<Map<String, String>> fetchListMap(){
        try {
            List<Map<String, String>> lstofMap = new List<Map<String, String>>();

            Map<String, String> simpleMap1 = new Map<String, String>();
            simpleMap1.put('fruit', 'apple');
            simpleMap1.put('vegetable', 'potato');
            lstofMap.add(simpleMap1);

            Map<String,String> simpleMap2 = new Map<String,String>();
            simpleMap2.put('fruit','mango');
            simpleMap2.put('vegetable','Cabbage');
            lstofMap.add(simpleMap2);

            return lstofMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    /**
     * @description Fetches a nested map structure where the primary key maps to another map.
     * @return      `Map<String, Map<String, String>>` A map containing string keys mapped to inner string maps.
     * @example
     * // Expected Output: {'map1' => {'fruit' => 'apple', 'vegetable' => 'potato'}}
     */
    @AuraEnabled
    public static Map<String,Map<String,String>> fetchNestedMap(){
        try { 
            Map<String,Map<String,String>> nestedMap = new Map<String,Map<String,String>>();
            Map<String,String> simpleMap1 = new Map<String,String>();
            simpleMap1.put('fruit','apple');
            simpleMap1.put('vegetable','potato');
            nestedMap.put('map1',simpleMap1);
            return nestedMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}