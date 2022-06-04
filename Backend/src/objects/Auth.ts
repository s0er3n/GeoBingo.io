import { getBadgesOfUser, getEmotesOfUser, getEquipedOfUser, getSumOfDonations, getSupportLevelAsBadgeAndSupportEmojis } from "../helpers/api";

export default class Auth {
  sub: string
  provider: string;
  name:string;
  profilePicture:string;
  badges: Array<string> = []
  emotes: Array<string>= []
  equiped = 0
  constructor(sub:string, provider:string, name:string, profilePicture:string) {
    this.sub = sub
    this.provider = provider;
    this.name = name;
    this.profilePicture = profilePicture;
    if (provider) {
      try {
        getBadgesOfUser(this)
      }
      catch (e) {
        console.log("couldnt get badges for user")
      }
      try {
        getEmotesOfUser(this)
      }
      catch (e) {
        console.log("couldnt get emote for user")
      }
      try {
        getEquipedOfUser(this)
      }
      catch (e) {
        console.log("couldnt get equpided emote for user")
      }
      try {
        getSupportLevelAsBadgeAndSupportEmojis(this)
      }
      catch (e) {
        console.log("couldnt get equpided emote for user")
      }
    }
  }
  toObj() {
    return {
      provider: this.provider,
      name: this.name,
      profilePicture: this.profilePicture,
      badges: this.badges,
      emotes: this.emotes,
      equiped: this.equiped,
    };
  }
}
