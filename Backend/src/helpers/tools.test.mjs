import { userNameGenerator } from "./tools"


describe('tools', function () {
  describe('userNameGenerator', function () {
    it('should return a string', function () {
      const name = userNameGenerator()
      expect(typeof name).toEqual("string")
    });
    it('should not be empty ', function () {
      expect(userNameGenerator()).not.toEqual("")
    });
    it('should start with Guest ', function () {
      expect(userNameGenerator().startsWith("Guest")).toBeTruthy()
    });
  });
});
