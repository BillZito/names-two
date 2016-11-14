import React from 'react';
import {render} from 'react-dom';
import GameBoard from './gameboard';

class App extends React.Component {
  // constructor(){
  //   super()
  // }

  render() {
    return (
      <div> 
        <p>Sup</p>
        <GameBoard/>
      </div>
      );
  }
}

render(<App/>, document.getElementById('app'));