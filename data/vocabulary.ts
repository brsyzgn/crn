import type { Level, VocabularyCategory, VocabularyEntry } from "@/types";
import { AVIATION_EXT } from "./vocab/aviation.ts";
import { CUSTOMER_SERVICE_EXT } from "./vocab/customer-service.ts";
import { EVERYDAY_EXT } from "./vocab/everyday.ts";
import { INTERVIEW_EXT } from "./vocab/interview.ts";
import { LEGACY_COLLOCATIONS } from "./vocab/legacy-collocations.ts";
import { SAFETY_EXT } from "./vocab/safety.ts";
import { TRAVEL_EXT } from "./vocab/travel.ts";

/**
 * Row format: [word, Turkish, part of speech, example sentence, level, optional Turkish note]
 * IDs are slugs of the word + category, and must stay stable (progress is saved against them).
 */
type Row = [string, string, string, string, Level, string?];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function build(category: VocabularyCategory, rows: Row[]): VocabularyEntry[] {
  const prefix = slugify(category).slice(0, 4);
  return rows.map(([word, turkish, partOfSpeech, example, level, turkishNote]) => {
    const id = `${prefix}-${slugify(word)}`;
    const collocations = LEGACY_COLLOCATIONS[id]
      ?.split(";")
      .map((c) => c.trim())
      .filter(Boolean);
    return {
      id,
      word,
      turkish,
      partOfSpeech,
      example,
      level,
      category,
      ...(turkishNote ? { turkishNote } : {}),
      ...(collocations ? { collocations } : {}),
    };
  });
}

const aviation: Row[] = [
  ["boarding pass", "biniş kartı", "noun", "Please have your boarding pass ready at the gate.", "B1"],
  ["gate", "uçuş kapısı", "noun", "Your flight leaves from gate 14, on the left side of the terminal.", "B1"],
  ["delay", "gecikme; ertelemek", "noun / verb", "The delay was caused by heavy fog over the airport.", "B1", "Hem isim hem fiil olarak kullanılır: \"a delay\" (gecikme), \"to delay\" (geciktirmek)."],
  ["cabin crew", "kabin ekibi", "noun", "The cabin crew welcomed every passenger with a smile.", "B1", "Bu ifade çoğul bir grubu anlatır; tek kişi için \"cabin crew member\" denir."],
  ["aisle", "uçak içi koridor", "noun", "Please keep the aisle clear during the meal service.", "B1"],
  ["turbulence", "türbülans", "noun", "The captain asked us to stay seated because of turbulence.", "B1"],
  ["overhead locker", "baş üstü bagaj bölmesi", "noun", "You can put your small bag in the overhead locker.", "B1", "Amerikan İngilizcesinde \"overhead bin\" da denir."],
  ["take off", "(uçak) havalanmak", "phrasal verb", "We will take off in about ten minutes.", "B1", "Zıttı: \"land\" (inmek). İsim hali: \"takeoff\"."],
  ["land", "inmek, yere inmek", "verb", "The plane will land at Istanbul Airport at six o'clock.", "B1"],
  ["layover", "aktarma bekleme süresi", "noun", "I had a three-hour layover in Frankfurt on my way to Tokyo.", "B2"],
  ["connecting flight", "aktarmalı uçuş", "noun", "She missed her connecting flight because the first one was late.", "B1"],
  ["runway", "pist", "noun", "The aircraft is waiting at the end of the runway.", "B1"],
  ["captain", "kaptan pilot", "noun", "The captain will make an announcement in a few minutes.", "B1"],
  ["galley", "uçak mutfağı", "noun", "The crew prepared the hot meals in the galley.", "B2"],
  ["check in", "giriş işlemlerini yaptırmak", "phrasal verb", "You can check in online up to twenty-four hours before the flight.", "B1", "İsim hali: \"check-in\" (tire ile yazılır)."],
  ["baggage allowance", "bagaj hakkı", "noun", "The baggage allowance for this ticket is twenty kilograms.", "B2"],
  ["departure", "kalkış, hareket", "noun", "The departure time has changed from 9:00 to 9:45.", "B1", "Zıttı: \"arrival\" (varış)."],
  ["in-flight entertainment", "uçuş içi eğlence sistemi", "noun", "The in-flight entertainment includes films, music and games.", "B2"],
  ["cruising altitude", "seyir irtifası", "noun", "We have reached our cruising altitude of thirty-five thousand feet.", "B2"],
  ["ground staff", "yer hizmetleri personeli", "noun", "The ground staff helped the family find their gate.", "B2"],
];

