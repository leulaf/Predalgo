import { Image } from 'expo-image';

const ResizableImage = ({ image, height, width, maxHeight, maxWidth, borderRadius, style }) => {
    if(image === null || image === undefined || image === ''){
        return null;
    }
    let imageHeight, imageWidth

    if(maxWidth && maxHeight){


        if(height > width && maxHeight/height <= 1){

            imageHeight = maxHeight;
            imageWidth = (maxHeight / height) * width;

        }else if(width > height && maxWidth/width <= 1){

            imageWidth = maxWidth;
            imageHeight = (maxWidth / width) * height;

        }else if(width === height && maxWidth/width <= 1){

            imageWidth = maxWidth;
            imageHeight = (maxWidth / width) * height;

        }else{

            imageHeight = height;
            imageWidth = width;

        }


    }else if(maxWidth && maxWidth/width <= 1){

        imageWidth = maxWidth;
        imageHeight = (maxWidth / width) * height;

    }else if(maxHeight && maxHeight/height <= 1){

        imageHeight = maxHeight;
        imageWidth = (maxHeight / height) * width;

    }else{

        imageHeight = height;
        imageWidth = width;

    }


    return (
        
        <Image
            // placeholder={require('../../assets/placeholder.png')}
            source={{uri : image}}
            alignSelf='center'
            height={imageHeight}
            width={imageWidth}

            style={style ? style : {}}
            cachePolicy={'disk'}

        />

    );
}

export default ResizableImage;