import React, { } from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import GlobalStyles from '../../../constants/GlobalStyles';

import DarkMemeCreate from '../../../../assets/meme_create_dark.svg';
import LightMemeCreate from '../../../../assets/meme_create_light.svg';

const MemeName = ({ memeName, theme, navigation }) => {

    let contentBottom = null;

    if (memeName) {
        contentBottom =
            <TouchableOpacity 
                onPress={() => navigation.push('Meme', {memeName: memeName})}
                style={styles.memeName}
            >
                
                {theme == "light" ?
                    <LightMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={5}/>
                    :
                    <DarkMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={5}/>
                }

                <TextTicker
                    style={theme == 'light' ? GlobalStyles.lightMemeName: GlobalStyles.darkMemeName}
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
        width: 170,
        marginTop: 0,
        marginLeft: 0,
        flexDirection: 'row',
        paddingHorizontal: 5,
    }
});

export default MemeName;
