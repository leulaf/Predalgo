
import {useContext} from 'react';
import {Text, StyleSheet} from 'react-native';
import { ThemeContext } from '../../../context-store/context';

import SplitTitle from './methods/SplitTitle';

const TitleText = ({title, numberOfLines, repostedWithComment}) => {
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
                [theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle,
                    {
                        fontSize: repostedWithComment ? 20 : 20,
                        marginTop: repostedWithComment && -5,
                        marginBottom: 8,
                    }
                ]
            }
        >
            {/* sdfgsdfg ssdf sdfsdf sdfs sdffsdg */}
            {title}
        </Text>


    );
}

const styles = StyleSheet.create({
    lightPostTitle: {
        fontSize: 20,
        // fontWeight: "500",
        fontFamily: "NotoSans_500Medium",
        // color: '#333333',
        color: '#000',
        textAlign: 'auto',
        marginHorizontal: 13,
        // marginTop: 4,
        letterSpacing: 0.2,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "500",
        // color: '#DDDDDD',
        color: '#FFF',
        textAlign: 'auto',
        marginHorizontal: 13,
        // marginTop: 4,
        letterSpacing: 0.2,
    },
})

export default TitleText;