import { useContext} from 'react';
import {Text} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitPost from './methods/SplitPost';

const PostText = ({text, numberOfLines}) => {
    if(text == undefined || text == null || text == '') {
        return null;
    }

    const {theme} = useContext(ThemeContext);

    return (
        <Text
            numberOfLines={numberOfLines && numberOfLines}
            style={{
                marginHorizontal: 14,
                marginTop: 6,
                textAlign: 'auto',
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