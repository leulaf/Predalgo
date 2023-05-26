import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view'
import {ThemeContext} from '../../../context-store/context';
import ImagePost from './ImagePost';
import MultiImagePost from './MultiImagePost';
import TextPost from './TextPost';
import GlobalStyles from '../../constants/GlobalStyles';
const width = Dimensions.get('window').width;


const { height: windowHeight, width: windowWidth} = Dimensions.get("window");


const boxHeight = windowHeight / 2;


export default function AllUserPosts({navigation, posts}){
   const height = Dimensions.get('window').height;
   const width = Dimensions.get('window').width;
   const {theme,setTheme} = useContext(ThemeContext);


   const renderItem = (item, index) => {
       let post

    //    if(index == 0){
    //         post = (
    //             <View style={{marginTop: 50}}>
    //                 <View style={{flexDirection: 'row'}}>
    //                     <View style={{}}>
    //                         <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>
    //                             New
    //                         </Text>
    //                     </View>
    //                 </View>
    //             </View>
    //         );
    //     }else 
        if(item.imageUrl){
            post = <ImagePost
                key={index}
                imageUrl={item.imageUrl}
                title={item.title}
                tags={item.tags}
                memeText={item.memeText}
            />
        }else if(item.imageUrls){
            post = <MultiImagePost
                key={index}
                title={item.title}
                imageUrls={item.imageUrls}
                tags={item.tags}
            />
        }else if(item.text){
            post = <TextPost title={item.title} text={item.text} tags={item.tags} />
        }

        if(index == posts.length -1){
            return (
                <View style={{marginBottom: 150}}>
                    {post}
                </View>
            );
        }


       return post;
   }
  
   return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
            <Tabs.FlatList
                data={posts}
                keyExtractor={(result) => result.id}
                renderItem={({ item, index }) => (
                    renderItem(item, index)
                )}
            />
        </View>
   );
}

const styles = StyleSheet.create({
    darkContainer: {
        backgroundColor: "#282828",
        marginTop: 25,
    },
    lightContainer: {
        backgroundColor: "#F6F6F6",
        marginTop: 25,
    },
});
