import React, { useState, useRef, useEffect } from 'react';
import PinturaEditor from "@pqina/react-native-expo-pintura";

import {
    createDefaultImageReader,
    createDefaultImageWriter,
    createDefaultImageOrienter,
    setPlugins,
    plugin_crop,
    locale_en_gb,
    plugin_crop_locale_en_gb,
} from '@pqina/pintura';
import { set } from 'react-native-reanimated';

setPlugins(plugin_crop);




const PinturaCompressImage = ({ image, setImage, setBase64, cameraPic, setCameraPic }) => {
    // if (!image) {
    //     return null;
    // }
  
    const editorRef = useRef(null);

    const editorDefaults = {
        imageReader: createDefaultImageReader(),
        imageWriter: { 
            quality: cameraPic ? 0.6 : 0.3,
            targetSize: {
                height: 500,
            },
         }, // picture taken through camera is already compressed
        imageOrienter: createDefaultImageOrienter(),
        locale: {
            ...locale_en_gb,
            ...plugin_crop_locale_en_gb,
        },
    };

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

          {...editorDefaults}

          onProcess={({ dest, imageState }) => {
            // dest is output file in dataURI format
            
            if(image){
                setImage(dest);
            setBase64(null);
            }
            

            if (cameraPic && image) {
                setCameraPic(false);
            }

          }}
        />
    );
}

export default PinturaCompressImage;