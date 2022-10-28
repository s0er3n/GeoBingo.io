import fetch from "node-fetch";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const api_key = process.env.bigdatacloudkey as string;
export const checkLatLangPointisInCountry = async (
  restriction: { key: string; val: string; lat: string; lng: string },
  long: number,
  lat: number
): Promise<boolean> => {
  try {
    console.log(api_key);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${long}&localityLanguage=en&key=${api_key}`
    );
    const data: any = await res.json();

    console.log(data, data?.countryName?.toLowerCase(), restriction);

    return data?.[restriction.key] === restriction.val;
  } catch (e) {
    console.log(e);
  }
  return true;
};
