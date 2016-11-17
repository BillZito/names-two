import React from 'react';

class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      timeGone: 0,
      startTime: null,
    };
  }

  componentDidMount(){
    this.setState({
      startTime: new Date()
    });
    this.timer = setInterval(this.start.bind(this), 500);
  }

  start(){
    var currDate = new Date(); 
    var currSeconds = currDate.getSeconds();
    var currMinutes = currDate.getMinutes();
    var pastSeconds = this.state.startTime.getSeconds();
    var pastMin = this.state.startTime.getMinutes();
    var secondsElapsed = (currMinutes - pastMin) * 60 + currSeconds - pastSeconds;

    // console.log('elapsed', secondsElapsed);
    // console.log('end after', this.state.timeGone);
    // var secondsElapsed = currDate.getSeconds();
    var tick = () => {
      this.setState({
        timeGone: secondsElapsed
      });
    };
    if (this.props.endAfter - this.state.timeGone < 1) {
      this.end();
    } else {
      tick();
    }
  }

  end(){
    console.log('it ended');
    clearInterval(this.timer);
    this.props.gameover();
  }

  render() {
    return(
      <div> Time: {this.props.endAfter - this.state.timeGone}</div>
    );
  }
}

module.exports = Clock;