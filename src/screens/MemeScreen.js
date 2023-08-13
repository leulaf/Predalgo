import React, {useContext, useRef, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Dimensions} from 'react-native';
import TextTicker from 'react-native-text-ticker';

import { StackActions } from '@react-navigation/native';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList } from '@shopify/flash-list';

import { Image } from 'expo-image';
import ResizableImage from '../shared/ResizableImage';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {ThemeContext} from '../../context-store/context';
import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import MemeTopBar from '../components/MemeTopBar';

import DarkMemeCreate from '../../assets/post_meme_create_light.svg';
import LightMemeCreate from '../../assets/post_meme_create_dark.svg';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const navToEdit= (navigation, item, forCommentOnComment, forCommentOnPost) => () => {
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
      navigation.navigate('EditMeme', {
        replyMemeName: item.name,
        imageUrl: item.url,
        height: item.height,
        width: item.width,
        templateExists: true,
        forCommentOnComment: forCommentOnComment,
        forCommentOnPost: forCommentOnPost,
        forMemeComment: forCommentOnComment
      })
    }
  }

const keyExtractor = (item, index) => item.id.toString + "-" + index.toString();

const MemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);

    const [memeTemplates, setMemeTeplates] = useState([{id : "fir"}, {id: "sec"}]);

    const { memeName, template, height, width, uploader, useCount, forCommentOnComment, forCommentOnPost } = route.params;

    const flashListRef = useRef(null);
   
    useEffect(() => {
        getFirstTenMemes();

        navigation.setOptions({
            header: () => <MemeTopBar name={memeName} url={template} height={height} width={width} />,
        });
    }, []);


    const getFirstTenMemes = React.useCallback(async () => {
        const q = query(
            collection(db, "allPosts"),
            where("memeName", "==", memeName),
            orderBy("likesCount", "desc"),
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
                    // onPress={navToMeme(item)}
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
            style={theme == 'light' ? styles.lightContainer : styles.darkContainer}
        >
                    
                
            {/* Memes */}
            <MasonryFlashList
                ref={flashListRef}
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

                ListHeaderComponent={
                    // template image, meme name, uploader, use count
                    <View style={theme == 'light' ? styles.lightMemeInfoContainer: styles.darkMemeInfoContainer}>

                        <Image source={{uri: template}} style={styles.image} cachePolicy='disk'/>

                        <View style={{flexDirection: 'column', marginLeft: 10}}>
                            {/* meme name */}
                            <View style={styles.memeName}>
                                {theme == "light" ?
                                    <LightMemeCreate width={25} height={25} marginHorizontal={7} marginTop={1}/>
                                    :
                                    <DarkMemeCreate width={25} height={25} marginHorizontal={7} marginTop={1}/>
                                }

                                <TextTicker
                                    style={theme == 'light' ? styles.lightMemeName: styles.darkMemeName}
                                    duration={12000}
                                    loop
                                    // bounce
                                    repeatSpacer={50}
                                    marqueeDelay={1000}
                                >
                                    {memeName}
                                </TextTicker>
                            </View>
                            
                            {/* @Uploader */}
                            <Text style={theme == 'light' ? styles.lightUploaderText : styles.darkUploaderText}>
                                By @{uploader}
                            </Text>

                            {/* use count */}
                            <Text style={theme == 'light' ? styles.lightUseCountText : styles.darkUseCountText}>
                                {useCount} memes
                            </Text>
                        </View>
                    </View>
                }

                ListFooterComponent={
                    <View style={{height: 100}}/>
                }

                keyExtractor={keyExtractor}
            />


            {/* create meme button */}
            <TouchableOpacity
                style={theme == 'light' ? styles.lightUseTemplateButton : styles.darkUseTemplateButton}
                onPress={navToEdit(navigation, {
                    name: memeName,
                    template: template,
                    height: height,
                    width: width,
                    
                }, forCommentOnComment, forCommentOnPost)}
            >
                {theme == "light" ?
                    <LightMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
                    :
                    <DarkMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
                }

                <Text style={theme == 'light' ? styles.lightUseTemplateText : styles.darkUseTemplateText}>
                    Use meme template
                </Text>
            </TouchableOpacity>
            
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    darkContainer: {
        flex: 1,
        backgroundColor: '#161616',
    },
    lightMemeInfoContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        borderBottomWidth: 1.5,
        borderColor: '#DDDDDD'
    },
    darkMemeInfoContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        borderBottomWidth: 1,
        borderBottomWidth: 1.5,
        borderColor: '#2f2f2f'
    },
    image: {
        marginLeft: 7,
        marginTop: 15,
        marginBottom: 25,
        borderRadius: 20,
        width: 150,
        height: 150,
    },
    memeName: {
        width: 225,
        marginTop: 23,
        flexDirection: 'row',
    },
    lightMemeName: {
        fontSize: 18,
        color: '#111111',
        fontWeight: '500',
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkMemeName: {
        fontSize: 18,
        color: '#f2f2f2',
        fontWeight: '500',
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUploaderText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkUploaderText: {
        fontSize: 18,
        color: '#f2f2f2',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUseCountText: {
        fontSize: 16,
        color: '#222222',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkUseCountText: {
        fontSize: 17,
        color: '#f2f2f2',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUseTemplateButton: {
        width: 240,
        height: 55,
        borderRadius: 100,
        flexDirection: 'row',
        marginTop: 700,
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#BBBBBB'
    },
    darkUseTemplateButton: {
        width: 240,
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
    lightUseTemplateText: {
        fontSize: 20,
        color: '#111111',
        fontWeight: '500',
        alignSelf: 'center',
    },
    darkUseTemplateText: {
        fontSize: 20,
        color: '#F0F0F0',
        fontWeight: '500',
        alignSelf: 'center',
    },
});

export default MemeScreen;