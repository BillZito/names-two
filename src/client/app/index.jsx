import React from 'react';
import {render} from 'react-dom';
import people from './people';
import DraggableName from './draggableName';
import Scoreboard from './scoreboard';

var path = './assets/';

class App extends React.Component {
  constructor(props){
    super(props);
    var allNames = {};
    props.people.forEach( (person)=>{
      allNames[person.name] = false;
    });
    console.log('allnames is', allNames);
    this.state = {
      'score': 0,
      'highlighted': null,
      'highlightedKey': null,
      'completed': allNames,
    };
  }

  highlight(name, i){
    this.setState({
      'highlighted': name,
      'highlightedKey': i
    });
  }

  checkName(draggedName){
    console.log('dragged Name is', draggedName);
    if (draggedName === this.state.highlighted) {
      console.log('matches!');
      var currentMatches = this.state.completed;
      currentMatches[draggedName] = true;
      this.setState({
        score: this.state.score + 3,
        completed: currentMatches
      });
    }
  }

  render() {
    return (
      <div className="fullScreen" style={fullStyle}>
        <div className="topBar" style={topBarStyle}>
          <br></br>
          <Scoreboard score={this.state.score}/>
        </div>
        <div className="outerBox" style={outerBoxStyle}> 
          <div className="leftColumn" style={leftColStyle}>
          {
            this.props.people.map((person, i)=> {
              return (
                <DraggableName 
                  key={i} 
                  name={person.name} 
                  checkName={this.checkName.bind(this, person.name)} 
                  completed={this.state.completed[person.name]}/>
              );
            })
          }
          </div>
          <div className="imgBox" style={imgBoxStyle}>
          {
            this.props.people.map((person, i) => {
              return (
                <img 
                  onMouseEnter={this.highlight.bind(this, person.name, i)} 
                  key={i} 
                  src={path + person.image}
                  style={this.state.completed[person.name] ? solvedStyle : this.state.highlightedKey === i ? highlightStyle : imgStyle}
                />
              );
            })
          }
          </div>

        </div>
      </div>
      );
  }
}

const outerBoxStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const fullStyle = {
  backgroundColor: '#57C2DD'
};

const topBarStyle = {
  backgroundColor: '#ff6666',
  marginTop: '25px',
  marginBottom: '5px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
};

const leftColStyle = {
  dispaly: 'flex',
  flexDirection: 'row',
  width: '200px',
  marginTop: '6px',
};

const imgBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap'
};

const imgStyle = {
  height: '150px',
  width: '150px',
  margin: '5px',
  borderRadius: '3px',
  opacity: '0.7'
};

const highlightStyle = {
  height: '150px',
  width: '150px',
  margin: '5px',
  borderRadius: '3px',
};

const solvedStyle = {
  display: 'none'
};

render(<App people={people}/>, document.getElementById('app'));