import players from "../objects/PlayerHandler";
import dotEnv from "dotenv";
dotEnv.config({ path: "../.env" })

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Auth from "../objects/Auth";
import Player from "../objects/Player";
import translator from "./translator";
const SUPABASE_KEY = process.env.supabasekey;
const SUPABASE_URL = process.env.supabaseurl;
let supabase: SupabaseClient;
if (SUPABASE_KEY && SUPABASE_URL) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.warn("No SUPABASE_KEY or SUPABASE_URL");
}

const supabaseProvided = SUPABASE_KEY && SUPABASE_URL

export const addWordToDB = async (word: { word: string; tags: string[] }) => {
  if (!supabaseProvided) return
  // not translating yet incase there is no google translate api key on the server
  const { data, error } = await supabase.from("bingoWordsBackup")?.insert([{ word }]);
  return data;
};

const LANGUAGES = ["en", "nl", "es", "de", "fr", "pt", "pl", "id"]

export const backUpDBAndTranslate = async (words: { word: { word: string | { [lng: string]: string } } }[]) => {
  // FIXME: only translate with api key
  return
  if (!supabaseProvided) return
  // console.log(words)
  const langWords = words.map(async word => {
    if (typeof word.word.word !== "string") {
      // console.log("already translated")
      let languagesMissing = []
      for (const lang of LANGUAGES) {
        if (!Object.keys(word.word.word).includes(lang)) {
          console.log("language missing:", lang)
          languagesMissing.push(lang)
        }
      }
      if (languagesMissing.length !== 0) {
        const [error, translationRes] = await translator(word.word.word.en, languagesMissing)
        if (!error && translationRes) {
          for (const [key, value] of Object.entries(translationRes)) {
            word.word.word[key] = value
          }
          return word
        }
        else {
          console.log(error)
        }
      }

      return word
    }
    console.log("translating")
    const [error, translationRes] = await translator(word.word.word, LANGUAGES)
    if (!error && translationRes) {
      console.log(translationRes)
      word.word.word = translationRes
      return word
    }
    else {
      console.log(error)
    }

    return word

  })
  let answer = await Promise.all(langWords)
  // console.log(answer)
  const { data, error } = await supabase.from("bingoWordsBackup").upsert(answer);
  console.log(error)
  return data;
};

const getTestWords = () => {
  const words = []
  for (let i = 0; i <= 100; i++) {
    words.push({
      word: "test word " + i,
      tags: []
    })
  }
  return words
}
export const getWordsFromDB = async () => {
  if (!supabaseProvided) return getTestWords()

  // FIXME: filter reported here
  let { data: words, error } = await supabase.from("bingoWordsBackup").select("*");

  if (error === null && words) {
    // console.log(words)
    // console.log(words)

    // inefficent see fix me
    words = words.filter((word) => !word.reported || typeof word.word.word !== "string");

    backUpDBAndTranslate(words)
    words = words.map((i) => {
      return i.word;
    });
    //filter words for duplicates
    function uniqBy(a: any, key: any) {
      return [...new Map(a.map((x: any) => [key(x), x])).values()];
    }
    words = uniqBy(words, (x: any) => x.word);
    console.log(words.length);
    return words;
  } else {
    return [];
  }
};

export const reportWord = async (word: string, test = false) => {
  if (!supabaseProvided) return
  console.log(word)
  const { data, error } = await supabase
    .from(test ? "bingoWordsTest" : "bingoWordsBackup")
    .update({ reported: true })
    .eq("word->word", word);
  const reportedWord = data;
  return reportedWord;
};

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
  if (!supabaseProvided) return

  if (typeof val !== "number") {
    console.log("cannot update not a number");
    return;
  }
  const { data, error } = await supabase
    .from("equiped")
    .upsert({ user_id: auth.sub, equiped: val });
  if (!error) {
    auth.equiped = val;
  } else {
    console.log(error);
  }
};

export const saveReportedPanosInDB = async (
  panoid: string,
  reason: string,
  player: Player
) => {

  if (!supabaseProvided) return
  try {
    const { data, error } = await supabase
      .from("reportedPhotospheres")
      .insert({ panoid, reason, playerid: player.id });
    console.log(data, error);
  } catch (e) {
    console.log(e);
  }
};

export const checkIfPanoIsReported = async (panoid: string, capture: any) => {

  if (!supabaseProvided) return
  const { data: reportedPhotospheres, error } = await supabase
    .from("reportedPhotospheres")
    .select("*")
    .eq("panoid", panoid);
  if (error === null && reportedPhotospheres) {
    capture.nsfw = reportedPhotospheres.length > 0;
  } else {
    capture.nsfw = false;
  }
};

