require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'
import ImgFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转化成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr){
  for(let i = 0;i<imageDataArr.length;i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

//－30到30 度数
function get30DegRandom(){
  return ((Math.random() > 0.5 ? '' : '-' )+Math.floor( Math.random() * 30 ));
}
// 边界内随机值
function getRangeRandom(low,high){
  return Math.floor(Math.random()*(high-low) + low);
}
let Constant = {
  //中间区域
  centerPos:{
    left:0,
    right:0
  },
  hPosRange:{//水平方向的取值范围
    //左边区域
    leftSecX:[0,0],
    //右边区域
    rightSecX:[0,0],
    y:[0,0]
  },
  vPosRange:{//垂直方向的取值范围
    x:[0,0],
    //上边区域
    topY:[0,0]
  }
}

class AppComponent extends React.Component {

  //重新布局所有图片
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,

        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,

        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random()*2), //取一个或者不取

        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
    //首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0] ={
      pos:centerPos,
      rotate:0,
      isCenter:true
    }
    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeTopArr[index] = {
        pos:{
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }
    });
    //布局左右两侧的图片
    for(var i = 0 , j = imgsArrangeArr.length , k = j / 2; i < j; i++){
      var hPosRangeLORX = null;
      //前半部分布局在左边
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{//后半部分布局在左边
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos:{
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      };
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex , 0 , imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });
  }
  constructor(props){
    super(props);
    this.state= {
      imgsArrangeArr:[]
    }
  }
  //组件加载以后，为每张图片计算其位置
  componentDidMount(){

    //首先拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH/2);
    //拿到－个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW/2),
        halfImgH = Math.floor(imgH/2);
    //计算中心图片的位置点
    Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };
    //计算左侧，右侧区域图片排布位置的取值范围
    Constant.hPosRange.leftSecX[0] = -halfImgW;
    Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
    Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    Constant.hPosRange.y[0] = -halfImgH;
    Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    Constant.vPosRange.topY[0] = -halfImgH;
    Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    Constant.vPosRange.x[0] = halfStageW - imgW;
    Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }
  //闭包
  inverse(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this);
  }
  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }
  render() {
    let controllerUnits =[],
        imgFigures  = [];
    imageDatas.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        };
      }
      imgFigures.push(
        <ImgFigure
          key={index}
          ref={'imgFigure'+index}
          data={value}
          arrange={this.state.imgsArrangeArr[index]}
          inverse={this.inverse(index)}
          center={this.center(index)}
        />);
      controllerUnits.push(
        <ControllerUnit
          key={index}
          arrange={this.state.imgsArrangeArr[index]}
          inverse={this.inverse(index)}
          center={this.center(index)}
        />)
    }.bind(this))
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
