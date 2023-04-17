import React, {useContext, useEffect} from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import {ThemeContext} from '../../../context-store/context';
import ThreeDotsLight from '../../../assets/three_dots_light.svg';
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';
import GlobalStyles from '../../constants/GlobalStyles';

const PostContainer = ({ navigation, title, content }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    let threeDots
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={40} height={40} style={styles.threeDots}/>
    }else{
        threeDots = <ThreeDotsDark width={40} height={40} style={styles.threeDots}/>
    }

    return (
        <View style={theme == 'light' ? GlobalStyles.lightPostContainer: GlobalStyles.darkPostContainer}>
            {title? 
                <View style={{flexDirection: 'row'}}>
                    <Text numberOfLines={2} 
                    style={theme == 'light' ? GlobalStyles.lightPostText: GlobalStyles.darkPostText}>{title}</Text>
                    {threeDots}
                </View>
            :
                <View style={{flexDirection: 'row'}}>
                    <View style={{marginVertical: 22}}></View>
                    {threeDots}
                </View>
            }
            {content}
        </View>
    );
    }

const styles = StyleSheet.create({
    threeDots: {
        marginLeft: 365,
        position:'absolute',
    },
});

export default PostContainer;
