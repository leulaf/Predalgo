import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import TextTicker from 'react-native-text-ticker'
import {ThemeContext} from '../../../context-store/context';

import DarkMemeCreate from '../../../assets/meme_create_light.svg';
import LightMemeCreate from '../../../assets/meme_create_dark.svg';

import GlobalStyles from '../../constants/GlobalStyles';

const PostBottom = ({ memeText, tags, hideBottom }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    let content
    let bottomTags

    if(tags){
        bottomTags = tags.map((d, index) => 
            <TouchableOpacity key={index}>
                <Text style={theme == 'light' ? GlobalStyles.lightPostBottomText: GlobalStyles.darkPostBottomText}>
                    #meme
                </Text>
            </TouchableOpacity>);
    }
    
    if (memeText && tags) {
        content =  <View flexDirection={"row"}>
            <View style={styles.memeName}>
                
                {theme == "light" ?
                    <LightMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                    :
                    <DarkMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                }
                
                <TextTicker
                    style={theme == 'light' ? GlobalStyles.lightMemeName: GlobalStyles.darkMemeName}
                    duration={12000}
                    loop
                    // bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                    {memeText}
                </TextTicker>
                
            </View>
            
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={30} >
                {bottomTags}
            </ScrollView>
        </View>
    } else if (memeText) {
        content =
            <View style={styles.memeName}>
                
                {theme == "light" ?
                    <LightMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                    :
                    <DarkMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                }

                <TextTicker
                    style={theme == 'light' ? GlobalStyles.lightMemeName: GlobalStyles.darkMemeName}
                    duration={12000}
                    loop
                    // bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                    {memeText}
                </TextTicker>
        </View>

    }else if (tags) {
        content = <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={5}>
                    {bottomTags}
                </ScrollView>;
    } else {
      content = <View marginVertical={hideBottom ? 0 : 10}></View>;
    }
  
    return content;
}

const styles = StyleSheet.create({
    bottomLeftContainer: {
        flexDirection: 'row',
    },
    memeName: {
        width: 170,
        marginLeft: 0,
        flexDirection: 'row',
    },
    hashTagAndAt: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#0147BD', 
        marginVertical: 7, 
        marginHorizontal: 5
    }
});

export default PostBottom;
