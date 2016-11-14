import React from 'react';
import Draggable from 'react-draggable';

class GameBoard extends React.Component{
  eventLogger(e: MouseEvent, data: Object){
    console.log('Event: ', event);
    console.log('Data: ', data);
  }

  render() {
    return (
      <Draggable
        axis="both"
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
        position={null}
        grid={[25, 25]}
        zIndex={100}
        onStart={this.eventLogger}
        onDrag={this.eventLogger}
        onStop={this.eventLogger}>
        <div>
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
    );
  }
}

module.exports = GameBoard;