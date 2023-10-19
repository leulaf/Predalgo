import React, { } from 'react';

import { TouchableOpacity, View, Linking } from 'react-native';

import { AuthenticatedUserContext } from '../../../context-store/context';

import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

import PostContainer from './PostContainer';

import PostText from '../../shared/Text/PostText';

import WebView, {} from 'react-native-webview';

import InstagramPost from '../InstagramPost';

import { ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import TikTokPost from '../TikTokPost';
import NativeAdView from "react-native-admob-native-ads";


const onNavToPost =  (navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount) => () => {
    console.log('nav to post')
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    });
}

const TextPost = ({ title, username, reposterUsername, profilePic, reposterProfilePic, text, tags, profile, reposterProfile, postId, repostId, likesCount, commentsCount, repostsCount, repostComment }) => {
    // const {theme,setTheme} = useContext(ThemeContext);
    // const [profilePicState, setProfilePicState] = useState(profilePic);
    // const [usernameState, setUsernameState] = useState(username);
    // const [repostUsername, setRepostUsername] = useState(null);
    const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    const navigation = useNavigation();
    const video = React.useRef(null);
    const [url, setUrl] = React.useState(null);


    const onLongPress = React.useCallback((repostWithComment) => () => {
        if(repostWithComment){
            setOptions({
                postId: repostId,
                repostedId: postId,
                profile: reposterProfile,
                repostComment: repostComment,
            })
        }else{
            setOptions({
                postId: postId,
                repostId: repostId,
                profile: profile,
                text: text,
            })
        }
        
    }, []);

    React.useEffect(() => {

          
        // let text = await response.text();
        add()
        // console.log(add())
    //     fetch("https://www.tiktok.com/@scout2015/video/6718335390845095173")
    // .then((response) => {
    //     console.log(response)
    //   return response
    // })
    // .then((responseJson) => {
    //   return responseJson.movies;
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    }, []);

    const add = async() => {
        // let response = await fetch( 'https://www.tiktok.com/@scout2015/video/6718335390845095173');
        
        // let text = await response.text();
        return fetch('https://www.reddit.com/r/facepalm/comments/176g8tl/im_going_to_need_this_one_fact_checked/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button')
    .then(response => response.text())
    .then(json => {
        console.log("{{{{{{")
        var mySubString = json.substring(
            json.indexOf("<video>"),
            // json.indexOf("</video>")
        );
        setUrl(json)

        console.log(mySubString)
      return json.movies;
    })
    .catch(error => {
      console.error(error);
    });
        // console.log(text)
        return text
    }

//     if(repostComment?.length > 0){
//         return (
//             <PostContainer 
//                 // likesCount={repostLikesCount}
//                 // commentsCount={repostCommentsCount}
//                 likesCount={0}
//                 commentsCount={0}
//                 repostComment={repostComment}
//                 postId={repostId}
//                 profile={reposterProfile}
//                 username={reposterUsername}
//                 profilePic={reposterProfilePic}
//                 tags={tags}
    
//                 navigation={navigation}
    
//                 content={
//                     <>

//                         <TouchableOpacity
//                             activeOpacity={0.9}
//                             onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
//                             onLongPress={onLongPress(true)}
//                         >
                        
//                             <PostText numberOfLines={15} text={repostComment}/>

//                         </TouchableOpacity>

                        

                                
//                         <TouchableOpacity
//                             activeOpacity={0.9}
//                             onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
//                             // onLongPress={onLongPress(true)}
//                             style={{marginHorizontal: '2%',}}
//                         >

//                             <PostContainer 
//                                 title={title}
//                                 text={text}
//                                 likesCount={likesCount}
//                                 commentsCount={commentsCount}
//                                 // repostComment={repostComment}
//                                 repostsCount={repostsCount}
//                                 memeText={false}
//                                 profile={profile}
//                                 // repostId={repostId}
//                                 postId={postId}
//                                 profilePic={profilePic}
//                                 username={username}
//                                 // reposterProfile={reposterProfile}
//                                 // reposterUsername={reposterUsername}
//                                 // reposterProfilePic={reposterProfilePic}
//                                 repostedWithComment={true}
                    
//                                 navigation={navigation}
                    
//                                 content={
//                                     // <View style={{marginBottom: 10}}>
//                                         <PostText numberOfLines={10} text={text} repostedWithComment={true}/>
//                                     // </View>
//                                 }
//                             />

//                         </TouchableOpacity>
                        
//                     </>
//                 }
//             />
//         );
//     }
const navigationRedirect = navState => {
    const { dispatch } = navigation
    const url = navState.url

      if(!url.includes('m.')){

         if(navState.canGoBack && navState.loading){

            this.webview.goBack()

             return dispatch(StackActions.push({
                 routeName: 'VisorWebView',
                 params: { url },
                 actions: [this.trackingForAnalytics(url)] //This function not affect the navigation
            }))

         }

     }else{
           this.webview.stopLoading()
           this.webview.goBack()
           Linking.openURL(url)
    }
    // return false

}
let jsCode = `!function(){var e=function(e,n,t){if(n=n.replace(/^on/g,""),"addEventListener"in window)e.addEventListener(n,t,!1);else if("attachEvent"in window)e.attachEvent("on"+n,t);else{var o=e["on"+n];e["on"+n]=o?function(e){o(e),t(e)}:t}return e},n=document.querySelectorAll("a[href]");if(n)for(var t in n)n.hasOwnProperty(t)&&e(n[t],"onclick",function(e){new RegExp("^https?://"+location.host,"gi").test(this.href)||(e.preventDefault(),window.postMessage(JSON.stringify({external_url_open:this.href})))})}();`
const onMessage = (e) =>
{
    // retrieve event data
    var data = e.nativeEvent.data;
    // maybe parse stringified JSON
    try {
      data = JSON.parse(data)
    } catch ( e ) {  }
    // check if this message concerns us
    if ( 'object' == typeof data && data.external_url_open ) {
      // proceed with URL open request
      return Alert.alert(
        'External URL',
        'Do you want to open this URL in your browser?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => Linking.openURL( data.external_url_open )},
        ],
        { cancelable: false }
      );
    }
  }
  const shouldStartLoadWithRequest = (req) => {
    // open the link in native browser
    // Linking.openURL(req.url);
  
    // returning false prevents WebView to navigate to new URL
    return false;
  };
    return (








        // <WebView
        //     ref={(ref) => { this.webview = ref; }}
        //     automaticallyAdjustContentInsets={true}
        //     // allowsFullscreenVideo={true} // self-explanntory
        //     allowsInlineMediaPlayback={true}
        //     scrollEnabled={false}  // self-explanntory
        //     allowsFullscreenVideo={false}  // not sure if this is applicable for the webview but don't want users causing weird bugs
        //     domStorageEnabled={false}  // for TikTok's caching purposes
        //     javaScriptEnabled={true}  // so the all-to-import script tag will run in the rendered HTML
        //     // originWhitelist={["https://predalgo-backend.web.app/", "https://instagram.com/",]}  // Allows the requests content header to TikTok to accept any IP address, pretty much
        //     style={{height: 600, width: "100%", marginBottom: 50,}}
        //     // source={{html: '<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">きつね<a href="https://twitter.com/hashtag/AnimateDiff?src=hash&amp;ref_src=twsrc%5Etfw">#AnimateDiff</a> <a href="https://t.co/3c4asNpRMh">pic.twitter.com/3c4asNpRMh</a></p>&mdash; ScottieFox (@ScottieFoxTTV) <a href="https://twitter.com/ScottieFoxTTV/status/1712288843116773661?ref_src=twsrc%5Etfw">October 12, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'}}
        //     // originWhitelist={["https://predalgo-backend.web.app/, https://www.instagram.com/"]}
        //     // userAgent="demo-react-native-app"
        //     // allowsLinkPreview={true}
        //     mixedContentMode='always'
        //     // userAgent="Mozilla/5.0"
        //     setSupportMultipleWindows={false}
        //     forceDarkOn={true}

        //     source={{url: url}}
        //     onShouldStartLoadWithRequest={request => {
        //         console.log(request)
        //         // return request.url.includ/es("applink") ? false : true;
        //         return true
        //     }}
        // />









// <View><NativeAdView adUnitID="ca-app-pub-3940256099942544/2247696110">
//   <View></View>
// </NativeAdView></View>

        // <WebView
        //     ref={(ref) => { this.webview = ref; }}
        //     // automaticallyAdjustContentInsets={true}
        //     allowsInlineMediaPlayback={true}
        //     // scrollEnabled={false}  // self-explanntory
        //     // allowsFullscreenVideo={true}  // not sure if this is applicable for the webview but don't want users causing weird bugs
        //     // domStorageEnabled={false}  // for TikTok's caching purposes
        //     // javaScriptEnabled={true}  // so the all-to-import script tag will run in the rendered HTML
        //     // originWhitelist={["https://predalgo-backend.web.app/", "https://instagram.com/",]}  // Allows the requests content header to TikTok to accept any IP address, pretty much
        //     style={{height: 400, width: "100%", marginBottom: 50,}}
        //     source={{url: "https://www.youtube.com/embed/VJdPBKNr0mo"}}
        //     // originWhitelist={["https://predalgo-backend.web.app/, https://www.instagram.com/"]}
        //     // userAgent="demo-react-native-app"
        //     // userAgent="Mozilla/5.0 AppleWebKit/537.36  Chrome/78.0.3904.97 Safari/537.36"
        //     // allowsLinkPreview={true}
        //     // mixedContentMode='always'
        //     // userAgent="Mozilla/5.0"
        //     // userAgent="Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/28.0.0.20.16;]"
        //     // mediaPlaybackRequiresUserAction={false}
        //     // setSupportMultipleWindows={false}
        //     forceDarkOn={true}

        //     onNavigatorStateChange={(event) => {
        //         if (event.url !== "https://www.youtube.com/embed/VJdPBKNr0mo") {
        //         this.webview.stopLoading();
        //         Linking.openURL(event.url);
        //         }
        //     }}

        //     onShouldStartLoadWithRequest={request => {
        //         console.log(request)
        //         return !request.url.includes("https://www.youtube.com/embed/VJdPBKNr0mo") ? false : true;
        //         // return tru
        //     }}

        // />













        // TikTok Post
        // <Video
        //     ref={video}
        //     style={{ width: "auto", height: 500, marginBottom: 50,}}
        //     source={{
        //         uri: url
        //     //   uri: 'https://v16m-default.tiktokcdn-us.com/0b2efa3463563d301c473f889c1bac6b/6528c06b/video/tos/useast5/tos-useast5-ve-0068c004-tx/o4hRs0UtOZj1nCzxBgtSf6ASQvIVDN0fDSbkLE/?a=1988&ch=0&cr=3&dr=0&lr=tiktok_m&cd=0%7C0%7C1%7C3&cv=1&br=5864&bt=2932&bti=NDU3ZjAwOg%3D%3D&cs=0&ds=3&ft=_G6uMBnZq8Zmo47R.Q_vj-qLsAhLrus&mime_type=video_mp4&qs=0&rc=M2U3OjpoaWk1ZTo2NDtlPEBpM29tZ2g6ZnlsazMzZzczNEBfNTBgLTZgNl8xXjQ1MTIvYSM2L2FxcjRva2pgLS1kMS9zcw%3D%3D&l=20231012215758B4616E514ED8C71BDF79&btag=e00008000',
        //     }}
        //     useNativeControls
        //     resizeMode={ResizeMode.COVER}
        //     isLooping
        //     shouldPlay
        //     // isMuted={true} // create function to mute or unmute all videos at once
        //     // onPlaybackStatusUpdate={status => setStatus(() => status)}
        // />








        // Youtube Video
<WebView
ref={(ref) => { this.webview = ref; }}
// automaticallyAdjustContentInsets={true}
allowsInlineMediaPlayback={true}
// scrollEnabled={false}  // self-explanntory
// allowsFullscreenVideo={true}  // not sure if this is applicable for the webview but don't want users causing weird bugs
// domStorageEnabled={false}  // for TikTok's caching purposes
// javaScriptEnabled={true}  // so the all-to-import script tag will run in the rendered HTML
// originWhitelist={["https://predalgo-backend.web.app/", "https://instagram.com/",]}  // Allows the requests content header to TikTok to accept any IP address, pretty much
style={{height: 400, width: "100%", marginBottom: 50,}}
source={{url: "https://www.youtube.com/embed/VJdPBKNr0mo"}}
// originWhitelist={["https://predalgo-backend.web.app/, https://www.instagram.com/"]}
// userAgent="demo-react-native-app"
// userAgent="Mozilla/5.0 AppleWebKit/537.36  Chrome/78.0.3904.97 Safari/537.36"
// allowsLinkPreview={true}
// mixedContentMode='always'
// userAgent="Mozilla/5.0"
// userAgent="Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/28.0.0.20.16;]"
// mediaPlaybackRequiresUserAction={false}
// setSupportMultipleWindows={false}
forceDarkOn={true}

onNavigatorStateChange={(event) => {
if (event.url !== "https://www.youtube.com/embed/VJdPBKNr0mo") {
this.webview.stopLoading();
Linking.openURL(event.url);
}
}}

onShouldStartLoadWithRequest={request => {
console.log(request)
return !request.url.includes("https://www.youtube.com/embed/VJdPBKNr0mo") ? false : true;
// return tru
}}

/>
    );
}


export default TextPost;
{/* <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                    onLongPress={onLongPress()}
                >
                    
                    <PostText numberOfLines={15} text={!repostComment ? text : repostComment}/>

                    {
                        repostComment &&
                            
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                                onLongPress={onLongPress()}
                                style={{marginLeft: '15%',}}
                            >
                                <PostContainer 
                                    title={title}
                                    text={text}
                                    likesCount={likesCount}
                                    commentsCount={commentsCount}
                                    repostComment={repostComment}
                                    repostsCount={repostsCount}
                                    tags={tags}
                                    memeText={false}
                                    profile={profile}
                                    repostId={repostId}
                                    postId={postId}
                                    profilePic={profilePic}
                                    username={username}
                                    reposterProfile={reposterProfile}
                                    reposterUsername={reposterUsername}
                                    reposterProfilePic={reposterProfilePic}
                        
                                    navigation={navigation}
                        
                                    content={
                                        <PostText numberOfLines={15} text={text}/>
                                    }
                                />
                            </TouchableOpacity>
                    }
                </TouchableOpacity> */}