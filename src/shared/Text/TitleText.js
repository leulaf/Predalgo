
import {useContext} from 'react';
import {Text} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitTitle from './methods/SplitTitle';

const PostText = ({text, numberOfLines}) => {
    if(!(text)) {
        return null;
    }

    const {theme} = useContext(ThemeContext);

    return (
        <Text
            numberOfLines={numberOfLines && numberOfLines}
            style={{
                marginHorizontal: 12.5,
                marginTop: 4,
                textAlign: 'auto',
            }}
        >

            {SplitTitle(text, theme).map((textPart, index) => {
                // console.log(textPart);
                return textPart;
            })}
            
        </Text>
    );
}


export default PostText;