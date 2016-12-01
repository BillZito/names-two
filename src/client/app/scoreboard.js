import React from 'react';
import Clock from './clock';

class Scoreboard extends React.Component{
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <div style={directStyle}>
          <span> Directions: Drag names onto their corresponding pictures, and you'll get points! </span>
        </div>
        <div>
          <span style={scoreboardStyle}> Points: {this.props.score} </span>
          <span style={pumpupStyle}> {coolPhrases[this.props.score % 10]} </span>
        </div>
        <div style={moreInfoStyle}>
          <Clock style={clockStyle} endAfter={100} gameover={this.props.gameover.bind(this)}/>
          <span style={nameStyle}> Name: {this.props.name} </span>
        </div>
      </div>
    );
  }
}

const coolPhrases = [
  'one day you\'ll be a self-driving car too'
];

/*
'now you have to say hi in-person...',
'you make marcus proud',
'a friend a day keeps the lonely away',
'99% of HR grads marry other HR grads',
'fred will be giving a lecture on friendship next week',
'who will be your next breakfast buddy?',
'you code good',
'you can doo itttttt',
'if only it were this easy to talk to people...',
'if you dont hate your friends a little bit, are they really your friends?'
*/

const scoreboardStyle = {
  fontWeight: 'bold',
  float: 'left',
};

const directStyle = {
  marginBottom: '10px'
};

const pumpupStyle = {
  float: 'none',
};

const moreInfoStyle ={
  float: 'left'
};

const clockStyle = {
  float: 'left',
};

const nameStyle = {
  float: 'left',
};

module.exports = Scoreboard;