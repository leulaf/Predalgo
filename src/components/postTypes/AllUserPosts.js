import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view'
import ImagePost from './ImagePost';
import MultiImagePost from './MultiImagePost';
import TextPost from './TextPost';
import Carousel from 'react-native-reanimated-carousel';
const width = Dimensions.get('window').width;


const { height: windowHeight, width: windowWidth} = Dimensions.get("window");


const boxHeight = windowHeight / 2;


export default function AllUserPosts({navigation, posts}){
   const height = Dimensions.get('window').height;
   const width = Dimensions.get('window').width;


   const renderItem = (item, index) => {
       let post
       if(item.imageUrl){
           post = <ImagePost
               key={index}
               imageUrl={item.imageUrl}
               title={item.title + " " + index}
               tags={item.tags}
               memeText={item.memeText}
           />
       }else if(item.imageUrls){
           post = <MultiImagePost
               key={index}
               title={item.title + index}
               imageUrls={item.imageUrls}
               tags={item.tags}
           />
       }else if(item.text){
           post = <TextPost title={item.title} text={item.text} tags={item.tags} />
       }


       return post;
   }
  
   return (
       <View style={{marginTop: 50}}>
          
           <View style={{flexDirection: 'row'}}>
               <View style={{}}>
                   <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>Popular</Text>
               </View>
           </View>


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


});
