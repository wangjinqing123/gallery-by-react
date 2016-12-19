

import React from 'react';

export default class ImgFigure extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    //翻转和居中图片
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    var styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度不为0，则添加。
    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform','transfrom']).forEach(function(value ){
        styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));
    }
    //
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }
    var imgFigureClassName = 'img-figure';
    //是否翻转
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse':'';
    return (
      <figure
        className={imgFigureClassName}
        style={styleObj}
        onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}
