import { useContext} from 'react';
import {Text} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitPost from './methods/SplitPost';

const PostText = ({text, numberOfLines, forPost, forDisplayMeme}) => {
    if(text == undefined || text == null || text == '') {
        return null;
    }

    const {theme} = useContext(ThemeContext);

    return (
        <Text
            numberOfLines={numberOfLines && numberOfLines}
            style={{
                marginHorizontal: forDisplayMeme ? 8 : 14,
                marginTop: 6,
                textAlign: 'auto',
                marginBottom: forPost ? 10 : forDisplayMeme ? 10 : 0,
                marginTop: forPost ? -8 : forDisplayMeme ? -2 : 0,
            }}
        >

            {SplitPost(text, theme).map((textPart, index) => {
                // console.log(textPart);
                return textPart;
            })}
            
        </Text>
    );
}


export default PostText;