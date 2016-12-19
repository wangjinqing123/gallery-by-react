

import React from 'react';

export default class ImgFigure extends React.Component{
  render(){
    var styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度不为0，则添加。
    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform','transfrom']).forEach(function(value,index ){
        styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));

    }
    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption className="figcaption">
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}
