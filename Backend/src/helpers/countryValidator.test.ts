import { checkLatLangPointisInCountry } from "./countryValidator";

const country = "Germany";
const countryNotInDatabase = "Gerone";
describe("check country validator", function () {
  it("accepting country", function () {
    expect(
      checkLatLangPointisInCountry(country, 13.354366, 52.496352)
    ).toBeTruthy();
  });
  it("not accepting country", function () {
    expect(
      checkLatLangPointisInCountry(country, -52.496352, 13.354366)
    ).toBeFalsy();
  });
  it("handleing wrong country wrong country ", function () {
    expect(
      checkLatLangPointisInCountry(countryNotInDatabase, 52.496352, 13.354366)
    ).toBeFalsy();
  });
});
