import type { PassageDef } from "./helpers.ts";

/** Reading passages 1-10: B1 and B1+. Passages 11-20 are in reading-b.ts. */
export const READING_PASSAGES_A: PassageDef[] = [
  {
    id: "rd-01",
    title: "A Weekend in Istanbul",
    level: "B1",
    topic: "Travel",
    text: `Last month my friend Selin and I spent a weekend in Istanbul. We flew from Izmir on Friday evening, and the flight was only one hour long. We stayed in a small hotel near the Galata Tower. The room was not big, but it was clean, and the owner gave us a free map and some good advice.

On Saturday we woke up early and had breakfast on the hotel's roof. Then we took a ferry across the Bosphorus. Selin had been to Istanbul before, so she showed me her favourite places. We visited the Grand Bazaar, but it was so crowded that we left after an hour. In the afternoon we found a quiet café with a beautiful view, and we stayed there until sunset.

On Sunday it rained, so we visited a museum instead of walking around the city. The museum was interesting, but the tickets were more expensive than we expected. Before going to the airport, we bought some Turkish delight for our families.

I would like to go back again in spring, when the weather is warmer. Next time, I will book a hotel with a bigger room and travel with fewer bags. I learned that the best way to enjoy a short trip is not to plan too much.`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "A short city trip and what the writer learned from it", ["How to find cheap flights and hotels for a short weekend away", "A comparison of different hotels in the centre of Istanbul", "The history of the main places along the Bosphorus"],
        "The writer describes the weekend day by day and ends with a lesson, so the text is about a short trip and what it taught her."],
      ["specific information", "Why did the friends leave the Grand Bazaar early?",
        "There were too many people.", ["It started to rain.", "They had to catch a ferry.", "Selin had already visited it."],
        "The text says it was \"so crowded\" that they left after an hour. Rain came on Sunday, and Selin's earlier visit is not given as a reason."],
      ["inference", "What can we understand about Selin?",
        "She knew Istanbul better than the writer.", ["She lives in the old part of the city.", "She did not enjoy the weekend at all.", "She booked the hotel by herself."],
        "Selin \"had been to Istanbul before\" and showed the writer her favourite places, which suggests she knew the city better."],
      ["vocabulary in context", "In the text, \"crowded\" is closest in meaning to ...",
        "full of people", ["very old", "very expensive", "very dark"],
        "A \"crowded\" place has too many people in it."],
      ["author's intention", "What does the writer suggest about short trips at the end of the text?",
        "They are better when you don't plan every hour.", ["They are usually too short to be enjoyable.", "They should be planned very carefully in advance.", "They are cheaper than longer holidays."],
        "The final sentence says the best way to enjoy a short trip \"is not to plan too much\"."],
    ],
  },
  {
    id: "rd-02",
    title: "Changing Planes at a Busy Airport",
    level: "B1",
    topic: "Airports",
    text: `Changing planes can be stressful, especially at a large airport. Many passengers worry that they will miss their connecting flight. However, with a little preparation, the experience can be much easier.

First, check how much time you have between flights. If you have less than an hour, you should move quickly. Look at the information screens as soon as you arrive. They show the gate for your next flight, and the gate can change at the last minute. Some big airports have trains or buses between terminals, so ask a member of staff how to get there.

Second, keep your boarding pass and passport in an easy place, such as a front pocket. You may need to show them several times. If your bags were checked in all the way to your final destination, you do not need to collect them. Your airline will move them for you.

Finally, if your first flight is late, do not panic. Tell a flight attendant that you have a connection. Sometimes the crew can contact the ground staff, who may be able to hold the next flight for a few minutes or find you a new one.

Long waits can also be boring. Many airports have free Wi-Fi, comfortable seating areas and even small gardens. Using this time to rest, read or call your family will help you arrive in a good mood.`,
    questions: [
      ["main idea", "What is the main purpose of the text?",
        "To give advice that makes changing flights less stressful", ["To explain why connecting flights are often late in big cities", "To compare the services of large and small airports", "To describe the facilities that are available in modern airports"],
        "The text gives practical advice on checking time, keeping documents ready and dealing with delays, so its purpose is to make changing planes easier."],
      ["specific information", "Why is it a good idea to check the information screens?",
        "The departure gate may be changed.", ["They show which bags are late.", "They list the free Wi-Fi areas.", "They give the weather at your destination."],
        "The text says that the gate \"can change at the last minute\"."],
      ["inference", "What can we understand about bags that are checked in \"all the way to your final destination\"?",
        "Passengers do not have to carry them between flights.", ["They will always arrive earlier than the passengers do.", "They can never be lost during the connection.", "Passengers must show them again at the second airport."],
        "The airline moves them for you, so passengers do not need to collect or carry them during the connection."],
      ["vocabulary in context", "In the phrase \"hold the next flight\", the word \"hold\" means ...",
        "delay its departure", ["carry it", "own it", "cancel it"],
        "To \"hold\" a flight means to make it wait before leaving, so passengers can still board."],
      ["logical conclusion", "What would be the best advice for a passenger whose first flight is running late?",
        "Tell the crew about the connection before landing.", ["Collect the bags and buy a new ticket immediately.", "Wait until the next flight has already left.", "Run to the gate without checking the information screens."],
        "The text advises telling a flight attendant, because the crew may contact the ground staff to help with the connection."],
    ],
  },
  {
    id: "rd-03",
    title: "Early Shifts",
    level: "B1",
    topic: "Daily life",
    text: `Leyla started her new job at a hotel in March. Before that, she worked in a bookshop, where she started at ten o'clock and finished at six. Now she starts at six in the morning, so she has to get up at four-thirty. "The first week was terrible," she says. "I was always tired, and I fell asleep on the bus twice."

Leyla decided to change her routine. She now goes to bed at nine o'clock, even at weekends. She stopped drinking coffee after lunch because it kept her awake. She also prepares her clothes and her lunch the night before, so that the morning is calm. On her days off she still gets up fairly early, which helps her body keep a regular pattern.

After two months, Leyla feels much better. She enjoys the quiet hours at the hotel, when only a few guests are awake and the sun is rising. She also finishes at two o'clock, so she has the afternoon free. She is learning to paint, and she meets her friends for a late lunch twice a week.

"I thought I would never get used to it," Leyla says. "But now I don't want to go back to a normal schedule. The early start has changed my life in a positive way."`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "How a woman adapted to a new working schedule", ["Why hotels are better employers than bookshops", "How to stop drinking coffee", "A hotel that opens very early"],
        "The text follows Leyla from a difficult first week to a routine that she is happy with."],
      ["specific information", "Why did Leyla stop drinking coffee in the afternoon?",
        "It made it hard for her to sleep.", ["It made her feel hungry.", "She wanted to save money.", "A doctor told her to stop."],
        "The text says that coffee after lunch \"kept her awake\", which made it hard to go to bed early."],
      ["inference", "What can we understand about Leyla's first week at the hotel?",
        "She was not prepared for such an early start.", ["She enjoyed the early mornings from the beginning.", "She was happy about finishing at two o'clock.", "She had already worked early shifts before."],
        "She was always tired and even fell asleep on the bus, so she was clearly not ready for the new timetable."],
      ["vocabulary in context", "In the text, \"get used to\" means ...",
        "become familiar with", ["start using", "begin to like", "try for the first time"],
        "\"Get used to\" something means to find it normal after some time."],
      ["logical conclusion", "How does Leyla feel about her job now?",
        "She is satisfied and would not like to change.", ["She is still tired and wants to find a new job.", "She would like to return to work at the bookshop.", "She finds her new routine rather boring."],
        "She says that she doesn't want to go back to a normal schedule and that the early start has changed her life positively."],
    ],
  },
  {
    id: "rd-04",
    title: "The Lost Keys",
    level: "B1",
    topic: "Customer service",
    text: `Omer works at the front desk of a hotel in Antalya. One evening, a guest named Mrs Brown came to the desk looking very worried. "I can't find my room key," she said. "And I think I left my handbag in a taxi."

Omer stayed calm and spoke in a friendly voice. First he gave Mrs Brown a chair and a glass of water. Then he made her a new key, after checking her passport. "Don't worry," he said. "Let's try to find your bag together." He asked her which taxi company she had used and what time she had arrived. Mrs Brown remembered that the taxi was white and that the driver wore a green cap.

Omer called three taxi companies. On the third call, the manager told him that a driver had found a handbag on the back seat. Omer asked them to bring it to the hotel at once. Thirty minutes later, the driver arrived, and Mrs Brown had her bag again. Nothing was missing.

Mrs Brown was so grateful that she wrote a long message in the hotel's guest book. She said that Omer's kindness had made her stay unforgettable. The next morning, the hotel manager thanked Omer in front of the whole team. Omer smiled and said, "I only did what I would like someone to do for me."`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "A receptionist who helps a guest solve a problem", ["A guest who complains about the service in a hotel", "A hotel manager who finds a guest's lost handbag", "A taxi driver who returns something to its owner"],
        "The story shows how Omer helps Mrs Brown with her key and her handbag."],
      ["specific information", "How did Omer find the handbag?",
        "He phoned several taxi companies.", ["He asked the driver to come back to the hotel.", "He searched the streets near the hotel.", "He asked the hotel manager for help."],
        "Omer called three taxi companies, and the third one had the bag. The driver brought it to the hotel only after Omer's calls."],
      ["inference", "Why did Omer first give Mrs Brown a chair and a glass of water?",
        "To help her feel calmer", ["To make her wait for the new key", "Because she was ill", "Because hotel rules say so"],
        "Mrs Brown was worried, so he made her comfortable before solving the problem."],
      ["vocabulary in context", "In the text, \"grateful\" is closest in meaning to ...",
        "thankful", ["worried", "surprised", "polite"],
        "A \"grateful\" person feels thanks for what someone has done."],
      ["author's intention", "Why does the writer end with Omer's last sentence?",
        "To show that he treats helping guests as natural", ["To suggest that he was hoping for a reward", "To show that he felt embarrassed by the praise", "To explain why managers thank their employees"],
        "Omer says he only did what he would like someone to do for him. This shows that helping is natural to him."],
    ],
  },
  {
    id: "rd-05",
    title: "Self-Service Check-In",
    level: "B1",
    topic: "Technology",
    text: `In many airports today, passengers can check in without speaking to anyone. They use a machine, or they do it on their phone before they leave home. This is called self-service check-in, and it has become very popular during the last ten years.

There are several advantages. First, it saves time. Queues at the desks are usually shorter, because only passengers with special questions need help from staff. Second, you can choose your seat yourself. If you like sitting by the window, you can see which seats are free and pick one in a few seconds. Third, airlines save money, so tickets can sometimes be cheaper.

However, self-service has some disadvantages too. Older passengers, or people who are not confident with technology, may find the machines difficult to use. Sometimes the machines break down, or the Wi-Fi does not work, and then the queues get longer than before. In addition, a machine cannot answer unusual questions. It cannot tell a worried traveller what to do if the passport has expired.

For this reason, most airports keep a few desks open with friendly staff. Airlines have also started to put employees near the machines to help people who are confused. Technology can make travel faster, but it works best when it is combined with human help.`,
    questions: [
      ["main idea", "What is the main idea of the text?",
        "Self-service check-in is useful but still needs human support.", ["Machines will soon replace all the staff in airports.", "Check-in is faster at small airports than at large ones.", "Tickets are always cheaper when passengers use self-service."],
        "The text describes both advantages and problems and concludes that technology works best with human help."],
      ["specific information", "Which advantage for passengers is mentioned in the text?",
        "They can pick their own seat quickly.", ["They can avoid showing their passport.", "They can carry more baggage.", "They can board earlier."],
        "The text says passengers can see which seats are free and choose one in a few seconds."],
      ["inference", "What can we understand about the desks that still have staff?",
        "They are still needed for problems that machines cannot solve.", ["They are usually empty because few people need them.", "They are cheaper for airlines than machines would be.", "They only serve passengers who are older than sixty."],
        "A machine cannot answer unusual questions, so airports keep some desks open."],
      ["vocabulary in context", "In the text, \"confident with technology\" means ...",
        "comfortable using it", ["worried about it", "angry with it", "famous for it"],
        "A person who is \"confident with\" technology feels sure and relaxed when using it."],
      ["logical conclusion", "Which statement would the writer most probably agree with?",
        "Airlines should offer both machines and personal help.", ["Airlines should close all of their check-in desks.", "Passengers should avoid using technology at airports.", "Older people should not travel on their own."],
        "The last sentence says that technology works best when it is combined with human help."],
    ],
  },
  {
    id: "rd-06",
    title: "The Crew Briefing",
    level: "B1+",
    topic: "Teamwork",
    text: `Before every flight, the cabin crew meet for a short briefing. It usually lasts about fifteen minutes, and it is the first time that the team members, who may never have worked together before, talk to each other. The senior cabin crew member introduces everyone, explains the details of the flight and checks that each person knows their position and responsibilities.

During the briefing, the crew discuss practical matters, such as how many passengers are travelling, whether anybody needs special assistance and what the weather will be like. They also review safety information. The leader often asks quick questions, for example, "Where is the nearest first-aid kit?", to make sure that everyone remembers important details. Nobody is embarrassed if they have to think for a moment; the aim is to learn, not to test.

Experienced crew members say that the atmosphere of the briefing often affects the whole flight. When the leader smiles, asks for ideas and thanks people for their contributions, the crew tend to work more closely together. On the other hand, if the briefing is rushed or unfriendly, small misunderstandings are more likely to happen later, for instance when two colleagues both think the other will serve the drinks.

Many airlines now train senior crew in communication as well as technical knowledge. Instead of simply giving orders, they learn to listen and to encourage people to speak up if they have a worry. As one leader explained, "A briefing is not a speech. It is the moment when a group of individuals starts to become a team."`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "A good briefing helps colleagues who are new to each other to work as a team.", ["Briefings are mainly a test of the crew's safety knowledge.", "Senior crew members must always give clear orders to the team.", "Cabin crew usually work with exactly the same people every day."],
        "The passage stresses the social side of the briefing: introductions, atmosphere and communication."],
      ["specific information", "Why does the leader ask quick questions?",
        "To check that important details are remembered", ["To find out which crew member is the most experienced", "To make new employees feel embarrassed in front of others", "To test what the passengers on the flight need"],
        "The text says the questions make sure that everyone remembers important details. The aim is to learn, not to test or embarrass."],
      ["inference", "What does the example about the drinks suggest?",
        "Unclear communication can cause tasks to be missed or repeated.", ["Crew members dislike serving drinks to passengers.", "Briefings should always last longer than fifteen minutes.", "Each crew member should try to do all of the work."],
        "If two colleagues each think the other will serve the drinks, the task might not be done, or it might be done twice."],
      ["vocabulary in context", "In the text, a \"rushed\" briefing is one that is ...",
        "done too quickly", ["extremely long", "carefully planned", "very formal"],
        "\"Rushed\" describes something done with too little time or care."],
      ["author's intention", "Why does the writer end with the leader's quotation?",
        "To summarise the main message in a memorable way", ["To criticise the way that briefings are run", "To show that leaders give long speeches", "To introduce a completely different topic"],
        "The quotation states in one sentence the idea of the whole passage: a briefing helps individuals become a team."],
    ],
  },
  {
    id: "rd-07",
    title: "When the Storm Closed the Airport",
    level: "B1+",
    topic: "Flight disruption",
    text: `At 3 p.m. on Tuesday, a severe snowstorm forced Northfield Airport to close all runways. Within an hour, the departure hall was full of tired, worried passengers. More than two hundred flights were cancelled, and thousands of people were suddenly stuck.

The airport's team responded quickly. Staff handed out blankets and bottles of water, and volunteers from a local charity brought sandwiches and hot drinks. The information desk opened an extra phone line, and employees walked through the crowds to answer questions before frustration grew. "People can accept bad news," said Karen, a supervisor. "What they can't accept is silence."

Some passengers were less patient. A man shouted at a young employee because his connecting flight had left without him. Another woman complained that the airline had given her no hotel room. Staff explained that hotels in the area were full and that, in extreme weather, airlines are not always required to pay for accommodation. They offered everyone a place in a temporary rest area and gave updates every thirty minutes.

By midnight, the snow had stopped, and the runways were cleared. The first flights left at six the next morning. Many travellers were still exhausted, but several said that they were surprised by how well they had been treated. "I had expected chaos," one passenger admitted. "Instead, everyone was kind, and I always knew what was happening."`,
    questions: [
      ["main idea", "What does the passage mainly describe?",
        "How an airport team handled a difficult situation", ["Why snow causes flights to be cancelled", "The legal rights of passengers in storms", "A complaint made by an angry passenger"],
        "Most of the text describes how staff and volunteers looked after passengers during the closure."],
      ["specific information", "Why could the woman not get a hotel room?",
        "The hotels nearby were full.", ["The information desk was closed.", "She did not have a valid ticket.", "The staff were too tired to book it."],
        "Staff explained that hotels in the area were full."],
      ["inference", "What does Karen mean by \"What they can't accept is silence\"?",
        "Passengers need regular information, even when it is bad.", ["Passengers dislike airports that are too quiet.", "Staff should chat about other things to pass the time.", "Passengers prefer to be left alone until news arrives."],
        "Karen says people can accept bad news, so what upsets them is not knowing what is happening."],
      ["vocabulary in context", "In the first paragraph, \"stuck\" means ...",
        "unable to leave", ["very angry", "lost", "hungry"],
        "The passengers were \"stuck\" because the flights were cancelled and they could not travel."],
      ["logical conclusion", "What conclusion can we draw from the passenger's last comment?",
        "Clear communication can improve how people experience a bad situation.", ["Most passengers expect airports to be chaotic in storms.", "Passengers actually prefer to travel when there is snow.", "Airports should close more often to protect passengers."],
        "The passenger expected chaos but felt well treated because staff were kind and kept everyone informed."],
    ],
  },
  {
    id: "rd-08",
    title: "Learning English at Work",
    level: "B1+",
    topic: "Education",
    text: `At a regional airport in Turkey, the ground staff now attend free English classes twice a week. The airline started the programme after several passengers said that employees were friendly but difficult to understand. "We realised that kindness is not enough if people cannot communicate," said the training manager, Deniz.

The lessons are different from school lessons. Instead of studying long lists of grammar rules, the staff practise real conversations. In one class, a teacher plays an angry customer whose luggage is missing, and the employees take turns to respond. Afterwards, the group discusses which phrases sounded polite and which sounded too direct. They also learn short sentences that they can use immediately, such as "Let me check that for you" or "I'm afraid there's a delay."

At first, some employees were nervous, because they thought their English was not good enough. But the teachers encourage them to make mistakes. "If you only speak when you are sure everything is correct, you will never speak," one of them tells the class. After three months, a survey showed that 80 per cent of the staff felt more confident, and the number of complaints about communication fell by almost a third.

Selin, who works at the check-in desk, says that her life has changed. "Before, when a foreign passenger spoke fast, I wanted to hide. Now I ask politely if they can repeat it, and I explain things step by step. I even understand jokes!"`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "A programme that helps airport staff communicate better", ["A school for children who want to become pilots", "The most common causes of luggage problems", "Why English is such a difficult language to learn"],
        "The text describes the classes, their methods and their results for airport staff."],
      ["specific information", "What happened after three months?",
        "Fewer passengers complained about communication.", ["Every member of staff passed an English exam.", "The airline opened a new language school.", "The lessons became more expensive for staff."],
        "Complaints about communication fell by almost a third."],
      ["inference", "Why do the teachers encourage staff to make mistakes?",
        "They believe that fear of errors stops people from speaking.", ["They think that grammar is not important at all.", "They want to make the lessons easier for everyone.", "They enjoy correcting the mistakes of the staff."],
        "The teacher says that people who wait until everything is correct will never speak, so mistakes are part of learning."],
      ["vocabulary in context", "In the text, a phrase that sounds \"too direct\" is ...",
        "blunt", ["slow", "formal", "friendly"],
        "A \"direct\" phrase that is \"too direct\" sounds impolite because it says things without softening them."],
      ["author's intention", "Why does the writer include Selin's comment?",
        "To give a personal example of the programme's benefits", ["To prove that jokes are easy to understand", "To suggest that working at check-in is difficult", "To criticise passengers who speak very fast"],
        "Selin shows how her confidence and daily work have changed after the classes."],
    ],
  },
  {
    id: "rd-09",
    title: "Balloons over Cappadocia",
    level: "B1+",
    topic: "Tourism",
    text: `Every morning before sunrise, hundreds of hot-air balloons rise over the valleys of Cappadocia in central Turkey. The sight of the colourful balloons floating above the strange rock formations has become one of the most photographed scenes in the world, and it attracts visitors from every continent.

Tourism has brought many benefits to the region. Local families who once depended only on farming now run small hotels, cafés and souvenir shops. Young people who might have moved to big cities can find jobs close to home. In the village of Göreme, the number of guesthouses has grown from fewer than ten to more than two hundred in twenty years.

However, the rapid growth has also created problems. In the high season, the roads are crowded, and old stone houses are sometimes replaced by modern hotels that do not match the area. Some residents complain that prices have risen so much that they can no longer afford to live in their own villages. There are also worries about safety, and the authorities have introduced stricter rules for balloon pilots and cancelled flights when the wind is strong.

Many local leaders now say that the future depends on balance. They want to protect the landscape and traditional buildings, limit the number of new hotels and encourage visitors to stay longer rather than just come for the balloons. "Tourists are welcome," says one guesthouse owner, "but we don't want to become a theme park."`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "Tourism has helped Cappadocia but has also caused difficulties.", ["Balloon flights are too dangerous for most tourists.", "Farming is more profitable for families than tourism.", "Göreme is the largest tourist town in the whole country."],
        "The text first lists the benefits of tourism and then the problems, ending with the need for balance."],
      ["specific information", "How has tourism helped young people in the region?",
        "It has given them work close to home.", ["It has helped them move to cities.", "It has made farming easier.", "It has provided free education."],
        "Young people who might have left can now find jobs near their homes."],
      ["inference", "What can we understand from the guesthouse owner's comment?",
        "He is worried that the region could lose its character.", ["He wants fewer tourists to visit the village.", "He would like to open a new theme park.", "He thinks that the balloons are not safe."],
        "He says that tourists are welcome but that he does not want the area to become a theme park, which suggests a fear of losing its identity."],
      ["vocabulary in context", "In the text, \"rapid\" means ...",
        "very fast", ["unexpected", "limited", "careful"],
        "\"Rapid growth\" is growth that happens very quickly."],
      ["logical conclusion", "What does the passage suggest about the region's future?",
        "It may depend on managing tourism more carefully.", ["Tourism will end soon.", "No new hotels will be allowed anywhere.", "The balloons will be replaced by other attractions."],
        "Local leaders say that the future depends on balance, such as limiting new hotels and protecting traditional buildings."],
    ],
  },
  {
    id: "rd-10",
    title: "Why Tone Matters in Emails",
    level: "B1+",
    topic: "Communication",
    text: `Imagine that you receive an email from your manager that says only: "Come and see me." Your heart might beat a little faster. Is she angry? Have you made a mistake? In fact, she may simply want to give you some good news, but without a friendly tone, the short message creates worry.

Written communication has no voice, facial expression or gestures, so readers often fill the gaps with their own feelings. Studies show that people tend to read neutral emails as more negative than the writer intended. This is why it is so important to choose words carefully.

There are a few simple habits that help. First, begin with a greeting and end with a polite closing, such as "Best wishes" or "Thank you for your help." Second, use "please" and "thank you", but do not overdo them. Third, give a reason when you ask for something: "Could you send me the report by Friday? I need it for the meeting on Monday" sounds more reasonable than "Send the report by Friday." Finally, avoid writing in capital letters, which many people read as shouting.

Of course, if a subject is sensitive, such as a complaint or a disagreement, an email may not be the best choice. A short phone call or a face-to-face talk allows you to explain your feelings and to hear the other person's reaction at once. The best communicators know not only how to write a good email but also when not to write one.`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "The words and tone you choose can prevent misunderstandings in emails.", ["Managers should never send very short emails to staff.", "Emails are always a worse choice than phone calls.", "People should write longer emails in order to be polite."],
        "The text explains that readers fill gaps with their own feelings, so tone and word choice are important."],
      ["specific information", "Why does the writer recommend giving a reason in a request?",
        "It makes the request seem more reasonable.", ["It makes the email longer.", "It stops the reader from replying.", "It is required by company rules."],
        "The example with the Monday meeting \"sounds more reasonable\" than a bare order."],
      ["inference", "What does the writer suggest about readers of neutral emails?",
        "They often imagine a more negative tone than the writer meant.", ["They usually ignore emails that sound neutral.", "They prefer to receive very short messages.", "They tend to reply to neutral emails more slowly."],
        "Studies show that people tend to read neutral emails as more negative than intended."],
      ["vocabulary in context", "In the text, \"overdo\" means ...",
        "do too much", ["do again", "do badly", "do slowly"],
        "To \"overdo\" something is to use or do more of it than is necessary."],
      ["logical conclusion", "In which situation would the writer probably advise NOT sending an email?",
        "When you want to discuss a disagreement", ["When you need to share a schedule", "When you want to say thank you", "When you ask for a report"],
        "The text says that sensitive subjects, such as complaints and disagreements, are better discussed by phone or face to face."],
    ],
  },
];
