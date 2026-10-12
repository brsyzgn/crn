import type { Level, QuestionCategory, QuizCategory, QuizQuestion, QuizSet, ResultCategory } from "@/types";
import { BANK_QUESTIONS } from "./question-bank.ts";

type Choices = readonly [string, string, string, string];
type Answer = 0 | 1 | 2 | 3;

/** The original 64 questions predate topics, so they get a topic from their category. */
const DEFAULT_TOPIC: Record<QuizCategory, string> = {
  vocabulary: "Aviation and service vocabulary",
  grammar: "Core grammar",
  reading: "Reading comprehension",
  "cabin-crew": "Cabin crew communication",
};

function q(
  id: string,
  category: QuizCategory,
  difficulty: Level,
  prompt: string,
  choices: Choices,
  answerIndex: Answer,
  explanation: string,
  passage?: string,
): QuizQuestion {
  return {
    id,
    category,
    difficulty,
    topic: DEFAULT_TOPIC[category],
    prompt,
    choices,
    answerIndex,
    explanation,
    ...(passage ? { passage } : {}),
  };
}

/* -------------------------------------------------------------------------- */
/*  Vocabulary                                                                */
/* -------------------------------------------------------------------------- */

const vocabulary: QuizQuestion[] = [
  q("vocab-01", "vocabulary", "B1", "The flight was ____ for two hours because of heavy fog.",
    ["delivered", "delayed", "decided", "departed"], 1,
    "\"Delayed\" means made late. \"Departed\" means left, which does not fit with \"for two hours\"."),
  q("vocab-02", "vocabulary", "B1", "Please ____ your seat belt when the sign is on.",
    ["close", "tie", "hold", "fasten"], 3,
    "\"Fasten your seat belt\" is the standard collocation used on aircraft."),
  q("vocab-03", "vocabulary", "B1", "A person who works in the cabin and looks after passengers is called a ____.",
    ["flight attendant", "ground engineer", "air traffic controller", "baggage handler"], 0,
    "A flight attendant (cabin crew member) takes care of passengers and safety in the cabin."),
  q("vocab-04", "vocabulary", "B1", "What does \"turbulence\" mean?",
    ["a delay at the gate", "a type of in-flight meal", "rough, unstable movement of the air", "the sound of the engines"], 2,
    "Turbulence is irregular air movement that makes the aircraft shake or bump."),
  q("vocab-05", "vocabulary", "B1", "If you are unhappy with a service, you can make a ____.",
    ["comparison", "complaint", "competition", "compartment"], 1,
    "You \"make a complaint\" when you tell someone that you are not satisfied."),
  q("vocab-06", "vocabulary", "B2", "We apologize for the ____ caused by the change of gate.",
    ["inconvenient", "convenience", "convenient", "inconvenience"], 3,
    "A noun is needed after \"the\". \"Inconvenience\" is the noun meaning trouble or difficulty."),
  q("vocab-07", "vocabulary", "B1", "Which word is closest in meaning to \"assist\"?",
    ["help", "ask", "avoid", "order"], 0,
    "\"Assist\" is a more formal word for \"help\"."),
  q("vocab-08", "vocabulary", "B1", "After you land in a new country, you go through ____ to show your passport.",
    ["the galley", "a layover", "passport control", "a runway"], 2,
    "Passport control is where officers check your passport and visa."),
  q("vocab-09", "vocabulary", "B1", "She is very ____. She never gets angry, even when passengers are rude.",
    ["rude", "patient", "careless", "curious"], 1,
    "A patient person stays calm and does not get angry or impatient easily."),
  q("vocab-10", "vocabulary", "B1", "A ____ is the time you wait between two flights.",
    ["itinerary", "departure", "souvenir", "layover"], 3,
    "A layover is a waiting period between connecting flights. An itinerary is the travel plan."),
  q("vocab-11", "vocabulary", "B2", "In an emergency, the crew must ____ the aircraft quickly.",
    ["evacuate", "evaluate", "evolve", "elevate"], 0,
    "To evacuate means to move people out of a dangerous place."),
  q("vocab-12", "vocabulary", "B1", "In a job interview, \"I am reliable\" means:",
    ["I travel a lot", "I speak many languages", "People can trust me to do my job well", "I am always in a hurry"], 2,
    "A reliable person is someone you can depend on."),
  q("vocab-13", "vocabulary", "B2", "Please ____ your small bag in the overhead locker before take-off.",
    ["stay", "stow", "stop", "stir"], 1,
    "\"Stow\" means to put something away safely. It is common in safety announcements."),
  q("vocab-14", "vocabulary", "B2", "To \"go the extra mile\" means to:",
    ["walk a long distance", "travel abroad", "finish work early", "do more than is expected"], 3,
    "This idiom describes making an extra effort to help someone."),
  q("vocab-15", "vocabulary", "B1", "A document that allows you to enter some countries is called a ____.",
    ["visa", "ticket", "receipt", "menu"], 0,
    "A visa gives you official permission to enter, or stay in, a country."),
  q("vocab-16", "vocabulary", "B2", "Which verb means \"to make someone feel less worried\"?",
    ["upset", "compare", "reassure", "delay"], 2,
    "To reassure someone is to say or do something that makes them feel calmer and safer."),
];

