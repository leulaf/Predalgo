import { useContext} from 'react';
import {Text} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitPost from './methods/SplitPost';

const PostText = ({text, numberOfLines, forPost, forDisplayMeme, repostedWithComment}) => {
    if(text == undefined || text == null || text == '') {
        return null;
    }

    const {theme} = useContext(ThemeContext);

    return (
        <Text
            numberOfLines={numberOfLines && numberOfLines}
            style={{
                marginHorizontal: forDisplayMeme ? 8 : 13,
                marginBottom: 2,
                textAlign: 'auto',
                marginBottom: repostedWithComment && 15,
                // marginBottom: forDisplayMeme ? 10 : repostedWithComment ? 15 : 0,
                // marginTop: forDisplayMeme ? -2 : 10,
                fontSize : 18
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