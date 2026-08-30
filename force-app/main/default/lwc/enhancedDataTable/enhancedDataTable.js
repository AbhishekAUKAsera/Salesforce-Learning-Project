import LightningDatatable from 'lightning/datatable';
import customImage from './customImage.html';

export default class EnhancedDataTable extends LightningDatatable {
    static customTypes = {
        customImage : {
            template : customImage,
            typeAttributes : ['title']
        }
    };
    /*
    In the above code, we have a static property customTypes that registers a custom column type called customImage for the datatable.

In this section, we customize the datatable with static customTypes = { customImage: { template: customImage, typeAttributes: [‘title’] } };. The static customTypes property defines a new column type called customImage.
It uses template: customImage to link to the imported customImage.html file for rendering an image and typeAttributes: [‘title’], which enables the data table to display a customImage column for images.
    */
}