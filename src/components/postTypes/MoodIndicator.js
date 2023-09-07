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

export default MoodIndicator = ({postId, emoji, setEmoji}) => {
    const jumpOffSet = useSharedValue(0);

    // Jumping animation
    const jumpStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: jumpOffSet.value }],
    }));


    React.useEffect(() => {
        if(emoji.show == "laughing"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "laughing"
                }
            );
        }else if(emoji.show == "loving"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "loving"
                }
            );
        }else if(emoji.show == "shocked"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "shocked"
                }
            );
        }else if(emoji.show == "lightBulb"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "lightBulb"
                }
            );
        }else if(emoji.show == "confetti"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "confetti"
                }
            );
        }else if(emoji.show == "wink"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "wink"
                }
            );
        }else if(emoji.show == "skeptical"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "skeptical"
                }
            );
        }else if(emoji.show == "eyeRoll"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "eyeRoll"
                }
            );
        }else if(emoji.show == "crying"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "crying"
                }
            );
        }else if(emoji.show == "sad"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "sad"
                }
            );
        }else if(emoji.show == "angry"){
            jumpOffSet.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    id: postId,
                    show: "stop",
                    chose: "angry"
                }
            );
        }
        
    }, [emoji]);

    

    return(
        <View style={{ marginLeft: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  justifyContent: 'space-around'}}>
            
            {/* Light Bulb */}
            {
                (emoji.chose == "lightBulb" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "lightBulb" ? 7 : 0, marginLeft: emoji.chose == "lightBulb" ? -5 : 0}}
                        onPress={() => {
                            // emoji.chose != "lightBulb" && onSelectMood(replyToPostId, postId, "good")
                            // emoji.chose == "lightBulb" && onUnselectMood(replyToPostId, postId, "good")
                            emoji.chose != "lightBulb" ?
                                onSelectMood(postId, "lightBulb")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "lightBulb")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "lightBulb" ?
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
                (emoji.chose == "confetti" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "confetti" ? 8 : 0, marginLeft: emoji.chose == "confetti" ?-1 : -6}}
                        onPress={() => {
                            emoji.chose != "confetti" ?
                                onSelectMood(postId, "confetti")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "confetti")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "confetti" ?
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
                (emoji.chose == "laughing" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "laughing" ? 5 : 0, marginLeft: emoji.chose == "laughing" ? -7 : -12}}
                        onPress={() => {
                            emoji.chose != "laughing" ?
                                onSelectMood(postId, "laughing")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "laughing")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "laughing" ?
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
                (emoji.chose == "loving" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "loving" ? 13 : 0, marginLeft: emoji.chose == "loving" ? -2 : -8}}
                        onPress={() => {
                            emoji.chose != "loving" ?
                                onSelectMood(postId, "loving")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "loving")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "loving" ?
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
                (emoji.chose == "wink" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "wink" ? 10 : 0, marginLeft: emoji.chose == "wink" ? -3 : -7}}
                        onPress={() => {
                            emoji.chose != "wink" ?
                                onSelectMood(postId, "wink")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "wink")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "wink" ?
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
                            style={{height: (emoji.chose == "wink" || emoji.show === false) && 39, width: 39}}
                            source={wink}
                        />

                    </TouchableOpacity>
                </Animated.View>
            }



            {/* Shocked */}
            {
                (emoji.chose == "shocked" || emoji.show === false) &&
                
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "shocked" ? 13 : 0, marginLeft: emoji.chose == "shocked" ? -2 : -7}}
                        onPress={() => {
                            emoji.chose != "shocked" ?
                                onSelectMood(postId, "shocked")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "shocked")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "shocked" ?
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
                (emoji.chose == "sad" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "sad" ? 11 : 0, marginLeft: emoji.chose == "sad" ? -3 : -9}}
                        onPress={() => {
                            emoji.chose != "sad" ?
                                onSelectMood(postId, "sad")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "sad")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "sad" ?
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
                (emoji.chose == "skeptical" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "skeptical" ? 6 : 0, marginLeft: emoji.chose == "skeptical" ? -6 : -11}}
                        onPress={() => {
                            emoji.chose != "skeptical" ?
                                onSelectMood(postId, "skeptical")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "skeptical")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "skeptical" ?
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
                (emoji.chose == "eyeRoll" || emoji.show === false) &&
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "eyeRoll" ? 10 : 0, marginLeft: emoji.chose == "eyeRoll" ? -2 : -6}}
                        onPress={() => {
                            emoji.chose != "eyeRoll" ?
                                onSelectMood(postId, "eyeRoll")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "eyeRoll")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "eyeRoll" ?
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
                (emoji.chose == "angry" || emoji.show === false) &&
                
                <Animated.View style={[jumpStyle, {flex: emoji.show === false && 1, marginRight: emoji.chose == "angry" ? -9 : 1, marginLeft: -2}]}>
                    <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "angry" ? 0 : 5, marginLeft: emoji.chose == "angry" ? -21 : -21}}
                        onPress={() => {
                            emoji.chose != "angry" ?
                                onSelectMood(postId, "angry")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            :
                                onUnselectMood(postId, "angry")
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setEmoji(
                                emoji.chose == "angry" ?
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

                            emoji.chose == "angry" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
