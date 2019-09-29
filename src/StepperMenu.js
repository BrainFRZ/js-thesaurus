import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './StepperMenu.css';


export default class StepperMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: props.activeStep,
      latestStep: props.latestStep,
      onUpdate: props.onUpdate,
      inputVal: props.activeStep + 2,
      loaded: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  };

  componentDidMount() {
    this.setState({loaded: true});
  }

  handleClick(evt) {
    const activeStep = this.state.activeStep;
    switch (evt.target.id) {
      case 'first':
        this.state.onUpdate(-1);
        break;
      case 'prev':
        this.state.onUpdate(activeStep - 1);
        break;
      case 'next':
          this.state.onUpdate(activeStep + 1);
        break;
      case 'last':
          this.state.onUpdate(this.state.latestStep);
        break;
      default:
        break;
    }
  };

  handleInput = (evt) => {
    const target = evt.target;
    this.setState({
      inputVal: target.value,
    });
  };

  handleInputBlur = (evt) => {
    const newStep = evt.target.value - 2;
    if (newStep < -1 || newStep > this.state.latestStep) {
      this.setState({inputVal: this.state.activeStep + 2});
    } else {
      this.state.onUpdate(newStep);
    }
  };

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.handleInputBlur(event);
    }
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    const activeStep = this.state.activeStep;
    const latestStep = this.state.latestStep;

    const firstStep = -1;
    const prevStep = activeStep - 1;
    const nextStep = activeStep + 1;
    const lastStep = latestStep;

    const firstMsg = `<<  Step 1`;
    const prevMsg  = `<  Step ${(prevStep < firstStep) ? 1 : prevStep + 2}`;
    const nextMsg  = `Step ${(nextStep > latestStep) ? latestStep + 2 : nextStep + 2}  >`;
    const lastMsg  = `Step ${lastStep + 2}  >>`;

    return (
      <ButtonToolbar id='stepper-menu'>
        <Button className='step-button' variant='secondary' id='first' type='button'
          disabled={activeStep <= firstStep}
          onClick={this.handleClick}
        >
          {firstMsg}
        </Button>

        <Button className='step-button' variant='primary' id='prev' type='button'
          disabled={activeStep <= firstStep}
          onClick={this.handleClick}
        >
          {prevMsg}
        </Button>

        <input id='step-input' value={this.state.inputVal}
          onChange={(e) => this.handleInput(e)}  onBlur={(e) => this.handleInputBlur(e)}  onKeyPress={(e) => this.handleKeyPress(e)}
        />

        <Button className='step-button' variant='primary' id='next' type='button'
          disabled={activeStep >= lastStep}
          onClick={this.handleClick}
        >
          {nextMsg}
        </Button>

        <Button className='step-button' variant='secondary' id='last' type='button'
          disabled={activeStep >= lastStep}
          onClick={this.handleClick}
        >
          {lastMsg}
        </Button>
      </ButtonToolbar>
    );
  };
}
