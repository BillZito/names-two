import React from 'react';
import {render} from 'react-dom';
import people from './people';
import DraggableName from './draggableName';
import Picture from './picture';
// import styles from '../styles.css';

var path = './assets/';

const imgStyle = {
  maxWidth: '50px',
  maxHeight: '50px'
};

class App extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props.people[0].name); //should be bill
  }

  render() {
    return (
      <div> 
        <p> sup </p>
        {
          this.props.people.map((person, i)=> {
            return (
              <div>
                <DraggableName key={i} name={person.name}/>
              </div>
            );
          })
        }
        {
          this.props.people.map((person, i) => {
            return (
              <div>
                <img key={i} style={imgStyle} src={path + person.image}/>
              </div>
            );
          })
        }
        <Picture/>
      </div>
      );
  }
}

render(<App people={people}/>, document.getElementById('app'));