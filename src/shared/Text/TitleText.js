
import {useContext} from 'react';
import {Text, StyleSheet} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitTitle from './methods/SplitTitle';

const TitleText = ({title, numberOfLines}) => {
    // if(!(title)) {
    //     return null;
    // }

    const {theme} = useContext(ThemeContext);

    return (
        // <Text
        //     numberOfLines={numberOfLines && numberOfLines}
        //     style={{
        //         marginHorizontal: 12.5,
        //         marginTop: 4,
        //         textAlign: 'auto',
        //     }}
        // >

        //     {SplitTitle(title, theme).map((textPart, index) => {
        //         // console.log(textPart);
        //         return textPart;
        //     })}
            
        // </Text>

        <Text
            numberOfLines={numberOfLines && numberOfLines}
            style={
                theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle
            }
        >
            {title}
        </Text>


    );
}

const styles = StyleSheet.create({
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "500",
        color: '#333333',
        textAlign: 'auto',
        marginHorizontal: 12.5,
        marginTop: 4,
        letterSpacing: 0.5,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "500",
        color: '#DDDDDD',
        textAlign: 'auto',
        marginHorizontal: 12.5,
        marginTop: 4,
        letterSpacing: 0.5,
    },
})

export default TitleText;