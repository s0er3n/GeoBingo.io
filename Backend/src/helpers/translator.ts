import * as gTranslate from '@google-cloud/translate';
/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const projectId = 'geobingo-320717';


// Imports the Google Cloud client library
const { Translate } = gTranslate.v2
// Instantiates a client
const translate = new Translate({ projectId });



// Translates some text into Russian
export default async (text: string, target: string | string[]): Promise<[string | null, { [key: string]: string } | null]> => {
  try {

    const translationRes: { [key: string]: string } = {}
    if (!Array.isArray(target)) {
      target = [target]
    }
    for (const lang of target) {
      const [translation] = await translate.translate(text, lang);
      translationRes[lang] = translation
    }
    return [null, translationRes]
  } catch (error) {
    return [String(error), null]

  }
}

