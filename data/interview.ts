import type { InterviewQuestion } from "../types/index.ts";
import { interviewBank } from "./interview/helpers.ts";
import { LEGACY_ENRICHMENT } from "./interview/legacy-enrichment.ts";
import { INTERVIEW_ROWS } from "./interview/rows.ts";

/**
 * Cabin crew interview practice bank.
 *
 * Every question is a "Representative Practice Question": written for practice, NOT reported by a
 * candidate and NOT taken from any specific airline. Sample answers are models only; candidates
 * should adapt them with their own real experience.
 *
 * - The original 32 questions are kept word for word below (LEGACY_QUESTIONS). Their new fields
 *   (translation, competency, second-level answer, follow-ups...) live in interview/legacy-enrichment.ts.
 * - The expanded questions are authored in interview/rows.ts.
 */
interface LegacyQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "B1" | "B2";
  sampleAnswer: string;
  tips: string[];
  commonMistakes: string[];
  turkishNote?: string;
}

const LEGACY_QUESTIONS: readonly LegacyQuestion[] = [
  /* ------------------------- Personal Introduction ------------------------ */
  {
    id: "intro-tell-me-about-yourself",
    question: "Can you tell me a little about yourself?",
    category: "Personal Introduction",
    difficulty: "B1",
    sampleAnswer:
      "Of course. My name is Ceren, and I am from Turkey. I have always enjoyed meeting new people and learning about different cultures, so I decided to build a career in aviation. I am patient, friendly and organized, and I work hard to improve my English every day. I am excited about the chance to take care of passengers and be part of a professional team.",
    tips: [
      "Keep it to about 30–45 seconds: who you are, what you enjoy, and why you are here.",
      "Mention two or three personal qualities that fit cabin crew work.",
      "Finish with a sentence about your goal so the answer sounds complete.",
    ],
    commonMistakes: [
      "Reading your whole CV aloud instead of giving a short summary.",
      "Talking only about family or hobbies and forgetting your professional goals.",
    ],
    turkishNote:
      "Kısa ve akıcı bir tanıtım yapın; kendinizi, güçlü yönlerinizi ve hedefinizi anlatın.",
  },
  {
    id: "intro-describe-personality",
    question: "How would you describe your personality in three words?",
    category: "Personal Introduction",
    difficulty: "B1",
    sampleAnswer:
      "I would say I am friendly, calm and responsible. I am friendly because I enjoy talking to people and making them feel comfortable. I stay calm when things become busy, and I always try to finish my tasks carefully. My friends often say they can rely on me, and I think this is important for a cabin crew member.",
    tips: [
      "Choose three adjectives, then give a short reason or example for each.",
      "Pick qualities that match the job, such as calm, reliable or caring.",
    ],
    commonMistakes: [
      "Giving three words but no explanation.",
      "Choosing vague words like \"nice\" or \"good\" that do not tell the interviewer much.",
    ],
    turkishNote:
      "Her sıfat için kısa bir örnek verin; sadece üç kelime saymak yeterli değildir.",
  },
  {
    id: "intro-languages",
    question: "What languages do you speak, and how do you use English in your daily life?",
    category: "Personal Introduction",
    difficulty: "B1",
    sampleAnswer:
      "I speak Turkish as my first language, and I am improving my English. I use English every day when I read articles, watch videos and practise speaking. I know that clear communication is very important for cabin crew, so I am studying the vocabulary I need for passengers and safety information. My goal is to become more confident every month.",
    tips: [
      "Be honest about your level, and show that you are actively improving.",
      "Give a real example of how you practise English.",
    ],
    commonMistakes: [
      "Saying \"my English is bad\" without adding what you are doing to improve it.",
      "Exaggerating your level. Interviewers can usually tell.",
    ],
    turkishNote:
      "Dürüst olun ama gelişim çabanızı mutlaka vurgulayın.",
  },
  {
    id: "intro-day-description",
    question: "What does a typical day look like for you at the moment?",
    category: "Personal Introduction",
    difficulty: "B1",
    sampleAnswer:
      "At the moment, I wake up early and study English for about an hour. After that, I focus on my other responsibilities. In the evening, I practise speaking and review new vocabulary. I like to have a clear routine because it helps me stay organized and motivated. On weekends, I rest, spend time with my family and prepare for the next week.",
    tips: [
      "Use the present simple for routines and add time expressions like \"in the morning\" or \"after that\".",
      "Show that you are organized and disciplined.",
    ],
    commonMistakes: [
      "Using the past simple for daily routines (\"I woke up every day\").",
      "Describing a day that sounds unplanned or unproductive.",
    ],
  },

  /* ------------------------------ Motivation ------------------------------ */
  {
    id: "motivation-why-cabin-crew",
    question: "Why do you want to become a cabin crew member?",
    category: "Motivation",
    difficulty: "B1",
    sampleAnswer:
      "I want to become a cabin crew member because I love meeting new people, experiencing different cultures and giving excellent customer service. I enjoy working in a dynamic environment, and I believe my communication skills and calm attitude make me a good fit for this role. I also like the responsibility of keeping passengers safe and comfortable.",
    tips: [
      "Mention both service and safety. Cabin crew are first of all safety professionals.",
      "Give personal reasons, not only \"I like travelling\".",
      "Connect your reasons to your own skills.",
    ],
    commonMistakes: [
      "Saying you only want to travel for free or see the world.",
      "Forgetting to mention safety responsibilities.",
    ],
    turkishNote:
      "Seyahati tek sebep olarak göstermeyin; hizmet ve güvenlik sorumluluğunu da vurgulayın.",
  },
  {
    id: "motivation-why-us",
    question: "Why do you want to work for our airline?",
    category: "Motivation",
    difficulty: "B2",
    sampleAnswer:
      "I admire your airline because it connects many different countries and cultures, and I would be proud to represent it. I have read about your values and the way you focus on passenger care. I would like to learn from experienced colleagues and grow with a professional team. I believe that my positive attitude and my willingness to learn would be a real advantage.",
    tips: [
      "Research the airline before the interview and mention one or two real facts you actually checked.",
      "Link the airline's values to your own character.",
    ],
    commonMistakes: [
      "Giving an answer that could fit any airline without any specific detail.",
      "Criticizing other airlines.",
    ],
    turkishNote:
      "Başvurduğunuz havayolunu gerçekten araştırın ve gerçek bir bilgiyi cevabınıza ekleyin.",
  },
  {
    id: "motivation-strengths",
    question: "What are your greatest strengths?",
    category: "Motivation",
    difficulty: "B1",
    sampleAnswer:
      "My greatest strengths are communication and patience. I listen carefully to people, and I explain things in a simple and friendly way. I stay patient even when a situation is stressful. For example, when I helped a confused customer at my previous job, I stayed calm and found a solution, and the customer thanked me. I think these strengths are very useful in the cabin.",
    tips: [
      "Choose two strengths and support at least one with a short real example.",
      "Use simple structures: \"One of my strengths is… For example, …\".",
    ],
    commonMistakes: [
      "Listing many strengths without any proof.",
      "Sounding arrogant instead of confident.",
    ],
  },
  {
    id: "motivation-weakness",
    question: "What is your biggest weakness?",
    category: "Motivation",
    difficulty: "B2",
    sampleAnswer:
      "In the past, I was sometimes too shy when I spoke English in front of new people. I did not want to make mistakes. To improve this, I now practise speaking every day, and I try to start conversations with confidence. I have already noticed a big difference, and I will keep working on it. I see mistakes as a normal part of learning.",
    tips: [
      "Pick a real but non-critical weakness, then explain what you are doing to improve it.",
      "Use the pattern: problem → action → result.",
    ],
    commonMistakes: [
      "Saying \"I have no weaknesses\".",
      "Naming a weakness that is essential for the job, such as \"I get angry at customers\".",
    ],
    turkishNote:
      "Dürüst bir zayıf yön seçin ve nasıl geliştirdiğinizi anlatın.",
  },
  {
    id: "motivation-five-years",
    question: "Where do you see yourself in five years?",
    category: "Motivation",
    difficulty: "B2",
    sampleAnswer:
      "In five years, I hope to be an experienced and trusted member of the cabin crew team. I would like to improve my service skills, learn from my colleagues and take on more responsibility over time. I am also interested in developing my languages further. My main goal is to grow with the company and be proud of the service I provide.",
    tips: [
      "Show ambition, but keep your answer connected to the airline and the job.",
      "Use \"I hope to…\" and \"I would like to…\" to sound polite and realistic.",
    ],
    commonMistakes: [
      "Saying you plan to leave the airline or change careers.",
      "Making unrealistic promises, such as becoming a manager in one year.",
    ],
  },

  /* --------------------------- Customer Service --------------------------- */
  {
    id: "service-good-service",
    question: "What does excellent customer service mean to you?",
    category: "Customer Service",
    difficulty: "B1",
    sampleAnswer:
      "To me, excellent customer service means making every person feel welcome, respected and safe. It means listening carefully, staying polite and solving problems quickly. A small gesture, like a smile or a kind word, can change a passenger's whole experience. I also believe that good service continues even when the person is tired or unhappy.",
    tips: [
      "Mention three clear ideas such as listening, politeness and problem-solving.",
      "Add one short real or imagined example.",
    ],
    commonMistakes: [
      "Giving a very general answer like \"to be nice to people\".",
      "Forgetting that service also includes safety.",
    ],
  },
  {
    id: "service-difficult-customer",
    question: "Tell me about a time you dealt with a difficult customer.",
    category: "Customer Service",
    difficulty: "B2",
    sampleAnswer:
      "In my previous job, a customer was upset because his order was late. First, I listened to him without interrupting. Then I apologized for the delay and explained what I could do. I offered him a drink while I checked the problem with my manager. In the end, the customer calmed down and thanked me for my help. This experience taught me that listening first is the best way to stay calm.",
    tips: [
      "Use the STAR method: Situation, Task, Action, Result.",
      "Use the past simple for the story, and finish with what you learned.",
    ],
    commonMistakes: [
      "Blaming the customer or speaking badly about the situation.",
      "Telling a story with no clear result.",
    ],
    turkishNote:
      "STAR yöntemi: Durum, Görev, Eylem, Sonuç. Hikâyeyi geçmiş zamanda anlatın.",
  },
  {
    id: "service-no-experience",
    question: "You have no airline experience. How will you give good service to passengers?",
    category: "Customer Service",
    difficulty: "B2",
    sampleAnswer:
      "Although I do not have airline experience yet, I understand what passengers need: clear information, kindness and safety. I have practised these skills in other situations, such as helping people and working with a team. I am a fast learner and I am ready to follow training carefully. I will also ask experienced colleagues for advice and always try to improve.",
    tips: [
      "Connect skills from other jobs, studies or volunteering to cabin crew work.",
      "Show a learning attitude: training, feedback, practice.",
    ],
    commonMistakes: [
      "Apologizing too much for the lack of experience.",
      "Saying that you do not need training.",
    ],
  },
  {
    id: "service-special-needs",
    question: "How would you help a passenger who needs special assistance?",
    category: "Customer Service",
    difficulty: "B2",
    sampleAnswer:
      "First, I would politely ask the passenger what kind of help they need, and I would listen carefully. I would never assume what they want. Then I would explain the options clearly and help them in a respectful way, for example with boarding, seating or their luggage. I would also tell my team so everyone knows how to support the passenger during the flight.",
    tips: [
      "Show respect, dignity and clear communication.",
      "Mention that you would inform the rest of the crew.",
    ],
    commonMistakes: [
      "Acting without asking the passenger what they need.",
      "Using words that sound like pity instead of respect.",
    ],
    turkishNote:
      "Önce yolcuya ne tür bir yardıma ihtiyacı olduğunu saygıyla sorun, varsayımda bulunmayın.",
  },
  {
    id: "service-tired-passenger",
    question: "How do you keep a positive attitude when you are tired?",
    category: "Customer Service",
    difficulty: "B1",
    sampleAnswer:
      "When I am tired, I remind myself that passengers need my best attitude, even at the end of a long day. I take a deep breath, smile and focus on one task at a time. I also drink water and take short breaks when it is possible. I think a positive attitude is a professional choice, and it often helps me feel more energetic.",
    tips: [
      "Give two or three simple, healthy habits.",
      "Show that you take responsibility for your own attitude.",
    ],
    commonMistakes: [
      "Saying that you never feel tired.",
      "Complaining about long working hours.",
    ],
  },

  /* ------------------------------- Teamwork ------------------------------- */
  {
    id: "team-why-important",
    question: "Why is teamwork important for cabin crew?",
    category: "Teamwork",
    difficulty: "B1",
    sampleAnswer:
      "Teamwork is very important for cabin crew because we work together in a small space with many passengers and a lot of responsibilities. We need to communicate clearly so that service and safety procedures are done correctly. When everyone helps each other, the work is faster and the passengers feel more comfortable. In an emergency, good teamwork can protect lives.",
    tips: [
      "Mention both service and safety.",
      "Use words like communicate, support and trust.",
    ],
    commonMistakes: [
      "Giving a general answer about teamwork without connecting it to the cabin environment.",
    ],
  },
  {
    id: "team-difficult-colleague",
    question: "How would you work with a colleague you find difficult?",
    category: "Teamwork",
    difficulty: "B2",
    sampleAnswer:
      "I would try to understand the other person's point of view and stay respectful. If there was a problem, I would speak to my colleague privately and politely, and I would focus on the task, not on the person. I would keep a professional attitude during the flight, because passengers should never feel tension in the crew. If we could not solve the problem, I would ask a supervisor for advice.",
    tips: [
      "Show maturity: private conversation, respect and focus on solutions.",
      "Mention that you would involve a supervisor only when necessary.",
    ],
    commonMistakes: [
      "Saying that you would ignore the colleague completely.",
      "Criticizing a colleague in front of passengers or the team.",
    ],
  },
  {
    id: "team-role-in-team",
    question: "What role do you usually take in a team?",
    category: "Teamwork",
    difficulty: "B1",
    sampleAnswer:
      "I usually take a supportive and reliable role. I like to listen to everyone's ideas first, and then I help the team to find a clear plan. If someone needs help, I offer my support. I can also lead when it is necessary, but I believe that every member is equally important. For me, the success of the team is more important than my own success.",
    tips: [
      "Be flexible: show that you can follow and lead.",
      "Add a short example from school, work or volunteering if you can.",
    ],
    commonMistakes: [
      "Saying \"I always do everything myself\".",
      "Describing a role without mentioning other people.",
    ],
  },
  {
    id: "team-help-colleague",
    question: "Describe a time when you helped a colleague or teammate.",
    category: "Teamwork",
    difficulty: "B2",
    sampleAnswer:
      "At my last workplace, a new colleague felt nervous because she did not know our system. After my own tasks were finished, I offered to sit with her and explain each step. I answered her questions patiently and showed her useful shortcuts. A week later, she was working confidently on her own. I felt proud, and our whole team worked better afterwards.",
    tips: [
      "Use the STAR method and finish with a positive result.",
      "Describe your action clearly: what exactly did you do?",
    ],
    commonMistakes: [
      "Using a story where you only gave orders.",
      "Forgetting to explain the result.",
    ],
  },

  /* -------------------------- Conflict Resolution ------------------------- */
  {
    id: "conflict-seat-dispute",
    question: "Two passengers are arguing about a seat. What would you do?",
    category: "Conflict Resolution",
    difficulty: "B2",
    sampleAnswer:
      "First, I would stay calm and speak politely to both passengers. I would listen to each person separately and check their boarding passes. Then I would explain the situation clearly. If one passenger is in the wrong seat, I would kindly ask them to move. If the problem continues, I would offer a solution, such as another available seat, or ask a senior crew member for help.",
    tips: [
      "Follow a clear order: stay calm, listen, check facts, offer a solution, ask for help if needed.",
      "Use a neutral voice. Do not take sides.",
    ],
    commonMistakes: [
      "Taking one passenger's side before checking the facts.",
      "Raising your voice or sounding annoyed.",
    ],
    turkishNote:
      "Sakin kalın, iki tarafı da dinleyin, bilgileri kontrol edin ve çözüm önerin.",
  },
  {
    id: "conflict-angry-passenger",
    question: "A passenger is shouting at you because the flight is delayed. How do you respond?",
    category: "Conflict Resolution",
    difficulty: "B2",
    sampleAnswer:
      "I would stay calm and let the passenger speak first. Then I would say, \"I understand that you are frustrated, and I am sorry for the delay.\" I would give the information I have, and I would not promise anything I cannot guarantee. If possible, I would offer a small help, like water or an update from the captain. If the passenger remained aggressive, I would inform my senior crew member.",
    tips: [
      "Show empathy first, then give information.",
      "Never argue and never make promises you cannot keep.",
    ],
    commonMistakes: [
      "Saying \"It's not my fault\".",
      "Giving the passenger false information to calm them down.",
    ],
  },
  {
    id: "conflict-misunderstanding-team",
    question: "Tell me about a time you had a disagreement with someone. How did you solve it?",
    category: "Conflict Resolution",
    difficulty: "B2",
    sampleAnswer:
      "During a group project, a teammate and I disagreed about how to divide the work. Instead of arguing, I suggested that we talk after class. I listened to her ideas, and I explained mine. We found a compromise: each person chose the tasks they were best at. The project went well, and our relationship became stronger. I learned that calm communication solves most problems.",
    tips: [
      "Choose a small, professional example, not a personal fight.",
      "Highlight listening and compromise.",
    ],
    commonMistakes: [
      "Showing that you are always right.",
      "Telling a story that ends without a solution.",
    ],
  },
  {
    id: "conflict-passenger-complaint",
    question: "A passenger complains that their meal is cold. What do you say and do?",
    category: "Conflict Resolution",
    difficulty: "B1",
    sampleAnswer:
      "I would apologize and say, \"I'm very sorry about that. Let me see what I can do.\" I would check if there is another meal available or if I can heat it up safely. If not, I would offer an alternative, such as a snack or a drink. I would thank the passenger for telling me, and I would make sure to follow up later to check that everything is fine.",
    tips: [
      "Apologize, offer a solution, and follow up.",
      "Use polite phrases such as \"Let me see what I can do\".",
    ],
    commonMistakes: [
      "Only saying \"sorry\" without offering a solution.",
      "Making excuses or blaming the kitchen.",
    ],
  },

  /* --------------------------- Safety Awareness --------------------------- */
  {
    id: "safety-most-important",
    question: "What is the most important responsibility of cabin crew?",
    category: "Safety Awareness",
    difficulty: "B1",
    sampleAnswer:
      "The most important responsibility of cabin crew is the safety of the passengers. We provide good service, but our first duty is to follow safety procedures and be ready for emergencies. This means checking emergency equipment, giving safety instructions and staying calm in difficult situations. Safety and service work together, because passengers feel more comfortable when they know they are safe.",
    tips: [
      "Always put safety first in your answer.",
      "Then explain how service and safety are connected.",
    ],
    commonMistakes: [
      "Saying that serving food and drinks is the most important job.",
    ],
    turkishNote:
      "Kabin ekibinin birinci görevi güvenliktir; hizmet bunun yanında gelir.",
  },
  {
    id: "safety-passenger-ignores-instructions",
    question: "A passenger refuses to fasten their seat belt during turbulence. What would you do?",
    category: "Safety Awareness",
    difficulty: "B2",
    sampleAnswer:
      "I would approach the passenger calmly and politely explain why the seat belt is necessary for their safety. I would say, \"Sir, for your safety, please fasten your seat belt during turbulence.\" If the passenger still refused, I would explain the safety rules again more clearly and inform the senior crew member immediately. I would stay respectful, but I would never ignore a safety rule.",
    tips: [
      "Be polite but firm: safety rules are not optional.",
      "Explain the reason and report to a senior crew member if needed.",
    ],
    commonMistakes: [
      "Ignoring the problem to avoid conflict.",
      "Sounding aggressive or giving orders without any explanation.",
    ],
  },
  {
    id: "safety-medical-emergency",
    question: "A passenger suddenly feels very unwell during the flight. What are your first steps?",
    category: "Safety Awareness",
    difficulty: "B2",
    sampleAnswer:
      "First, I would stay calm and go to the passenger immediately. I would ask them how they feel and check if they are conscious. Then I would inform the senior crew member so we could follow our medical emergency procedures. I would ask if there is a doctor or a nurse on board, and I would bring the first aid kit. I would also keep the other passengers calm and the aisle clear.",
    tips: [
      "Mention staying calm, informing the team and using the proper equipment.",
      "Do not claim you would give advanced medical treatment. Cabin crew follow trained procedures.",
    ],
    commonMistakes: [
      "Forgetting to inform other crew members.",
      "Promising to do medical actions you are not trained for.",
    ],
    turkishNote:
      "Sakin kalın, ekibi bilgilendirin ve eğitimde öğrendiğiniz prosedürleri izleyin.",
  },
  {
    id: "safety-fear-of-flying",
    question: "A passenger tells you they are afraid of flying. How would you support them?",
    category: "Safety Awareness",
    difficulty: "B2",
    sampleAnswer:
      "I would speak to the passenger in a calm and friendly voice. I would listen to their worries and reassure them that flying is very safe and that the crew is trained to take care of them. I might explain normal sounds, like the engines or the landing gear, so they feel less afraid. I would check on them regularly and offer a drink of water. I would never laugh at their fear.",
    tips: [
      "Use calm language, listen first and reassure honestly.",
      "Offer practical support such as a seat check, water or regular visits.",
    ],
    commonMistakes: [
      "Saying \"There is nothing to be afraid of\" without listening first.",
      "Giving too many technical details that may increase anxiety.",
    ],
  },
  {
    id: "safety-bag-in-aisle",
    question: "During boarding, you see a heavy bag that is not stored safely. What do you do?",
    category: "Safety Awareness",
    difficulty: "B1",
    sampleAnswer:
      "I would kindly speak to the passenger and explain that the bag must be stored safely before take-off. I would offer to help put the bag in the overhead locker or under the seat. If the bag is too large or too heavy, I would explain the options politely and follow the airline's rules. I always remember that loose items can be dangerous during turbulence or in an emergency.",
    tips: [
      "Offer help first. A friendly approach works better than an order.",
      "Link your answer to safety: loose items can hurt people.",
    ],
    commonMistakes: [
      "Ignoring the bag because the cabin is busy.",
      "Speaking in a rude or impatient way.",
    ],
  },

  /* -------------------------- Situational Questions ----------------------- */
  {
    id: "situation-late-passenger",
    question: "A passenger is very late and wants to board after the gate has closed. What do you do?",
    category: "Situational Questions",
    difficulty: "B2",
    sampleAnswer:
      "I would remain polite and explain that the boarding procedure is finished. I would not decide this alone, because the decision depends on airline rules and the ground staff. I would contact the right person and help the passenger understand the next options, such as speaking with the ground team about another flight. I would show understanding but stay professional and clear.",
    tips: [
      "Show that you respect procedures and teamwork.",
      "Offer to contact the correct colleague instead of making a promise.",
    ],
    commonMistakes: [
      "Promising the passenger that they can board.",
      "Ignoring the passenger or sounding unkind.",
    ],
  },
  {
    id: "situation-lost-child",
    question: "A parent tells you that their child is missing from their seat. What do you do?",
    category: "Situational Questions",
    difficulty: "B2",
    sampleAnswer:
      "I would stay calm and speak to the parent in a reassuring voice. I would ask for a short description of the child and when they last saw them. Then I would inform the senior crew member immediately so that we can search the cabin as a team. I would check the toilets and the galley and ask nearby passengers if they have seen the child. I would keep the parent informed and as calm as possible.",
    tips: [
      "Prioritize calm, quick communication with the team.",
      "Show that you would keep the parent informed and supported.",
    ],
    commonMistakes: [
      "Searching alone without informing the crew.",
      "Showing panic in front of the parent.",
    ],
  },
  {
    id: "situation-allergy",
    question: "A passenger tells you they have a severe food allergy. How do you handle it?",
    category: "Situational Questions",
    difficulty: "B2",
    sampleAnswer:
      "I would thank the passenger for telling me and ask which food they must avoid. I would check the meal information carefully and not guess. If I could not be sure that a meal was safe, I would say so honestly and offer a safer alternative. I would also tell my colleagues so that everyone is aware. If the passenger felt unwell, I would follow the medical emergency procedures immediately.",
    tips: [
      "Never guess about food ingredients. Safety comes first.",
      "Inform the team and follow procedures.",
    ],
    commonMistakes: [
      "Saying \"It should be fine\" without checking.",
      "Not informing other crew members.",
    ],
  },
  {
    id: "situation-overbooked",
    question: "The flight is full and a family wants to sit together, but their seats are apart. What would you do?",
    category: "Situational Questions",
    difficulty: "B1",
    sampleAnswer:
      "I would politely check the seating plan and see what is possible. Then I would kindly ask other passengers if they would be happy to change seats, and I would thank them for their help. I would not force anyone to move. If it is not possible, I would explain this honestly to the family and try to place the youngest children close to a parent.",
    tips: [
      "Ask politely and thank the passengers who agree to help.",
      "Never force a passenger to move seats.",
    ],
    commonMistakes: [
      "Telling the family there is nothing you can do before trying.",
      "Pressuring other passengers to give up their seats.",
    ],
  },
  {
    id: "situation-rule-vs-request",
    question: "A passenger asks you to break a rule because they are in a hurry. How do you respond?",
    category: "Situational Questions",
    difficulty: "B2",
    sampleAnswer:
      "I would listen carefully and show understanding. Then I would explain politely that I cannot break the rule because it protects everyone's safety. I would say, \"I understand that you are in a hurry, and I'm sorry I can't change this, but here is what I can do for you.\" Then I would offer a helpful alternative if possible. I would stay friendly and firm.",
    tips: [
      "Use \"I understand… but…\" and always follow with a helpful alternative.",
      "Never break a safety or security rule.",
    ],
    commonMistakes: [
      "Saying \"No, that's impossible\" without a polite explanation.",
      "Agreeing to a request because the passenger is insistent.",
    ],
    turkishNote:
      "Önce anlayış gösterin, sonra kuralı nazikçe açıklayın ve bir alternatif sunun.",
  },
];

