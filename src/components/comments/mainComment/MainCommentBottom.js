import React, {useEffect} from 'react';

import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

import styles from './Styles';

import MemeName from '../shared/MemeName';

import { intToString, onLike, onDisike } from '../shared/CommentMethods';

import overrideItemLayout from '../../../shared/OverrideItemLayout';
import getItemType from '../../../shared/GetItemType';

import { fetchFirstFiveCommentsByPopular, fetchNextFiveCommentsByPopular } from '../../../shared/comment/GetComments';
import { FlashList } from '@shopify/flash-list';

// SecondaryComment is a comment that is a reply to a comment
import SubComment from '../subComment/SubComment';

// light mode icons
import Likes from '../../../../assets/likes.svg';
import Liked from '../../../../assets/liked.svg';
import Reply from '../../../../assets/reply_comment_light.svg';
import Down from '../../../../assets/down_light.svg';

// dark mode icons
import LikesDark from '../../../../assets/likes_dark.svg';
import LikedDark from '../../../../assets/liked_dark.svg';
import ReplyDark from '../../../../assets/reply_comment_dark.svg';
import DownDark from '../../../../assets/down_dark.svg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ImagePost = React.memo(({item, theme, navigation})=>{
    return (
        <SubComment
            navigation={navigation}
            theme={theme}
            replyToPostId={item.replyToPostId}
            replyToCommentId={item.replyToCommentId}
            profile={item.profile}
            username={item.username}
            profilePic={item.profilePic}
            commentId={item.id}
            text={item.text}
            imageUrl={item.imageUrl}
            memeName={item.memeName}
            template={item.template}
            templateState={item.templateState}
            imageWidth={item.imageWidth}
            imageHeight={item.imageHeight}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
        />
    );
}, itemEquals);

const itemEquals = (prev, next) => {
    return prev.item.id === next.item.id
};

const TextPost = React.memo(({item, theme, navigation})=>{
    return (
        <SubComment
            navigation={navigation}
            theme={theme}
            replyToPostId={item.replyToPostId}
            replyToCommentId={item.replyToCommentId}
            profile={item.profile}
            username={item.username}
            profilePic={item.profilePic}
            commentId={item.id}
            text={item.text}
            imageUrl={item.imageUrl}
            memeName={item.memeName}
            template={item.template}
            templateState={item.templateState}
            imageWidth={item.imageWidth}
            imageHeight={item.imageHeight}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
        />
    );
}, itemEquals);



const keyExtractor = (item, index) => item.id.toString + "-" + index.toString();

