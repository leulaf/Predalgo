import React, { } from 'react';

import { Video, ResizeMode } from 'expo-av';



const TikTokPost = ({ postUrl }) => {
    // const {theme,setTheme} = useContext(ThemeContext);
    // const [profilePicState, setProfilePicState] = useState(profilePic);
    // const [usernameState, setUsernameState] = useState(username);
    // const [repostUsername, setRepostUsername] = useState(null);
    // const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    // const navigation = useNavigation();
    const video = React.useRef(null);
    const [url, setUrl] = React.useState(postUrl);

    React.useEffect(() => {

          
        // let text = await response.text();
        set()

    }, []);
    console.log(url)
    const set = async() => {
        // let response = await fetch( 'https://www.tiktok.com/@scout2015/video/6718335390845095173');
        // console.log(url)
        // let text = await response.text();
        return fetch(postUrl)
        .then(response => response.text())
        .then(json => {
            // console.log("{{{{{{")
            var mySubString = json.substring(
                json.indexOf("https://v16m"), 
                json.indexOf("poster=")-2
            );
            setUrl(mySubString)

            console.log(mySubString)
            return json.movies;
        })
        .catch(error => {
            console.error(error);
        });

    }

    if(url === undefined || url === null || url === ""){
        return null
    }

    return (

        <Video
        // ref={video}
        style={{ width: "auto", height: 500, marginBottom: 50,}}
        source={{
            uri: url
        //   uri: 'https://v16m-default.tiktokcdn-us.com/0b2efa3463563d301c473f889c1bac6b/6528c06b/video/tos/useast5/tos-useast5-ve-0068c004-tx/o4hRs0UtOZj1nCzxBgtSf6ASQvIVDN0fDSbkLE/?a=1988&ch=0&cr=3&dr=0&lr=tiktok_m&cd=0%7C0%7C1%7C3&cv=1&br=5864&bt=2932&bti=NDU3ZjAwOg%3D%3D&cs=0&ds=3&ft=_G6uMBnZq8Zmo47R.Q_vj-qLsAhLrus&mime_type=video_mp4&qs=0&rc=M2U3OjpoaWk1ZTo2NDtlPEBpM29tZ2g6ZnlsazMzZzczNEBfNTBgLTZgNl8xXjQ1MTIvYSM2L2FxcjRva2pgLS1kMS9zcw%3D%3D&l=20231012215758B4616E514ED8C71BDF79&btag=e00008000',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        // shouldPlay
        // onPlaybackStatusUpdate={status => setStatus(() => status)}
      />

    );
}


export default TikTokPost;
