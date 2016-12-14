import React from 'react';
import {render} from 'react-dom';
import lodash from 'lodash';
import Dropzone from 'react-dropzone';
import Scoreboard from './scoreboard';
import DraggableName from './draggableName';

const cdnPath = 'https://s3-us-west-1.amazonaws.com/invalidmemories/';
const serverPath = 'http://localhost:5000/';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'score': 0,
      'highlighted': null,
      'highlightedKey': null,
      'completed': '',
      'shuffledPeople': '',
      'gameover': true,
      'name': '',
      'topscores': [
        {'name': 'none', 'score': '0'}
        ],
      'cohort': '',
      'selectedCohort': '',
      'allCohorts': [],
      'currPerson': '',
      'randomPeople': [],
      'showUpload': false,
    };

    this.startGame = this.startGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.selectCohort = this.selectCohort.bind(this);
    this.highlight = this.highlight.bind(this);
    this.gameover = this.gameover.bind(this);
    this.checkName = this.checkName.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.getCohortList = this.getCohortList.bind(this);
  }

  componentDidMount(){
    // fetch the scores from mongolab
    this.getAllScores();
    this.getCohortList();
    // this.setState({
    //   'score': 0,
    //   'highlighted': null,
    //   'highlightedKey': null,
    // });
  }

  getAllScores(){
    fetch('https://cryptic-temple-42662.herokuapp.com/scores', {
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
    // set events name to new val
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handleCheckChange(event) {
    console.log('event', event.target.checked);
    this.setState({
      [event.target.name] : event.target.checked
    });
  }

  preparePeople() {
    const people = this.state.allCohorts.filter((cohort) => {
      return cohort.name === this.state.selectedCohort;
    })[0]['students'].map((studentObj, i) => {
      const newObj = studentObj; 
      newObj['number'] = i;
      return newObj;
    });

    const shuffledPeople = _.shuffle(people);
    
    const allNames = {};
    people.forEach((person) => {
      allNames[person] = false;
    });

    this.setState({
      'completed': allNames,
      'shuffledPeople': shuffledPeople,
      'unshuffledPeople': people,
      'currPerson': shuffledPeople[0],
    }, () => {
      console.log('callback called');
      this.chooseRandom();
    });


    console.log('shuffled people arr', shuffledPeople);
  }

  chooseRandom() {
    // choose 4 random numbers -- if already in array choose again
    var i = 0;
    var randos = []; 
    console.log('shuffled', this.state.shuffledPeople);
    console.log('while statements', i < 4, randos.length < this.state.shuffledPeople.length - 1);
    while (i < 4 && randos.length < this.state.shuffledPeople.length - 1) {
      console.log('called once');
      var randomNum = Math.round(Math.random() * (this.state.shuffledPeople.length - 1));
      var randomPerson = this.state.shuffledPeople[randomNum];
      if (randos.indexOf(randomPerson) === -1 && randomPerson !== this.state.currPerson) {
        randos.push(randomPerson);
        i++;
        console.log('found one rando', randomPerson);
      }
    }

    randos.push(this.state.currPerson);
    randos = _.shuffle(randos);
    console.log('all randos are', randos);

    this.setState({
      'randomPeople': randos,
    });
  }

  startGame(e, second){
    // console.log('e is', e);
    e.preventDefault();

    this.preparePeople();
    this.setState({
      gameover: false,
    });
    // console.log('after submit', this.state.name);
  }

  gameover(){
    // console.log('top game ended');
    fetch('https://cryptic-temple-42662.herokuapp.com/addscore', {
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
        completed: currentMatches,
      });

      if (this.state.currPerson.number === this.state.shuffledPeople.length - 1) {
        // if is the last person, set to gameover
        this.gameover();  
      } else {
        // otherwise, set the current person to the next one, 
        const newPerson = this.state.shuffledPeople[this.state.currPerson.number + 1];
        this.setState({
          currPerson: newPerson,
        }, () => {
          console.log('choose random called for second time');
           // call choose random again, and 
          this.chooseRandom();
          // rerender
          this.render();
        });
      }
    } 
    // subtract points for wrong guess
  }

  selectCohort(event){
    this.setState({
      selectedCohort: event.target.value
    });
  }

  sendToS3(file, url) {
    console.log('file is', file.name);
    fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read',
      },
    })
    .then(resp => resp)
    .catch(err => err);
  }
  
  saveNewCohort(people) {
    //
    console.log('people in savenew are', people);
    return fetch(serverPath + 'cohort/' + this.state.cohort, {
      'method': 'POST',
      'body': JSON.stringify({students: people}),
      'headers': {
        'Content-Type': 'application/json',
      },
    })
    .then(data => data.json())
    .then(msg => console.log('message received', msg))
    .catch(err => console.log('error saving new cohort', err)); 
  }

  onDrop(files){
    console.log('files are', files);

    const people = files.map((imgfile) => {
      const name = imgfile.name.split('.')[0];
      return {
        name: name,
        image: imgfile.name,
      };
    });

    // console.log('people are', people);

    this.saveNewCohort(people);
    this.getAllPhotos(files, 0, files.length);
  }

  // on successful upload, create a new game button option on main page
  // on button selection, populate with that games information


  getAllPhotos(files, currIndex, end) {
    if (currIndex === end) {
      console.log('sent all files');
      return 'success';
    } else {
      this.getOnePhoto(files[currIndex])
      .then((resp) => {
        console.log('response for', currIndex, resp);
        return this.getAllPhotos(files, currIndex + 1, end);
      })
      .catch((err) => {
        console.log('error getting file', currIndex, err);
        return this.getAllPhotos(files, currIndex + 1, end);
      });
    }
      
  }

  getOnePhoto(file) {
    return fetch('http://localhost:5000/s3/sign', {
      method: 'POST',
      body: JSON.stringify({
        filename: file.name,
        filetype: file.type,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(data => data.json())
    .then(url => this.sendToS3(file, url))
    .catch(err => console.log('error getting photo', err));
  }

  getCohortList() {
    return fetch(serverPath + 'cohort', {
      method: 'GET',
    })
    .then(data => data.json())
    .then((cohortList) => {

      this.setState({
        allCohorts: cohortList,
        selectedCohort: cohortList[0]['name'],
      });
    })
    .catch(err => console.log('error getting cohorts', err));
  }

  renderUploadOptions() {
    return (
      <div>
        <form>
        <span> Cohort name: </span>
          <input name="cohort" value={this.state.cohort} onChange={this.handleChange}/>
        </form>
        <Dropzone onDrop={this.onDrop}>
          <div>Upload your images here</div>
        </Dropzone>
      </div>
    );
  }

  renderLeaderboard() {
    return (
      <div>
        <div style={scoreStyle}> </div>
        <p> Your last score: {this.state.score} </p>
        <div style={leaderboardStyle}> Top scores: </div>
        {this.state.topscores.map((person, i)=> {
          return (<div key={i + 1}> {(i + 1) + ". " + person.name + ": " + person.score} </div>);
        })}
      </div>
    );
  }

  renderStartingScreen() {
    return (
      <div className="startingdiv" style={startingStyle}>
        <form onSubmit={this.startGame} style={formStyle}>
          Name:
          <input style={inputStyle} type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
          <input style={inputButtonStyle} type="submit" value="Start game"/>
          <div> Test me on the names of: </div>
          <select value={this.state.selectedCohort} onChange={this.selectCohort}>
            {
              this.state.allCohorts.map((cohort, i) => {
                return (<option key={i} value={cohort.name}> {cohort.name} </option>);
              })
            }
          </select>
          <br></br><br></br>
          
          <span>Upload cohort </span>
          <input style={inputStyle} type="checkbox" name="showUpload" onChange={this.handleCheckChange}/>
            {
              this.state.showUpload ? (this.renderUploadOptions()) : null
            }
            {
              this.renderLeaderboard()
            }

        </form>
      </div>
    );
  }

  // {
  //   this.renderUploadOptions()
  // }

  render() {
    return (
      <div>
      {!this.state.gameover ? (
        <div className="fullScreen" style={fullStyle}>
            <div className="topBar" style={topBarStyle}>
              <br></br>
              <Scoreboard score={this.state.score} gameover={this.gameover} name={this.state.name}/>
              <br></br>
            </div>
            <div className="outerBox" style={outerBoxStyle}> 
              <div className="leftColumn" style={leftColStyle}>
              {
                this.state.randomPeople.map((person, i)=> {
                  return (
                    <DraggableName 
                      key={i} 
                      name={person.name} 
                      checkName={()=> this.checkName(person.name)} 
                      completed={this.state.completed[person.name]}/>
                  );
                })
              }

              </div>
              <div className="imgBox" style={imgBoxStyle}>
                <img 
                  onMouseEnter={()=> this.highlight(this.state.currPerson.name)} 
                  src={cdnPath + this.state.currPerson.image}
                  style={this.state.completed[this.state.currPerson.name] ? solvedStyle : imgStyle}
                />
              </div>
            </div>
        </div>
      ) : (
        <div>
        {
          this.renderStartingScreen()
        }
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

render(<App />, document.getElementById('app'));