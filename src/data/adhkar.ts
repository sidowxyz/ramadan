// TODO: content must be reviewed by a qualified scholar before release (PRD §7).
// Arabic, counts and references follow widely used collections (e.g. Hisn al-Muslim).

export type Dhikr = {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  source: string;
};

export const MORNING_EVENING: Dhikr[] = [
  {
    id: 'kursi',
    arabic: 'آيَةُ الْكُرْسِيّ',
    transliteration: 'Ayat al-Kursi',
    meaning: 'Recite the Verse of the Throne.',
    count: 1,
    source: 'Al-Baqarah 2:255',
  },
  {
    id: 'quls',
    arabic: 'الْإِخْلَاص · الْفَلَق · النَّاس',
    transliteration: 'Al-Ikhlas, Al-Falaq, An-Nas',
    meaning: 'Recite the last three surahs, three times each.',
    count: 3,
    source: 'Abu Dawud, At-Tirmidhi',
  },
  {
    id: 'bismillah',
    arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma’as-mihi shay’un fil-ardi wa la fis-sama’i wa huwas-Sami’ul-’Alim',
    meaning:
      'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    count: 3,
    source: 'Abu Dawud, At-Tirmidhi',
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa ’ala kulli shay’in qadir',
    meaning:
      'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He has power over all things.',
    count: 10,
    source: 'Al-Bukhari, Muslim',
  },
  {
    id: 'subhan-bihamdihi',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    meaning: 'Glory be to Allah and praise be to Him.',
    count: 100,
    source: 'Muslim',
  },
];

export const AFTER_PRAYER: Dhikr[] = [
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek the forgiveness of Allah.',
    count: 3,
    source: 'Muslim',
  },
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah.',
    count: 33,
    source: 'Muslim',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is for Allah.',
    count: 33,
    source: 'Muslim',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest.',
    count: 33,
    source: 'Muslim',
  },
  {
    id: 'kursi-after',
    arabic: 'آيَةُ الْكُرْسِيّ',
    transliteration: 'Ayat al-Kursi',
    meaning: 'Recite the Verse of the Throne after each prayer.',
    count: 1,
    source: 'An-Nasa’i',
  },
];

// Phrases offered in the free tasbih counter.
export const TASBIH = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللهِ', label: 'SubhanAllah' },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', label: 'Alhamdulillah' },
  { id: 'allahuakbar', arabic: 'اللهُ أَكْبَرُ', label: 'Allahu Akbar' },
  { id: 'istighfar', arabic: 'أَسْتَغْفِرُ اللهَ', label: 'Astaghfirullah' },
];