const customerService: Row[] = [
  ["assist", "yardım etmek", "verb", "We are happy to assist you with your luggage.", "B1", "\"Help\"den daha resmi ve profesyonel bir tondadır."],
  ["apologize", "özür dilemek", "verb", "I apologize for the inconvenience this has caused you.", "B1", "İngiliz İngilizcesinde \"apologise\" şeklinde de yazılır."],
  ["complaint", "şikâyet", "noun", "She made a complaint about the long waiting time.", "B1"],
  ["refund", "para iadesi", "noun", "You can ask for a refund if your flight is cancelled.", "B1"],
  ["compensation", "tazminat", "noun", "Passengers may receive compensation for very long delays.", "B2"],
  ["reassure", "içini rahatlatmak, güven vermek", "verb", "I tried to reassure the nervous passenger that the flight was safe.", "B2"],
  ["patient", "sabırlı", "adjective", "A good flight attendant stays patient with every passenger.", "B1", "Dikkat: \"patient\" isim olarak \"hasta\" anlamına da gelir."],
  ["courteous", "kibar, saygılı", "adjective", "The crew were courteous even when the passengers were tired.", "B2"],
  ["accommodate", "ihtiyacına uyum sağlamak, yer ayırmak", "verb", "We will do our best to accommodate your special meal request.", "B2"],
  ["resolve", "çözmek (sorunu)", "verb", "The manager resolved the problem within a few minutes.", "B2"],
  ["inconvenience", "rahatsızlık, zahmet", "noun", "We apologize for any inconvenience caused by the delay.", "B2"],
  ["go the extra mile", "ekstra çaba göstermek", "idiom", "Our team always goes the extra mile to make passengers comfortable.", "B2"],
  ["feedback", "geri bildirim", "noun", "We welcome feedback from our passengers after every flight.", "B1", "Sayılamayan bir isimdir: \"a feedback\" denmez."],
  ["frequent flyer", "sık uçan yolcu", "noun", "The frequent flyer asked for a seat near the exit.", "B2"],
  ["upset", "üzgün, canı sıkkın", "adjective", "The upset passenger needed a few quiet minutes.", "B1"],
  ["escalate", "üst makama iletmek", "verb", "If I cannot solve the issue, I will escalate it to my supervisor.", "B2"],
  ["I'm afraid that...", "Maalesef...", "polite phrase", "I'm afraid that this seat is already taken, but I can find you another one.", "B1", "Kötü haber verirken nazik bir giriş cümlesidir; korkmak anlamında değildir."],
  ["How may I help you?", "Size nasıl yardımcı olabilirim?", "polite phrase", "Good morning, madam. How may I help you?", "B1"],
  ["satisfaction", "memnuniyet", "noun", "Customer satisfaction is the most important goal for our team.", "B2"],
  ["greet", "karşılamak, selamlamak", "verb", "We greet every passenger at the door with a warm welcome.", "B1"],
];

const travel: Row[] = [
  ["itinerary", "seyahat programı", "noun", "Our itinerary includes two days in Rome and three days in Florence.", "B2"],
  ["luggage", "bagaj", "noun", "Please keep your luggage with you at all times.", "B1", "Sayılamayan isimdir: \"a luggage\" denmez, \"a piece of luggage\" denir."],
  ["customs", "gümrük", "noun", "We went through customs after collecting our bags.", "B1", "Bu anlamda her zaman çoğul (customs) kullanılır."],
  ["passport control", "pasaport kontrolü", "noun", "The queue at passport control was very long.", "B1"],
  ["visa", "vize", "noun", "Do you need a visa to travel to that country?", "B1"],
  ["destination", "varış noktası", "noun", "Our final destination is Barcelona.", "B1"],
  ["round trip", "gidiş-dönüş", "noun", "I bought a round trip ticket to London.", "B1", "İngiliz İngilizcesinde \"return ticket\" da denir."],
  ["one-way ticket", "tek yön bilet", "noun", "He only needed a one-way ticket because he was moving abroad.", "B1"],
  ["currency exchange", "döviz bürosu / döviz değişimi", "noun", "You can change money at the currency exchange in the arrivals hall.", "B2"],
  ["accommodation", "konaklama", "noun", "The price includes flights and accommodation for five nights.", "B2", "Sayılamayan isimdir."],
  ["sightseeing", "gezi, görülecek yerleri gezme", "noun", "We spent the afternoon sightseeing in the old town.", "B1"],
  ["jet lag", "jet lag, saat farkı yorgunluğu", "noun", "I always feel tired for two days because of jet lag.", "B1"],
  ["time zone", "saat dilimi", "noun", "There is a three-hour time difference between the two time zones.", "B1"],
  ["departure lounge", "dış hatlar bekleme salonu", "noun", "We waited in the departure lounge until our flight was called.", "B2"],
  ["tourist attraction", "turistik yer", "noun", "The castle is the most popular tourist attraction in the city.", "B1"],
  ["book", "(bilet, otel) ayırtmak", "verb", "I booked my flight three months in advance.", "B1", "\"Book\" fiil olarak rezervasyon yapmak anlamına gelir."],
  ["reservation", "rezervasyon", "noun", "I have a reservation under the name Yilmaz.", "B1"],
  ["travel insurance", "seyahat sigortası", "noun", "It is wise to buy travel insurance before a long trip.", "B2"],
  ["souvenir", "hatıra eşya", "noun", "She bought a small souvenir for each of her friends.", "B1"],
  ["journey", "yolculuk", "noun", "The journey from Istanbul to Lisbon takes about four hours.", "B1", "\"Trip\" kısa seyahat, \"journey\" daha çok yolculuğun kendisini anlatır."],
];

