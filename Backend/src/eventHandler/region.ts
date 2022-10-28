import createListner from "../helpers/createListner";
import type { MySocket } from "../types";

import fetch from "node-fetch";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const api_key = process.env.bigdatacloudkey as string;
export const latLangData = async (long: number, lat: number): Promise<any> => {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${long}&localityLanguage=en&key=${api_key}`
  );
  const data: any = await res.json();

  return data;
};

const properties = [
  "city",
  "continent",
  "countryName",
  "locality",
  "principalSubdivision",
  "latitude",
  "longitude",
];

export default (io: unknown, socket: MySocket) => {
  const getRegion = async (
    lat: number,
    lng: number,
    callback: (data: any) => void
  ) => {
    const data = await latLangData(lng, lat);
    const response: any = {};
    for (const prop of properties) {
      response[prop] = data[prop];
    }
    callback(response);
  };

  createListner(socket, "region", [getRegion]);
};