/** A second common mistake for the two original questions that only had one (their own text is unchanged). */
const EXTRA_MISTAKES: Record<string, string> = {
  "team-why-important": "Using abstract words like “cooperation” without showing how crew really work together.",
  "safety-most-important": "Presenting safety and service as opposites instead of showing how they support each other.",
};

const LEGACY_MERGED: InterviewQuestion[] = LEGACY_QUESTIONS.map((q) => {
  const e = LEGACY_ENRICHMENT[q.id];
  if (!e) throw new Error(`Missing interview enrichment for ${q.id}`);
  const [category, turkish, competency, why, keyPoints, other, vocabulary, phrases, followUps, framework] = e;
  const split = (t: string) => t.split("|").map((x) => x.trim()).filter(Boolean);
  const isB1 = q.difficulty === "B1";
  return {
    id: q.id,
    question: q.question,
    turkish,
    category: category as InterviewQuestion["category"],
    difficulty: q.difficulty,
    competency,
    why,
    keyPoints: split(keyPoints),
    // The original answer keeps its level; the other level was written for the expansion.
    sampleAnswer: isB1 ? q.sampleAnswer : other,
    sampleAnswerB2: isB1 ? other : q.sampleAnswer,
    vocabulary: vocabulary.split(";").map((x) => x.trim()).filter(Boolean),
    phrases: split(phrases),
    tips: q.tips,
    commonMistakes: EXTRA_MISTAKES[q.id] ? [...q.commonMistakes, EXTRA_MISTAKES[q.id]] : q.commonMistakes,
    followUps: split(followUps),
    framework,
    source: "representative",
    ...(q.turkishNote ? { turkishNote: q.turkishNote } : {}),
  };
});

export const INTERVIEW_QUESTIONS: readonly InterviewQuestion[] = [...LEGACY_MERGED, ...interviewBank(INTERVIEW_ROWS)];

export const INTERVIEW_BY_ID: ReadonlyMap<string, InterviewQuestion> = new Map(
  INTERVIEW_QUESTIONS.map((q) => [q.id, q]),
);
