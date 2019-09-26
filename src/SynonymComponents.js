import React from 'react';


export class SynonymList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wordID: props.wordID,
      internTable: props.internTable,
    }
  }

  render() {
    const wordID = this.state.wordID;
    console.log(`SynonymList: wordID is ${wordID}`);
    if (!wordID) {
      return null;
    }

    const internedWord = this.state.internTable[wordID];
    const word = internedWord.name;
    const synonyms = internedWord.synonyms;
    console.log('SynonymList: synonyms:');
    console.log(synonyms);
    if (!synonyms || synonyms.length === 0) {
      return null;
    }

    return (
      <div>
        <h2 id='syn-head'>{`${word} (${wordID})`}</h2>
        <ul id='syn-list'>
          {synonyms.map(synonym => (
            <li key={`syn-${synonym}`}>{`${this.state.internTable[synonym].name} (${synonym})`}</li>
          ))}
        </ul>
      </div>
    );
  }
}


