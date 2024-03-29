import React, { } from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Dimensions} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { Tabs } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../../context-store/context';
import ImagePost from '../postTypes/ImagePost';
import TextPost from '../postTypes/TextPost';

import getItemType from '../../shared/functions/GetItemType';
import NativeAdView from "react-native-admob-native-ads";
import { AdView } from '../AdView';

import { getTrackingStatus } from 'react-native-tracking-transparency';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const renderItem = ({ item, index }) => {
    // console.log(item.imageUrl);
    if(item.imageUrl || item.template){
        return (
            <ImagePost
                imageUrl={item.imageUrl}
                imageHeight={item.imageHeight}
                imageWidth={item.imageWidth}
                template={item.template}
                templateUploader={item.templateUploader}
                templateState={item.templateState}
                text={item.text}
                title={item.title}
                tags={item.tags}
                memeName={item.memeName}
                profile={item.profile}
                username={item.username}
                profilePic={item.profilePic}
                repostId={item.repostId}
                postId={item.id}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
                repostsCount={item.repostsCount}
                reposterProfile={item.reposterProfile}
                reposterUsername={item.reposterUsername}
                reposterProfilePic={item.reposterProfilePic}
                repostComment={item.repostComment}
            />
        )
    }else if(item.text){
        return (
            <TextPost
                title={item.title}
                text={item.text}
                tags={item.tags}
                profile={item.profile}
                username={item.username}
                profilePic={item.profilePic}
                repostId={item.repostId}
                postId={item.id}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
                repostsCount={item.repostsCount}
                reposterProfile={item.reposterProfile}
                reposterUsername={item.reposterUsername}
                reposterProfilePic={item.reposterProfilePic}
                repostComment={item.repostComment}
            />
        )
    }
};


const keyExtractor = (item, index) => item.id.toString() + index.toString();

export default function AllUserPosts({ userId, username, profilePic, postList, byNewPosts, byPopularPosts, handleNewPostsClick, handlePopularPostsClick, handleRefreshPostsClick, handleNewPostsRefreshClick, handlePopularPostsRefreshClick }){
    const {theme,setTheme} = React.useContext(ThemeContext);
    const nativeAdViewRef = React.useRef();
    // console.log(nativeAdViewRef)

    React.useEffect(() => {
      nativeAdViewRef.current?.loadAd();
      setup()
    }, []);
    const setup = async() => {
        const trackingStatus = await getTrackingStatus();
if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
  // enable tracking features
}
    }
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


    return (
        <View 
            style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 }]}
        >
    {/* //         <NativeAdView

    //   ref={nativeAdViewRef}
    // //   adUnitID="ca-app-pub-3940256099942544~1458002511"
    // //   mediationOptions={{
    // //     nativeBanner: true,
    // //   }}
    //   repository={'imageAd'}
    //   style={{
    //     width: 5000,
    //     height: 5000,
    //     alignSelf: 'center',
    //     backgroundColor: 'yellow',
    //   }}
    // >
    //   <View style={{
    //       width: 50,
    //       height: 50,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}></View>
    // </NativeAdView>
    // <AdView type="videoAd" media={true} /> */}

            <Tabs.FlashList
                data={postList.length > 0 ? postList : [{id: "fir"}]}

                // extraData={[]}

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

                showsVerticalScrollIndicator={false}

                getItemType={getItemType}

                // overrideItemLayout={(layout, item) =>{
                //   layout.span = windowWidth;
                //   layout.size = item.imageHeight * (layout.span/item.imageWidth);
                //   // layout.size = item.imageHeight * (layout.span/item.imageWidth);
                // }}
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
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: 4
    },
    darkPopularText: {
        fontSize: 18,
        color: '#EEEEEE',
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: 4
    },
});
