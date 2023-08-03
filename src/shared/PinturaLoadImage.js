import React, { useRef} from 'react';
import PinturaEditor from "@pqina/react-native-expo-pintura";

import { manipulateAsync } from 'expo-image-manipulator';



const PinturaLoadImage = ({ image, imageState, setImage, }) => {

    
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
            editorRef.current.editor.processImage(image, imageState)
        }
        onProcess={async({ dest }) => {
            manipulateAsync(dest, [], ).then((res) => {
                setFinished(true);
                setImage(res.uri);
                // console.log(res.uri)
            })
        }}
    />      
  );
};

export default PinturaLoadImage;