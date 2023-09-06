import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, RefreshControl, Alert, Dimensions} from 'react-native';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList } from '@shopify/flash-list';

import { db, storage } from '../config/firebase';
import { collection, addDoc, getDoc, doc, query, where, orderBy, startAfter, limit, getDocs } from "firebase/firestore";

import ResizableImage from '../shared/functions/ResizableImage';
import { Image } from 'expo-image';

import { BlurView } from 'expo-blur';

import { StackActions } from '@react-navigation/native';

import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import imgflip from '../api/imgflip';
import PostBar from '../components/PostBar';
import AddPostTopBar from '../ScreenTop/AddPostTopBar';

import DarkMemeCreate from '../../assets/post_meme_create_dark.svg';
import LightMemeCreate from '../../assets/post_meme_create_light.svg';

const lightBackground = require('../../assets/AddPostBackgroundLight.png');
const darkBackground = require('../../assets/AddPostBackgroundDark.png');

const navToUpload = (navigation, forPost, forCommentOnComment, forCommentOnPost) => () => {
  // navigation.dispatch(
  //   StackActions.replace("Upload", {
  //     forCommentOnComment: forCommentOnComment,
  //     forCommentOnPost: forCommentOnPost,
  //     forMemeComment: forCommentOnComment || forCommentOnPost ? true : false,
  //   })
  // )
  navigation.navigate("Upload", {
    forCommentOnComment: forCommentOnComment,
    forCommentOnPost: forCommentOnPost,
    forMemeComment: forCommentOnComment || forCommentOnPost ? true : false,
    forMemePost: forPost,
    forPost: forPost,
  })
}

