import React from 'react';

class Picture extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      'highlighted': false
    };
  }

  highlight() {
    console.log('highlight called');
    this.setState({
      highlighted: true
    });
    this.render();
  }

  render() {
    console.log('i was rendered state', this.state.highlighted);
    return (
      <img onMouseEnter={this.highlight.bind(this)} src={this.props.src} style={this.state.highlighted ? highlightStyle : imgStyle}/>
    );
  }
}

const imgStyle = {
  height: '150px',
  width: '150px',
  margin: '5px',
  borderRadius: '3px'
};

const highlightStyle = {
  height: '150px',
  width: '150px',
  margin: '5px',
  borderRadius: '3px',
  borderColor: 'blue',
  opacity: '0.6'
}

module.exports = Picture;