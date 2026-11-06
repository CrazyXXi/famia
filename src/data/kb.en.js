// English version of the local knowledge base (general information only).
// Keys match the ids in kb.js. `k` = extra English keywords used to detect the topic.
// To be reviewed by a health professional before deployment.

export const KB_EN = {
  body: {
    k: ['period', 'cycle', 'menstru', 'ovulation', 'fertile', 'puberty', 'my body', 'periods'],
    a: "A menstrual cycle lasts about 28 days on average (anything from 21 to 35 days is normal) and a period lasts 3 to 7 days. Ovulation happens about 14 days before the next period. The fertile days are roughly the 5 days before ovulation and the day itself, but if your cycle is irregular, counting days is not a reliable way to avoid pregnancy. Periods are not dirty or shameful: it is a normal way for the body to work. If they are very painful or very heavy, talk to a health worker.",
  },
  contra: {
    k: ['contracept', 'the pill', 'implant', 'injection', 'iud', 'condom', 'prevent pregnancy', 'birth control', 'family planning', 'side effect'],
    a: "There are several methods: condoms (the only one that also protects against STIs and HIV), the pill, injections, implants, the IUD, and natural methods. None is “the best” for everyone: the choice depends on your health, your daily life and your plans. Modern methods do not make you infertile, and fertility usually comes back quickly after stopping. A health centre or family planning clinic can explain each method, often free of charge and in complete confidence.",
  },
  urgence: {
    k: ['morning after', 'emergency contracept', 'unprotected', 'broken condom', 'forgot pill', 'missed pill', 'after unprotected'],
    a: "After unprotected sex, emergency contraception (the “morning-after pill”) can reduce the risk of pregnancy: the sooner it is taken the better, and up to 5 days afterwards depending on the product. It is not an abortion pill: it does not work on an existing pregnancy. You can get it at a pharmacy or health centre. Also consider an STI test if the sex was unprotected.",
  },
  pregnancy: {
    k: ['pregnan', 'late period', 'missed period', 'nausea', 'pregnancy test', 'prenatal', 'baby', 'first child'],
    a: "Possible signs of pregnancy: a late period, nausea, tender breasts, tiredness. A pregnancy test (pharmacy or health centre) can confirm it. If you are pregnant and want to continue, start antenatal care early: the WHO recommends at least 8 contacts with a health professional during pregnancy. Avoid any medicine or traditional remedy without medical advice.",
  },
  espace: {
    k: ['spacing', 'space births', 'how long to wait', 'another pregnancy', 'second child', 'between two children', 'between children'],
    a: "The WHO recommends waiting at least 24 months after a birth before trying for another pregnancy: it protects the health of both mother and baby (lower risk of prematurity and anaemia). A health worker can suggest a suitable method, including while breastfeeding.",
  },
  allait: {
    k: ['breastfeed', 'nursing', 'breast feeding'],
    a: "Breastfeeding gives some protection against a new pregnancy, but only under strict conditions (baby under 6 months, exclusive breastfeeding day and night, periods not yet back). Otherwise it is not reliable. Methods compatible with breastfeeding exist: ask at a health centre.",
  },
  ist: {
    k: ['sti', 'std', 'hiv', 'aids', 'infection', 'itching', 'discharge', 'testing', 'burning', 'sexually transmitted'],
    a: "Sexually transmitted infections (STIs) and HIV are passed on through unprotected sex. Condoms greatly reduce the risk. Many STIs have no visible signs: testing is the only way to know, it is often free and confidential, and most STIs can be treated. If you have discharge, burning or itching, get seen without waiting: nobody will judge you.",
  },
  myths: {
    k: ['contraception make you gain weight', 'make you gain weight', 'myth', 'rumor', 'rumour', 'true or false', 'gain weight', 'make you fat', 'weight gain', 'sterile', 'infertil', 'first time'],
    a: "“Contraception makes you gain weight”: for most methods no weight gain has been shown; with the injection some women gain a little, and another choice exists if that bothers you. Other false rumours: you can get pregnant the very first time; having sex standing up or washing afterwards does not prevent pregnancy; modern methods do not make you infertile; periods do not make you “impure”. Try the “Play” section to test other ideas!",
  },
  consent: {
    k: ['consent', 'forced', 'rape', 'harass', 'abuse', 'pressure', 'violence', 'made me'],
    a: "Nobody has the right to force you, whatever your age or relationship. Saying no is always your right, and what happened is never your fault. If you are in danger or have experienced violence, talk to someone you trust, a health centre or a helpline in your country. After an assault, get care quickly (ideally within 72 hours): treatment exists.",
  },
  garcons: {
    k: ['boy', 'boys', 'man', 'partner', 'boyfriend', 'husband', 'father', 'my partner'],
    a: "Family planning is for both people: boys and men have a key role (respecting consent, condoms, talking as a couple, supporting a pregnancy). Talking about it early helps build relationships without pressure or shame. The condom is the only male method that also protects against STIs.",
  },
  sos: {
    k: ['heavy bleeding', 'severe pain', 'high fever', 'fainted', 'hemorrhage', 'seizure', 'bleeding a lot'],
    a: "⚠️ What you describe may be urgent. Go to a health centre or emergency department now, or ask someone to take you. Do not stay alone and do not wait for it to pass.",
  },
}

export const FALLBACK_EN =
  "I didn't quite understand, but your question matters. Try different words (periods, contraception, pregnancy, STIs, spacing births…) or pick a topic above. For a personal situation, a health worker is best placed to help you."

export const WHERE_EN = 'For personal advice: your nearest health centre, a family planning clinic, or a pharmacy.'

export const SAFE_REFUSAL_EN =
  "I can't give a method or recipe to end a pregnancy: “home” products can kill or cause serious harm. But you are not alone and I'm not judging you. If you think you are pregnant and don't want to be, go to a health centre soon: they can explain the legal, safe options in your country, confidentially. If you have heavy bleeding, severe pain or fever, it is an emergency: get care immediately."
