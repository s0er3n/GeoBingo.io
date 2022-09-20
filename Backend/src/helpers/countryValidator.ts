import fetch from "node-fetch";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const api_key = process.env.bigdatacloudkey as string
export const checkLatLangPointisInCountry = async (
  country: string,
  long: number,
  lat: number
): Promise<boolean> => {

  try {
    console.log(api_key)
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${long}&localityLanguage=en&key=${api_key}`)
    const data: any = await res.json()

    console.log(data, data?.countryName?.toLowerCase(), country.toLowerCase())

    return (data?.countryName?.toLowerCase() === country.toLowerCase())
  } catch (e) {
    console.log(e)
  }
  return true
};
