import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, RefreshControl, Alert, Dimensions} from 'react-native';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList } from '@shopify/flash-list';

import { db, storage } from '../config/firebase';
import { collection, addDoc, getDoc, doc, query, where, orderBy, startAfter, limit, getDocs } from "firebase/firestore";

import ResizableImage from '../shared/ResizableImage';
import { Image } from 'expo-image';

import { BlurView } from 'expo-blur';

import { StackActions } from '@react-navigation/native';

import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import imgflip from '../api/imgflip';
import PostBar from '../components/PostBar';
import AddPostTopBar from '../ScreenTop/AddPostTopBar';

import DarkMemeCreate from '../../assets/post_meme_create_dark.svg';
import LightMemeCreate from '../../assets/post_meme_create_light.svg';

const navToUpload = (navigation, forCommentOnComment, forCommentOnPost) => () => {
  navigation.dispatch(
    StackActions.replace("Upload", {
      forCommentOnComment: forCommentOnComment,
      forCommentOnPost: forCommentOnPost,
      forMemeComment: forCommentOnComment || forCommentOnPost ? true : false,
    })
  )
}

const navToMeme = (navigation, item, forCommentOnComment, forCommentOnPost) => () => {
  if(forCommentOnComment || forCommentOnPost){
    navigation.dispatch(
        StackActions.replace('EditMeme', {
          uploader: item.uploader,
          memeName: item.name,
          template: item.url,
          height: item.height,
          width: item.width,
          templateExists: true,
          forCommentOnComment: forCommentOnComment,
          forCommentOnPost: forCommentOnPost,
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
    })
  }
}

const navToSearchMemes = (navigation, forCommentOnComment, forCommentOnPost) => () => {
  if(forCommentOnComment || forCommentOnPost){
    navigation.dispatch(
        StackActions.replace('SearchMemes', {
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
      })
    )
  }else{
    navigation.navigate(('SearchMemes'), {
      forCommentOnComment: forCommentOnComment,
      forCommentOnPost: forCommentOnPost,
    })
  }
}

const navToFavorites = (navigation, forCommentOnComment, forCommentOnPost) => () => {
  if(forCommentOnComment || forCommentOnPost){
    navigation.dispatch(
        StackActions.replace('FavoriteTemplates', {
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
      })
    )
  }else{
    navigation.navigate(('FavoriteTemplates'), {
      forCommentOnComment: forCommentOnComment,
      forCommentOnPost: forCommentOnPost,
    })
  }
}

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const keyExtractor = (item, index) => item.id.toString() + "-" + index.toString();

const AddPostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    
    const [memeTemplates, setMemeTeplates] = useState([{id : "fir"}, {id: "sec"}]);

    const { forCommentOnComment, forCommentOnPost, showBottomSheet, toggleBottomSheet } = route?.params;

    const flashListRef = useRef(null);

    useEffect(() => {
      memeTemplates.length == 2 && showBottomSheet && getFirstTenTemplates();
    }, [showBottomSheet]);



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
            onPress={navToMeme(navigation, item, forCommentOnComment, forCommentOnPost)}
            style={
              index % 2 == 1 ?
                {marginLeft: 2, marginRight: 4, marginBottom: 6} 
              :
                {marginLeft: 4, marginRight: 2, marginBottom: 6} 
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

    if(!showBottomSheet){
      return null
    }


    return (
      <Animated.View
        style={[
          theme == 'light' ? {backgroundColor: 'rgba(255, 255, 255, 0.15)'} : {backgroundColor: 'rgba(0, 0, 0, 0.15)'},
          {flex: 1}
        ]}
      >

        <AddPostTopBar
          navToFavorites={navToFavorites(navigation, forCommentOnComment, forCommentOnPost)}
          navToSearchMemes={navToSearchMemes(navigation, forCommentOnComment, forCommentOnPost)}
          closeBottomSheet={() => 
            toggleBottomSheet()
          }
        />

        {
          // showBottomSheet &&
        
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
                  <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                      Meme Templates
                  </Text>
                </View>
              </View>
            }

            ListFooterComponent={
                <View style={{height: 100}}/>
            }

            keyExtractor={keyExtractor}

            refreshControl={
              <RefreshControl 
                  // refreshing={isRefreshing}
                  onRefresh={() => {
                      toggleBottomSheet()
                  }}
                  // progressViewOffset={progress}
                  tintColor={'rgba(255, 255, 255, 0.0)'}
                  // progressViewOffset={0}
              />
          }
          />
        }
          
        {/* Add template button */}
        

            <TouchableOpacity
                style={theme == 'light' ? styles.lightAddTemplateButton : styles.darkAddTemplateButton}
                onPress={navToUpload(navigation, forCommentOnComment, forCommentOnPost)}
            >
              <BlurView
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
              >

                {theme == "light" ?
                    <LightMemeCreate width={31} height={31} alignSelf={'center'} marginRight={5} marginTop={4}/>
                    :
                    <DarkMemeCreate width={31} height={31} alignSelf={'center'} marginRight={5} marginTop={4}/>
                }

                <Text style={theme == 'light' ? styles.lightAddTemplateText : styles.darkAddTemplateText}>
                    Add meme template
                </Text>

              </BlurView>
          </TouchableOpacity>

        

        {/* <TouchableOpacity
              style={theme == 'light' ? styles.lightAddTemplateButton : styles.darkAddTemplateButton}
              onPress={navToUpload(navigation, forCommentOnComment, forCommentOnPost)}
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

      </Animated.View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 'auto',
    height: 42,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E4E4E4'
  },
  darkMemeTemplateContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(32, 32, 32, 0.3)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 'auto',
    height: 42,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#313131'
  },
  lightText: {
    fontSize: 22,
    color: '#444444',
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  darkText: {
    fontSize: 22,
    color: '#f2f2f2',
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  lightAddTemplateButton: {
    overflow: 'hidden',
    width: 284,
    height: 60,
    borderRadius: 100,
    flexDirection: 'row',
    bottom: 50,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  darkAddTemplateButton: {
    overflow: 'hidden',
    width: 284,
    height: 60,
    borderRadius: 100,
    flexDirection: 'row',
    bottom: 50,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#262626'
  },
  lightAddTemplateText: {
      fontSize: 24,
      color: '#000000',
      fontWeight: '500',
      alignSelf: 'center',
  },
  darkAddTemplateText: {
      fontSize: 24,
      color: '#F0F0F0',
      fontWeight: '500',
      alignSelf: 'center',
  },
  askText: {
    fontSize: 20,
    color: '#222222',
    fontWeight: '500',
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
      fontWeight: '500',
      alignSelf: 'center'
  },
});

export default AddPostScreen;