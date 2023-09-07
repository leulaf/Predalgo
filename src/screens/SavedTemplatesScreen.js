import React, {useEffect, useState, useContext} from 'react';
import {View, Image, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import SavedTemplatesTopBar from '../ScreenTop/SavedTemplatesTopBar';

import { StackActions } from '@react-navigation/native';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList } from '@shopify/flash-list';

import ResizableImage from '../shared/functions/ResizableImage';


const navToMeme = (navigation, item, forPost, forCommentOnComment, forCommentOnPost) => () => {
    console.log(item)
    if(forCommentOnComment || forCommentOnPost || forPost){
      navigation.dispatch(
          StackActions.replace('EditMeme', {
            uploader: item.uploader,
            replyMemeName: item.name,
            imageUrl: item.url,
            height: item.height,
            width: item.width,
            templateExists: true,
            forCommentOnComment: forCommentOnComment,
            forCommentOnPost: forCommentOnPost,
            forPost: forPost,
        })
      )
    }else{
      navigation.navigate('Meme', {
          uploader: item.uploader,
          memeName: item.name,
          template: item.url,
          height: item.height,
          width: item.width,
          useCount: item.useCount,
          uploader: item.uploader,
          forCommentOnComment: forCommentOnComment,
          forCommentOnPost: forCommentOnPost,
          forPost: forPost,
          fromSavedTemplates: true,
      })
    }
  }
const navToSearchMemes = (navigation, forPost, forCommentOnComment, forCommentOnPost) => () => {
    if(forCommentOnComment || forCommentOnPost || forPost){
      navigation.dispatch(
          StackActions.replace('SearchMemes', {
          forCommentOnComment: forCommentOnComment,
          forCommentOnPost: forCommentOnPost,
          forPost: forPost,
        })
      )
    }else{
      navigation.navigate(('SearchMemes'), {
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
        forPost: forPost,
      })
    }
  }

const lightBackground = require('../../assets/AddPostBackgroundLight.png');
const darkBackground = require('../../assets/AddPostBackgroundDark.png');

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const keyExtractor = (item, index) => item.id.toString() + "-" + index.toString();

const SavedTemplatesScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [memeTemplates, setMemeTemplates] = useState([{id : "fir"}, {id: "sec"}]);

    const {forCommentOnComment, forCommentOnPost, forPost} = route?.params;

    useEffect(() => {
        getFirstFourTemplates();
    }, []);

    const getFirstFourTemplates = React.useCallback(async () => {
        const q = query(
            collection(db, "savedImageTemplates", firebase.auth().currentUser.uid, "templates"),
            limit(8)
        );
        
        await getDocs(q)
        .then((snapshot) => {
            
            let templates = snapshot.docs.map(doc => {
                
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            setMemeTemplates(templates);
        });
    }, []);

    const renderItem = React.useCallback(({item, index}) => {

        return (
            <Animated.View
                entering={FadeIn}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={navToMeme(navigation, item, forPost, forCommentOnComment, forCommentOnPost)}
                style={
                  index % 2 == 1 ?
                    {marginLeft: 2, marginRight: 2, marginBottom: 6} 
                  :
                    {marginLeft: 2, marginRight: 2, marginBottom: 6} 
                }
              >
                {/* Meme name
                    <Text style={theme == 'light' ? styles.lightName : styles.darkName}>
                        {item.name}
                    </Text> */}

                <ResizableImage
                  image={item.url}
                  maxWidth={windowWidth/2 - 8}
                  maxHeight={500}
                  height={item.height}
                  width={item.width}
                  style={{borderRadius: 10}}
                />
              </TouchableOpacity>
            </Animated.View>
          );
    }, [])

    
    return (
        <Animated.View
            entering={FadeIn}
            style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, {flex: 1}]}
        >

            <ImageBackground 
                source={theme == 'light' ? lightBackground : darkBackground} 
                resizeMode="cover"
                // height={windowHeight}
                // width={windowWidth}
                style={theme == 'light' ? styles.lightBackground : styles.darkBackground}
            >

                <SavedTemplatesTopBar
                    navToSearchMemes={navToSearchMemes(navigation, forPost, forCommentOnComment, forCommentOnPost)}
                    // closeBottomSheet={() => 
                    //   toggleBottomSheet()
                    // }
                />

                <MasonryFlashList
                    // ref={flashListRef}
                    data={memeTemplates}
                    numColumns={2}

                    // onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
                    // onEndReachedThreshold={1} //need to implement infinite scroll
                    
                    renderItem={renderItem}
                    // extraData={[]}

                    removeClippedSubviews={true}

                    estimatedItemSize={200}
                    estimatedListSize={{height: windowHeight, width: windowWidth}}

                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={{paddingTop: 5}}

                    keyExtractor={keyExtractor}
                />
            </ImageBackground>
                
      </Animated.View>
    );
}

const styles = StyleSheet.create({
    darkBackground: {
        flex: 1,
        height: windowHeight*1.7,
        // justifyContent: 'center',
    },
        lightBackground: {
        flex: 1,
        height: windowHeight*1.6,
        // justifyContent: 'center',
    },
    lightName: {
        fontSize: 22,
        fontWeight: "600",
        color: '#444444',
        marginLeft: 10,
    },
    darkName: {
        fontSize: 22,
        fontWeight: "600",
        color: '#EEEEEE',
        marginLeft: 10,
    },
    profilePicture: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 100,
    },
    lightText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: "500",
        color: '#444444',
    },
    darkText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: "500",
        color: '#EEEEEE',
    },
    lightListItem: { 
        flex: 1, 
        height: 60, 
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center', 
        marginHorizontal: 0, 
        marginVertical: 5, 
        borderRadius: 100, 
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    darkListItem: { 
        flex: 1, 
        height: 60, 
        flexDirection: 'row',
        backgroundColor: "#1D1D1D",
        alignItems: 'center', 
        marginHorizontal: 0, 
        marginVertical: 5, 
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#444444',
    },
});

export default SavedTemplatesScreen;