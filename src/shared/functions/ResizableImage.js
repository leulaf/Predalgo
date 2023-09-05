import { Image } from 'expo-image';
// import {  Image, } from 'react-native';

// import { Dimensions } from 'react-native';
// const screenWidth = Dimensions.get('window').width;

// const equal = (prevProps, nextProps) => true;
const ResizableImage = ({ image, height, width, maxHeight, maxWidth, style }) => {
    if(!(image)){
        return null;
    }
    
    let ratio = Math.min(1, maxWidth / width, maxHeight / height);

    // let imageHeight, imageWidth

    // if(maxWidth && maxHeight){


    //     if(maxWidth > maxHeight && maxHeight/height <= 1){

    //         imageHeight = maxHeight;
    //         imageWidth = (maxHeight / height) * width;

    //     }else if(maxHeight > maxWidth && maxWidth/width <= 1){

    //         imageWidth = maxWidth;
    //         imageHeight = (maxWidth / width) * height;

    //     }else if(maxWidth === maxHeight && maxWidth/width <= 1){

    //         imageWidth = maxWidth;
    //         imageHeight = (maxWidth / width) * height;

    //     }else if(maxWidth === maxHeight && maxHeight/height <= 1){
    //         imageHeight = maxHeight;
    //         imageWidth = (maxHeight / height) * width;
    //     }else{

    //         imageHeight = height;
    //         imageWidth = width;

    //     }


    // }else if(maxWidth && maxWidth/width <= 1){

    //     imageWidth = maxWidth;
    //     imageHeight = (maxWidth / width) * height;

    // }else if(maxHeight && maxHeight/height <= 1){

    //     imageHeight = maxHeight;
    //     imageWidth = (maxHeight / height) * width;

    // }else{

    //     imageHeight = height;
    //     imageWidth = width;

    // }


    // ////
    // ////
    // ///


    // if(maxWidth && maxHeight){


    //     if(maxWidth > maxHeight && maxHeight/height <= 1){

    //         imageHeight = maxHeight;
    //         imageWidth = (maxHeight / height) * width;

    //     }else if(maxHeight > maxWidth && maxWidth/width <= 1){

    //         imageWidth = maxWidth;
    //         imageHeight = (maxWidth / width) * height;

    //     }else if(maxWidth === maxHeight && maxWidth/width <= 1){

    //         imageWidth = maxWidth;
    //         imageHeight = (maxWidth / width) * height;

    //     }else if(maxWidth === maxHeight && maxHeight/height <= 1){
    //         imageHeight = maxHeight;
    //         imageWidth = (maxHeight / height) * width;
    //     }else{

    //         imageHeight = height;
    //         imageWidth = width;

    //     }


    // }else if(maxWidth && maxWidth/width <= 1){

    //     imageWidth = maxWidth;
    //     imageHeight = (maxWidth / width) * height;

    // }else if(maxHeight && maxHeight/height <= 1){

    //     imageHeight = maxHeight;
    //     imageWidth = (maxHeight / height) * width;

    // }else{

    //     imageHeight = height;
    //     imageWidth = width;

    // }

    return (
        
        <Image
            // placeholder={require('../../assets/placeholder.png')}
            source={{uri : image}}
            alignSelf='center'
            // height={imageHeight}
            // width={imageWidth}
            height={height * ratio}
            width={width * ratio}
            style={style ? style : {}}
            cachePolicy={'disk'}
        />

    );
}

export default ResizableImage;