const safety: Row[] = [
  ["emergency exit", "acil çıkış", "noun", "The nearest emergency exit is two rows behind you.", "B1"],
  ["life jacket", "can yeleği", "noun", "Your life jacket is under your seat.", "B1"],
  ["oxygen mask", "oksijen maskesi", "noun", "If the cabin pressure drops, an oxygen mask will fall from above.", "B1"],
  ["seat belt", "emniyet kemeri", "noun", "Please keep your seat belt fastened while you are seated.", "B1"],
  ["fasten", "(kemer vb.) bağlamak", "verb", "Please fasten your seat belt and return your seat to the upright position.", "B1"],
  ["evacuate", "tahliye etmek", "verb", "The crew can evacuate the aircraft in less than ninety seconds.", "B2"],
  ["brace position", "darbeye hazırlık (koruma) pozisyonu", "noun", "The crew showed us the brace position before the landing.", "B2"],
  ["fire extinguisher", "yangın söndürücü", "noun", "There is a fire extinguisher near the rear galley.", "B2"],
  ["first aid kit", "ilk yardım çantası", "noun", "The first aid kit is stored in the overhead locker.", "B1"],
  ["emergency landing", "acil iniş", "noun", "The pilot made an emergency landing at the nearest airport.", "B2"],
  ["safety demonstration", "güvenlik gösterimi", "noun", "Please watch the safety demonstration carefully.", "B1"],
  ["cabin pressure", "kabin basıncı", "noun", "The system keeps the cabin pressure comfortable during the flight.", "B2"],
  ["evacuation slide", "tahliye kaydırağı", "noun", "The evacuation slide opens automatically when the door is opened in an emergency.", "B2"],
  ["remain seated", "yerinde oturmaya devam etmek", "phrase", "Please remain seated until the seat belt sign is switched off.", "B1"],
  ["stow", "(eşyayı) yerleştirmek", "verb", "Please stow your bag under the seat in front of you.", "B2", "Havacılıkta bagajı güvenli şekilde yerleştirmek için kullanılan resmî kelimedir."],
  ["hazard", "tehlike, risk", "noun", "A loose bag in the aisle can be a safety hazard.", "B2"],
  ["comply with", "(kurallara) uymak", "phrasal verb", "All passengers must comply with the crew's safety instructions.", "B2"],
  ["medical emergency", "tıbbi acil durum", "noun", "A passenger had a medical emergency, and the crew responded quickly.", "B2"],
  ["safety briefing", "güvenlik brifingi", "noun", "The crew have a safety briefing before every flight.", "B1"],
  ["prohibited item", "yasaklı eşya", "noun", "Sharp knives are a prohibited item in the cabin.", "B2"],
];

