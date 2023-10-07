import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';

import ImagePost from '../postTypes/ImagePost';
import MultiImagePost from '../postTypes/MultiImagePost';
import TextPost from '../postTypes/TextPost';
// import Carousel from 'react-native-reanimated-carousel';
const width = Dimensions.get('window').width;

const { height: windowHeight, width: windowWidth} = Dimensions.get("window");

const boxHeight = windowHeight / 2;

export default function AllPosts({navigation, posts}){
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
                profile={item.profile}
            />
        }else if(item.imageUrls){
            post = <MultiImagePost 
                key={index} 
                // url={item.url} 
                title={item.title + index}
                imageUrls={item.imageUrls}
                tags={item.tags}
                profile={item.profile}
            />
        }else if(item.text){
            post = <TextPost title={item.title} text={item.text} tags={item.tags} profile={item.profile}/>
        }

        return post;
    }
    
    return (null
        // <Carousel
        //     // loop
        //     panGestureHandlerProps={{
        //         activeOffsetY: [-10, 10],
        //     }}
        //     width={width}
        //     height={height/2}
        //     autoPlay={false}
        //     mode={'parallax'}
        //     modeConfig={{
        //         parallaxScrollingOffset: 0,
        //         parallaxScrollingScale: 1,
        //         parallaxAdjacentItemScale: .97 ,
        //     }}
        //     style={{ marginTop: 20, height: height }}
        //     vertical
        //     pagingEnabled={true}
        //     snapEnabled={true}
        //     data={posts}
        //     scrollAnimationDuration={400}
        //     onSnapToItem={(index) => console.log('current index:', index)}
        //     renderItem={({ item, index }) => (
        //         renderItem(item, index)
        //     )}
        // />
    );
}

const styles = StyleSheet.create({

});
  