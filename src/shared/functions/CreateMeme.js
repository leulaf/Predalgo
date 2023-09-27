import PinturaEditor from "@pqina/react-native-expo-pintura";

import React, {useRef} from 'react';

import { manipulateAsync } from 'expo-image-manipulator';


// React.memo??????????????????????
// Load Meme with template and template state
export default CreateMeme = React.memo(({image, templateState, setFinished, setImage, id}) => {
    const editorRef = useRef(null);

    return (
        <PinturaEditor
            ref={editorRef}
            style={{
                width: "0%",
                height: "0%",
            }}
            src={image}
            // onClose={() => console.log('closed')}
            // onDestroy={() => console.log('destroyed')}
            onLoad={() => 
                editorRef.current.editor.processImage(templateState)
            }
            // onInit={() => 
            //     editorRef.current.editor.processImage(image, templateState)
            // }
            onProcess={async({ dest }) => {
                manipulateAsync(dest, [], ).then((res) => {
                    setFinished(true);
                    setImage(res.uri);
                    // console.log(res.uri)
                })
            }}
        />
    )
}, itemEquals);

const itemEquals = (prevItem, nextItem) => {
    // return prevItem.id === nextItem.id;
    return false
}
