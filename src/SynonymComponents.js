import React from 'react';
import './index.css'
import './SynonymComponents.css';

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
        <div id='synonym-div'>
          <SynonymSearchBox word='' onUpdate={this.state.onUpdate} />
          <p>Please enter a word.</p>
        </div>
      );
    }

    const word = this.state.internTable[wordID].name;
    return (
      <div id='synonym-div'>
        <SynonymSearchBox word={word} onUpdate={this.state.onUpdate} />
        <SynonymList wordID={wordID} internTable={this.state.internTable} onClick={this.state.onUpdate} />
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
    const currentWord = this.state.word;
    if (newWord === '') {
      evt.target.value = currentWord;
    } else if (newWord !== currentWord) {
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
      <input id='search-box' value={this.state.searchVal}
        onChange={(e) => this.handleInput(e)}
        onBlur={(e) => this.handleInputBlur(e)}
        onKeyPress={(e) => this.handleKeyPress(e)}
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
      onClick: props.onClick,
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
      <div id='synonym-list'>
        <h2 id='syn-head'>{`${word} (${wordID})`}</h2>
        <ul id='syn-list'>
          {synonyms.map(synonym => (
            <SynonymCell
              key={`syn-${synonym}`}
              wordID={synonym}
              word={this.state.internTable[synonym].name}
              onClick={this.state.onClick}
            />
          ))}
        </ul>
      </div>
    );
  }
}


function SynonymCell(props) {
  const wordID = props.wordID;
  const word = props.word;
  return (
    <li>
      <span
        className='clickable'
        onClick={(e) => props.onClick(word)}
      >
        {`${word} (${wordID})`}
      </span>
    </li>
  );
}