// ******** React memo ********
export default MainCommentBottom = ({navigation, index, theme, commentId, replyToPostId, memeName, profile, likesCount, commentsCount, navToCommentWithComments, onNavToComment, onReply,}) => {
    
    const [liked, setLiked] = React.useState(false);

    // const [commentsList, setCommentsList] = React.useState([{first1first: true, id: "fir"}]); // array of replies to this comment
    const [commentsList, setCommentsList] = React.useState([]); // array of replies to this comment

    let likes, alreadyLiked, reply, down

    if(theme == 'light'){
        likes = <Likes width={20} height={20} style={{ marginRight: 5 }}/>;
        alreadyLiked = <Liked width={20} height={20} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <Down width={25} height={25} style={{ marginRight: 5 }}/>;
    }else{
        likes = <LikesDark width={21} height={21} style={{ marginRight: 5 }}/>;
        alreadyLiked = <LikedDark width={21} height={21} style={{ marginRight: 5 }}/>;
        reply = <ReplyDark width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <DownDark width={25} height={25} style={{ marginRight: 5 }}/>;
    }

    
    // populate commentsList with first five comments
    // only it is one of the first three comments
    useEffect(() => {
        index < 5 && commentsCount > 0 && commentsList.length == 0 &&
        fetchFirstFiveCommentsByPopular(replyToPostId, commentId).then((comments) => {
            setCommentsList(comments);
        })
    }, [])


    // ****PREVENT unnecessary requests*****
    // fetch comments five at a time
    const getFiveCommentsByPopular = React.useCallback(() => async () => {

        if(commentsList.length == 0){

            const comments = await fetchFirstFiveCommentsByPopular(replyToPostId, commentId)
            setCommentsList(comments);

        }else if(commentsList.length >= 10 && commentsCount - commentsList.length > 10){
            // console.log(commentsList[commentsList.length-1].snap, "  commentsCount  ", commentsList.length, "  index  ", commentsList[commentsList.length-1].index)
            navToCommentWithComments(commentsList);
        }else if(commentsList.length > 2){
            // console.log(commentsList.length, "  ", commentsCount)
            const comments = await fetchNextFiveCommentsByPopular(replyToPostId, commentId, commentsList[commentsList.length-1].snap);
            commentsList[commentsList.length-1].snap = null;
            setCommentsList(commentsList => [...commentsList, ...comments]);

        }
    }, [commentsList]);


    const toggleLike = () => async() => {
        if(liked){
            await onDisike(replyToPostId, commentId).then((result) => {
                if(result){
                    setLiked(false);
                }
            })
        }else{
            await onLike(replyToPostId, commentId).then((result) => {
                if(result){
                    setLiked(true);
                }
            })
        }
    }


    const renderItem = React.useCallback(({ item, index }) => {
        if(index == 0){
            return (
                null
            );
        }else if(item.imageHeight){
            return (
                <ImagePost item={item} navigation={navigation} theme={theme}/>
            );
        }else{
            return (
                <TextPost item={item} navigation={navigation} theme={theme}/>
            );
        }
    }, [])


    return (
        <View style={{flex: 1}}>
            {/* Reply and Like */}
            <View style={{ flexDirection: 'row', marginTop: 1,  alignItems: 'center', alignContent: 'center'  }}>

                {/* MemeName */}
                {
                    memeName &&
                    <MemeName 
                        memeName={memeName}
                        theme={theme}
                        navigation={navigation}
                    />
                }

                {/* Spacer */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, height: 40, }}
                    onPress={onNavToComment()}
                ></TouchableOpacity>

                {/* Reply */}
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{ paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={onReply()}
                >
                    {reply}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        Reply
                    </Text>
                </TouchableOpacity>
                
                {/* Like Button */}
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{ width: 110, paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={toggleLike()}
                >
                    
                    {liked ?
                        alreadyLiked
                    :
                        likes
                    }

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        {liked? intToString(likesCount + 1) : intToString(likesCount)} Likes
                    </Text>

                </TouchableOpacity>
            </View>


            {/* Replies - SubComments */}
            {
                commentsCount > 0 &&

                <View style={{backgroundColor: 
                        theme == 'light' ? 
                            commentsCount > 0 ? '#F2F2F2' : '#FFFFFF'
                        : 
                            commentsCount > 0 ? '#000000' : '#151515', 
                        minHeight: 3,
                }}>

                    <FlashList
                        // ref={flashListRef}
                        data={commentsList}

                        renderItem={renderItem}

                        // extraData={[]}

                        // onEndReachedThreshold={0.5}
                        // onEndReached={() => }
                        
                        removeClippedSubviews={true}


                        estimatedItemSize={200}
                        estimatedListSize={{height: windowHeight, width: windowWidth - 10}}

                        ListFooterComponent={
                            <View style={{ marginTop: 2, marginBottom: 2}}/>
                        }

                        getItemType={getItemType}

                        // overrideItemLayout={overrideItemLayout}

                        keyExtractor={keyExtractor}

                    />
                </View>
                
            }


            {/* Comment Footer */}
            {
                commentsCount > 0 &&

                    <TouchableOpacity 
                        activeOpacity={1}
                        style={{
                            backgroundColor: theme == 'light' ? '#FFFFFF' : '#151515',
                            // backgroundColor: theme == 'light' ? '#EEEEEE' : '#171717',
                            borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' 
                        }}
                        onPress = {commentsCount - commentsList.length > 0 && getFiveCommentsByPopular()}
                    >
                        
                        {/* might need too edit input to intToString */}
                        <Text style={[theme == 'light' ? styles.lightViewText : styles.darkViewText,{
                            margin: 10,
                        }]}>
                            View {intToString(commentsCount - (commentsList.length > 1 ? commentsList.length : 0))} replies
                        </Text>

                        {down}
                        
                    </TouchableOpacity>
            }
        </View>
    );
}