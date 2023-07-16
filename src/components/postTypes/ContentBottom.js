import React, {useContext, useState, useEffect} from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import TextTicker from 'react-native-text-ticker'
import {ThemeContext} from '../../../context-store/context';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, getDocs, where, collection, query } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../../constants/GlobalStyles';

import DarkMemeCreate from '../../../assets/post_meme_create_light.svg';
import LightMemeCreate from '../../../assets/post_meme_create_dark.svg';

const ContentBottom = ({ tags, memeName }) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    let contentBottom = null;
    let bottomTags

    if(tags){
        bottomTags = tags.map((d, index) => 
            <TouchableOpacity
                key={index}
                onPress={() => navigateToTag(tags[index])}
            >
                <Text style={theme == 'light' ? GlobalStyles.lightPostBottomText: GlobalStyles.darkPostBottomText}>
                    {tags[index]}
                </Text>
            </TouchableOpacity>
        );
    }

    if (memeName && tags) {
        contentBottom =  <View flexDirection={"row"}>
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
            
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={30} >
                {bottomTags}
            </ScrollView>
        </View>
    } else if (memeName) {
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
    }else if (tags) {
        contentBottom = <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={5}>
                    {bottomTags}
                </ScrollView>;
    } else {
        contentBottom = <View marginVertical={hideBottom ? 0 : 10}></View>;
    }

    const navigateToTag = async(tag) => {
        if(tag.charAt(0) == '#'){
            navigation.push('Tag', {tag: tag});
        }else if(tag.charAt(0) == '@'){
            const username = tag.substring(1);

            const q = query(collection(db, "users"), where("username", "==", username));

            let user = null;

            await getDocs(q).then((snapshot) => {
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    user = { ...data, id: doc.id }; // Add the id property to the user object
                });
            });

            if(user){
                navigation.push('Profile', { user: user });
            }

        }
    }

    // if post is deleted or content is null, don't show post
    if (contentBottom == null) {  
        return null;
    }

    return contentBottom;
}

const styles = StyleSheet.create({
    memeName: {
        width: 170,
        marginTop: 8,
        marginLeft: 0,
        flexDirection: 'row',
    },
});

export default ContentBottom;
