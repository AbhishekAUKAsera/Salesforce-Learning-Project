import { LightningElement } from 'lwc';
import getCurrencies from '@salesforce/apex/CurrencyController.getCurrencies';
export default class ConvertCurrency extends LightningElement {

    showOutput = false;
    convertedValue='';
    fromCurrency='';
    toCurrency='';
    enteredAmount='';
    currencyOptions = [];

    connectedCallback(){
        this.fetchSymbols();
    }

    changeHandler(event){
        //destructuring the element
        let{name, value} = event.target;
        if(name === 'amount'){
            this.enteredAmount = value;
        }
        if(name === 'fromcurr'){
            this.fromCurrency = value;
        }
        if(name === 'tocurr'){
            this.toCurrency = value;
        }
    }
    clickHandler(){
        this.conversion();
    }

    async fetchSymbols(){
        //LWC JS CODE:::::
       /*let endpoint = 'https://api.frankfurter.app/currencies';
        try{
            let response = await fetch(endpoint);
            if(!response.ok){
                throw new Error('Network response was not OK');
            }
            const data = await response.json();
            //process the data returned from api
            let options = [];
            for(let symbol in data){
                options = [...options, {label : symbol, value : symbol}]
            } 
            this.currencyOptions = [...options];
        }catch(error){
            console.log('Error ' , error);
        }*/

        //APEX SIDE CODE
        getCurrencies()
        .then(result => {
            console.log('Result in fetch Symbols ' + result);
        })
        .catch(error => {
            console.log('Error ' , error);
        });
    }

    async conversion(){
        let endpoint = `https://api.frankfurter.app/latest?amount=${this.enteredAmount}&from=${this.fromCurrency}&to=${this.toCurrency}`;
        try{
            let response = await fetch(endpoint);
            if(!response.ok){
                throw new Error('Network response was not OK');
            }
            const data = await response.json();
            this.convertedValue = data.rates[this.toCurrency];
            this.showOutput = true;
        }catch(error){
            console.log('Error ' , error);
        }
    }
    
}