/* -------------------------------------------------------------------------- */
/*  Grammar                                                                   */
/* -------------------------------------------------------------------------- */

const grammar: QuizQuestion[] = [
  q("gram-01", "grammar", "B1", "I ____ in Istanbul since 2020.",
    ["live", "lived", "have lived", "am living"], 2,
    "\"Since 2020\" shows a period from the past until now, so the present perfect (have lived) is needed."),
  q("gram-02", "grammar", "B1", "If the flight ____ cancelled, we will give you a refund.",
    ["is", "will be", "was", "would be"], 0,
    "In the first conditional, we use the present simple in the if-clause and \"will\" in the result clause."),
  q("gram-03", "grammar", "B1", "The safety instructions ____ in three languages.",
    ["give", "gave", "are giving", "are given"], 3,
    "The instructions do not perform the action; they receive it. We need the passive: are given."),
  q("gram-04", "grammar", "B1", "You ____ use your phone during take-off. It is not allowed.",
    ["don't have to", "mustn't", "needn't", "may"], 1,
    "\"Mustn't\" expresses prohibition. \"Don't have to\" means something is not necessary."),
  q("gram-05", "grammar", "B2", "She asked me where ____ from.",
    ["did I come", "do I come", "I came", "am I coming"], 2,
    "In reported questions we use statement word order (subject + verb) and the tense moves back: \"I came\"."),
  q("gram-06", "grammar", "B1", "This seat is ____ than that one.",
    ["more comfortable", "comfortabler", "most comfortable", "the more comfortable"], 0,
    "Long adjectives form the comparative with \"more\": more comfortable than."),
  q("gram-07", "grammar", "B1", "I'm looking forward to ____ you next week.",
    ["see", "saw", "seen", "seeing"], 3,
    "\"To\" in \"look forward to\" is a preposition, so it is followed by the -ing form: seeing."),
  q("gram-08", "grammar", "B1", "There ____ any seats left on the morning flight.",
    ["isn't", "aren't", "hasn't", "doesn't"], 1,
    "\"Seats\" is plural, so we use \"There aren't any seats\"."),
  q("gram-09", "grammar", "B2", "The passenger ____ bag was lost was very upset.",
    ["who", "which", "whose", "whom"], 2,
    "\"Whose\" shows possession (the passenger's bag) in a relative clause."),
  q("gram-10", "grammar", "B2", "When I arrived at the gate, the plane ____.",
    ["had already left", "already leaves", "has already left", "was already leave"], 0,
    "The plane left before I arrived, so we use the past perfect (had already left) for the earlier action."),
  q("gram-11", "grammar", "B1", "She is interested ____ working as cabin crew.",
    ["on", "at", "for", "in"], 3,
    "The adjective \"interested\" is followed by the preposition \"in\"."),
  q("gram-12", "grammar", "B2", "He suggested ____ a taxi to the airport.",
    ["to take", "taking", "take", "to taking"], 1,
    "\"Suggest\" is followed by the -ing form: suggested taking."),
  q("gram-13", "grammar", "B2", "I wish I ____ more confident when I speak English.",
    ["am", "will be", "were", "would be"], 2,
    "After \"I wish\" we use the past simple to talk about an unreal present situation: I wish I were."),
  q("gram-14", "grammar", "B2", "Could you tell me ____ the nearest exit is?",
    ["where", "where is", "where does", "where was"], 0,
    "In an indirect question we use statement word order, so \"where the nearest exit is\" is correct."),
  q("gram-15", "grammar", "B1", "We ____ our dinner when the turbulence started.",
    ["have had", "has", "are having", "were having"], 3,
    "The past continuous (were having) describes an action in progress when another action started."),
  q("gram-16", "grammar", "B1", "How ____ luggage do you have?",
    ["many", "much", "few", "a lot"], 1,
    "\"Luggage\" is uncountable, so we ask \"How much luggage\"."),
];

