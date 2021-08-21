export default function mediaMatch(query = '(max-width:640px)') {
    return window.matchMedia(query).matches;
}