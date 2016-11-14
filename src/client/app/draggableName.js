import React from 'react';
import Draggable from 'react-draggable';

class DraggableName extends React.Component{
  constructor(props){
    super(props);
  }

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
          <div className="handle">{this.props.name}</div>
        </div>
      </Draggable>
    );
  }
}

module.exports = DraggableName;