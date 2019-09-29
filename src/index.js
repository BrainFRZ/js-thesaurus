import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import APIReader from './APIReader';
import {SynonymSearchBox, SynonymList} from './SynonymComponents'
import InternDiv from './TableComponents';


export default class Doc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      internTable: {},
      wordID: '',
      errors: 0,
      loaded: false,
    };

    this.apiReader = new APIReader();

    this.updateWord = this.updateWord.bind(this);
  }

  componentDidMount() {
    document.title = "React Thesaurus";
    this.setState({loaded: true});
  }


  updateWord(word) {
    this.apiReader.internWord(word)
      .then(() => this.setState({
        internTable: this.apiReader.internTable,
        wordID: this.apiReader.lookupTable[word],
        errors: 0,
      }), error => {
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


    return (
      <div id='doc-div'>
        <div id='synonym-div'>
          {searchBox}
          {synonymList}
        </div>
        
        {internDiv}
      </div>
    );
  }
}


// ====================================================

ReactDOM.render(<App />, document.getElementById('root'));
