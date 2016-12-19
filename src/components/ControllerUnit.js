
import React from 'react';

export default class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {

    }
  }
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    var controllerUnitName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerUnitName += ' is-center';
      if(this.props.arrange.isInverse){
        controllerUnitName += ' is-inverse'
      }
    }

    return (
        <span
          className={controllerUnitName}
          onClick={this.handleClick}
        ></span>
    )
  }
}
