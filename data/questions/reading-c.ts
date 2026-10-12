import type { PassageDef } from "./helpers.ts";

/** Reading passages 21-30: adds reference, tone and cause-and-effect questions across B1 to B2+. */
export const READING_PASSAGES_C: PassageDef[] = [
  {
    id: "rd-21",
    title: "A New Flight Attendant's First Week",
    level: "B1",
    topic: "Cabin crew life",
    text: `Elif is twenty-four years old, and last Monday she started her first job as a flight attendant. Before the first flight, she was very nervous. She had passed all her exams during training, but she was afraid that she would forget something important.

On the first morning, the senior crew member, Mr Aydın, met her in the briefing room. He was friendly and told her not to worry. "Everybody feels like this on the first day," he said. "Just ask questions when you are not sure." During the briefing, the crew checked the safety equipment, talked about the passengers on the flight and shared the tasks. Elif was responsible for the back of the cabin.

The flight was full, and a baby started to cry just after take-off. Elif stayed calm, smiled at the mother and brought her a glass of water. Later, an older man could not find his seat. She walked with him to row 28 and put his bag in the overhead locker. By the end of the flight she was tired but happy.

After four days, Elif felt much more confident. She learned that the job is not only about serving drinks. "We are here mainly for safety," she says, "but small acts of kindness make passengers feel comfortable." Her advice for new colleagues is simple: listen carefully, be polite and never be afraid to ask for help.`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "Elif's first days in a new job and what she learned", ["How to pass the exams for cabin crew training", "Why babies often cry during take-off", "The daily duties of a senior crew member"],
        "The text follows Elif through her first week and ends with what she learned."],
      ["specific information", "What did Elif do when the baby started to cry?",
        "She stayed calm and brought the mother some water.", ["She asked a colleague to take over the task.", "She gave the baby a small toy to play with.", "She called the senior crew member for help."],
        "The text says: \"Elif stayed calm, smiled at the mother and brought her a glass of water.\""],
      ["reference", "In the third paragraph, \"She walked with him to row 28\". Who is \"him\"?",
        "the older man", ["Mr Aydın", "the baby's father", "a crew member"],
        "The sentence before says that an older man could not find his seat, so Elif walked with him."],
      ["vocabulary in context", "In the first paragraph, \"nervous\" means ...",
        "worried and a little afraid", ["very tired", "angry with other people", "happy and relaxed"],
        "Elif was afraid that she would forget something, so she felt worried and uneasy."],
      ["logical conclusion", "What can we conclude about Elif at the end of her first week?",
        "She felt more comfortable in her new job.", ["She decided to change her job.", "She no longer needed any help at work.", "She wanted to work only in the briefing room."],
        "The text says that she felt \"much more confident\" after four days, but she still recommends asking for help."],
    ],
  },
  {
    id: "rd-22",
    title: "Choosing a Hotel Online",
    level: "B1",
    topic: "Travel",
    text: `Booking a hotel online is easy, but choosing the right one can be difficult. There are thousands of hotels on every website, and each one has beautiful photos. So how can you decide?

First, look at the location. A cheap hotel outside the city may seem like a good deal, but you may spend a lot of money and time on taxis or buses. If you want to visit museums and restaurants, it is usually better to stay near the centre.

Second, read the reviews, but read them carefully. A hotel with a score of 9.5 from only ten guests may be less reliable than one with a score of 8.7 from two thousand guests. It is also a good idea to read some of the bad reviews. If the complaints are about small things, such as slow wi-fi, the hotel may still be fine. If many guests mention dirty rooms, you should look somewhere else.

Third, check what is included in the price. Some hotels offer free breakfast and free cancellation, while others charge extra for everything. A room that looks cheaper at first can become more expensive in the end.

Finally, remember that the photos on the website are chosen by the hotel. Look for pictures from real guests. They often show the true size of the room and the view from the window.`,
    questions: [
      ["main idea", "What is the main purpose of the text?",
        "To give advice on choosing a hotel", ["To compare two hotel booking websites", "To describe a hotel in the city centre", "To explain how to get a refund"],
        "The text gives a series of tips (location, reviews, price, photos) for choosing a hotel."],
      ["cause and effect", "Why can a cheap hotel outside the city become expensive?",
        "Travelling to the centre can cost a lot of money.", ["The rooms there have hidden fees at the door.", "Breakfast is never included in the price.", "Hotels outside cities have no reviews."],
        "The text says that you may spend a lot of money and time on taxis or buses."],
      ["inference", "Why does the writer say a score of 9.5 from ten guests may be less reliable?",
        "Very few people gave their opinion.", ["Scores above 9 are always false.", "Only hotel managers write the reviews.", "The score does not include the price."],
        "A high score from a small number of guests gives less information than a good score from many guests."],
      ["vocabulary in context", "In the third paragraph, \"reliable\" means ...",
        "possible to trust", ["cheap to book", "popular with tourists", "easy to find"],
        "A reliable score is one that you can trust."],
      ["author's intention", "Why does the writer mention photos from real guests?",
        "To suggest a way of seeing what a room is really like", ["To tell readers never to use the hotel's website", "To explain how to take better holiday photos", "To show that hotels want guests to complain"],
        "Photos from guests are not chosen by the hotel, so they often show the room more honestly."],
    ],
  },
  {
    id: "rd-23",
    title: "Jet Lag: Why Your Body Feels Confused",
    level: "B1+",
    topic: "Health and travel",
    text: `Anyone who has flown across several time zones knows the feeling: it is midday at your destination, but your body is begging for sleep. This is jet lag, and it affects millions of travellers every year.

Jet lag happens because our bodies have an internal clock, often called the circadian rhythm. It tells us when to feel sleepy, when to feel hungry and when to wake up. Light is the most important signal for this clock. When we fly quickly to a place where the sun rises and sets at different times, the internal clock is still working on home time. It can take several days for the body to adjust.

Flying east is usually harder than flying west. Travelling east means that we have to go to sleep earlier than our body expects, and most people find it harder to fall asleep early than to stay awake late. Symptoms include tiredness, headaches, difficulty concentrating and stomach problems.

There is no perfect cure, but several habits can help. Experts suggest drinking plenty of water, avoiding heavy meals and alcohol on the plane, and spending time in daylight after arrival. Some travellers start changing their sleeping hours a few days before the trip. A short nap can also help, but a long sleep in the afternoon may make things worse.

For airline crew, who often cross time zones several times a month, jet lag is part of the job. Many of them plan their rest carefully and treat sleep as a professional responsibility.`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "What causes jet lag and how travellers can reduce it", ["Why flying is harmful to the human body", "How airlines plan their flight times", "The best places to travel by plane"],
        "The text explains the cause of jet lag, its symptoms and some ways to reduce it."],
      ["cause and effect", "According to the text, what causes jet lag?",
        "The body's internal clock does not match the new time zone.", ["The air in the aircraft cabin is very dry.", "Passengers eat too much food on the plane.", "The aircraft flies at a very high altitude."],
        "Jet lag happens because the internal clock is still working on home time."],
      ["specific information", "Why is flying east usually harder than flying west?",
        "It is harder to sleep earlier than usual than to stay up later.", ["The flights to the east are always longer.", "There is less daylight in the east.", "Passengers cannot sleep on east-bound flights."],
        "The text says that most people find it harder to fall asleep early than to stay awake late."],
      ["reference", "In the second paragraph, \"It tells us when to feel sleepy\". What does \"It\" refer to?",
        "the internal clock", ["the sunlight", "the time zone", "the destination"],
        "The previous sentence introduces the internal clock, which tells us when to sleep, eat and wake."],
      ["inference", "What can we infer about airline crew from the last paragraph?",
        "They must manage their sleep carefully because they change time zones often.", ["They are never affected by jet lag.", "They prefer flying east to flying west.", "They sleep for a long time every afternoon."],
        "The text says crew often cross time zones and treat sleep as a professional responsibility."],
    ],
  },
  {
    id: "rd-24",
    title: "Working in Another Country",
    level: "B1+",
    topic: "Cultural differences",
    text: `Moving abroad for work is an exciting idea for many young people, but the reality can be more complicated than expected. Selin moved to Dubai two years ago to work as a customer service agent. "In the first month I loved everything: the weather, the city, the food," she says. "Then the difficult part started."

Her first problem was language. Although her English was good, her colleagues came from more than twenty countries and spoke with different accents. At first she found it hard to understand them on the phone. She solved this by listening to recordings and asking people to repeat things without feeling embarrassed.

The second problem was cultural. In her office, people greeted each other differently and had different ideas about time and personal space. "One colleague told me that being exactly on time was less important than being polite," Selin explains. "In my country, being late is a serious problem, so I was surprised." Over time she learned to ask questions instead of judging.

The third problem was loneliness. She missed her family and friends, and weekends felt very long. Joining a language club and a volunteering group helped her to meet people with similar interests.

Today Selin says that the experience has changed her. She is more patient, more flexible and more confident when she meets people from different backgrounds. "I would not say it was easy," she says, "but I would do it again."`,
    questions: [
      ["main idea", "What is the best title for the passage?",
        "Selin's challenges and growth in a new country", ["The best cities for foreign workers", "How to learn English in Dubai", "Why customer service jobs are difficult"],
        "The text describes the problems Selin met abroad and how she changed."],
      ["specific information", "How did Selin improve her understanding of different accents?",
        "She listened to recordings and asked people to repeat.", ["She took an English course in the evenings.", "She asked her manager to change her team.", "She wrote down everything her colleagues said."],
        "The text says: \"listening to recordings and asking people to repeat things\"."],
      ["cause and effect", "Why was Selin surprised by her colleague's comment about time?",
        "In her own country, being late is considered a serious problem.", ["She had never spoken to him before.", "Her office started work very early.", "She thought politeness was not important."],
        "Selin explains that being late is a serious problem in her country."],
      ["vocabulary in context", "In the last paragraph, \"flexible\" means ...",
        "willing to change and adapt", ["afraid of new situations", "always on time", "very quiet in groups"],
        "A flexible person can adapt to different people and situations."],
      ["tone and attitude", "How does Selin feel about her experience now?",
        "Positive, although she admits it was difficult", ["Disappointed because she felt lonely", "Proud because everything was easy", "Uninterested and unwilling to talk about it"],
        "She says she would do it again, but she also says that it was not easy."],
    ],
  },
  {
    id: "rd-25",
    title: "The Language of Safety Announcements",
    level: "B1+",
    topic: "Aviation communication",
    text: `Next time you fly, listen carefully to the safety announcement. The words are simple, the sentences are short and the instructions are always given in the same order. This is not an accident. Airlines and safety authorities spend a lot of time making sure that the message is clear to people of many nationalities and ages.

One important feature is the use of direct instructions. Crew say "Fasten your seat belt" or "Place the mask over your nose and mouth" rather than "You might want to think about fastening your seat belt." In an emergency, there is no time to work out what polite but vague language means. Direct does not mean rude, however. Crew often add "please" and use a calm, friendly voice.

Another feature is repetition. Important points are said more than once, and they are supported by demonstrations and cards in the seat pocket. Many people do not listen because they have heard the announcement many times, so some airlines now use humour, music or short films to attract attention. The information is still the same, but a funny video may be remembered better than a routine speech.

Finally, crew are trained to speak slowly and clearly, and to avoid difficult words. For people in this job, a good command of simple, precise English matters more than a large vocabulary.`,
    questions: [
      ["main idea", "What is the passage mainly about?",
        "How and why safety announcements are made clear and easy to follow", ["Why passengers should never ignore the crew", "How airlines make their films funny", "The history of safety rules in aviation"],
        "The text describes the features of announcements (direct language, repetition, clear speech) and the reasons for them."],
      ["specific information", "Why do crew use direct instructions such as \"Fasten your seat belt\"?",
        "Vague language may not be understood quickly in an emergency.", ["Polite language is not allowed in announcements.", "Passengers prefer short speeches.", "Direct sentences are easier to translate."],
        "The text says that in an emergency there is no time to work out what vague language means."],
      ["reference", "In the first paragraph, \"This is not an accident\". What does \"This\" refer to?",
        "the simple, clear style of the announcements", ["the time that passengers spend listening", "the number of nationalities on a flight", "the training of the cabin crew"],
        "The previous sentences describe simple words, short sentences and a fixed order."],
      ["vocabulary in context", "In the second paragraph, \"vague\" means ...",
        "not clear or exact", ["very polite", "too loud", "easy to remember"],
        "\"You might want to think about fastening...\" is vague because it does not clearly say what to do."],
      ["cause and effect", "Why have some airlines started to use humour or short films?",
        "Passengers often stop listening to routine announcements.", ["Safety rules have become less important.", "The crew do not like speaking in front of passengers.", "Films are cheaper than seat-pocket cards."],
        "The text says that many people do not listen because they have heard the announcement many times."],
    ],
  },
  {
    id: "rd-26",
    title: "Overtourism: When Visitors Become a Problem",
    level: "B2",
    topic: "Tourism",
    text: `Tourism brings money, jobs and cultural exchange, and for many cities it is a vital source of income. Yet in recent years, residents of several popular destinations have begun to complain that there are simply too many visitors. The word for this problem is overtourism.

The symptoms are easy to recognise. Narrow streets are crowded from morning to night, rents rise because apartments are turned into holiday rentals, and local shops give way to souvenir stands. For residents, ordinary activities such as taking a bus or shopping for food can become frustrating. In some places, local people have organised protests against the pressure of mass tourism.

City authorities have tried a range of solutions. Some charge day visitors an entry fee, others limit the number of people who can enter famous sites at the same time, and several have restricted short-term holiday rentals. Supporters argue that such rules protect residents and the places that tourists come to see. Critics worry that they may make travel more expensive and available only to wealthy visitors.

Many experts believe that the answer is not to stop tourism but to manage it better. Encouraging visitors to travel outside the busiest months, to explore lesser-known neighbourhoods and to stay longer instead of making quick trips can spread the benefits more fairly. Travellers can also help by choosing local guides, restaurants and family-run hotels.

In the end, overtourism is a reminder that a destination is not only a product to be consumed; it is also somebody's home.`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "Tourism needs to be managed so that it does not harm local communities.", ["Tourism should be stopped in the most popular cities.", "Visitors cause more problems than benefits everywhere.", "Local people prefer tourists to stay for short periods."],
        "The text describes the problem, the solutions and the view that tourism should be managed, not stopped."],
      ["specific information", "Which measure to control visitor numbers is mentioned in the text?",
        "Limiting how many people can enter famous sites at one time", ["Closing all hotels outside the city centre", "Asking residents to leave during summer", "Banning all foreign tourists from city centres"],
        "The third paragraph mentions limiting the number of people who can enter famous sites at the same time."],
      ["vocabulary in context", "In the third paragraph, \"restricted\" is closest in meaning to ...",
        "limited", ["advertised", "encouraged", "improved"],
        "To restrict something is to limit it by rules."],
      ["tone and attitude", "What is the writer's attitude to the topic?",
        "Balanced: the writer sees both the benefits and the problems.", ["Strongly against all forms of tourism", "Enthusiastic about every measure described", "Indifferent to the opinion of residents"],
        "The writer presents advantages, problems and arguments from both supporters and critics."],
      ["author's intention", "Why does the writer end with \"it is also somebody's home\"?",
        "To remind readers that destinations have real residents", ["To suggest that tourists should buy local homes", "To criticise the cost of holiday rentals", "To advertise family-run hotels"],
        "The final sentence reminds readers that a place is not only an attraction; people live there."],
    ],
  },
  {
    id: "rd-27",
    title: "Hearing What We Don't Want to Hear",
    level: "B2",
    topic: "Professional skills",
    text: `Few things are as uncomfortable as being told that we could have done something better. Feedback, in theory, is a gift: it shows us blind spots and helps us improve. In practice, many people react to it with defensiveness, sadness or even anger. Understanding why can make us better at both giving and receiving it.

Psychologists explain that criticism feels like a threat to our self-image. When a manager says that a report was confusing, the brain does not simply register information about the report; it may interpret the comment as a judgement about our competence. The natural response is to protect ourselves by explaining, blaming circumstances or dismissing the comment.

Those who handle feedback well tend to share some habits. First, they pause before replying. A few seconds of silence is enough to avoid an emotional answer that they may regret. Second, they ask clarifying questions, such as "Could you give me an example?" This turns a vague criticism into something concrete and shows that they are taking it seriously. Third, they separate the message from the messenger: even if the feedback is delivered clumsily, it may contain something useful.

Managers have responsibilities too. Effective feedback is specific, timely and focused on behaviour rather than character. Saying "You never listen" is likely to cause an argument, whereas "In today's meeting you interrupted two colleagues" gives the person something they can change. It is also helpful to mention what went well, not as a way of softening the blow, but because people need to know which behaviour to continue.

Feedback will probably never be comfortable. But with practice, it can become one of the most valuable tools for professional growth.`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "Feedback is uncomfortable, but people can learn to give and receive it well.", ["Managers should avoid giving negative feedback.", "Most criticism is unfair and should be ignored.", "Feedback only works when it is given in writing."],
        "The text explains why feedback is difficult and offers habits for both receivers and givers."],
      ["cause and effect", "According to the text, why do people often react badly to criticism?",
        "They feel it is an attack on their image of themselves.", ["They do not understand the language of managers.", "They receive feedback too often.", "They think feedback is a waste of time."],
        "Criticism feels like a threat to self-image, so people protect themselves."],
      ["reference", "In the third paragraph, \"This turns a vague criticism into something concrete\". What does \"This\" refer to?",
        "asking a clarifying question", ["pausing before replying", "separating message from messenger", "feeling a threat"],
        "The previous sentence describes asking clarifying questions such as \"Could you give me an example?\""],
      ["vocabulary in context", "In the third paragraph, \"clumsily\" means ...",
        "in an awkward or careless way", ["in a friendly way", "in great detail", "with great speed"],
        "Feedback that is delivered clumsily is given badly, but may still be useful."],
      ["inference", "What does the writer imply about the comment \"You never listen\"?",
        "It is ineffective because it criticises the person, not a specific behaviour.", ["It is the best way to correct a mistake.", "It is acceptable only in private meetings.", "It is too polite for a manager to use."],
        "The writer contrasts it with a specific, behaviour-focused comment that the person can change."],
    ],
  },
  {
    id: "rd-28",
    title: "Fatigue and Safety in Aviation",
    level: "B2",
    topic: "Safety",
    text: `Aviation is among the safest forms of transport, and one reason is that the industry takes human limitations seriously. Fatigue is one of those limitations. A tired crew member reacts more slowly, makes more mistakes and may find it harder to communicate clearly. For this reason, the hours that pilots and cabin crew may work are controlled by detailed regulations.

These rules usually set limits on the length of a duty period, the number of flights in a day and the minimum rest between duties. Night flights and early starts are treated with extra caution, because they interfere with natural sleep patterns. The details differ between countries and airlines, but the principle is the same: rest is not a luxury but a safety requirement.

However, rules alone cannot solve the problem. Each crew member is also expected to arrive "fit for duty", which means rested and healthy enough to perform safety tasks. This responsibility can be difficult to manage when schedules are irregular and sleep is disturbed by time-zone changes. Experienced crew learn to protect their sleep by keeping the bedroom dark and quiet, avoiding caffeine late in the day and treating rest as seriously as any other part of the job.

Many airlines also encourage an open reporting culture. If a crew member feels too tired to work safely, they are expected to say so without fear of punishment. This is based on the idea that it is far better to lose one flight attendant for a day than to risk an error during an emergency.

Passengers rarely see this side of the job. They see smiles and service; behind the smiles is a system designed to make sure that those smiling people are alert enough to protect them.`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "Managing fatigue is an important part of aviation safety.", ["Crew members should work as few hours as possible.", "Pilots are more tired than cabin crew.", "Passengers should check the rest hours of the crew."],
        "The text explains regulations, personal responsibility and reporting culture, all related to fatigue and safety."],
      ["specific information", "According to the text, what does \"fit for duty\" mean?",
        "Rested and healthy enough to perform safety tasks", ["Trained to work on every type of aircraft", "Able to work without any rest period", "Dressed correctly according to uniform rules"],
        "The text defines it as \"rested and healthy enough to perform safety tasks\"."],
      ["vocabulary in context", "In the second paragraph, \"interfere with\" is closest in meaning to ...",
        "disturb", ["improve", "replace", "describe"],
        "Night flights and early starts disturb natural sleep patterns."],
      ["cause and effect", "Why do many airlines encourage crew to report that they are too tired?",
        "An alert crew member is safer in an emergency than a tired one.", ["Crew members are paid more when they report fatigue.", "Passengers prefer crew members who work less.", "Regulations forbid crew from working at night."],
        "The text says it is better to lose one flight attendant for a day than to risk an error during an emergency."],
      ["author's intention", "Why does the writer end with a comment about smiles?",
        "To highlight the hidden safety work behind the visible service", ["To criticise crew members who smile too much", "To describe the training of new crew", "To suggest that service is more important than safety"],
        "The last paragraph contrasts what passengers see (smiles) with the system that keeps crew alert."],
    ],
  },
  {
    id: "rd-29",
    title: "Greener Skies?",
    level: "B2",
    topic: "Environment",
    text: `Aviation produces a relatively small share of global greenhouse-gas emissions, but it is one of the hardest sectors to clean up. Unlike cars, aircraft cannot easily run on batteries, because batteries are too heavy for long flights. As a result, the industry is exploring several different solutions at the same time, and none of them is simple.

One option is sustainable aviation fuel, made from sources such as used cooking oil, agricultural waste or other renewable materials. It can be used in existing engines and can reduce emissions over its lifecycle significantly. However, it is still expensive and produced in small quantities, so it currently makes up only a tiny proportion of the fuel that airlines use.

A second approach is to make aircraft more efficient. Modern planes are lighter and use less fuel than older models, and airlines can reduce consumption by choosing smoother routes, carrying less unnecessary weight and flying more efficient approaches to landing. These improvements are valuable, but they are gradual, and the growth in air travel may cancel out some of the savings.

Some companies are also developing electric and hydrogen aircraft. Small electric planes already exist for short trips, but larger hydrogen-powered aircraft are not expected to carry passengers for many years.

Experts generally agree that no single technology will be enough. The most realistic plan combines cleaner fuels, better aircraft, smarter operations and, in some cases, a reduction in unnecessary flights. For travellers, this means that choices such as taking a train for a short journey will remain part of the solution.`,
    questions: [
      ["main idea", "What is the main idea of the passage?",
        "Reducing aviation emissions will require several solutions together.", ["Electric aircraft will soon replace all current planes.", "Aviation is the main cause of climate change.", "Airlines have already solved their emissions problem."],
        "The text compares fuels, efficiency and new aircraft, and concludes that a combination is needed."],
      ["specific information", "Why are batteries unsuitable for long flights?",
        "They are too heavy.", ["They are too expensive for airlines.", "They cannot be recharged in airports.", "They do not work at high altitude."],
        "The text says that batteries are too heavy for long flights."],
      ["reference", "In the first paragraph, \"none of them is simple\". What does \"them\" refer to?",
        "the solutions being explored", ["the batteries", "the long flights", "the emissions"],
        "\"Them\" refers back to \"several different solutions\"."],
      ["vocabulary in context", "In the third paragraph, \"gradual\" means ...",
        "happening slowly, step by step", ["very expensive", "completely new", "easy to measure"],
        "The improvements are valuable but happen slowly, which is why growth in air travel may cancel out some savings."],
      ["logical conclusion", "Which conclusion does the text support?",
        "A combination of measures is more realistic than a single solution.", ["Sustainable fuel will make other measures unnecessary.", "People should stop travelling by plane.", "Hydrogen aircraft will solve the problem in the next few years."],
        "The final paragraph says that no single technology will be enough."],
    ],
  },
  {
    id: "rd-30",
    title: "The Quiet Power of Listening",
    level: "B2+",
    topic: "Communication",
    text: `We tend to associate good communication with speaking: persuasive presentations, confident interviews, clever remarks. Yet those who work in customer-facing roles often discover that their most valuable skill is the opposite. Listening, properly done, is not a passive activity. It requires attention, discipline and a surprising amount of effort.

Consider a passenger who approaches a flight attendant, apparently to complain about the temperature. A hurried listener might offer a blanket and move on. A skilled listener notices the passenger's tone, her tight grip on the armrest and the way she glances at the window. A single question, "Is everything all right?", may reveal that the real issue is anxiety about turbulence. The blanket was never the problem, and no number of blankets would have solved it.

Researchers who study conversation distinguish between listening to reply and listening to understand. Most of us do the former: while the other person is speaking, we prepare our response, judge their argument or think about something else. Listening to understand demands that we suspend those habits, at least temporarily, and focus on what is said, what is left unsaid and what the speaker seems to need.

Several techniques can help. Paraphrasing, which means summarising what you have heard in your own words, confirms that you have understood and signals respect. Silence, used well, gives people space to say what they actually mean, since the first thing they say is rarely the most important. And what some call "listening with the eyes" reminds us that posture, expression and tone often tell us more than words.

None of this is dramatic, which may be why it is undervalued. Nobody receives applause for noticing that a passenger is afraid. Nevertheless, the cumulative effect of such small acts is enormous: they build the kind of trust that no marketing campaign can buy. In a profession where reputation depends on thousands of brief encounters every day, the ability to listen may be the quietest, and most powerful, competitive advantage of all.`,
    questions: [
      ["main idea", "What is the central argument of the passage?",
        "Attentive listening is a demanding skill that builds trust with customers.", ["Speaking confidently is more valuable than listening.", "Passengers who complain should be given more comfort items.", "Marketing campaigns are the best way to build trust."],
        "The writer argues that listening is active, effortful and builds trust through small acts."],
      ["inference", "What does the passenger example suggest about the first thing people say?",
        "It may not describe the real problem.", ["It is always an accurate description.", "It is usually a complaint about service.", "It should be ignored by crew."],
        "The passenger asked about the temperature, but the real issue was her anxiety about turbulence."],
      ["vocabulary in context", "In the third paragraph, \"suspend\" is closest in meaning to ...",
        "put aside for a time", ["strengthen", "hang up", "decide against forever"],
        "To suspend a habit is to stop it temporarily so that you can listen to understand."],
      ["tone and attitude", "How does the writer feel about the role of listening in service work?",
        "Admiring: it is undervalued but highly effective.", ["Doubtful: it takes too much time", "Critical: crew rarely use it", "Neutral: it is just one of many skills"],
        "The writer calls it \"the quietest, and most powerful, competitive advantage\" and says it is undervalued."],
      ["author's intention", "Why does the writer describe the passenger's tight grip on the armrest?",
        "To show that non-verbal signals can reveal what words do not", ["To criticise the passenger for being nervous", "To explain how turbulence affects passengers", "To suggest that crew should watch passengers all the time"],
        "The detail is an example of \"listening with the eyes\": body language tells us more than words."],
    ],
  },
];
