export default function bindUrlParams(url, ...params) {
    let i = 0;
    return url.replace(/\{\}/g, () => i < params.length ? params[i++] : '{}');
};