import fs from "fs";
import { geoBounds } from "d3-geo";

const countriesJSON = fs.readFileSync("countries.geojson").toString();

const countries = JSON.parse(countriesJSON);
type Geometries = {
  [key: string]: any;
};
const geometries: Geometries = {};
export const countryNames = countries.features.map(
  (f: { properties: { ADMIN: string } }) => f.properties.ADMIN
);

const bounds: {
  [key: string]: { north: number; south: number; west: number; east: number };
} = {};

for (const name of countryNames) {
  geometries[name] = {
    feature: countries.features.filter(
      (f: { properties: { ADMIN: any } }) => f.properties.ADMIN === name
    )[0],
  };
  // geometries[name].bounds = geoBounds(geometries[name].feature)
  const boundOfCountry = geoBounds(geometries[name].feature);
  bounds[name] = {
    north: boundOfCountry[1][1],
    south: boundOfCountry[0][1],
    west: boundOfCountry[0][0],
    east: boundOfCountry[1][0],
  };
}
export { geometries };
export { bounds };
