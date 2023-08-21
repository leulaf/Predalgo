import React, { } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import GlobalStyles from '../../../constants/GlobalStyles';

import DarkMemeCreate from '../../../../assets/meme_create_dark.svg';

const windowWidth = Dimensions.get('window').width;

const MemeName = ({ memeName, theme, navigation }) => {

    let contentBottom = null;

    if (memeName) {
        contentBottom =
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.push('Meme', {memeName: memeName})}
                style={styles.memeName}
            >
                
                <DarkMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={5}/>

                <TextTicker
                    style={GlobalStyles.darkMemeName}
                    duration={12000}
                    loop
                    // bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                    {memeName}
                </TextTicker>
            </TouchableOpacity>
    }else {
        return null;
    }

    return contentBottom;
}

const styles = StyleSheet.create({
    memeName: {
        width: windowWidth,
        paddingLeft: 10,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        padding: 5,
        position: 'absolute',
    }
});

export default MemeName;
