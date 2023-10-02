import { Share } from 'react-native';

export default onShare = (text, image) => async() =>{
    try {
        const result = await Share.share({
            message: text,
            url: image
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
            // shared with activity type of result.activityType
            } else {
            // shared
            }
        }
        else if (result.action === Share.dismissedAction) {
            // dismissed
        }
        return 1
    } catch (error) {
        // alert(error.message);
    }
}