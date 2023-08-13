import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { manipulateAsync } from 'expo-image-manipulator';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';

import { StackActions } from '@react-navigation/native';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList } from '@shopify/flash-list';

import ResizableImage from '../shared/ResizableImage';

import MemesSearchBar from '../components/MemesSearchBar';

const navToMeme = (navigation, item, forCommentOnComment, forCommentOnPost) => () => {
  if(forCommentOnComment || forCommentOnPost){
    navigation.dispatch(
        StackActions.replace('EditMeme', {
        replyMemeName: item.name,
        imageUrl: item.url,
        height: item.height,
        width: item.width,
        templateExists: true,
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
        forMemeComment: forCommentOnComment
      })
    )
  }else{
    navigation.navigate('Meme', {
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

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const keyExtractor = (item, index) => item.id.toString() + "-" + index.toString();

const SearchMemesScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [memeTemplates, setMemeTeplates] = useState([{id: "fir"}, {id: "sec"}]);
    const [term, setTerm] = useState('');

    const {forCommentOnComment, forCommentOnPost} = route?.params;

    useEffect(() => {
        if (term !== '') {
            q = query(
                collection(db, "imageTemplates"),
                where("name", ">=", term),
                where('name', '<=', term + '\uf8ff'),
                limit(2)
            );
    
            getDocs(q)
            .then((snapshot) => {
                let templates = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setMemeTeplates(templates);
            });
        }
    }, [term]);
    // console.log(memeTemplates)
    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <MemesSearchBar title={"Back"} term={term} setTerm={setTerm}/>
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
        onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
        onTouchEnd={e => {
        if (e.nativeEvent.pageX - this.touchX > 150)
            // console.log('Swiped Right')
            navigation.goBack()
        }}
        style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, {flex: 1}]}
      >

        <MasonryFlashList
          // ref={flashListRef}
          data={memeTemplates}
          numColumns={2}

          // onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
          // onEndReachedThreshold={1} //need to implement infinite scroll
          
          renderItem={renderItem}
          extraData={[memeTemplates]}

          removeClippedSubviews={true}

          estimatedItemSize={200}
          estimatedListSize={{height: windowHeight, width: windowWidth}}

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{paddingTop: 5}}

          ListFooterComponent={
              <View style={{}}>

                  <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    Didn't find the right template?
                  </Text>

                  <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    Try changing the capitalization for some words and check spelling.
                  </Text>
              </View>
          }

          keyExtractor={keyExtractor}
        />


        

      </Animated.View>
    );
}

const styles = StyleSheet.create({
    lightText: {
        fontSize: 20,
        marginRight: 20,
        marginTop: 20,
        fontWeight: '500',
        color: '#555555',
        alignSelf: 'center',
    },
    darkText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: '500',
        color: '#DDDDDD',
        alignSelf: 'center',
    },
});

export default SearchMemesScreen;