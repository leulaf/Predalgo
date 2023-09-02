export default intToString = (count) => {
    if (count === 0) {

      return "0";
    } else if (count > 999 && count < 1000000) {

        return Math.floor(count / 1000) + "k";
    } else if (count > 999999) {

        return Math.floor(count / 1000000) + "m";
    } else {

        return count;
    }
};