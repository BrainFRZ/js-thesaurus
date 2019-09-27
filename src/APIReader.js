import {APIKey} from './APIKey';

export default class APIReader {
  constructor() {
    this.internTable = {};
    this.lookupTable = {};
    this.nextID = 0;
    this.size = 5;
  }

  async internWord(word) {
    let wordID;
    let internData;
    if ((word in this.lookupTable)) {
      wordID = this.lookupTable[word];
      internData = this.internTable[wordID];
      if (!internData.synonyms.length) {
        internData.synonyms = await this.getOrFetchSynonyms(word)
                                      .catch(error => {return Promise.reject(error)});
        console.log(`Fetched synonyms for ${word} (${wordID})`);
      } else {
        console.log(`Loaded synonyms for ${word} (${wordID})`);
      }
      return;
    }

    wordID = this.nextID;
    console.log(`Interning ${word} as id ${wordID}`);
    this.lookupTable[word] = wordID;
    this.internTable[wordID] = {name: word, synonyms: []};
    this.incrementID();

    this.internTable[wordID].synonyms =
      await this.getOrFetchSynonyms(word)
              .catch(error => {
                console.log(`Releasing ${word} due to error`);
                delete this.lookupTable[word];
                delete this.internTable[wordID];
                this.incrementID(-1);
                return Promise.reject(error)
              });
  }

  async getOrFetchSynonyms(word) {
    const synonymIDs = [];
    const synonyms = await this.fetchSynonyms(word)
                              .catch(error => {return Promise.reject(error)});

    for (let i = 0; i < synonyms.length; i++) {
      const word = synonyms[i];
      let id;
      if (word in this.lookupTable) {
        id = this.lookupTable[word];
        console.log(`Loading ${word} (${id})`);
      } else {
        id = this.nextID;
        console.log(`Interning ${word} as id ${id}`);
        this.internTable[id] = {name: word, synonyms: []};
        this.lookupTable[word] = id;
        this.incrementID();
      }
      synonymIDs.push(id);
    }

    return synonymIDs;
  }

  async fetchSynonyms(word) {
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/synonyms`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": APIKey,
        }
      });
    
    if (!response.ok) {
      return Promise.reject(response.error);
    }

    const data = await response.json();
    const synonyms = data.synonyms.slice(0, this.size);
    console.log(`Fetched synonyms for ${word}`);
    console.log(synonyms);
  
    return synonyms;
  }

  /**
   * @param {Number} id
   */
  set nextID(id) {
    let tag;
    if (id < 10) {
      tag = '00' + id;
    } else if (id < 100) {
      tag = '0' + id;
    } else {
      tag = '' + id;
    }

    this._nextID = tag;
  }

  get nextID() {
    return this._nextID;
  }

  incrementID(increment=1) {
    const id = parseInt(this.nextID);
    this.nextID = id + increment;
  }
}