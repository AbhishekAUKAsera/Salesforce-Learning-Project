import { LightningElement, wire} from 'lwc';
import {publish, MessageContext} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

const DELAY = 300;

export default class MovieSearch extends LightningElement {
    selectedType='';
    loading=false;
    selectedSearch='';
    selectedPageNo="1";
    delayTimeout;
    searchResults = [];
    selectedMovie='';

    @wire(MessageContext)
    messageContext;

    get Typeoptions() {
        return [
            { label: 'None', value: '' },
            { label: 'Movie', value: 'movie' },
            { label: 'Series', value: 'series' },
            { label: 'Episode', value: 'episode' },
        ];
    }

    handleChange(event){
        //Destructuring the value into 2
        let { name, value} = event.target;
        this.loading = true;
        if(name === 'type'){
            this.selectedType = value;
            console.log('SELECTED TYPE ' + this.selectedType);
        }else if(name === 'search'){
            this.selectedSearch = value;
            console.log('SELECTED SEARCH ' + this.selectedSearch);
        }else if(name === 'pageno'){
            this.selectedPageNo = value;
            console.log('SELECTED PAge No ' + this.selectedPageNo);
        }
        //debouncing
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.searchMovie();
        }, DELAY);
    }
    async searchMovie(){
        const url=`	https://www.omdbapi.com/?s=${this.selectedSearch}&type=${this.selectedType}&page=${this.selectedPageNo}&apikey=16f3e4a7`;
        const res = await fetch(url);
        const data = await res.json();
        console.log('Movie Search Output ' +  JSON.stringify(data));
        this.loading = false;
        if(data.Response === 'True'){
            this.searchResults = data.Search;
        }
    }

    get displaySearchResult(){
        return this.searchResults.length > 0 ? true : false;
    }

    movieSelectedHandler(event){
        this.selectedMovie = event.detail;
        const payload = { movieId: this.selectedMovie }; //movieId is same as we defined in movieChannel as lightning message fields

        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }
}