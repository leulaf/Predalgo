export const getJsonLottie = (url) => {
    fetch(url, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
        // console.log(responseData);
        return responseData;
    })
    .catch((error) => {
        // console.log(error);
    })
}