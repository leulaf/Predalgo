import { Dimensions } from 'react-native';

import Image from 'react-native-scalable-image';

export default ImageContainer = (props) => {
    const windowWidth = Dimensions.get('window').width;
    
    return (
        <Image 
            width={windowWidth} // this will make image take full width of the device
            height={800}
            source={props.imageSource} // pass the image source via props
            style={{borderRadius: 10, alignSelf: 'center'}}
        />
    );
};