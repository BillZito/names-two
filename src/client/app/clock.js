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
    var secondsElapsed = Math.floor((currDate - this.state.startTime)/1000);

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