// TODO: content must be reviewed by a qualified scholar before release (PRD §7).

export type Dua = {
  id: string;
  category: 'Daily life' | 'From the Qur’an';
  title: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  source: string;
};

export const DUAS: Dua[] = [
  {
    id: 'waking',
    category: 'Daily life',
    title: 'On waking up',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba’da ma amatana wa ilayhin-nushur',
    meaning: 'All praise is for Allah who gave us life after causing us to die, and to Him is the return.',
    source: 'Al-Bukhari',
  },
  {
    id: 'leaving-home',
    category: 'Daily life',
    title: 'Leaving home',
    arabic: 'بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    transliteration: 'Bismillah, tawakkaltu ’alallah, wa la hawla wa la quwwata illa billah',
    meaning: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
    source: 'Abu Dawud, At-Tirmidhi',
  },
  {
    id: 'before-eating',
    category: 'Daily life',
    title: 'Before eating',
    arabic: 'بِسْمِ اللهِ',
    transliteration: 'Bismillah',
    meaning: 'In the name of Allah.',
    source: 'Abu Dawud, At-Tirmidhi',
  },
  {
    id: 'after-eating',
    category: 'Daily life',
    title: 'After eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-ladhi at’amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah',
    meaning: 'All praise is for Allah who fed me this and provided it for me without any might or power from myself.',
    source: 'Abu Dawud, At-Tirmidhi',
  },
  {
    id: 'masjid',
    category: 'Daily life',
    title: 'Entering the masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaf-tah li abwaba rahmatik',
    meaning: 'O Allah, open for me the gates of Your mercy.',
    source: 'Muslim',
  },
  {
    id: 'sleeping',
    category: 'Daily life',
    title: 'Before sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    meaning: 'In Your name, O Allah, I die and I live.',
    source: 'Al-Bukhari',
  },
  {
    id: 'both-worlds',
    category: 'From the Qur’an',
    title: 'Good in both worlds',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina ’adhaban-nar',
    meaning: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    source: 'Al-Baqarah 2:201',
  },
  {
    id: 'distress',
    category: 'From the Qur’an',
    title: 'In distress',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    meaning: 'There is no god but You, glory be to You. Indeed, I have been among the wrongdoers.',
    source: 'Al-Anbiya 21:87',
  },
  {
    id: 'parents',
    category: 'From the Qur’an',
    title: 'For parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-hamhuma kama rabbayani saghira',
    meaning: 'My Lord, have mercy on them as they raised me when I was small.',
    source: 'Al-Isra 17:24',
  },
  {
    id: 'knowledge',
    category: 'From the Qur’an',
    title: 'For knowledge',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ’ilma',
    meaning: 'My Lord, increase me in knowledge.',
    source: 'Ta-Ha 20:114',
  },
];
