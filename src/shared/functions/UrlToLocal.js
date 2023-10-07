export default urlToLocal = async (url) => {

    return new Promise(async (resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function(e) {
            console.log("dfgsdgfsdgf" + this.response);
            if (this.status == 200) {
                const file = new File([this.response], 'fileName');
                console.log("dfgsdgfsdgf" + file);
                resolve(file);
            }else{
                // reject(url);
                console.log("sssdfg" + this.response);
                resolve(url);
            }
        };
    })
}