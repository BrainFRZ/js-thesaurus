import {APIKey} from './APIKey';

export default class APIReader {
  constructor(internTable={}, lookupTable={}, nextID=0) {
    this.internTable = internTable;
    this.lookupTable = lookupTable;
    this.nextID = nextID;
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
        console.log(`Fetched synonyms for ${word} (${wordID})`)
        return Promise.resolve(`Fetched synonyms for ${word} (${wordID})`);
      } else {
        console.log(`Loaded synonyms for ${word} (${wordID})`)
        return Promise.resolve(`Loaded synonyms for ${word} (${wordID})`);
      }
      
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
    return Promise.resolve(`Interning ${word} as id ${wordID}`);
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


  /**
   * Slices the intern and lookup tables to the first and last ID, excluding the last ID. Since
   * IDs are unique, the first occurence will be the only occurence. If the first tag is not
   * found, an empty API will be returned. If the last ID is empty or never found, all remaining
   * data after the first ID will be kept. The iteration will be on the intern table's IDs, as
   * the lookup table is not in order of internment.
   * 
   * @param {*} first Optional. First tag to keep. If none is provided, the first ID will be used.
   * @param {*} last Optional. First tag to slice off. If none is provided, all data after the first tag is kept.
   */
  slice(first='', last='') {
    if (first ==='' && last === '') {
      return new APIReader(
        this.internTable,
        this.lookupTable,
        parseInt(this.nextID),
      )
    }

    const ids = Object.keys(this.internTable);
    console.log('API Slice IDs');
    console.log(ids);
    const newInternTable = {};
    const newLookupTable = {};
    let newNextID = 0;

    let counter = 0;

    /* Skip over head */
    while ((ids[counter] !== first) && (counter < ids.length)) {
      counter += 1;
    }

    /* Build body */
    while ((ids[counter] !== last) && (counter < ids.length)) {
      const id = ids[counter];
      const word = this.internTable[id].name;
      const synonyms = this.internTable[id].synonyms.slice();
      newInternTable[id] = {name: word, synonyms: synonyms};
      newLookupTable[word] = id;
      counter += 1;
    }
    
    if (counter === ids.length) {
      newNextID = this.nextID;
    } else {
      newNextID = parseInt(ids[counter]) + 1;
    }

    return new APIReader(
      newInternTable,
      newLookupTable,
      parseInt(newNextID)
    );
  }

  release(wordID) {
    const word = this.internTable[wordID].name;
    delete this.internTable[wordID];
    delete this.lookupTable[word];
  }
}