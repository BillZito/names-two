import React from 'react';
import {render} from 'react-dom';
import people from './people';
import DraggableName from './draggableName';
import Picture from './picture';
// import styles from '../styles.css';

var path = './assets/';

const outerBoxStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const imgStyle = {
  height: '100px',
  width: '100px'
};

const imgBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row'
};

const leftColStyle = {
  dispaly: 'flex',
  flexDirection: 'row',
  width: '100px'
};

// const nameStyle = {
//   margin: '2px'
// };

class App extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props.people[0].name); //should be bill
  }

  render() {
    return (
      <div>
        <p> Points </p>
        <div className="outerBox" style={outerBoxStyle}> 
          <div className="leftColumn" style={leftColStyle}>
          {
            this.props.people.map((person, i)=> {
              return (
                <DraggableName key={i} name={person.name}/>
              );
            })
          }
          </div>
          <div className="imgBox" style={imgBoxStyle}>
          {
            this.props.people.map((person, i) => {
              return (
                <img key={i} style={imgStyle} src={path + person.image}/>
              );
            })
          }
          </div>
          <Picture/>

        </div>
      </div>
      );
  }
}

render(<App people={people}/>, document.getElementById('app'));