
import fetch from "node-fetch";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const api_key = process.env.bigdatacloudkey as string
export async function getCountries() {
  const res = await fetch(`https://api.bigdatacloud.net/data/countries?localityLanguage=en&key=${api_key}`)
  const data: any = await res.json()

  return data.map((country: any) => country.name as string)

}
