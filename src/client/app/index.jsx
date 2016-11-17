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
    // console.log('allnames is', allNames);
    this.state = {
      'score': 0,
      'highlighted': null,
      'highlightedKey': null,
      'completed': allNames,
      'gameover': true,
      'name': '',
      'topscores': [
        {'name': 'none', 'score': '0'}
        ],
    };
  }

  componentDidMount(){
    // fetch the scores from mongolab
    // console.log('component did mount');
    this.getAllScores();
  }

  componentWillReceiveProps(){
    // console.log('will receive props');
    var allNames = {};
    this.props.people.forEach( (person)=>{
      allNames[person.name] = false;
    });
    this.setState({
      'score': 0,
      'highlighted': null,
      'highlightedKey': null,
      'completed': allNames,
    });
  }

  getAllScores(){
    fetch('http://localhost:5000/scores', {
      method: 'GET',
      headers: {  
        'Content-Type': 'application/json',
      }
    })
    .then((resp) => {
      return resp.json();
    })
    .then((parsedResp) => {
      // console.log('parsed', parsedResp);

      var newTopScores = [];
      parsedResp.forEach((person) => {
        newTopScores.push({name: person.name, score: person.score});
      });

      newTopScores.sort((a, b) => {
        return b.score - a.score;
      });

      this.setState({
        'topscores': newTopScores,
      });

    })
    .catch((err) => {
      console.log('error posting', err);
    });
  }

  handleChange(event){
    this.setState({
      name: event.target.value
    });
  }

  startGame(e, second){
    // console.log('e is', e);
    e.preventDefault();
    this.setState({
      gameover: false,
    });
    // console.log('after submit', this.state.name);
    this.componentWillReceiveProps();
  }

  gameover(){
    // console.log('top game ended');
    fetch('http://localhost:5000/addscore', {
      method: 'POST',
      body: JSON.stringify({
        'name': this.state.name,
        'score': this.state.score
      }),
      headers: {  
        'Content-Type': 'application/json',
      }
    })
    .then((resp) => {
      return resp.json();
    })
    .then((parsedResp) => {
      console.log('parsed', parsedResp);
      return parsedResp;
    })
    .catch((err) => {
      console.log('error saving score', err);
      return 'error';
    })
    .then((resp) => {
      console.log('resp from server', resp)
      var newTopScores = this.state.topscores;
      newTopScores.push({name: this.state.name, score: this.state.score});
      newTopScores.sort((a, b)=> {
        return b.score - a.score;
      });
      this.setState({
        gameover: true,
        name: '',
        topscores: newTopScores
      });
    })
    .catch((err) => {
      console.log('error at end', err);
    });
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
    // subtract points for wrong guess
  }

  render() {
    return (
      <div>
      {!this.state.gameover ? (
        <div className="fullScreen" style={fullStyle}>
            <div className="topBar" style={topBarStyle}>
              <br></br>
              <Scoreboard score={this.state.score} gameover={this.gameover.bind(this)} name={this.state.name}/>
              <br></br>
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
      ) : (
      <div className="startingdiv" style={startingStyle}>
        <form onSubmit={this.startGame.bind(this)} style={formStyle}>
          Name:
          <input style={inputStyle} type="text" name="name" value={this.state.name} onChange={this.handleChange.bind(this)}/>
          <input style={inputButtonStyle} type="submit" value="Submit"/>
          <div style={scoreStyle}> </div>
            <p> Your last score: {this.state.score} </p>
            <div style={leaderboardStyle}> Top scores: </div>
            {this.state.topscores.map((person, i)=> {
              return (<div key={i + 1}> {(i + 1) + ". " + person.name + ": " + person.score} </div>);
            })}
        </form>
      </div>
      ) }
    </div>
    );
  }
}

const fullStyle = {
  backgroundColor: '#57C2DD'
};

const outerBoxStyle = {
  display: 'flex',
  flexDirection: 'row'
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

const startingStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: '#57C2DD',
};

const formStyle = {
  marginTop: '20px',
}

const inputStyle = {
  borderRadius: '5px',
  marginLeft: '5px',
  marginRight: '5px',
}

const inputButtonStyle = {
  borderRadius: '5px',
}

const scoreStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: '40px',
};

const leaderboardStyle = {
  fontSize: '20px',
  textDecoration: 'underline',
};

render(<App people={people}/>, document.getElementById('app'));