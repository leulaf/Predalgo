import React, { useState, useRef, useEffect } from 'react';
import PinturaEditor from "@pqina/react-native-expo-pintura";



const PinturaLoadImage = ({ image, imageState, setImage, setBase64, }) => {

    const editorRef = useRef(null);

    // console.log("image--", image);

    return (
        <PinturaEditor
          ref={editorRef}
          

          src={image}


          onLoaderror={(err) => {
            // console.log("onLoaderror", err);
          }}


          onLoad={({ size }) => {
            editorRef.current.editor.processImage();
          }}


          onProcess={({ dest, imageState }) => {
            // dest is output file in dataURI format
            // console.log("dest", dest);
            if(image){
                // console.log(dest);
                // console.log("dest");
                setImage(dest);
                setBase64(null);
            }
            

          }}
        />
    );
}

export default PinturaLoadImage;