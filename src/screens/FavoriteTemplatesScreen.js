import React, {useEffect, useState, useContext} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import SimpleTopBar from '../components/SimpleTopBar';

import { StackActions } from '@react-navigation/native';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList } from '@shopify/flash-list';

import ResizableImage from '../shared/ResizableImage';


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

const FavoriteTemplatesScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [memeTemplates, setMemeTemplates] = useState([{id: "fir"}]);

    const {forCommentOnComment, forCommentOnPost} = route?.params;

    useEffect(() => {
        getFirstFourTemplates();

        // Sets the header to the SimpleTopBar component
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Favorite Templates"}/>
        });
    }, []);

    const getFirstFourTemplates = React.useCallback(async () => {
        const q = query(
            collection(db, "favoriteImageTemplates", firebase.auth().currentUser.uid, "templates"),
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
                    onPress={navToMeme(navigation, item, forCommentOnComment, forCommentOnPost)}
                    style={
                    index % 2 == 1 ?
                        {marginLeft: 2, marginRight: 4, marginBottom: 6} 
                    :
                        {marginLeft: 4, marginRight: 2, marginBottom: 6} 
                    }
                >   
                    {/* Meme name */}
                    <Text style={theme == 'light' ? styles.lightName : styles.darkName}>
                        {item.name}
                    </Text>

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

                keyExtractor={keyExtractor}
            />

      </Animated.View>
    );
}

const styles = StyleSheet.create({
    lightName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#444444',
        marginLeft: 10,
    },
    darkName: {
        fontSize: 22,
        fontWeight: '600',
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
        fontWeight: '500',
        color: '#444444',
    },
    darkText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: '500',
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

export default FavoriteTemplatesScreen;