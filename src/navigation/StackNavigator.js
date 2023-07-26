import React from "react";
import { createStackNavigator } from "@react-navigation/stack";



import AuthScreen from '../screens/AuthScreen';

import DrawerNavigator from "./DrawerNavigator";

import UploadScreen from '../screens/UploadScreen';
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
import PostReplyBottomSheet from '../components/replyBottom/PostReplyBottomSheet';
import CommentReplyBottomSheet from '../components/replyBottom/CommentReplyBottomSheet';


const Stack = createStackNavigator();

const MainStackNavigator = ({}) => {

    
  return (
    <Stack.Navigator 
        initialRouteName="Drawer"
    >
        <Stack.Screen name="Drawer" component={DrawerNavigator}
            options={{
                headerShown: false,
            }} 
        />

        <Stack.Screen name="Upload" component={UploadScreen}
            options={{
                headerShown: false,
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
            }}
        />
        <Stack.Screen name="Tag" component={TagScreen}
            options={{
                // headerShown: false,
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
            }}
        />
        <Stack.Screen name="FavoriteTemplates" component={FavoriteTemplatesScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="Post" component={PostScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="Comment" component={CommentScreen}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="PostReplyBottomSheet" component={PostReplyBottomSheet}
            options={{
                // headerShown: false,
            }}
        />
        <Stack.Screen name="CommentReplyBottomSheet" component={CommentReplyBottomSheet}
            options={{
                // headerShown: false,
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