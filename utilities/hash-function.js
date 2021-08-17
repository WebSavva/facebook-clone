import sha1 from 'hash.js/lib/hash/sha/1';

export default function hashify(input) {
    return sha1().update(input).digest('hex');
}