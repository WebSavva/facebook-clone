export default function getSample(arr, sampleSize) {
    const copiedArray = [...arr];
    const middlePoint = Math.floor( arr.length / 2);

    return arr.sort(() => Math.random() - .5).slice(middlePoint, middlePoint + sampleSize);
}