/* -------------------------------------------------------------------------- */
/*  Reading comprehension                                                     */
/* -------------------------------------------------------------------------- */

const PASSAGE_NOTICE =
  "Notice to passengers on Flight 218 to Rome. Because of strong winds, the flight will leave 45 minutes later than planned. The new departure time is 14:15. Boarding will start at 13:40 at Gate 22. Passengers who need extra time or assistance can board first. Free water and snacks are available at the information desk until boarding begins. We apologize for the delay.";

const PASSAGE_MARIA =
  "Maria has been a flight attendant for three years. Her favourite part of the job is meeting people from all over the world. Last month, a nervous passenger was flying for the first time. Maria spoke to him quietly, explained the sounds of the plane and brought him a glass of water. After landing, the passenger thanked her and said the flight was easier than he expected. Maria says the job can be tiring, but small moments like this remind her why she loves it.";

const PASSAGE_LONGHAUL =
  "Long flights can be tiring, but a few simple habits can help. First, drink plenty of water, because the air in the cabin is very dry. Second, walk around the cabin every two or three hours to keep your blood moving. Many passengers also wear comfortable clothes and bring a light jacket, as the temperature can change. Finally, try to adjust your sleep to the time at your destination. This can reduce jet lag, although it may not remove it completely.";

const PASSAGE_EMAIL =
  "Dear Mr Kaya, thank you for contacting us about your missing suitcase. We are sorry that it did not arrive with you on Tuesday. Our team has found the suitcase, and it is now at the airport in Munich. It will be delivered to your hotel by Thursday evening. In the meantime, you may buy essential items such as clothes and toiletries. Please keep your receipts, because we will refund reasonable costs. If you have any questions, please call our baggage service team.";

