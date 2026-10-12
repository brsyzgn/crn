import type { DailyPhrase } from "@/types";

/** One phrase is shown per calendar day, rotating deterministically. */
export const DAILY_PHRASES: readonly DailyPhrase[] = [
  {
    id: "phrase-welcome-aboard",
    phrase: "Welcome aboard. May I see your boarding pass, please?",
    turkish: "Uçağa hoş geldiniz. Biniş kartınızı görebilir miyim?",
    usage: "A friendly greeting at the aircraft door.",
  },
  {
    id: "phrase-anything-else",
    phrase: "Is there anything else I can help you with?",
    turkish: "Size yardımcı olabileceğim başka bir şey var mı?",
    usage: "A polite way to finish helping a passenger.",
  },
  {
    id: "phrase-apologize-delay",
    phrase: "I apologize for the delay. Thank you for your patience.",
    turkish: "Gecikme için özür dilerim. Sabrınız için teşekkür ederim.",
    usage: "Use when passengers have been waiting.",
  },
  {
    id: "phrase-let-me-check",
    phrase: "Let me check that for you.",
    turkish: "Bunu sizin için kontrol edeyim.",
    usage: "Shows you are willing to help even when you do not know the answer yet.",
  },
  {
    id: "phrase-i-understand",
    phrase: "I understand how you feel, and I will do my best to help.",
    turkish: "Ne hissettiğinizi anlıyorum ve yardımcı olmak için elimden geleni yapacağım.",
    usage: "Shows empathy to an upset passenger.",
  },
  {
    id: "phrase-fasten-seatbelt",
    phrase: "For your safety, please keep your seat belt fastened.",
    turkish: "Güvenliğiniz için lütfen emniyet kemerinizi bağlı tutun.",
    usage: "A clear and polite safety reminder.",
  },
  {
    id: "phrase-would-you-like",
    phrase: "Would you like something to drink?",
    turkish: "İçecek bir şey ister misiniz?",
    usage: "The standard polite offer during service.",
  },
  {
    id: "phrase-im-afraid",
    phrase: "I'm afraid that seat is taken, but I'll find you another one.",
    turkish: "Maalesef o koltuk dolu ama size başka bir koltuk bulacağım.",
    usage: "\"I'm afraid\" softens bad news.",
  },
  {
    id: "phrase-strength-answer",
    phrase: "One of my strengths is staying calm under pressure.",
    turkish: "Güçlü yönlerimden biri baskı altında sakin kalabilmek.",
    usage: "A useful sentence in a job interview.",
  },
  {
    id: "phrase-look-forward",
    phrase: "I'm really looking forward to learning from the team.",
    turkish: "Ekipten bir şeyler öğrenmeyi dört gözle bekliyorum.",
    usage: "Remember: \"look forward to\" is followed by the -ing form.",
  },
  {
    id: "phrase-give-example",
    phrase: "For example, last year I helped a customer who was very upset.",
    turkish: "Örneğin, geçen yıl çok üzgün olan bir müşteriye yardım ettim.",
    usage: "Use examples to make your interview answers stronger.",
  },
  {
    id: "phrase-pardon",
    phrase: "I'm sorry, could you repeat that, please?",
    turkish: "Üzgünüm, tekrar eder misiniz lütfen?",
    usage: "A polite way to ask for repetition. Better than saying \"What?\".",
  },
  {
    id: "phrase-thank-patience",
    phrase: "Thank you for your understanding.",
    turkish: "Anlayışınız için teşekkür ederiz.",
    usage: "Perfect after explaining a rule or a change of plan.",
  },
  {
    id: "phrase-enjoy-flight",
    phrase: "I hope you enjoy the rest of your flight.",
    turkish: "Uçuşunuzun geri kalanının keyfini çıkarmanızı dilerim.",
    usage: "A warm way to end a conversation during the flight.",
  },
];
