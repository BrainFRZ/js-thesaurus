import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './SynonymComponents.css';


export class SynonymSearchBox extends React.Component {
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
      <label>
        Look up:
        <input id='search-box' value={this.state.searchVal}
          onChange={(e) => this.handleInput(e)}
          onBlur={(e) => this.handleInputBlur(e)}
          onKeyPress={(e) => this.handleKeyPress(e)}
        />
      </label>
    );
  }
}


export class SynonymList extends React.Component {
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
        <SynonymHead
          key={`syn-head-${wordID}`}
          word={word}
          wordID={wordID}
        />
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

function SynonymHead(props) {
  const wordID = props.wordID;
  const word = props.word;

  return (
    <h2 id='syn-head'>
      <OverlayTrigger
        key={`trigger-${wordID}`}
        placement='right'
        delay={{ show: 150, hide: 250 }}
        overlay={
          <Tooltip id={`tooltip-${wordID}`}>
            Interned ID: {wordID}
          </Tooltip>
        }
      >
        <span>{word}</span>
      </OverlayTrigger>
    </h2>
  );
}

function SynonymCell(props) {
  const wordID = props.wordID;
  const word = props.word;
  return (
    <li>
      <OverlayTrigger
        key={`trigger-${wordID}`}
        placement='right'
        delay={{ show: 150, hide: 250 }}
        overlay={
          <Tooltip id={`tooltip-${wordID}`}>
            Interned ID: {wordID}
          </Tooltip>
        }
      >
        <span
          className='clickable'
          onClick={(e) => props.onClick(word)}
        >
          {word}
        </span>
      </OverlayTrigger>
    </li>
  );
}

export function CloseSynonymsButton(props) {
  return (
    <button
      type='button'
      className='to-bottom'
      id='close-syn-button'
      onClick={() => props.closeSynonyms(props.api)}
    >
      Close synonyms
    </button>
  );
}