const reading: QuizQuestion[] = [
  q("read-01", "reading", "B1", "Why is the flight late?",
    ["There is a problem with the engine.", "The weather is windy.", "The crew has not arrived.", "The gate has changed."], 1,
    "The notice says, \"Because of strong winds, the flight will leave 45 minutes later than planned.\"", PASSAGE_NOTICE),
  q("read-02", "reading", "B1", "What time will boarding start?",
    ["13:40", "14:15", "13:15", "14:40"], 0,
    "The text says boarding starts at 13:40. The departure time (14:15) is a different time.", PASSAGE_NOTICE),
  q("read-03", "reading", "B1", "Who can board the aircraft first?",
    ["Passengers with the earliest tickets", "Passengers going to Rome only", "Passengers who need extra time or assistance", "Passengers who bought snacks"], 2,
    "\"Passengers who need extra time or assistance can board first.\"", PASSAGE_NOTICE),
  q("read-04", "reading", "B1", "What can passengers get at the information desk?",
    ["Free hotel rooms", "Free water and snacks", "New boarding passes", "A refund"], 1,
    "The notice mentions free water and snacks at the information desk until boarding begins.", PASSAGE_NOTICE),

  q("read-05", "reading", "B1", "How long has Maria worked as a flight attendant?",
    ["One year", "Two years", "Three years", "Five years"], 2,
    "The first sentence says she has been a flight attendant for three years.", PASSAGE_MARIA),
  q("read-06", "reading", "B1", "What did Maria do for the nervous passenger?",
    ["She changed his seat and gave him a magazine.", "She explained the sounds of the plane and brought him water.", "She asked the captain to land early.", "She let him sit in the galley."], 1,
    "Maria spoke quietly, explained the sounds of the plane and brought a glass of water.", PASSAGE_MARIA),
  q("read-07", "reading", "B2", "What is Maria's opinion of her job?",
    ["It is easy and never tiring.", "It is tiring, but she finds it rewarding.", "It is boring after three years.", "It is only good for travelling."], 1,
    "She says the job can be tiring, but small moments remind her why she loves it.", PASSAGE_MARIA),
  q("read-08", "reading", "B1", "In the text, the word \"nervous\" is closest in meaning to:",
    ["angry", "tired", "worried", "excited about the food"], 2,
    "The passenger was flying for the first time and needed calming, so \"nervous\" means worried or anxious.", PASSAGE_MARIA),

  q("read-09", "reading", "B1", "Why does the writer recommend drinking plenty of water?",
    ["The food on the plane is salty.", "The air in the cabin is very dry.", "Water helps you sleep.", "The seats are uncomfortable."], 1,
    "The text says, \"drink plenty of water, because the air in the cabin is very dry.\"", PASSAGE_LONGHAUL),
  q("read-10", "reading", "B1", "How often should passengers walk around the cabin?",
    ["Every hour", "Every two or three hours", "Once at the start", "Every six hours"], 1,
    "The writer suggests walking \"every two or three hours\" to keep the blood moving.", PASSAGE_LONGHAUL),
  q("read-11", "reading", "B1", "Why might passengers bring a light jacket?",
    ["Because the cabin is always very cold.", "Because the temperature can change.", "Because it is a rule on long flights.", "Because it helps with jet lag."], 1,
    "The text says passengers bring a light jacket \"as the temperature can change\".", PASSAGE_LONGHAUL),
  q("read-12", "reading", "B2", "What does the writer say about adjusting your sleep to the destination's time?",
    ["It removes jet lag completely.", "It has no effect at all.", "It can reduce jet lag but may not remove it fully.", "It is dangerous on long flights."], 2,
    "The last sentence says it \"can reduce jet lag, although it may not remove it completely\".", PASSAGE_LONGHAUL),

  q("read-13", "reading", "B1", "What is the main purpose of the email?",
    ["To ask Mr Kaya to book a new flight", "To tell Mr Kaya about his missing suitcase", "To offer Mr Kaya a free hotel", "To say the airline has closed"], 1,
    "The email responds to Mr Kaya's contact about his missing suitcase and gives an update.", PASSAGE_EMAIL),
  q("read-14", "reading", "B1", "Where is the suitcase now?",
    ["At Mr Kaya's hotel", "On a flight to Munich", "At the airport in Munich", "At the baggage service desk in his home city"], 2,
    "\"It is now at the airport in Munich.\"", PASSAGE_EMAIL),
  q("read-15", "reading", "B2", "Why should Mr Kaya keep his receipts?",
    ["To prove he was on the flight", "To pay for the delivery", "Because the airline will refund reasonable costs", "To enter the airport again"], 2,
    "The email says, \"Please keep your receipts, because we will refund reasonable costs.\"", PASSAGE_EMAIL),
  q("read-16", "reading", "B1", "When will the suitcase be delivered to the hotel?",
    ["By Tuesday morning", "By Wednesday afternoon", "By Thursday evening", "By Friday night"], 2,
    "The email says it will be delivered \"by Thursday evening\". Tuesday is when the suitcase failed to arrive.", PASSAGE_EMAIL),
];

/* -------------------------------------------------------------------------- */
/*  Cabin crew English                                                        */
/* -------------------------------------------------------------------------- */

