import { getWordsFromDB } from "./api";
type Word = {word:string, tags: string[]}
let words: Word[]  = [];
getWordsFromDB()
  .then((w) => (words = w))
  .catch((e) => console.log("couldnt get words from db", e));

const refreshWords = () =>
  getWordsFromDB()
    .then((w) => (words = w))
    .catch((e) => console.log("couldnt get words from db", e));


export function getRandomWords(count:number) {
  let arr = words;
  let answer: Word[] = [],
    counter = 0;

  while (counter < count) {
    let rand = arr[Math.floor(Math.random() * arr.length)];
    if (!answer.some((an) => an === rand)) {
      answer.push(rand);
      counter++;
    }
  }

  return answer;
}
export function getRandomWordNotInWordList(wordList: Word[]) {
  let newWord = words[Math.floor(Math.random() * words.length)];
  while (wordList.includes(newWord)) {
    newWord = words[Math.floor(Math.random() * words.length)];
  }
  return newWord
}
