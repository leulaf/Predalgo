import React, { } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import GlobalStyles from '../../../constants/GlobalStyles';

import DownDark from '../../../../assets/down_dark.svg';

import DarkMemeCreate from '../../../../assets/meme_create_dark.svg';
import LightMemeCreate from '../../../../assets/meme_create_light.svg';

const windowWidth = Dimensions.get('window').width;

const MemeName = ({ memeName, templateUploader, theme, navToMeme }) => {

    let contentBottom = null;

    if (memeName) {
        contentBottom =
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navToMeme()}
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
                    {memeName + " - @" + templateUploader}
                </TextTicker>
            </TouchableOpacity>
    }else {
        return null;
    }

    return contentBottom;
}

const styles = StyleSheet.create({
    memeName: {
        maxWidth: windowWidth/2.3,
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingRight: 20,
        paddingVertical: 3,
    }
});

export default MemeName;