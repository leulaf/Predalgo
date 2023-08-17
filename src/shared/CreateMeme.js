import PinturaEditor from "@pqina/react-native-expo-pintura";

import React, {useRef} from 'react';

import { manipulateAsync } from 'expo-image-manipulator';


// React.memo??????????????????????
// Load Meme with template and template state
export default CreateMeme = ({image, templateState, setFinished, setImage}) => {
    const editorRef = useRef(null);

    return (
        <PinturaEditor
            ref={editorRef}
            
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
                    setFinished(true);
                    setImage(res.uri);
                    // console.log(res.uri)
                })
            }}
        />    
    )
};