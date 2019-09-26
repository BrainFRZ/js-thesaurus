import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './TableComponents.css';


export default class InternDiv extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      internTable: props.internTable,
      onUpdate: props.onUpdate,
      tables: [],
      loaded: false,
    }

    this.getTables = this.getTables.bind(this);
  }

  componentDidMount() {
    this.setState((prevState, props) => ({
      loaded: true,
      tables: prevState.tables.push(prevState.internTable),
    }));
  }


  getTables = () => (this.state.tables ? this.state.tables : [])


  render() {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div>
        <InternTable data={this.state.internTable} />
        <DeepTables getTables={this.getTables} />
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
      <td key={`${id}row-int-id`} className='id-cell'>{id}</td>
      <td key={`${id}row-int-name`}>{data[id].name}</td>
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
      getTables: props.getTables,
      steps: 0,
      loaded: false,
    }
  }


  render() {
    return null;
  }
}