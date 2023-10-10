import React, {useContext, useState, useEffect} from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import TextTicker from 'react-native-text-ticker'
import {ThemeContext} from '../../../context-store/context';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, updateDoc, getDocs, where, collection, query } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../../constants/GlobalStyles';

import DarkMemeCreate from '../../../assets/post_meme_create_dark.svg';
import LightMemeCreate from '../../../assets/post_meme_create_light.svg';


const windowWidth = Dimensions.get('window').width;


const navigateToTag = (navigation, tag) => async () => {
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
                navigation.push('Profile', {
                    profile: user.id,
                    username: user.username,
                    profilePic: user.profilePic,
                    bioData: user.bio,
                    followersCountData: user.followers,
                    postsCountData: user.posts,
                });
            }

        }
        // const q = query(
        //     collection(db, "comments", "pjYXUKPOEH24C9Jkjjkw", "comments"),
        //     where("memeName", "!=", "")
        // );
        
        // await getDocs(q)
        //     .then(async (snapshot) => {
        //         let templates = snapshot.docs.map(doc => {
        //             const data = doc.data();
        //             const id = doc.id;
        //             // Add a new document in collection "cities"
        //             addName(id);
        //         })
        //     });
        // }

        // const addName = async(id) => {
        // updateDoc(doc(db, "comments", "pjYXUKPOEH24C9Jkjjkw", "comments", id), {
        //     templateUploader: "Leul"
        // });
}

const ContentBottom = ({ tags, memeName, templateUploader, navToPost, navToMeme }) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    
    let bottomTags

    if(tags){
        bottomTags = tags.map((d, index) => 
            <TouchableOpacity
                onPress={navigateToTag(navigation, tags[index])}
            >
                <Text style={theme == 'light' ? GlobalStyles.lightPostBottomText: GlobalStyles.darkPostBottomText}>
                    {tags[index]}
                </Text>
            </TouchableOpacity>
        );
    }


    

    

    // return contentBottom;

    return (
        <View flexDirection={"row"} marginBottom={-5} marginTop={0}>
            {   memeName &&
                 <TouchableOpacity
                    onPress={navToMeme}
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
                        {
                            templateUploader ?
                                memeName + " - @" + templateUploader
                            :
                                memeName
                        }
                    </TextTicker>
                    
                </TouchableOpacity>
            }
            {   tags &&
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={5} paddingRight={10} paddingTop={memeName && 6}>
                    {bottomTags}
                </ScrollView>
            }

            <TouchableOpacity 
                onPress={
                    navToPost ?
                        () => navToPost()
                    :
                        () =>{}
                }  
                style={{flex: 1, height: 'auto'}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    memeName: {
        maxWidth: windowWidth/2.3,
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 0,
        paddingTop: 12,
    },
});

export default ContentBottom;
