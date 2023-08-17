import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

// ~for text use the number of lines or characters in text to determine height
export default overrideItemLayout = (layout, item) => {
    if(item.imageHeight){
        let ratio = Math.min(1, windowWidth / item.imageWidth, 500 / item.imageHeight);

        layout.size = (item.imageHeight * ratio)+100;
        layout.span = windowWidth;
        
    }else{
        layout.size = 200;
        layout.span = windowWidth;
    }
};