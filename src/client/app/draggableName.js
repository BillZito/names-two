import React from 'react';
import Draggable from 'react-draggable';

class DraggableName extends React.Component{
  constructor(props){
    super(props);
  }

  eventLogger(e: MouseEvent, data: Object){
    // console.log('Event: ', event);
    // console.log('Data: ', data);
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
        onStop={this.props.checkName}>
        <div style={this.props.completed ? solvedStyle : draggableStyle}>
          <div className="handle">{this.props.name}</div>
        </div>
      </Draggable>
    );
  }
}

const draggableStyle = {
  backgroundColor: '#BBE9EE',
  borderRadius: '1px',
  marginBottom: '2px',
};

const solvedStyle = {
  display: 'none'
};

module.exports = DraggableName;