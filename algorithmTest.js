// 1. Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"
function reverseAlphabetWithNumber(input) {
    const letters = input.match(/[A-Z]/g);
    const numbers = input.match(/[0-9]/g);

    const reversedLetters = letters.reverse().join('');

    return reversedLetters + (numbers ? numbers.join('') : '');
}
const result1 = reverseAlphabetWithNumber("NEGIE1");
console.log(result1);

// 2. Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu
function longest(sentence) {
    const words = sentence.split(' ');
    let longestWord = '';

    for (const word of words) {
        if (word.length > longestWord.length) {
            longestWord = word;
        }
    }

    return longestWord;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
const result2 = longest(sentence);
console.log(result2);

// 3.Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT
function countOccurrences(INPUT, QUERY) {
    const result = new Array(QUERY.length).fill(0);

    for (let i = 0; i < QUERY.length; i++) {
        const word = QUERY[i];
        result[i] = INPUT.filter(item => item === word).length;
    }

    return result;
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
const result3 = countOccurrences(INPUT, QUERY);
console.log(result3);

// 4. Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN Contoh:
function diagonalDifference(matrix) {
    let primaryDiagonalSum = 0;
    let secondaryDiagonalSum = 0;
    const size = matrix.length;

    for (let i = 0; i < size; i++) {
        primaryDiagonalSum += matrix[i][i];
        secondaryDiagonalSum += matrix[i][size - 1 - i];
    }

    return Math.abs(primaryDiagonalSum - secondaryDiagonalSum);
}

const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
const result4 = diagonalDifference(matrix);
console.log(result4);
