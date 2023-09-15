import PinturaEditor from "@pqina/react-native-expo-pintura";

import { getEditorDefaults } from '@pqina/pintura';

import React, {useRef} from 'react';

import { manipulateAsync } from 'expo-image-manipulator';

// import Predalgo_logo_dark from '../../../assets/predalgo_logo_dark.svg';

// React.memo??????????????????????
// Load Meme with template and template state
export default Watermark = React.memo(({image, templateState, setImage, id}) => {
    const editorRef = useRef(null);
    console.log(image)
    const editorDefaults = getEditorDefaults({
        imageWriter: {
            targetSize: {
                width: 512,
                height: 512,
                fit: 'contain',
            },
            postprocessImageData: (imageData) =>
                new Promise((resolve, reject) => {
                    // Create a canvas element to handle the imageData
                    const canvas = document.createElement('canvas');
                    canvas.width = imageData.width;
                    canvas.height = imageData.height;
                    const ctx = canvas.getContext('2d');
                    ctx.putImageData(imageData, 0, 0);
    
                    // Draw our watermark on top
                    const watermark = new Image();
                    watermark.onload = () => {
                        // how to draw the image to the canvas
                        ctx.globalCompositeOperation = 'screen';
    
                        // draw the watermark in the top right corner
                        ctx.drawImage(
                            watermark,
    
                            // the watermark x and y position
                            imageData.width - 100 - 20,
                            20,
    
                            // the watermark width and height
                            100,
                            40
                        );
    
                        // Get and return the modified imageData
                        resolve(
                            ctx.getImageData(
                                0,
                                0,
                                imageData.width,
                                imageData.height
                            )
                        );
                    };
                    watermark.onerror = reject;
                    watermark.crossOrigin = 'Anonymous';
                    watermark.src = '../../../assets/add.svg';
                }),
        },
    });

    return (
        <PinturaEditor
            ref={editorRef}
            {...editorDefaults}
            style={{
                width: "0%",
                height: "0%",
            }}
            // src={image}
            // onClose={() => console.log('closed')}
            // onDestroy={() => console.log('destroyed')}
            // onLoad={() => 
            //     editorRef.current.editor.processImage(templateState)
            // }
            onInit={() => 
                editorRef.current.editor.processImage(image, templateState)
            }
            onProcess={async({ dest }) => {
                manipulateAsync(dest, [], ).then((res) => {
                    console.log(res.uri)
                    setImage(res.uri);
                    // console.log(res.uri)
                })
            }}
        />
    )
}, itemEquals);

const itemEquals = (prevItem, nextItem) => {
    return prevItem.id === nextItem.id;
}