const cabinCrew: QuizQuestion[] = [
  q("crew-01", "cabin-crew", "B1", "Which sentence is the most polite way to ask a passenger to return to their seat?",
    ["Could you please return to your seat, sir?", "Sit down now.", "You must sit, immediately.", "Go to your seat."], 0,
    "\"Could you please…\" is a polite request. The other options sound like commands."),
  q("crew-02", "cabin-crew", "B1", "A passenger says, \"I'm cold.\" What is the best reply?",
    ["That's not my job.", "Wear a jacket next time.", "I'll bring you a blanket right away.", "The air conditioning is fine."], 2,
    "Good service means offering a quick, practical solution in a friendly way."),
  q("crew-03", "cabin-crew", "B1", "Complete the announcement: \"Ladies and gentlemen, we are now ____ our final descent into Madrid.\"",
    ["leaving", "beginning", "opening", "carrying"], 1,
    "We \"begin\" or \"start\" the final descent. The other verbs do not collocate with \"descent\"."),
  q("crew-04", "cabin-crew", "B1", "A crew member says, \"Please stow your tray table.\" What should the passenger do?",
    ["Open it fully", "Clean it with a napkin", "Put their food on it", "Fold it up and lock it in place"], 3,
    "\"Stow\" means to put away. Tray tables must be folded and secured before take-off and landing."),
  q("crew-05", "cabin-crew", "B1", "A passenger asks for a vegetarian meal, but none are left. Which is the best response?",
    ["I'm very sorry, we don't have one left. May I offer you a salad or a cheese sandwich instead?", "No vegetarian meals.", "You should have ordered it earlier.", "Eat what we have."], 0,
    "A professional answer includes an apology and an alternative solution."),
  q("crew-06", "cabin-crew", "B1", "Complete the safety announcement: \"In an emergency, please ____ the instructions of the crew.\"",
    ["ignore", "compare", "follow", "forget"], 2,
    "Passengers must follow the crew's instructions in an emergency."),
  q("crew-07", "cabin-crew", "B1", "What does \"The seat belt sign is on\" mean?",
    ["You can walk around freely.", "Passengers should sit down and fasten their seat belts.", "The meal service is starting.", "The flight has landed."], 1,
    "When the seat belt sign is on, passengers must be seated with their belts fastened."),
  q("crew-08", "cabin-crew", "B2", "Which phrase shows empathy to an upset passenger?",
    ["Calm down.", "That's the rule.", "I can't help you.", "I understand how you feel, and I'm sorry for the trouble."], 3,
    "Empathy means showing that you understand the person's feelings. Telling someone to \"calm down\" can sound rude."),
  q("crew-09", "cabin-crew", "B1", "Which is the correct way to offer a drink?",
    ["Would you like something to drink?", "You want drink?", "Do you drinking something?", "What you want drink?"], 0,
    "\"Would you like…?\" is a polite and grammatically correct way to make an offer."),
  q("crew-10", "cabin-crew", "B2", "The overhead locker above a passenger's seat is full. Which sentence is best?",
    ["Your bag doesn't fit.", "The locker is full, so that's your problem.", "I'm afraid this locker is full. Let me find another space for your bag.", "Put it somewhere else."], 2,
    "\"I'm afraid…\" softens bad news, and offering help turns the problem into a solution."),
  q("crew-11", "cabin-crew", "B1", "What does \"Boarding has finished\" mean?",
    ["Passengers may now enter the gate.", "Boarding is over, and the doors will close soon.", "The luggage is lost.", "Passengers must leave the aircraft."], 1,
    "The boarding process is complete. Passengers are on board and the doors are about to close."),
  q("crew-12", "cabin-crew", "B1", "A passenger asks, \"Excuse me, where is the lavatory?\" Which answer is best?",
    ["Over there.", "I don't know.", "Find it yourself.", "It's at the back of the cabin, on your left. I'll show you if you like."], 3,
    "A clear direction plus an offer to help is both informative and friendly."),
  q("crew-13", "cabin-crew", "B1", "Which announcement is grammatically correct?",
    ["Please keep your seat belt fastened while seated.", "Please keeping your seat belt fasten while sit.", "Please keep fastened your seat belt while sat.", "Please kept your seat belt fasten while seating."], 0,
    "\"Keep + object + past participle\" is correct: keep your seat belt fastened. \"While seated\" is a standard reduced clause."),
  q("crew-14", "cabin-crew", "B1", "What is the best way to end a conversation with a passenger?",
    ["That's all.", "Bye.", "Is there anything else I can help you with?", "Next, please."], 2,
    "Offering further help is polite and shows good customer service."),
  q("crew-15", "cabin-crew", "B1", "The captain says, \"We are expecting some turbulence.\" What does this mean?",
    ["The flight will be very quiet.", "The air may be bumpy.", "We will arrive early.", "The meals are ready."], 1,
    "Turbulence means rough air, so the aircraft may shake or bump."),
  q("crew-16", "cabin-crew", "B2", "A passenger is nervous about turbulence. Which reply is the most reassuring?",
    ["It can be dangerous.", "I have no idea.", "Don't be silly.", "Turbulence is common, and the aircraft is designed to handle it. I'm here if you need anything."], 3,
    "This answer is honest, calm and supportive, and it offers further help."),
];

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  ...vocabulary,
  ...grammar,
  ...reading,
  ...cabinCrew,
];

