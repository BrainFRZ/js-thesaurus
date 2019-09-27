import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './TableComponents.css';


export default class InternDiv extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      internTable: props.internTable,
      onUpdate: props.onUpdate,
      tableIDs: [],
      loaded: false,
      steps: 0,
    }

    this.openTable = this.openTable.bind(this);
  }

  componentDidMount() {
    this.setState({loaded: true});
  }


  openTable(id, clickedTableIndex) {
    const newTables = this.state.tableIDs.slice(0, clickedTableIndex+1);
    newTables.push(id);
    this.setState((prevState, props) => ({
      tableIDs: newTables,
      steps: prevState.steps + 1,
    }));
  }


  render() {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div>
        <InternTable
          data={this.state.internTable}
          openTable={this.openTable}
          onUpdate={this.state.onUpdate}
        />
        <DeepTables
          key={`${this.state.steps}DeepTables`}
          data={this.state.internTable}
          tableIDs={this.state.tableIDs}
          openTable={this.openTable}
          onUpdate={this.state.onUpdate}
        />
      </div>
    );
  }
}

function InternTable(props) {
  const data = props.data;
  const titleRow = (<tr><th colSpan={2} className='table-title'>Intern Table</th></tr>);

  const ids = Object.keys(data);
  let heads;
  if (ids.length === 0) {
    heads = (<tr><th colSpan={2}>There are currently no synonyms interned.</th></tr>);
  } else {
    heads = (
      <tr>
        <th className='id-cell'>ID</th>
        <th>Word</th>
      </tr>
    );
  }

  const rows = ids.map(id => (
    <tr key={`${id}row-intern`}>
      <IDCell key={`${id}row-int-id`}  tableID={-1}  wordID={id}  word={data[id].name}  openTable={props.openTable} />
      <WordCell key={`${id}row-int-word`}  word={data[id].name}  onUpdate={props.onUpdate} />
    </tr>
  ));

  return (
    <table key='intern-table' className='intern-table'>
      <thead key='intern-head'>
        {titleRow}
        {heads}
      </thead>
      <tbody key='intern-body'>
        {rows}
      </tbody>
    </table>
  );
}


class DeepTables extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      tableIDs: props.tableIDs,
      openTable: props.openTable,
      onUpdate: props.onUpdate,
      steps: 0,
      loaded: false,
    }
  }

  componentDidMount() {
    this.setState({loaded: true});
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    const tableIDs = this.state.tableIDs;
    const tables = [];
    for (let t = 0; t < tableIDs.length; t++) {
      const wordID = tableIDs[t];
      tables.push(
        <Table
          key={`${wordID}t${t}`}
          data={this.state.data}
          wordID={wordID}
          index={t}
          openTable={this.state.openTable}
          onUpdate={this.state.onUpdate}
        />
      );
    }

    return (
      <div>
        {tables}
      </div>
    );
  }
}


function Table(props) {
  const id = props.wordID;
  const data = props.data[id];
  const word = data.name;
  const index = props.index;
  const synonymIDs = data.synonyms;

  const titleRow = (
    <tr>
      <OverlayTrigger
        key={`trigger-${id}`}
        placement='right'
        overlay={
          <Tooltip id={`${word}${index}tooltip-${id}`}>
            {`Interned ID: ${id}`}
          </Tooltip>
        }
      >
        <th colSpan={2} className='table-title'>{word}</th>
      </OverlayTrigger>      
    </tr>
  );

  let heads;
  if (synonymIDs.length === 0) {
    heads = (<tr><th colSpan={2}>This word hasn't been looked up yet.</th></tr>);
  } else {
    heads = (
      <tr>
        <th className='id-cell'>ID</th>
        <th>Word</th>
      </tr>
    );
  }

  console.log(synonymIDs);

  const rows = synonymIDs.map(id => (
    <tr key={`${id}row-t${index}`}>
      <IDCell key={`${id}row-int-id`}  tableIndex={index}  wordID={id}  openTable={props.openTable} />
      <WordCell key={`${id}row-int-word`}  word={props.data[id].name}  onUpdate={props.onUpdate} />
    </tr>
  ));

  return (
    <table key='intern-table' className='intern-table'>
      <thead key='intern-head'>
        {titleRow}
        {heads}
      </thead>
      <tbody key='intern-body'>
        {rows}
      </tbody>
    </table>
  );
}



function IDCell(props) {
  const id = props.wordID;
  const index = props.tableIndex;
  return (
    <td
      className='clickable id-cell'
      onClick={(e) => props.openTable(id, index)}
    >
      <OverlayTrigger
        key={`trigger-${id}`}
        placement='bottom'
        overlay={
          <Tooltip id={`${index}tooltip-${id}`}>
            Click to open relation table
          </Tooltip>
        }
      >
        <span>{id}</span>
      </OverlayTrigger>
    </td>
  );
}

function WordCell(props) {
  const word = props.word;
  return (
    <td
      className='clickable'
      onClick={(e) => props.onUpdate(word)}
    >
      <OverlayTrigger
        key={`trigger-${word}`}
        placement='right'
        overlay={
          <Tooltip id={`${word}Tooltip`}>
            Click to look up word
          </Tooltip>
        }
      >
        <span>{word}</span>
      </OverlayTrigger>
    </td>
  );
}