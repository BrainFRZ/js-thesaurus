import React from 'react';


export default class SynonymDiv extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wordID: props.wordID,
      internTable: props.internTable,
      onUpdate: props.onUpdate,
    }
  }

  render() {
    const wordID = this.state.wordID;
    if (!wordID) {
      return (
        <div>
          <SynonymSearchBox id='search-box' word='' onUpdate={this.state.onUpdate} />
          <p>Please enter a word.</p>
        </div>
      );
    }

    const word = this.state.internTable[wordID].name;
    return (
      <div>
        <SynonymSearchBox id='search-box' word={word} onUpdate={this.state.onUpdate} />
        <SynonymList wordID={wordID} internTable={this.state.internTable} />
      </div>
    );
  }
}


class SynonymSearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      word: props.word,
      searchVal: props.word,
      onUpdate: props.onUpdate,
    };
  }


  handleInput = (evt) => {
    this.setState({
      searchVal: evt.target.value,
    });
  }

  handleInputBlur = (evt) => {
    const newWord = evt.target.value;
    if (newWord !== this.state.word) {
      this.state.onUpdate(newWord);
    }
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleInputBlur(event);
    }
  }


  render() {
    return (
      <input id='step-input' value={this.state.searchVal}
        onChange={(e) => this.handleInput(e)}  onBlur={(e) => this.handleInputBlur(e)}  onKeyPress={(e) => this.handleKeyPress(e)}
      />
    );
  }
}


class SynonymList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wordID: props.wordID,
      internTable: props.internTable,
    };
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