export const getBadgesOfUser = async (auth: Auth) => {
  if (!supabaseProvided) return
  let { data: badges, error } = await supabase
    .from("badges")
    .select("badgesOfUser")
    // Filters
    .eq("id", auth.sub);
  if (!error && badges) {
    badges = badges[0]?.badgesOfUser;
    if (badges) {
      auth.badges = badges;
    } else auth.badges = [];
  } else {
    auth.badges = [];
  }
};
export const getEmotesOfUser = async (auth: Auth) => {

  if (!supabaseProvided) return
  let { data: emotes, error } = await supabase
    .from("emotes")
    .select("*")
    // Filters
    .eq("id", auth.sub);
  console.log({ emotes, error });
  if (!error && emotes) {
    emotes = emotes[0]?.emotesOfUser;
    if (emotes) {
      // adding old emojis + removing duplicates
      auth.emotes = [...new Set([...(auth.emotes ?? []), ...emotes])];
      try {
        const player = players.getPlayerBySub(auth.sub);
        players.getPlayerBySub(auth.sub)!.updateSelf();
      } catch (e) {
        console.log(e);
      }
    }
  }
};

export const getEquipedOfUser = async (auth: Auth) => {
  if (!supabaseProvided) return
  const { data: rows, error } = await supabase
    .from("equiped")
    .select("equiped")
    // Filters
    .eq("user_id", auth.sub);
  if (!error && rows) {
    const equiped = rows[0]?.equiped;
    if (equiped) {
      auth.equiped = equiped;
      // no player in testing
      try {
        players.getPlayerBySub(auth.sub)!.updateSelf();
      } catch (e) {
        console.log(e);
      }
    }
  }
};

export const addKofiDonation = async (donation: any) => {

  if (!supabaseProvided) return
  const { data, error } = await supabase
    .from("kofi_donations")
    .insert([donation]);
  console.log(error, data);
  return error;
};

export async function getDonationEmails(auth: Auth) {

  if (!supabaseProvided) return []
  let { data: donationEmails, error: err1 } = await supabase
    .from("donation_email_id")
    .select("email")
    .eq("id", auth.sub);

  if (!donationEmails) {
    donationEmails = [];
  }
  let { data: users, error } = await supabase
    .from("email_user")
    .select("*")
    .eq("id", auth.sub);

  if (!users) {
    users = [];
  }
  users = [...users, ...donationEmails];

  return [...new Set(users.map((i) => i.email))]; // removing duplicates
}

export async function getSumOfDonations(emails: string[]): Promise<number> {

  if (!supabaseProvided) return 0
  const [{ data: webhookdonations, error }, { data: csvDonations, error: e }] =
    await Promise.all([
      supabase
        .from("kofi_donations")
        .select("amount, email")
        .in("email", emails),
      supabase
        .from("donationsNew")
        .select("BuyerEmail, Received")
        .in("BuyerEmail", emails),
    ]);

  let amount = 0;
  if (!error && !e && csvDonations && webhookdonations) {
    if (webhookdonations.length > 1) {
      amount =
        amount +
        Number(webhookdonations.reduce((pv, cv) => pv.amount + cv.amount));
    } else if (webhookdonations.length === 1) {
      amount += webhookdonations[0].amount;
    }
    if (csvDonations.length > 1) {
      amount =
        amount +
        Number(csvDonations.reduce((pv, cv) => pv.Received + cv.Received));
    } else if (csvDonations.length === 1) {
      amount += csvDonations[0].Received;
    }
  } else {
    console.log(e, error);
  }
  return amount;
}

type Emote = {
  [key: string]: string;
};
const emotes: Emote = {
  0: "heart.png",
  5: "magnifying_glass.png",
  10: "plus1.png",
  15: "camera.png",
};
export async function getSupportLevelAsBadgeAndSupportEmojis(auth: Auth) {
  if (!supabaseProvided) return
  const emails = await getDonationEmails(auth);
  const sum = await getSumOfDonations(emails);
  if (!auth.badges) {
    auth.badges = [];
  }
  if (sum === 0) {
    return;
  }
  auth.badges = auth.badges.filter((b) => b !== "donator");
  auth.badges.push(`Donator Level ${Math.round(sum / 3).toString()}`);
  Object.keys(emotes).forEach((key) => {
    if (sum / 3 >= parseFloat(key)) {
      auth.emotes = [...(auth.emotes ?? []), "/emotes/" + emotes[key]];
    }
  });
}

export async function getStreamerWhiteList() {

  if (!supabaseProvided) return []

  const { data: list, error } = await supabase
    .from("Streamer Whitelist")
    .select("Streamer");
  if (!error && list) {
    return list.map((i) => i.Streamer);
  }
  console.log(error);
  return [];
}
