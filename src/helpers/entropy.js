// function to check a password by calculating entropy.
// It produces a number between 0 and 8.
// As we type in readable text a practical ceiling to the maximum of 8 is 4.
// For a reasonably strong password values above 3 should suffice
// Retrieved from :
// https://rosettacode.org/wiki/Entropy
// https://rosettacode.org/wiki/Entropy#JavaScript

function entropy(s) {
    const split = s.split('');
    const counter = {};
    split.forEach(ch => {
        if (!counter[ch]) counter[ch] = 1;
        else counter[ch]++;

    });

    const lengthf = s.length * 1.0;
    const counts = Object.values(counter);
    return -1 * counts
        .map(count => count / lengthf * Math.log2(count / lengthf))
        .reduce((a, b) => a + b);
}

export default entropy;
