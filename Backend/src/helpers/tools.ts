// source: https://stackoverflow.com/a/2117523
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export function userNameGenerator() {
  return "Guest" + "_" + Math.floor(Math.random() * 10000);
}

import {
  uniqueNamesGenerator,
  languages,
  countries,
  adjectives,
} from "unique-names-generator";

const config = {
  dictionaries: [adjectives, languages, countries],
};
export function makeRoomName() {
  return uniqueNamesGenerator(config)
    .replace(/_/g, "-")
    .replace(/\s/g, "-")
    .replace(/&/g, "and")
    .replace(/[^\w\s\-]/gi, "")
    .toLowerCase();
}