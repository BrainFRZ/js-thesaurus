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

      console.log('Synonym IDs');
      console.log(this.internTable[wordID].synonyms);
      console.log('Intern table:');
      console.log(this.internTable);
      console.log('Lookup table:');
      console.log(this.lookupTable);
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

    console.log('Synonym IDs');
    console.log(this.internTable[wordID].synonyms);
    console.log('Intern table:');
    console.log(this.internTable);
    console.log('Lookup table:');
    console.log(this.lookupTable);
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
        console.log(`Pulling ${word} from ${id}`);
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
    const baseURL = 'https://words.bighugelabs.com/api/2';
    const URL = `${baseURL}/${APIKey}/${word}/json`;
  
    const response = await fetch(URL)
                            .catch(error => {return Promise.reject(error)});

    const data = await response.json();
  
    const wordForm = Object.keys(data)[0];
    const synonyms = data[wordForm].syn.slice(0, this.size);

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