import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from 'react-native';

// import {Animated} from 'react-native';

import AuthScreen from '../screens/AuthScreen';

import DrawerNavigator from "./DrawerNavigator";

import UploadScreen from '../screens/UploadScreen';
import AddPostScreen from '../screens/AddPostScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditMemeScreen from '../screens/EditMemeScreen';
import EditImageScreen from '../screens/EditImageScreen';
import FollowingScreen from '../screens/FollowingScreen';
import FollowersScreen from '../screens/FollowersScreen';
import TagScreen from '../screens/TagScreen';
import SearchTagScreen from '../screens/SearchTagScreen';
import MemeScreen from '../screens/MemeScreen';
import SearchMemesScreen from '../screens/SearchMemesScreen';
import FavoriteTemplatesScreen from '../screens/FavoriteTemplatesScreen';
import PostScreen from '../screens/PostScreen';
import CommentScreen from '../screens/CommentScreen';


const windowWidth = Dimensions.get('screen').width;

const Stack = createStackNavigator();

// const cardStyleInterpolator = ({
//     current,
//     next,
//     inverted,
//     layouts: { screen }
//   }) => {
//     const progress = Animated.add(
//       current.progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 1],
//         extrapolate: "clamp"
//       }),
//       next
//         ? next.progress.interpolate({
//             inputRange: [0, 1],
//             outputRange: [0, 1],
//             extrapolate: "clamp"
//           })
//         : 0
//     );

//     return {
//       cardStyle: {
//         transform: [
//           {
//             translateX: Animated.multiply(
//               progress.interpolate({
//                 inputRange: [0, 1, 2],
//                 outputRange: [
//                   screen.width, // Focused, but offscreen in the beginning
//                   0, // Fully focused
//                   //I changed this line only
//                   //screen.width * -0.3 // Fully unfocused
//                   -screen.width
//                 ],
//                 extrapolate: "clamp"
//               }),
//               inverted
//             )
//           }
//         ]
//       }
//     };
//   };

const MainStackNavigator = ({}) => {

    
  return (
    <Stack.Navigator 
        initialRouteName="Drawer"
        // screenOptions={{
            // headerShown: false, //Optional
            // cardStyle: { backgroundColor: "transparent" }, //Optional
            // cardStyleInterpolator
        // }}
    >
        <Stack.Screen name="Drawer" component={DrawerNavigator}
            options={{
                headerShown: false,
            }} 
        />

        <Stack.Screen name="Upload" component={UploadScreen}
            options={{
                headerShown: false,
                gestureResponseDistance: windowWidth,
                
            }} 
        />
        <Stack.Screen name="AddPost" component={AddPostScreen}
            options={{
                // headerShown: false,
                // gestureResponseDistance: windowWidth,
            }}
        />
        <Stack.Screen name="CreatePost" component={CreatePostScreen}
            options={{
                headerShown: false,
            }} 
        />
        <Stack.Screen name="Search" component={SearchScreen}
            options={{
                headerShown: false,
            }} 
        />
        <Stack.Screen name="Profile" component={ProfileScreen} 
            options={{
            // header: () => <ProfileTop/>,
            }}
        />
        <Stack.Screen name="EditMeme" component={EditMemeScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="EditImage" component={EditImageScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="Following" component={FollowingScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="Followers" component={FollowersScreen}
            options={{
                // headerShown: false,
                gestureResponseDistance: windowWidth,
            }}
        />
        <Stack.Screen name="Tag" component={TagScreen}
            options={{
                // headerShown: false,
                gestureResponseDistance: windowWidth,
            }}
        />
        <Stack.Screen name="SearchTag" component={SearchTagScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="Meme" component={MemeScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="SearchMemes" component={SearchMemesScreen}
            options={{
                // headerShown: false,
                gestureResponseDistance: windowWidth,
            }}
        />
        <Stack.Screen name="FavoriteTemplates" component={FavoriteTemplatesScreen}
            options={{
                // headerShown: false,
                gestureResponseDistance: windowWidth,
            }}
        />
        <Stack.Screen name="Post" component={PostScreen}
            options={{
                // headerShown: false,
                gestureResponseDistance: windowWidth,
            }}
        />
        <Stack.Screen name="Comment" component={CommentScreen}
            options={{
                // headerShown: false,
                gestureResponseDistance: windowWidth,
            }}
        />

    </Stack.Navigator>
  );
}

const AuthStackNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen name="Auth" component={AuthScreen} 
              options={{
                  headerShown: false,
              }} 
          />
      </Stack.Navigator>
    );
  }

export { MainStackNavigator, AuthStackNavigator };