const everyday: Row[] = [
  ["look forward to", "dört gözle beklemek", "phrasal verb", "I look forward to meeting you next week.", "B1", "Sonrasında -ing gelir: \"I look forward to hearing from you.\""],
  ["get used to", "alışmak", "phrase", "It took me a month to get used to the new schedule.", "B1", "\"Used to\" (eskiden) ile karıştırmayın; \"get used to\" sonrasında -ing gelir."],
  ["run out of", "bitmek, tükenmek", "phrasal verb", "We have run out of coffee, but we still have tea.", "B1"],
  ["figure out", "anlamak, çözmek", "phrasal verb", "I couldn't figure out how to use the ticket machine.", "B1"],
  ["give it a try", "bir şans vermek, denemek", "idiom", "I'm not sure I'll like sushi, but I'll give it a try.", "B1"],
  ["on time", "zamanında", "phrase", "The train arrived on time, so we were not late.", "B1", "\"In time\" ise \"vaktinde yetişmek\" anlamına gelir; ikisi farklıdır."],
  ["in a hurry", "acelesi olan", "phrase", "Sorry, I can't talk now. I'm in a hurry.", "B1"],
  ["take care of", "ilgilenmek, bakmak", "phrasal verb", "Could you take care of my plants while I'm away?", "B1"],
  ["make a decision", "karar vermek", "phrase", "It was difficult to make a decision, but I chose the red one.", "B1", "\"Do a decision\" denmez; doğru fiil \"make\"."],
  ["keep in touch", "iletişimde kalmak", "phrase", "Let's keep in touch after the course finishes.", "B1"],
  ["as soon as possible", "mümkün olan en kısa sürede", "phrase", "Please send me the documents as soon as possible.", "B1"],
  ["be good at", "-de iyi olmak", "phrase", "She is really good at solving problems quickly.", "B1", "Sonrasında isim veya -ing gelir: \"good at cooking\"."],
  ["deal with", "(sorunla) başa çıkmak, ilgilenmek", "phrasal verb", "I know how to deal with difficult situations calmly.", "B1"],
  ["manage to", "başarmak, becermek", "phrase", "We managed to catch the last bus home.", "B2"],
  ["turn out", "sonuçlanmak, ortaya çıkmak", "phrasal verb", "The weather turned out better than we expected.", "B2"],
  ["pay attention to", "dikkat etmek", "phrase", "Please pay attention to the instructions on the screen.", "B1"],
  ["come across", "tesadüfen karşılaşmak", "phrasal verb", "I came across an old photo while I was cleaning my room.", "B2"],
  ["work out", "çözmek; egzersiz yapmak", "phrasal verb", "We worked out a plan that suited everyone.", "B2", "Aynı ifade \"spor yapmak\" anlamına da gelir: \"I work out three times a week.\""],
  ["It depends.", "Duruma bağlı.", "phrase", "\"Is the flight always full?\" \"It depends on the season.\"", "B1"],
  ["by the way", "bu arada", "phrase", "By the way, did you remember to bring your passport?", "B1"],
];

const interviewVocab: Row[] = [
  ["strength", "güçlü yön", "noun", "One of my strengths is staying calm in stressful situations.", "B1"],
  ["weakness", "zayıf yön", "noun", "My biggest weakness used to be public speaking, but I am improving it.", "B1"],
  ["teamwork", "takım çalışması", "noun", "Good teamwork is essential on every flight.", "B1"],
  ["work under pressure", "baskı altında çalışmak", "phrase", "I can work under pressure and still stay polite.", "B2"],
  ["reliable", "güvenilir", "adjective", "My manager says I am a reliable person who always arrives on time.", "B1"],
  ["flexible", "esnek", "adjective", "Cabin crew need to be flexible because schedules can change quickly.", "B1"],
  ["adaptable", "uyum sağlayabilen", "adjective", "I am adaptable, so I enjoy meeting new people and learning new routines.", "B2"],
  ["interpersonal skills", "kişilerarası iletişim becerileri", "noun", "Strong interpersonal skills help you build trust with passengers.", "B2"],
  ["customer-focused", "müşteri odaklı", "adjective", "I try to be customer-focused by listening carefully before I answer.", "B2"],
  ["positive attitude", "olumlu tutum", "noun", "A positive attitude makes a long flight easier for everyone.", "B1"],
  ["professional", "profesyonel, meslekî", "adjective", "She stayed professional even when the passenger was rude.", "B1"],
  ["multicultural", "çok kültürlü", "adjective", "I enjoy working in a multicultural environment.", "B2"],
  ["time management", "zaman yönetimi", "noun", "Good time management helped me finish my studies and work at the same time.", "B2"],
  ["take initiative", "inisiyatif almak", "phrase", "When I saw the problem, I took the initiative and told my supervisor.", "B2", "\"Take the initiative\" şeklinde de kullanılır."],
  ["achievement", "başarı, kazanım", "noun", "Finishing my English course was a big achievement for me.", "B1"],
  ["motivated", "motive, istekli", "adjective", "I am very motivated to start a career in aviation.", "B1"],
  ["dedicated", "kendini işine adamış", "adjective", "She is a dedicated student who studies English every day.", "B2"],
  ["personal growth", "kişisel gelişim", "noun", "Travelling alone gave me a lot of personal growth.", "B2"],
  ["fast learner", "çabuk öğrenen", "noun", "I am a fast learner, and I enjoy new challenges.", "B1"],
  ["resilient", "dirençli, çabuk toparlanan", "adjective", "Cabin crew must be resilient because the work can be tiring.", "B2"],
];

export const VOCABULARY: readonly VocabularyEntry[] = [
  ...build("Aviation", aviation),
  ...AVIATION_EXT,
  ...build("Customer Service", customerService),
  ...CUSTOMER_SERVICE_EXT,
  ...build("Travel", travel),
  ...TRAVEL_EXT,
  ...build("Safety", safety),
  ...SAFETY_EXT,
  ...build("Everyday English", everyday),
  ...EVERYDAY_EXT,
  ...build("Interview Vocabulary", interviewVocab),
  ...INTERVIEW_EXT,
];

export const VOCABULARY_BY_ID: ReadonlyMap<string, VocabularyEntry> = new Map(
  VOCABULARY.map((v) => [v.id, v]),
);
