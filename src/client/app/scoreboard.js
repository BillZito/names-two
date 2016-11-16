import React from 'react';
import Clock from './clock';

class Scoreboard extends React.Component{
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <div>
          <span style={scoreboardStyle}> Points: {this.props.score} </span>
          <span style={pumpupStyle}> {coolPhrases[3]} </span>
        </div>
        <div style={clockStyle}>
          <Clock endAfter={5}/>
        </div>
      </div>
    );
  }
}

const coolPhrases = [
  'you make marcus proud',
  'now you have to say hi in-person...',
  'a friend a day keeps the lonely away',
  '99% of HR grads marry other HR grads',
  'fred will be giving a lecture on friendship next week',
  'who will be your next breakfast buddy?',
  'you code good',
  'you can doo itttttt',
  'if only it were this easy to talk to people...',
];

const scoreboardStyle = {
  fontWeight: 'bold',
  float: 'left',
};

const pumpupStyle = {
  float: 'none',
};

const clockStyle = {
  float: 'left',
};

module.exports = Scoreboard;