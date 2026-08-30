import { LightningElement, wire} from 'lwc';
import fetchRecords from '@salesforce/apex/CsvController.fetchRecords';

const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' }
];

export default class CsvComponent extends LightningElement {

    columns = columns;
    accountData = [];
    @wire(fetchRecords) wiredFunction({data, error}){
        if(data){
            this.accountData = data;
            console.log('Account Data ' + JSON.stringify(this.accountData));
        }else if(error){
            console.log('Error is ' + error);
        }
    }

    get checkRecord(){
        return this.accountData.length > 0 ? false : true;
    }

    clickHandler(){
        //Get the records or rows selected on lightning datatable
        let selectedRows = [];
        let downloadRecords = [];
        selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        console.log('SELECTED ROWS ' + JSON.stringify(selectedRows));
        //if records are not selected then download all records in table..
        if(selectedRows.length > 0){
            downloadRecords = [...selectedRows];
            console.log('DOWNLOAD RECORDS IN IF ' + JSON.stringify(downloadRecords));
            /*
            [{"Id":"001g700000d7ERBAA2","Name":"Edge Communications","Website":"http://edgecomm.com","Industry":"Electronics","Phone":"(512) 757-6000"},{"Id":"001g700000d7ERCAA2","Name":"Burlington Textiles Corp of America","Website":"www.burlington.com","Industry":"Apparel","Phone":"8903638021"}]
            */
        }else {
            downloadRecords = [...this.accountData];
            console.log('DOWNLOAD RECORDS IN ELSE ' + JSON.stringify(downloadRecords));
        }
                        //convert array into csv
        let csvFile = this.convertArrayToCsv(downloadRecords);
        this.createLinkForDownload(csvFile);
    }
    convertArrayToCsv(downloadRecords){
        let csvHeader = Object.keys(downloadRecords[0]).toString(); //We can use join method as well
        console.log('CSV Header ' + JSON.stringify(csvHeader)); //CSV Header "Id,Name,Website,Industry,Phone"
        let csvBody = downloadRecords.map(currItem => Object.values(currItem).toString());
        console.log('CSV Body ' + JSON.stringify(csvBody)); //CSV Body ["001g700000d7ERBAA2,Edge Communications,http://edgecomm.com,Electronics,(512) 757-6000","001g700000d7ERCAA2,Burlington Textiles Corp of America,www.burlington.com,Apparel,8903638021"]
        let csvfile = csvHeader + '\n' + csvBody.join('\n');
        return csvfile;
    }
    createLinkForDownload(csvFile){
        const downLink = document.createElement('a');
        downLink.href = 'data:text/csv;charset=utf-8,'+encodeURI(csvFile);
        downLink.target = '_blank';
        downLink.download = 'Account_Data.csv';
        downLink.click(); //with the help of which file will be downloaded.
    }
}