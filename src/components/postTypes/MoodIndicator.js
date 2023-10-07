import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    // withRepeat,
    withSequence
} from 'react-native-reanimated';

import LottieView from 'lottie-react-native';

import * as Haptics from 'expo-haptics';

import {onSelectMood, onUnselectMood} from '../../shared/post/MoodSelectAndUnselect';


const laughing = require('../../../assets/emojis/laughing.json');
const angry = require('../../../assets/emojis/angry.json');
const sad = require('../../../assets/emojis/sad.json');
const lightBulb = require('../../../assets/emojis/lightBulb.json');
const eyeRoll = require('../../../assets/emojis/eyeRoll.json');
const loving = require('../../../assets/emojis/loving.json');
const shocked = require('../../../assets/emojis/shocked.json');
const skeptical = require('../../../assets/emojis/skeptical.json');
const wink = require('../../../assets/emojis/wink.json');
const confetti = require('../../../assets/emojis/confetti.json');
const crying = require('../../../assets/emojis/crying.json');

const initialOffset = 1;
const finalOffset = 50;

const moods = [
    "laughing",
    "loving",
    "shocked",
    "lightBulb",
    "confetti",
    "wink",
    "skeptical",
    "eyeRoll",
    "crying",
    "sad",
    "angry"
];

export default MoodIndicator = ({postId, liked, setLiked}) => {
    const jumpOffSet = useSharedValue(0);

    // Jumping animation
    const jumpStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: jumpOffSet.value }],
    }));


    React.useEffect(() => {
        if(liked.show == "laughing"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "laughing"
                }
            );
        }else if(liked.show == "loving"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "loving"
                }
            );
        }else if(liked.show == "shocked"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "shocked"
                }
            );
        }else if(liked.show == "lightBulb"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "lightBulb"
                }
            );
        }else if(liked.show == "confetti"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "confetti"
                }
            );
        }else if(liked.show == "wink"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "wink"
                }
            );
        }else if(liked.show == "skeptical"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "skeptical"
                }
            );
        }else if(liked.show == "eyeRoll"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "eyeRoll"
                }
            );
        }else if(liked.show == "crying"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "crying"
                }
            );
        }else if(liked.show == "sad"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "sad"
                }
            );
        }else if(liked.show == "angry"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setLiked(
                {
                    id: postId,
                    show: "stop",
                    chose: "angry"
                }
            );
        }
        
    }, [liked]);

    

    return(
        <View style={{ marginLeft: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  justifyContent: 'space-around'}}>
            
            {/* Light Bulb */}
            {
                (liked.chose == "lightBulb" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "lightBulb" ? 7 : 0, marginLeft: liked.chose == "lightBulb" ? -5 : 0}}
                        onPress={() => {
                            // liked.chose != "lightBulb" && onSelectMood(replyToPostId, postId, "good")
                            // liked.chose == "lightBulb" && onUnselectMood(replyToPostId, postId, "good")
                            liked.chose != "lightBulb" ?
                                onSelectMood(postId, "lightBulb")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "lightBulb")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "lightBulb" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "lightBulb",
                                        chose: ""
                                    }
                            )
                            
                            

                           
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: 35, width: 35}}
                            source={lightBulb}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Confetti */}
            {
                (liked.chose == "confetti" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "confetti" ? 8 : 0, marginLeft: liked.chose == "confetti" ?-1 : -6}}
                        onPress={() => {
                            liked.chose != "confetti" ?
                                onSelectMood(postId, "confetti")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "confetti")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "confetti" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "confetti",
                                        chose: ""
                                    }
                            )
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: 38, width: 38}}
                            source={confetti}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Laughing */}
            {
                (liked.chose == "laughing" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "laughing" ? 5 : 0, marginLeft: liked.chose == "laughing" ? -7 : -12}}
                        onPress={() => {
                            liked.chose != "laughing" ?
                                onSelectMood(postId, "laughing")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "laughing")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "laughing" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "laughing",
                                        chose: ""
                                    }
                            )
                        }}
                    >
                        
                            <LottieView
                                autoPlay
                                style={{height: 45, width: 45}}
                                source={laughing}
                            />
                        
                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Loving */}
            {
                (liked.chose == "loving" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "loving" ? 13 : 0, marginLeft: liked.chose == "loving" ? -2 : -8}}
                        onPress={() => {
                            liked.chose != "loving" ?
                                onSelectMood(postId, "loving")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "loving")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "loving" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "loving",
                                        chose: ""
                                    }
                            )
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: 39, width: 39}}
                            source={loving}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Wink */}
            {
                (liked.chose == "wink" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "wink" ? 10 : 0, marginLeft: liked.chose == "wink" ? -3 : -7}}
                        onPress={() => {
                            liked.chose != "wink" ?
                                onSelectMood(postId, "wink")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "wink")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "wink" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "wink",
                                        chose: ""
                                    }
                            )
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: (liked.chose == "wink" || liked.show === false) && 39, width: 39}}
                            source={wink}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Shocked */}
            {
                (liked.chose == "shocked" || liked.show === false) &&
                
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "shocked" ? 13 : 0, marginLeft: liked.chose == "shocked" ? -2 : -7}}
                        onPress={() => {
                            liked.chose != "shocked" ?
                                onSelectMood(postId, "shocked")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "shocked")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "shocked" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "shocked",
                                        chose: ""
                                    }
                            )
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: 34, width: 34}}
                            source={shocked}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Sad */}
            {
                (liked.chose == "sad" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "sad" ? 11 : 0, marginLeft: liked.chose == "sad" ? -3 : -9}}
                        onPress={() => {
                            liked.chose != "sad" ?
                                onSelectMood(postId, "sad")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "sad")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "sad" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "sad",
                                        chose: ""
                                    }
                            )
                        }}
                    >
                        
                        <LottieView
                            autoPlay
                            style={{height: 40.5, width: 40.5}}
                            source={sad}
                        />
                        
                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Skeptical */}
            {
                (liked.chose == "skeptical" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "skeptical" ? 6 : 0, marginLeft: liked.chose == "skeptical" ? -6 : -11}}
                        onPress={() => {
                            liked.chose != "skeptical" ?
                                onSelectMood(postId, "skeptical")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "skeptical")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "skeptical" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "skeptical",
                                        chose: ""
                                    }
                            )
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: 47, width: 47}}
                            source={skeptical}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Eye Roll */}
            {
                (liked.chose == "eyeRoll" || liked.show === false) &&
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "eyeRoll" ? 10 : 0, marginLeft: liked.chose == "eyeRoll" ? -2 : -6}}
                        onPress={() => {
                            liked.chose != "eyeRoll" ?
                                onSelectMood(postId, "eyeRoll")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "eyeRoll")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "eyeRoll" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "eyeRoll",
                                        chose: ""
                                    }
                            )
                        }}

                    >

                        <LottieView
                            autoPlay
                            style={{height: 39, width: 39}}
                            source={eyeRoll}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Angry */}
            {
                (liked.chose == "angry" || liked.show === false) &&
                
                <Animated.View style={[jumpStyle, {flex: liked.show === false && 1, marginRight: liked.chose == "angry" ? -9 : 1, marginLeft: -2}]}>
                    <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: liked.chose == "angry" ? 0 : 5, marginLeft: liked.chose == "angry" ? -21 : -21}}
                        onPress={() => {
                            liked.chose != "angry" ?
                                onSelectMood(postId, "angry")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "angry")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setLiked(
                                liked.chose == "angry" ?
                                    {
                                        id: postId,
                                        show: false
                                    }
                                :
                                    {
                                        id: postId,
                                        show: "angry",
                                        chose: ""
                                    }
                            )

                            liked.chose == "angry" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                    >
                    
                        <LottieView
                            autoPlay
                            style={{height: 41, width: 41}}
                            source={angry}
                        />
                        
                    </TouchableOpacity>
                </Animated.View>
            }
        </View>
    );
};
