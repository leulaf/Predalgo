import React, {useContext, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Overlay } from 'react-native-elements';
import { db, storage } from '../config/firebase';
import { collection, addDoc, getDoc, doc, query, where, orderBy, limit, getDocs } from "firebase/firestore";

import { StackActions } from '@react-navigation/native';

import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import imgflip from '../api/imgflip';
import PostBar from '../components/PostBar';
import AddPostTopBar from '../components/AddPostTopBar';

import DarkMemeCreate from '../../assets/post_meme_create_dark.svg';
import LightMemeCreate from '../../assets/post_meme_create_light.svg';


const AddPostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);

    const [newMemeName, setNewMemeName] = useState("");
    const [newTemplate, setNewTemplate] = useState(null);
    const [base64, setBase64] = useState(null);
    
    const [overlayVisible, setOverlayVisible] = useState(false);

    const [leftMemeTemplates, setLeftMemeTemplates] = useState([]);
    const [rightMemeTemplates, setRightMemeTemplates] = useState([]);

    const { forCommentOnComment, forCommentOnPost} = route.params;

    useEffect(() => {
      getFirstTenTemplates();
    }, []);

    const getFirstTenTemplates = async () => {
        const q = query(
            collection(db, "imageTemplates"),
            orderBy("useCount", "desc"),
            limit(10)
        );
        
        await getDocs(q)
        .then((snapshot) => {
            let templates = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })

            setLeftAndRightMemeTemplates(templates);
        });
    };

    // a function to split the meme templates into two arrays, the left should be odd indexes and the right should be even indexes
    const setLeftAndRightMemeTemplates = async (memeTemplates) => {
        let left = [];
        let right = [];

        for(let i = 0; i < memeTemplates.length; i++){
            if(i % 2 == 0){
                left.push(memeTemplates[i]);
            }else{
                right.push(memeTemplates[i]);
            }
        }

        setLeftMemeTemplates(left);
        setRightMemeTemplates(right);
    };

    
    // Sets the header to the AddPostTop component
    useEffect(() => {
        navigation.setOptions({
            header: () => <AddPostTopBar />
        });
    }, []);
    
    // Removes the bottom navigation
    useEffect(() => {
      navigation.setOptions({
        tabBarStyle: {
          display: "none"
        }
      });
      return () => navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
    }, [navigation]);

    return (
      <View
        onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
        onTouchEnd={e => {
        if (e.nativeEvent.pageX - this.touchX > 150)
            // console.log('Swiped Right')
            navigation.goBack()
        }}
        style={styles.container}
      >
        <ScrollView style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
          
          {!(forCommentOnComment || forCommentOnPost) &&
            <PostBar/>
          }

          <View style={{width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
              <View style={theme == 'light' ? styles.lightMemeTemplateContainer : styles.darkMemeTemplateContainer}>
                  <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                      Meme Templates
                  </Text>
              </View>
          </View> 

          {/* left side of meme templates */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <FlatList
                // nestedScrollEnabled={true}
                numColumns={1}
                data={leftMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => 
                          {
                            forCommentOnComment || forCommentOnPost ?
                              navigation.navigate('EditMeme', {
                                replyMemeName: item.name,
                                templateExists: true,
                                forCommentOnComment: forCommentOnComment,
                                forCommentOnPost: forCommentOnPost,
                              })
                            :
                              navigation.navigate('Meme', {
                                memeName: item.name,
                              })
                          }
                      }
                    >
                      <ImageContainer
                        imageSource={{ uri: item.url }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* right side of meme templates */}
            <View style={{flex: 1}}>
              <FlatList
                // nestedScrollEnabled={true}
                numColumns={1}
                data={rightMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => 
                        {
                          forCommentOnComment || forCommentOnPost ?
                            navigation.navigate('EditMeme', {
                              replyMemeName: item.name,
                              templateExists: true,
                              forCommentOnComment: forCommentOnComment,
                              forCommentOnPost: forCommentOnPost,
                            })
                          :
                            navigation.navigate('Meme', {
                              memeName: item.name,
                            })
                        }
                      }
                    >
                      <ImageContainer
                        imageSource={{ uri: item.url }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>

          
        </ScrollView>

        {/* Add template button */}
        <TouchableOpacity
              style={theme == 'light' ? styles.lightAddTemplateButton : styles.darkAddTemplateButton}
              onPress={() => 

                navigation.dispatch(
                  StackActions.replace("Upload", {
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    forMemeComment: forCommentOnComment || forCommentOnPost ? true : false,
                  })
                )
              }
          >
            {theme == "light" ?
                <LightMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
                :
                <DarkMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
            }

            <Text style={theme == 'light' ? styles.lightAddTemplateText : styles.darkAddTemplateText}>
                Add meme template
            </Text>
        </TouchableOpacity>


      </View>
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
    backgroundColor: '#ffffff',
    borderRadius: 15,
    // width: 110,
    height: 40,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C9C9C9'
  },
  darkMemeTemplateContainer: {
    flexDirection: 'column',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    // width: 110,
    height: 40,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#484848'
  },
  lightText: {
    fontSize: 22,
    color: '#444444',
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
  darkText: {
    fontSize: 22,
    color: '#f2f2f2',
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
  lightAddTemplateButton: {
    width: 245,
    height: 55,
    borderRadius: 100,
    flexDirection: 'row',
    marginTop: 700,
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DDDDDD'
  },
  darkAddTemplateButton: {
    width: 245,
    height: 55,
    borderRadius: 100,
    flexDirection: 'row',
    marginTop: 700,
    position: 'absolute',
    backgroundColor: '#151515',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#444444'
  },
  lightAddTemplateText: {
      fontSize: 20,
      color: '#111111',
      fontWeight: '500',
      alignSelf: 'center',
  },
  darkAddTemplateText: {
      fontSize: 20,
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