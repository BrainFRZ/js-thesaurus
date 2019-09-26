import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import APIReader from './APIReader';
import {SynonymList} from './SynonymComponents'


export default class Doc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      internTable: {},
      wordID: '',
    };

    this.apiReader = new APIReader();

    this.updateWord = this.updateWord.bind(this);
  }

  componentDidMount() {
    document.title = "Thesaurus";
    this.updateWord('quick');
  }


  updateWord(word) {
    this.apiReader.internWord(word)
      .then(() => this.setState({
        internTable: this.apiReader.internTable,
        wordID: this.apiReader.lookupTable[word],
      }), reason => (() => {
        alert(`Unable to find ${word} in the thesaurus. Reverting to previous word.`);
        this.setState((prevState, props) => ({
          wordID: prevState.wordID,
        }));
      }));
  }


  render() {
    const wordID = this.state.wordID;
    if (!wordID) {
      return (<div><p>Please enter a word.</p></div>);
    }

    console.log('Doc sees the following intern table');
    console.log(this.state.internTable);

    return (
      <div>
        <SynonymList key={`${wordID}List`} wordID={wordID} internTable={this.state.internTable} />
      </div>
    );
  }
}


// ====================================================

ReactDOM.render(<App />, document.getElementById('root'));
