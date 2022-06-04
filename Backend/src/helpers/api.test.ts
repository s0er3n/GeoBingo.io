import Auth from "../objects/Auth";
import { getDonationEmails, getBadgesOfUser, getSumOfDonations, getSupportLevelAsBadgeAndSupportEmojis, getEmotesOfUser, updateEquipedSkin, reportWord } from "./api"


// let auth = { sub: "d2b03234-7ab3-40eb-9c9f-eb1e28041523", badges: [] }
let auth = new Auth("d2b03234-7ab3-40eb-9c9f-eb1e28041523", "twitch", "Sören", "test.png")
let emails = [
  'soeren.michaels@gmail.com',
]

describe('supabase api', function() {
  describe('getbadgesOfUser', function() {
    it('should be my badges', async function() {
      await getBadgesOfUser(auth)
      expect(auth.badges).toEqual(["dev", "owner"])
    });
    it('should work with id without badges', async function() {
      let auth = new Auth("wrong sub", "twitch", "Sören", "test.png")
      await getBadgesOfUser(auth)
      expect(auth.badges).toEqual([])
    });
  })

  describe("getEmotesOfUser", function() {
    it("update current emojis with emojis from server", async () => {
      let auth = new Auth("d2b03234-7ab3-40eb-9c9f-eb1e28041523", "twitch", "Sören", "test.png")
      await getEmotesOfUser(auth)
      expect(auth.emotes).toEqual([
        "https://www.countryflags.com/wp-content/uploads/ukraine-flag-png-large.png",
        "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_de64f46b09734f6a924e39fcafa02e2b/default/light/1.0",
      ])
    })
  })

  describe('getSumOfDonations', function() {
    // it also querys old donations
    it("test with mouses id", async () => {
      let auth = new Auth("e590f04d-8fdd-4bff-b7bc-45452c43883d", "twitch", "mouse", "test.png")
      let donationEmails = await getDonationEmails(auth)
      console.log(donationEmails)
      let sum = await getSumOfDonations(donationEmails)
      expect(sum).toBe(30)
    })

    it('should return a number', async function() {
      let sum = await getSumOfDonations(emails)
      expect(typeof sum).toBe("number")
    });

    it('should be 1260 on my mail', async function() {
      let sum = await getSumOfDonations(emails)
      expect(sum).toBe(1260)
    });
    it('should return 0 on empty email listl', async function() {
      let sum = await getSumOfDonations([])
      expect(sum).toBe(0)
    });
    it('should return a positive number', async function() {
      let sum = await getSumOfDonations(emails)
      expect(sum).toBeGreaterThanOrEqual(0)
    });
  });

  describe('get donation emails', function() {
    it('first email should be my email', async function() {
      let donationEmails = await getDonationEmails(auth)
      expect(donationEmails).toEqual(emails)
    });
  });

  describe("updateEquipedSkin ", () => {
    it('should upsert', async () => {

      let auth = new Auth("d2b03234-7ab3-40eb-9c9f-eb1e28041523", "twitch", "Sören", "test.png")
      await updateEquipedSkin(auth, 2)
      expect(auth.equiped).toBe(2)
    })
    it('should upsert undefined', async () => {

      let auth = new Auth("asd-7ab3-40eb-9c9f-eb1e28041523", "twitch", "Sören", "test.png")
      await updateEquipedSkin(auth, 2)
      expect(auth.equiped).toBe(0)
    })
  })

  describe('get supporter level', function() {
    it('auth support level 420', async function() {
      let auth = new Auth("d2b03234-7ab3-40eb-9c9f-eb1e28041523", "twitch", "Sören", "test.png")
      await getSupportLevelAsBadgeAndSupportEmojis(auth)
      expect(auth.badges).toContain("Donator Level 420")
    });
    it('auth emotes heart and camera', async function() {
      let auth = new Auth("d2b03234-7ab3-40eb-9c9f-eb1e28041523", "twitch", "Sören", "test.png")
      await getSupportLevelAsBadgeAndSupportEmojis(auth)
      expect(auth.emotes).toContain("/emotes/camera.png")
      expect(auth.emotes).toContain("/emotes/heart.png")
      expect(auth.emotes).toContain("/emotes/magnifying_glass.png")
    });

    it('auth no support level', async function() {
      let auth = new Auth("does not exist", "twitch", "Sören", "test.png")
      await getSupportLevelAsBadgeAndSupportEmojis(auth)
      expect(auth.badges.map((b) => b.startsWith("Donator"))).not.toContain(true)
    });
  });
  describe("report a word", () => {
    it("should find word", async () => {
      const word = "test"
      const reportedWord = await reportWord(word, true)
      expect(reportedWord![0].word.word).toBe(word)


    })
    it("should not find non existing word", async () => {
      const word = "affentheater"
      const reportedWord = await reportWord(word, true)


      expect(reportedWord).toBe(null)


    })

  })
});
