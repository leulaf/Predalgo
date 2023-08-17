export default getItemType = (item) => {
    return item.imageHeight ? "image" : "text";
}