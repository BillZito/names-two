import React from 'react';
import {render} from 'react-dom';
import lodash from 'lodash';
import Dropzone from 'react-dropzone';
import Scoreboard from './scoreboard';

const cdnPath = 'https://s3-us-west-1.amazonaws.com/invalidmemories/';
// const serverPath = 'http://localhost:5000/';
const serverPath = 'https://cryptic-temple-42662.herokuapp.com/';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'score': 0,
      'completed': [],
      'gameover': true,
      'name': '',
      'topscores': 
        [
          {'name': 'none', 'score': '0'}
        ],
      'cohort': '',
      'selectedCohort': '',
      'allCohorts': [],
      'currPerson': '',
      'shuffledPeople': [],
      'randomPeople': [],
      'showUpload': false,
    };

    this.startGame = this.startGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.checkTypedAnswer = this.checkTypedAnswer.bind(this);
    this.selectCohort = this.selectCohort.bind(this);
    this.gameover = this.gameover.bind(this);
    this.checkName = this.checkName.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.getCohortList = this.getCohortList.bind(this);
  }

  componentDidMount(){
    // fetch the scores from mongolab
    this.getAllScores();
    this.getCohortList();
  }

  getAllScores(){
    fetch(serverPath + 'scores', {
      method: 'GET',
      headers: {  
        'Content-Type': 'application/json',
      }
    })
    .then((resp) => {
      return resp.json();
    })
    .then((parsedResp) => {
      var newTopScores = [];
      // only take top 50 scores if there are 100 to take
      for (var i = 0; i < parsedResp.length; i ++) {
        var person = parsedResp[i];
        newTopScores.push({name: person.name, score: person.score});
      }

      newTopScores.sort((a, b) => {
        return b.score - a.score;
      });

      var top50 = newTopScores.slice(0, 50);

      this.setState({
        'topscores': top50,
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
    })[0]['students'];

    const noNumberShuffledPeople = _.shuffle(people);
    const shuffledPeople = noNumberShuffledPeople.map((studentObj, i) => {
      const newObj = studentObj; 
      newObj['number'] = i;
      return newObj;
    });
    
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

    while (i < 4 && randos.length < this.state.shuffledPeople.length - 1) {
      var randomNum = Math.round(Math.random() * (this.state.shuffledPeople.length - 1));
      var randomPerson = this.state.shuffledPeople[randomNum];
      if (randos.indexOf(randomPerson) === -1 && randomPerson !== this.state.currPerson) {
        randos.push(randomPerson);
        i++;
      }
    }

    randos.push(this.state.currPerson);
    randos = _.shuffle(randos);

    this.setState({
      'randomPeople': randos,
    });
  }

  startGame(e, second){
    e.preventDefault();

    this.preparePeople();
    this.setState({
      gameover: false,
      score: 0,
    });
  }

  gameover(){
    fetch(serverPath + 'addscore', {
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
        topscores: newTopScores,
        currPerson: '',
      });
    })
    .catch((err) => {
      console.log('error at end', err);
    });
  }

  checkTypedAnswer(event) {
    console.log('val', event.target.value);
    this.checkName(event.target.value);
  }

  checkName(clickedName){
    console.log('curr person is', this.state.currPerson.name);
    
    if (clickedName === this.state.currPerson.name) {
      var currentMatches = this.state.completed;
      currentMatches[clickedName] = true;
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
           // call choose random again, and 
          this.chooseRandom();
          // rerender -- need this?
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
    return fetch(serverPath + 's3/sign', {
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
        <div style={leaderboardStyle}> Hall of fame: </div>
          <div> HR48: Amad </div>
          <div> HR50: Chan </div>
        <br></br>
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
          <br></br>
          
          {
            this.renderLeaderboard()
          }
          <br></br>
          <span>Upload cohort </span>
          <input style={inputStyle} type="checkbox" name="showUpload" onChange={this.handleCheckChange}/>
          {
            this.state.showUpload ? (this.renderUploadOptions()) : null
          }

        </form>
      </div>
    );
  }

  render() {
    return (
      <div>
      {!this.state.gameover ? (
        <div className="fullScreen" style={fullStyle}>
            <div className="topBar" style={topBarStyle}>
              <br></br>
              <Scoreboard score={this.state.score} gameover={this.gameover} name={this.state.name}/>
              <br></br>
              <button style={endButtonStyle} onClick={this.gameover}>End Session</button>
            </div>
            <div className="outerBox" style={outerBoxStyle}> 
              <div className="leftColumn" style={leftColStyle}>
              {
                this.state.randomPeople.map((person, i)=> {
                  return (
                    <div key={i}>
                      <button 
                        name={person.name} 
                        onClick={() => this.checkName(person.name)}
                      > {person.name}
                      </button>
                    </div>
                  );
                })
              }
              Answer: 
              <input name="typedAnswer" onChange={this.checkTypedAnswer}/>

              </div>
              <div className="imgBox" style={imgBoxStyle}>
                <img 
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
  flexDirection: 'row',
  marginLeft: '15px',
};

const topBarStyle = {
  backgroundColor: '#ff6666',
  marginTop: '25px',
  marginBottom: '5px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  padding: '15px',
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
  height: '250px',
  width: '250px',
  margin: '5px',
  borderRadius: '3px',
  opacity: '0.9',
};

const solvedStyle = {
  display: 'none'
};

const startingStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: '#57C2DD',
  padding: '15px',
};

const formStyle = {
  marginTop: '20px',
}

const inputStyle = {
  borderRadius: '5px',
  marginLeft: '5px',
  marginRight: '5px',
  marginBottom: '10px',
}

const inputButtonStyle = {
  borderRadius: '5px',
  marginBottom: '10px',
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

const endButtonStyle = {
  width: '60px',
  margin: '5px',
  borderRadius: '5px',
};

render(<App />, document.getElementById('app'));