/** Every question available to Practice and to the randomized tests: the original 64 plus the expanded bank. */
export const ALL_QUESTIONS: readonly QuizQuestion[] = [...QUIZ_QUESTIONS, ...BANK_QUESTIONS];

/** Lookup for every question (fixed sets, generated tests and history review all resolve ids here). */
export const QUIZ_QUESTIONS_BY_ID: ReadonlyMap<string, QuizQuestion> = new Map(
  ALL_QUESTIONS.map((x) => [x.id, x]),
);

function ids(list: QuizQuestion[], from: number, to: number): string[] {
  return list.slice(from, to).map((x) => x.id);
}

export const QUIZ_SETS: readonly QuizSet[] = [
  { id: "vocab-set-1", category: "vocabulary", title: "Vocabulary Test · Set 1", description: "Aviation, service and travel words in context.", questionIds: ids(vocabulary, 0, 8) },
  { id: "vocab-set-2", category: "vocabulary", title: "Vocabulary Test · Set 2", description: "Safety, interview and everyday vocabulary.", questionIds: ids(vocabulary, 8, 16) },
  { id: "grammar-set-1", category: "grammar", title: "Grammar Test · Set 1", description: "Tenses, conditionals, passive and modal verbs.", questionIds: ids(grammar, 0, 8) },
  { id: "grammar-set-2", category: "grammar", title: "Grammar Test · Set 2", description: "Relative clauses, reported speech and wishes.", questionIds: ids(grammar, 8, 16) },
  { id: "reading-set-1", category: "reading", title: "Reading Test · Set 1", description: "A passenger notice and a short story about a flight attendant.", questionIds: ids(reading, 0, 8) },
  { id: "reading-set-2", category: "reading", title: "Reading Test · Set 2", description: "Long-haul flight advice and a baggage service email.", questionIds: ids(reading, 8, 16) },
  { id: "crew-set-1", category: "cabin-crew", title: "Cabin Crew English · Set 1", description: "Polite requests, announcements and passenger replies.", questionIds: ids(cabinCrew, 0, 8) },
  { id: "crew-set-2", category: "cabin-crew", title: "Cabin Crew English · Set 2", description: "Handling situations with professional language.", questionIds: ids(cabinCrew, 8, 16) },
];

export const QUIZ_SETS_BY_ID: ReadonlyMap<string, QuizSet> = new Map(
  QUIZ_SETS.map((s) => [s.id, s]),
);

export const QUIZ_CATEGORY_LABELS: Record<ResultCategory, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading Comprehension",
  "cabin-crew": "Cabin Crew English",
  "customer-service": "Customer Service",
  mixed: "Mixed Levels",
};

/** Names of the Practice categories (one per question category). */
export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading",
  "cabin-crew": "Cabin Crew English",
  everyday: "Everyday English",
  workplace: "Workplace English",
  "customer-service": "Customer Service English",
  situational: "Situational English",
  "sentence-completion": "Sentence Completion",
  "error-correction": "Error Correction",
};
