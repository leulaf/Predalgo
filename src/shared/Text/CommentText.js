import React, {useContext} from 'react';
import {Text} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitComment from './methods/SplitComment';

const CommentText = ({text}) => {
    if(text == undefined || text == null || text == '') {
        return null;
    }
    const {theme} = useContext(ThemeContext);

    return (
        <Text
            numberOfLines={15}
            style={{
                marginHorizontal: 12,
                marginTop: 7,
                textAlign: 'auto',
            }}
        >

            {SplitComment(text, theme).map((textPart, index) => {
                // console.log(textPart);
                return textPart;
            })}
            
        </Text>
    );
}


export default CommentText;