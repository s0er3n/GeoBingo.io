
import { geoContains } from "d3-geo";
import { geometries } from "./getAllCountries";

export const checkLatLangPointisInCountry = (country:string, long: number, lat:number) => {
  try {
    const res = geoContains(geometries[country]?.feature?.geometry, [
      long,
      lat,
    ]);

    return res
  }
  catch (e) {
    console.log(e)
    return false
  }
}