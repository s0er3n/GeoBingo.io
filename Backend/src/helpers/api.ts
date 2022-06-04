import dotEnv from "dotenv";
import players from "../objects/PlayerHandler"
dotEnv.config({ path: "/home/soeren/Programming/GeoBingo/.env" });

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Auth from "../objects/Auth";
import Player from "../objects/Player";
const SUPABASE_KEY = process.env.supabasekey;
const SUPABASE_URL = process.env.supabaseurl;
let supabase: SupabaseClient
if (SUPABASE_KEY && SUPABASE_URL) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {

  throw ("Error: no SUPABASE_KEY or SUPABASE_URL")
}

export const addWordToDB = async (word: { word: string, tags: string[] }) => {
  let { data, error } = await supabase.from("bingoWords").insert([{ word }]);
  return data;
};

export const getWordsFromDB = async () => {
  let { data: words, error } = await supabase.from("bingoWords").select("*");
  if (error === null && words) {
    // console.log(words)

    // inefficent maybe
    words = words.filter(word => !word.reported)

    words = words.map((i) => {
      try {
        return JSON.parse(i.word);
      } catch {
        return i.word;
      }
    });
    //filter words for duplicates
    function uniqBy(a: any, key: any) {
      return [
        ...new Map(
          a.map((x: any) => [key(x), x])
        ).values()
      ]
    }
    words = uniqBy(words, (x: any) => x.word)
    console.log(words.length)
    return words
  } else {
    return [];
  }
};

export const reportWord = async (word: string, test = false) => {
  const { data, error } = await supabase
    .from(test ? 'bingoWordsTest' : 'bingoWords')
    .update(
      { reported: true }
    )
    .eq("word->word", JSON.stringify(word))
  const reportedWord = data
  return reportedWord
}

// export const savePanosInDB = async (panos:Pano) => {
//   panos = panos.map((p:Pano) => {
//     return { pano: p.pano, removed: p.removed, word: p.title };
//   });
//   try {
//     let { data, error } = await supabase.from("panos").insert(panos);
//     console.log(data, error);
//   } catch (e) {
//     console.log(e);
//   }
// };
export const updateEquipedSkin = async (auth: Auth, val: number) => {
  if (typeof val !== "number") {
    console.log("cannot update not a number")
    return
  }
  const { data, error } = await supabase
    .from('equiped')
    .upsert({ user_id: auth.sub, equiped: val })
  if (!error) {
    auth.equiped = val
  }
  else {
    console.log(error)
  }
}

export const saveReportedPanosInDB = async (panoid: string, reason: string, player: Player) => {
  try {
    let { data, error } = await supabase.from("reportedPhotospheres").insert({ panoid, reason, playerid: player.id });
    console.log(data, error);
  } catch (e) {
    console.log(e);
  }
};

export const checkIfPanoIsReported = async (panoid: string, capture: any) => {
  let { data: reportedPhotospheres, error } = await supabase
    .from('reportedPhotospheres')
    .select("*").eq("panoid", panoid)
  if (error === null && reportedPhotospheres) {
    capture.nsfw = reportedPhotospheres.length > 0
  } else {
    capture.nsfw = false;
  }
};

export const getBadgesOfUser = async (auth: Auth) => {
  let { data: badges, error } = await supabase
    .from('badges')
    .select("badgesOfUser")
    // Filters
    .eq("id", auth.sub)
  if (!error && badges) {
    badges = badges[0]?.badgesOfUser
    if (badges) {
      auth.badges = badges
    } else
      auth.badges = []
  }
  else {

    auth.badges = []
  }
}
export const getEmotesOfUser = async (auth: Auth) => {
  let { data: emotes, error } = await supabase
    .from('emotes')
    .select("*")
    // Filters
    .eq("id", auth.sub)
  console.log({ emotes, error })
  if (!error && emotes) {
    emotes = emotes[0]?.emotesOfUser
    if (emotes) {
      // adding old emojis + removing duplicates
      auth.emotes = [...new Set([...auth.emotes ?? [], ...emotes])]
      try {
        const player = players.getPlayerBySub(auth.sub)
        players.getPlayerBySub(auth.sub)!.updateSelf()
      } catch (e) {
        console.log(e)
      }
    }
  }
}

export const getEquipedOfUser = async (auth: Auth) => {
  let { data: rows, error } = await supabase
    .from('equiped')
    .select("equiped")
    // Filters
    .eq("user_id", auth.sub)
  if (!error && rows) {
    let equiped = rows[0]?.equiped
    if (equiped) {
      auth.equiped = equiped
      // no player in testing
      try {
        players.getPlayerBySub(auth.sub)!.updateSelf()
      }
      catch (e) {
        console.log(e)
      }
    }
  }
}

export const addKofiDonation = async (donation: any) => {
  const { data, error } = await supabase
    .from('kofi_donations')
    .insert([
      donation,
    ])
  console.log(error, data)
  return error
}

export async function getDonationEmails(auth: Auth) {

  let { data: donationEmails, error: err1 } = await supabase
    .from('donation_email_id')
    .select("email").eq("id", auth.sub)


  if (!donationEmails) {
    donationEmails = []

  }
  let { data: users, error } = await supabase
    .from('email_user')
    .select("*").eq("id", auth.sub)

  if (!users) {
    users = []

  }
  users = [...users, ...donationEmails]

  return [...new Set(users.map(i => i.email))] // removing duplicates
}

export async function getSumOfDonations(emails: string[]): Promise<number> {
  let [{ data: webhookdonations, error }, { data: csvDonations, error: e }] = await Promise.all(
    [
      supabase
        .from('kofi_donations')
        .select("amount, email").in("email", emails)
      ,
      supabase
        .from('donationsNew')
        .select("BuyerEmail, Received").in("BuyerEmail", emails)
    ])

  let amount = 0
  if (!error && !e && csvDonations && webhookdonations) {
    if (webhookdonations.length > 1) {
      amount = amount + Number(webhookdonations.reduce((pv, cv) => pv.amount + cv.amount))
    } else if (webhookdonations.length === 1) { amount += webhookdonations[0].amount }
    if (csvDonations.length > 1) {
      amount = amount + Number(csvDonations.reduce((pv, cv) => pv.Received + cv.Received))
    } else if (csvDonations.length === 1) { amount += csvDonations[0].Received }
  }
  else { console.log(e, error) }
  return amount
}

type Emote = {
  [key: string]: string
}
const emotes: Emote = {
  0: "heart.png",
  5: "magnifying_glass.png",
  10: "plus1.png",
  15: "camera.png",
}
export async function getSupportLevelAsBadgeAndSupportEmojis(auth: Auth) {
  const emails = await getDonationEmails(auth)
  const sum = await getSumOfDonations(emails)
  if (!auth.badges) { auth.badges = [] }
  if (sum === 0) { return }
  auth.badges = auth.badges.filter(b => b !== "donator")
  auth.badges.push(`Donator Level ${Math.round((sum / 3)).toString()}`)
  Object.keys(emotes).forEach(
    (key) => {
      if (sum / 3 >= parseFloat(key)) {
        auth.emotes = [...auth.emotes ?? [], "/emotes/" + emotes[key]]
      }
    }
  )
}

export async function getStreamerWhiteList() {
  let { data: list, error } = await supabase
    .from('Streamer Whitelist')
    .select('Streamer')
  if (!error && list) {
    return list.map(i => i.Streamer)
  }
  console.log(error)
  return []

}