const navToMeme = (navigation, item, forPost, forCommentOnComment, forCommentOnPost) => () => {
  // console.log(item)
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
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
        forPost: forPost,
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

const navToFavorites = (navigation, forPost, forCommentOnComment, forCommentOnPost) => () => {
  if(forCommentOnComment || forCommentOnPost || forPost){
    navigation.dispatch(
        StackActions.replace('FavoriteTemplates', {
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
        forPost: forPost,
      })
    )
  }else{
    navigation.navigate(('FavoriteTemplates'), {
      forCommentOnComment: forCommentOnComment,
      forCommentOnPost: forCommentOnPost,
      forPost: forPost,
    })
  }
}

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const keyExtractor = (item, index) => item.id.toString() + "-" + index.toString();

const AddPostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);

    const {memeTemplates, setMemeTeplates} = useContext(AuthenticatedUserContext);

    const { forPost, forCommentOnComment, forCommentOnPost } = route?.params;

    const flashListRef = useRef(null);


    useEffect(() => {
      memeTemplates.length == 2 && getFirstTenTemplates();
    }, []);



    const getFirstTenTemplates = React.useCallback(async () => {
        const q = query(
            collection(db, "imageTemplates"),
            orderBy("useCount", "desc"),
            limit(5)
        );
        
        await getDocs(q)
        .then((snapshot) => {
            let templates = snapshot.docs.map((doc, index)=> {
                const data = doc.data();
                const id = doc.id;

                if(index == snapshot.docs.length -1){
                  return { id, ...data, snap: doc }
                }
                return { id, ...data }
            })

            setMemeTeplates(templates);
        });
    }, []);

    const getNextTenTemplates = React.useCallback(async () => {

      const q = query(
          collection(db, "imageTemplates"),
          orderBy("useCount", "desc"),
          // startAfter(memeTemplates[memeTemplates.length-1].snap),
          limit(10)
      );
      
      await getDocs(q)
      .then((snapshot) => {
          let templates = snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data }
          })

          setMemeTeplates(templates);
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
        style={[
          theme == 'light' ? {backgroundColor: 'rgba(255, 255, 255, 1)'} : {backgroundColor: 'rgba(0, 0, 0, 1)'},
          {flex: 1}
        ]}
      >
        
        
        <ImageBackground 
          source={theme == 'light' ? lightBackground : darkBackground} 
          resizeMode="cover"
          // height={windowHeight}
          // width={windowWidth}
          style={theme == 'light' ? styles.lightBackground : styles.darkBackground}
        >
          
          <AddPostTopBar
            navToFavorites={navToFavorites(navigation, forPost, forCommentOnComment, forCommentOnPost)}
            navToSearchMemes={navToSearchMemes(navigation, forPost, forCommentOnComment, forCommentOnPost)}
            // closeBottomSheet={() => 
            //   toggleBottomSheet()
            // }
          />

          {
              <MasonryFlashList
                ref={flashListRef}
                data={memeTemplates}
                numColumns={2}

                // optimizeItemArrangement={true} // check if this rearranges previously displayed item onEndReached

                onEndReached={memeTemplates[memeTemplates.length-1]?.snap && getNextTenTemplates() }
                onEndReachedThreshold={1} //need to implement infinite scroll
                
                renderItem={renderItem}
                // extraData={[]}

                removeClippedSubviews={true}

                estimatedItemSize={200}
                estimatedListSize={{height: windowHeight, width: windowWidth}}

                showsVerticalScrollIndicator={false}

                // overrideItemLayout={(layout, item) =>{
                //   layout.span = windowWidth/2 - 8;
                //   // layout.size = item.imageHeight * (layout.span/item.imageWidth);
                // }}

                ListHeaderComponent={
                  <View>
                    {!(forCommentOnComment || forCommentOnPost) &&
                      <PostBar/>
                    }

                    <View style={theme == 'light' ? styles.lightMemeTemplateContainer : styles.darkMemeTemplateContainer}>
                      <Text style={theme == 'light' ? styles.lightMemeTemplateText : styles.darkMemeTemplateText}>
                          Meme Templates
                      </Text>
                    </View>
                  </View>
                }

                ListFooterComponent={
                    <View style={{height: 100}}/>
                }

                keyExtractor={keyExtractor}

                // refreshControl={
                //   <RefreshControl 
                //       // refreshing={isRefreshing}
                //       onRefresh={() => {
                //           toggleBottomSheet()
                //       }}
                //       // progressViewOffset={progress}
                //       tintColor={'rgba(255, 255, 255, 0.0)'}
                //       // progressViewOffset={0}
                //   />
                // }
              />
          }
            


          {/* Add template button */}
          <TouchableOpacity
              style={theme == 'light' ? styles.lightAddTemplateButton : styles.darkAddTemplateButton}
              onPress={navToUpload(navigation, forPost, forCommentOnComment, forCommentOnPost)}
          >
            {/* <BlurView
              tint = {theme == 'light' ?  "light" : "dark"}
              intensity={theme == 'light' ?  75 : 100}
              style={[StyleSheet.absoluteFill, 
                {
                  borderRadius: 95,
                  flexDirection: 'row',
                  justifyContent: "center",
                  alignItems: 'center',
                  alignSelf: 'center',
                }
              ]}
            > */}

              {theme == "light" ?
                  <LightMemeCreate width={31.5} height={31.5} alignSelf={'center'} marginRight={5} marginTop={4}/>
                  :
                  <DarkMemeCreate width={31.5} height={31.5} alignSelf={'center'} marginRight={5} marginTop={4}/>
              }

              <Text style={theme == 'light' ? styles.lightAddTemplateText : styles.darkAddTemplateText}>
                  Add meme template
              </Text>

            {/* </BlurView> */}
        </TouchableOpacity>

          

          {/* <TouchableOpacity
                style={theme == 'light' ? styles.lightAddTemplateButton : styles.darkAddTemplateButton}
                onPress={navToUpload(navigation, forPost, forCommentOnComment, forCommentOnPost)}
            >
              {theme == "light" ?
                  <LightMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
                  :
                  <DarkMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
              }

              <Text style={theme == 'light' ? styles.lightAddTemplateText : styles.darkAddTemplateText}>
                  Add meme template
              </Text>
          </TouchableOpacity> */}
        </ImageBackground>
      </Animated.View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
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
  image: {
    width: 200,
    height: 250,
    marginHorizontal: 3,
    marginVertical: 5,
    borderRadius: 10,
  },
  lightMemeTemplateContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    width: 'auto',
    height: 44,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1.3,
    borderColor: "#E8E8E8",
  },
  darkMemeTemplateContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(20, 20, 20, 1)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    // width: 'auto',
    // height: 44,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: "#393939",
  },
  lightMemeTemplateText: {
    fontSize: 24,
    color: '#444444',
    fontWeight: "600",
    alignSelf: 'center',
    marginHorizontal: 12,
    marginBottom: 6,
    marginTop: 5,

  },
  darkMemeTemplateText: {
    fontSize: 24,
    color: '#f2f2f2',
    fontWeight: "600",
    alignSelf: 'center',
    marginHorizontal: 12,
    marginBottom: 6,
    marginTop: 4,
  },
  lightAddTemplateButton: {
    overflow: 'hidden',
    width: 284,
    height: 60,
    borderRadius: 100,
    flexDirection: 'row',
    bottom: 50,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4D4D4',
  },
  darkAddTemplateButton: {
    overflow: 'hidden',
    width: 284,
    height: 60,
    borderRadius: 100,
    flexDirection: 'row',
    bottom: 50,
    position: 'absolute',
    backgroundColor: 'rgba(24, 24, 24, 1)',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#282828'
  },
  lightAddTemplateText: {
      fontSize: 23.5,
      color: '#000000',
      fontWeight: "600",
      alignSelf: 'center',
      marginRight: 3
  },
  darkAddTemplateText: {
      fontSize: 24,
      color: '#F0F0F0',
      fontWeight: "500",
      alignSelf: 'center',
      marginRight: 3
  },
  askText: {
    fontSize: 20,
    color: '#222222',
    fontWeight: "500",
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  answerButton: {
      width: 85,
      height: 50,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: '#AAAAAA',
      marginLeft: 10,
      marginTop: 15,
      marginRight: 40,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
  },
  answerText: {
      fontSize: 20,
      color: '#222222',
      fontWeight: "500",
      alignSelf: 'center'
  },
});

export default AddPostScreen;