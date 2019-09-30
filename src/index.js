import React from 'react';
import ReactDOM from 'react-dom';

import {Container, Row, Col} from 'react-bootstrap';

import App from './App';
import APIReader from './APIReader';
import {SynonymSearchBox, SynonymList, CloseSynonymsButton} from './SynonymComponents'
import InternDiv from './TableComponents';
import StepperMenu from './StepperMenu';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


export default class Doc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      internTable: {},
      history: [],
      activeStep: -1,
      wordID: '',
      loaded: false,
    };

    this.APIReader = new APIReader();

    this.updateWord = this.updateWord.bind(this);
    this.updateStep = this.updateStep.bind(this);
    this.closeSynonyms = this.closeSynonyms.bind(this);
  }

  componentDidMount() {
    document.title = "React Thesaurus";
    this.setState({loaded: true});
  }

  
  updateWord(wordID, newAPIReader) {
    const step = this.state.activeStep;
    let newHistory;
    if (step < this.state.history.length - 1) {
      newHistory = this.state.history.slice(0, step + 1);
    } else {
      newHistory = this.state.history.slice();
    }
    const nextID = newAPIReader.nextID;
    newHistory.push({
      wordID: wordID,
      nextID: nextID,
    })

    this.APIReader = newAPIReader;
    console.log(newAPIReader);

    this.setState((prevState, props) => ({
      internTable: newAPIReader.internTable,
      activeStep: prevState.activeStep + 1,
      wordID: wordID,
      history: newHistory,
    }));
  }

  updateStep = step => this.setState({activeStep: step});

  async closeSynonyms(api) {
    this.apiReader = api;
    let ids = Object.keys(api.internTable);
    console.log(ids);
    let idIndex = 0;
    do {
      while (idIndex < ids.length) {
        const id = ids[idIndex];
        const internData = api.internTable[id];
        console.log(internData);
        const word = internData.name;
        const synonyms = internData.synonyms;
        console.log(word);
        console.log(synonyms);
        if (synonyms.length === 0) {
          console.log(`Fetching ${word} from closeSynonyms`);
          await api.internWord(word)
            .then(() => {
              this.updateWord(id, api);
            }, error => {
              alert(`Unable to reach Thesaurus. Halting closure operation.`);
              return Promise.reject('Unable to reach Thesaurus');
            });
        }
        idIndex += 1;
      }
      ids = Object.keys(api.internTable);
    } while (idIndex < ids.length);
  }


  render() {
    if (!this.state.loaded) {
      return null;
    }

    const step = this.state.activeStep;
    const historicState = (step === -1) ? ({wordID: '', nextID: '000'}) : this.state.history[step];
    console.log(this.state.history);
    console.log(`Step ${step}:`)
    console.log(this.state.internTable);
    const nextID = historicState.nextID;
    const newAPIReader = (step === -1) ? (new APIReader()) : this.APIReader.slice('000', nextID);
    console.log(newAPIReader);
    const mountedWordID = historicState.wordID;
    console.log(mountedWordID);

    return (
      <Container>
        <Row>
          <Col>
            <StepperMenu
              key={`menu${step}`}
              activeStep={step}
              latestStep={this.state.history.length - 1}
              onUpdate={this.updateStep}
            />
          </Col>
        </Row>
        <Row>
          <Col xs='auto'>
            <Thesaurus
              key={`${step}thesaurus`}
              apiReader={newAPIReader}
              internTable={newAPIReader.internTable}
              wordID={mountedWordID}
              updateWord={this.updateWord}
              closeSynonyms={this.closeSynonyms}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}


class Thesaurus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiReader: props.apiReader,
      updateWord: props.updateWord,
      closeSynonyms: props.closeSynonyms,
      internTable: props.internTable,
      wordID: props.wordID,
      errors: 0,
      loaded: false,
    };

    this.updateWord = this.updateWord.bind(this);
  }

  componentDidMount() {
    this.setState({loaded: true});
  }


  updateWord(word) {
    const api = this.state.apiReader;
    api.internWord(word)
      .then(() => {
        const wordID = api.lookupTable[word];
        this.state.updateWord(wordID, api);
      }, error => {
        alert(`Unable to find "${word}" in the thesaurus. Reverting to previous word.`);
        this.setState((prevState, props) => ({
          errors: prevState.errors + 1, // Errors being changed in state allows rebuild of search box to reset the text
        }));
      });
  }


  render() {
    if (!this.state.loaded) {
      return null;
    }

    const wordID = this.state.wordID ? this.state.wordID : '';
    const data = this.state.internTable;
    const word = data[wordID]
      ? data[wordID].name
      : '';
    

    const searchBox = <SynonymSearchBox
      key={`${wordID}SynDiv${this.state.errors}`}
      word={word}
      onUpdate={this.updateWord}
    />;

    const synonymList = (word === '')
      ? <p>Please enter a word.</p>
      : <SynonymList
          key={`${wordID}SynList`}
          className='syn-list'
          wordID={wordID}
          internTable={data}
          onClick={this.state.onUpdate}
        />;


    const internDiv = <InternDiv
      key={`${wordID}IntDiv`}
      internTable={data}
      onUpdate={this.updateWord}
    />;

    const closeSynonymsButton = (word === '')
      ? null
      : <CloseSynonymsButton
          key={`${wordID}CloseButton`}
          api={this.state.apiReader}
          closeSynonyms={this.state.closeSynonyms}
        />


    return (
      <Container>
        <Row>
          <Col xs='auto'>{searchBox}</Col>
          <Col xs='auto'>{closeSynonymsButton}</Col>
        </Row>

        <Row>
          <Col>{synonymList}</Col>
          <Col>{internDiv}</Col>
        </Row>
      </Container>
    );
  }
}


// ====================================================

ReactDOM.render(<App />, document.getElementById('root'));
