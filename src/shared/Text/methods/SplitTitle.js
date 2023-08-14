import {Text, StyleSheet} from 'react-native';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

export default SplitPost = (text, theme) => {
    const navigation = useNavigation();
    let parts = text.split(' ');
    let currIndex = 0;

    let finalText = [];
    
    for (let i = 0; i < parts.length; i++) {
        
        if((parts[i].charAt(0) === '#' || parts[i].charAt(0) === '@') && parts[i].length > 1 && i == 0){
            // finalText.push( 
            //     <Text key={uuid.v4()} style={theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle}>
            //         {parts.slice(currIndex, i).join(" ")}
            //     </Text>
            // );

            finalText.push(
                <Text
                    key={uuid.v4()}
                    suppressHighlighting={true}
                    onPress={() => NavigateToTag(parts[i], navigation)}
                    style={theme == 'light' ? styles.lightLinkText : styles.darkLinkText}
                >
                    {parts[i]}
                </Text>
            );

            currIndex = i + 1;

        }else if((parts[i].charAt(0) === '#' || parts[i].charAt(0) === '@') && parts[i].length > 1){

            if(currIndex == 0){
                finalText.push( 
                    <Text key={uuid.v4()} style={theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle}>
                        {parts.slice(currIndex, i).join(" ")}
                    </Text>
                );
            }else{
                finalText.push( 
                    <Text key={uuid.v4()} style={theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle}>
                        {" " + parts.slice(currIndex, i).join(" ")}
                    </Text>
                );
            }
            

            finalText.push(
                <Text
                    key={uuid.v4()}
                    suppressHighlighting={true}
                    onPress={() => NavigateToTag(parts[i], navigation)}
                    style={theme == 'light' ? styles.lightLinkText : styles.darkLinkText}
                >
                    {" " + parts[i]}
                </Text>
            );

            currIndex = i + 1;

        }else if(i == parts.length - 1 && currIndex != 0){
            finalText.push( 
                <Text key={uuid.v4()} style={theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle}>
                    {" " + parts.slice(currIndex, i + 1).join(" ")}
                </Text>
            );
        }else if(i == parts.length - 1){
            finalText.push( 
                <Text key={uuid.v4()} style={theme == 'light' ? styles.lightPostTitle : styles.darkPostTitle}>
                    {parts.slice(currIndex, i + 1).join(" ")}
                    {/* {console.log(parts.slice(currIndex, i + 1))} */}
                </Text>
            );
        }
    }

    return finalText;
};


const styles = StyleSheet.create({
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#333333',
        textAlign: 'auto',
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: 'auto',
    },
    lightLinkText: {
        fontSize: 22,
        fontWeight: "600",
        color: 'blue',
        textAlign: 'auto',
        // marginBottom: 6,
    },
    darkLinkText: {
        fontSize: 22,
        fontWeight: "600",
        color: '#00C5FF',
        textAlign: 'auto',
    }
})
