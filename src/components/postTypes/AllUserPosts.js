import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlashList, Dimensions} from 'react-native';
import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import GlobalStyles from '../../constants/GlobalStyles';
import { Tabs } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../../context-store/context';
import ImagePost from './ImagePost';
import MultiImagePost from './MultiImagePost';
import TextPost from './TextPost';
import { set } from 'react-native-reanimated';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const itemEquals = (prev, next) => {
    return true
};

const keyExtractor = (item, index) => item.id.toString + "-" + index.toString();

export default function AllUserPosts({ userId, username, profilePic, postList, byNewPosts, byPopularPosts, handleNewPostsClick, handlePopularPostsClick, handleRefreshPostsClick, handleNewPostsRefreshClick, handlePopularPostsRefreshClick }){
    const {theme,setTheme} = useContext(ThemeContext);

    {/* New/Popular/Refresh button */}
    const topButtons = React.useCallback(() =>
        <View style={{flexDirection: 'row', marginBottom: 7, marginTop: 15}}>
            {/* New button */}
            {
                byNewPosts ?
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightNewButtonActive : styles.darkNewButtonActive}
                        // onPress={handleNewPostsClick()}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            New
                        </Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightNewButtonInactive : styles.darkNewButtonInactive}
                        // onPress={handleNewPostsClick()}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            New
                        </Text>
                    </TouchableOpacity>
            }
            
            {/* Popular button */}
            {
                byPopularPosts ?
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightPopularButtonActive : styles.darkPopularButtonActive}
                        // onPress={handlePopularPostsClick()}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            Popular
                        </Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightPopularButtonInactive : styles.darkPopularButtonInactive}
                        // onPress={handlePopularPostsClick()}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            Popular
                        </Text>
                    </TouchableOpacity>
            }
        </View>
    , [byNewPosts, byPopularPosts, theme]);
        

    const renderItem = React.useCallback(({ item, index }) => {
        if(item.imageUrl){
            return (
                <ImagePost
                    key={index}
                    repostProfile={item.repostProfile}
                    repostComment={item.repostComment}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    tags={item.tags}
                    memeName={item.memeName}
                    profile={item.profile}
                    username={username}
                    profilePic={profilePic}
                    postId={item.id}
                    likesCount={item.likesCount}
                    commentsCount={item.commentsCount}
                />
            )
        }else if(item.imageUrls){
            return (
                <MultiImagePost
                    key={index}
                    repostProfile={item.repostProfile}
                    repostComment={item.repostComment}
                    title={item.title}
                    imageUrls={item.imageUrls}
                    tags={item.tags}
                    profile={item.profile}
                    username={username}
                    profilePic={profilePic}
                    postId={item.id}
                    likesCount={item.likesCount}
                    commentsCount={item.commentsCount}
                />
            )
        }else if(item.text){
            return (
                <TextPost
                    key={index}
                    repostProfile={item.repostProfile}
                    repostComment={item.repostComment}
                    title={item.title}
                    text={item.text}
                    tags={item.tags}
                    profile={item.profile}
                    username={username}
                    profilePic={profilePic}
                    postId={item.id}
                    likesCount={item.likesCount}
                    commentsCount={item.commentsCount}
                />
            )
        }
    }, []);


    return (
        <View 
            style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 }]}
        >
            <Tabs.FlashList
                data={postList.length > 0 ? postList : [{id: "fir"}]}

                extraData={[postList]}

                // onEndReached={commentsList[commentsList.length-1].snap && getNextTenComments }
                // onEndReachedThreshold={1} //need to implement infinite scroll

                removeClippedSubviews={true}

                estimatedItemSize={400}
                estimatedListSize={{height: windowHeight, width: windowWidth}}

                ListFooterComponent={
                    <View style={{height: 200}}/>
                }

                keyExtractor={keyExtractor}
                ListHeaderComponent={topButtons}  // Use ListHeaderComponent to render buttons at the top
                renderItem={renderItem}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    darkContainer: {
        flex: 1,
        backgroundColor: "#282828",
    },
    lightContainer: {
        flex: 1,
        backgroundColor: "#F6F6F6",
    },
    // Popular button
    lightPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#121212',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
    },
    lightPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#1F1F1F',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
    },
    // New button
    lightNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#121212',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
    },
    lightNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#1F1F1F',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
    },
    lightPopularText: {
        fontSize: 18,
        color: '#555555',
        fontWeight: 600,
        alignSelf: 'center',
        marginTop: 4
    },
    darkPopularText: {
        fontSize: 18,
        color: '#EEEEEE',
        fontWeight: 600,
        alignSelf: 'center',
        marginTop: 4
    },
});
