import { Track, ArtistProfile } from '../types';

export const POPULAR_ARTISTS: ArtistProfile[] = [
  {
    name: "Sabrina Carpenter",
    picture: "https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/500x500-000000-80-0-0.jpg",
    fans: 9850000,
    genre: "Pop / Contemporary",
    verified: true
  },
  {
    name: "Burna Boy",
    picture: "https://cdn-images.dzcdn.net/images/artist/f1d7a312d83296fa28c2c8f62f3a67d1/500x500-000000-80-0-0.jpg",
    fans: 12400000,
    genre: "Afro-Fusion / Afrobeats",
    verified: true
  },
  {
    name: "Billie Eilish",
    picture: "https://cdn-images.dzcdn.net/images/artist/cf53d9e4a3aa02c2f6d549dd43ba7fe2/500x500-000000-80-0-0.jpg",
    fans: 22800000,
    genre: "Alt-Pop / Electronic",
    verified: true
  },
  {
    name: "Kendrick Lamar",
    picture: "https://cdn-images.dzcdn.net/images/artist/0681a28a3f5a2e5d9c57d72c4767aaee/500x500-000000-80-0-0.jpg",
    fans: 16900000,
    genre: "Hip-Hop / Rap",
    verified: true
  },
  {
    name: "Taylor Swift",
    picture: "https://cdn-images.dzcdn.net/images/artist/20703dd7f3f6e1f0e4bbf0cb92e858db/500x500-000000-80-0-0.jpg",
    fans: 34500000,
    genre: "Pop / Singer-Songwriter",
    verified: true
  },
  {
    name: "Eminem",
    picture: "https://cdn-images.dzcdn.net/images/artist/19cc5b1d30327f27ec4e8eec676a0860/500x500-000000-80-0-0.jpg",
    fans: 28900000,
    genre: "Hip-Hop",
    verified: true
  },
  {
    name: "Wizkid",
    picture: "https://cdn-images.dzcdn.net/images/artist/993a408798ca7cf4db0566e133e9d40b/500x500-000000-80-0-0.jpg",
    fans: 8700000,
    genre: "Afrobeats / R&B",
    verified: true
  },
  {
    name: "Asake",
    picture: "https://cdn-images.dzcdn.net/images/artist/97a544b8ee76a77ca519a911a37c00e1/500x500-000000-80-0-0.jpg",
    fans: 5200000,
    genre: "Afrobeats / Amapiano",
    verified: true
  },
  {
    name: "Teddy Swims",
    picture: "https://cdn-images.dzcdn.net/images/artist/672eb4cf78c2e648f02931100344d57c/500x500-000000-80-0-0.jpg",
    fans: 4800000,
    genre: "Soul / Pop / R&B",
    verified: true
  },
  {
    name: "Chappell Roan",
    picture: "https://cdn-images.dzcdn.net/images/artist/a2a6efcae137f6cb2996d9f9a0a1496a/500x500-000000-80-0-0.jpg",
    fans: 6100000,
    genre: "Synth-Pop / Indie Pop",
    verified: true
  },
  {
    name: "Ed Sheeran",
    picture: "https://cdn-images.dzcdn.net/images/artist/57a7d45763df3989c09d57a918a0026f/500x500-000000-80-0-0.jpg",
    fans: 26500000,
    genre: "Pop / Acoustic",
    verified: true
  },
  {
    name: "SZA",
    picture: "https://cdn-images.dzcdn.net/images/artist/ceadca4564c78160350d27ec29a43a6a/500x500-000000-80-0-0.jpg",
    fans: 14200000,
    genre: "R&B / Soul",
    verified: true
  },
  {
    name: "Sauti Sol",
    picture: "https://cdn-images.dzcdn.net/images/artist/f76a07a4a99395ffa717c223b732f26a/500x500-000000-80-0-0.jpg",
    fans: 1850000,
    genre: "Afro-Pop / Kenyan Band",
    verified: true,
    bio: "Kenya's iconic four-time MTV EMA & AFRIMA winning band celebrated for Midnight Train, Suzanna, and Melanin."
  },
  {
    name: "Bien",
    picture: "https://cdn-images.dzcdn.net/images/artist/5c6a553de4dc465a5e9a9e21f21517de/500x500-000000-80-0-0.jpg",
    fans: 980000,
    genre: "Afro-Pop / R&B / Soul",
    verified: true,
    bio: "Kenyan singer, songwriter and lead vocalist of Sauti Sol, known for hits like Inauma, Bald Men Anthem, and Wahala."
  },
  {
    name: "Nyashinski",
    picture: "https://cdn-images.dzcdn.net/images/artist/28aeeda3e775f6e54781a2c40bc8efc8/500x500-000000-80-0-0.jpg",
    fans: 1200000,
    genre: "Kenyan Hip-Hop / Afro-Fusion",
    verified: true,
    bio: "Pioneering Kenyan hip-hop legend and lyrical mastermind behind Mungu Pekee, Malaika, Free, and Bebi Bebi."
  },
  {
    name: "Otile Brown",
    picture: "https://cdn-images.dzcdn.net/images/artist/3068aba8a03149bca11add5710be467e/500x500-000000-80-0-0.jpg",
    fans: 1500000,
    genre: "Bongo Flava / R&B",
    verified: true,
    bio: "East Africa's premier vocal crooner with record-shattering hits including Dusuma, Chaguo La Moyo, and Baby Go."
  },
  {
    name: "Khaligraph Jones",
    picture: "https://cdn-images.dzcdn.net/images/artist/d8f476e90d1a9165a00d3b81dc2efa5c/500x500-000000-80-0-0.jpg",
    fans: 1100000,
    genre: "Kenyan Hip-Hop / Rap",
    verified: true,
    bio: "The OG of African rap, Soundcity MVP Best Male Rapper in Africa, acclaimed for Yes Bana, Mazishi, and Tuma Kitu."
  },
  {
    name: "Wakadinali",
    picture: "https://cdn-images.dzcdn.net/images/artist/600da912d6ed64c233b8a302d83aad2f/500x500-000000-80-0-0.jpg",
    fans: 850000,
    genre: "Kenyan Drill / Gengetone",
    verified: true,
    bio: "Kenya's premier drill and urban rap triumvirate representing Nairobi street culture with hits like Geri Inengi and Mc Mca."
  },
  {
    name: "Diamond Platnumz",
    picture: "https://cdn-images.dzcdn.net/images/artist/81ff238210334863c0a4e37340b61678/500x500-000000-80-0-0.jpg",
    fans: 7800000,
    genre: "Bongo Flava / Afro-Pop",
    verified: true,
    bio: "Tanzanian superstar, WCB Wasafi founder, and global East African ambassador behind Jeje, Number One, and Komasava."
  },
  {
    name: "Ayra Starr",
    picture: "https://cdn-images.dzcdn.net/images/artist/e13f28cfcf650b297920dc55f36e4dbb/500x500-000000-80-0-0.jpg",
    fans: 6200000,
    genre: "Afrobeats / Pop",
    verified: true,
    bio: "Grammy-nominated Nigerian sensation and Mavin records star known worldwide for Rush, Commas, and Santa."
  },
  {
    name: "Tems",
    picture: "https://cdn-images.dzcdn.net/images/artist/bc0629671d188ae6081da701c9058b8f/500x500-000000-80-0-0.jpg",
    fans: 8900000,
    genre: "R&B / Soul / Afro",
    verified: true,
    bio: "Grammy-winning vocalist celebrated for Free Mind, Me & U, and her album Born in the Wild."
  },
  {
    name: "Fally Ipupa",
    picture: "https://cdn-images.dzcdn.net/images/artist/a1df3e0d29ae553b1b6d1b7d5ee32bf4/500x500-000000-80-0-0.jpg",
    fans: 4500000,
    genre: "Congolese Rumba / Ndombolo",
    verified: true,
    bio: "Congolese music royalty, multi-award winning singer and dancer with massive francophone and Pan-African anthems."
  },
  {
    name: "Bad Bunny",
    picture: "https://cdn-images.dzcdn.net/images/artist/044a3f315b041864887a8dd8709e6926/500x500-000000-80-0-0.jpg",
    fans: 29000000,
    genre: "Latin Trap / Reggaeton",
    verified: true,
    bio: "Global streaming giant and multi-Grammy winner redefining modern Latin music worldwide."
  },
  {
    name: "Arijit Singh",
    picture: "https://cdn-images.dzcdn.net/images/artist/ac5350cff290edd5b69fa584b8b1bd4f/500x500-000000-80-0-0.jpg",
    fans: 24000000,
    genre: "Bollywood / Acoustic / Soul",
    verified: true,
    bio: "India's highest-streamed artist of all time, famous for heartfelt soulful ballads across global cinema."
  }
];

export const CURATED_TRACKS: Track[] = [
  // 1. Sabrina Carpenter - Latest 2024 Hits
  {
    videoId: "eVli-tstM5E",
    title: "Sabrina Carpenter - Espresso (Official Video)",
    author: { name: "Sabrina Carpenter" },
    timestamp: "3:21",
    views: 669000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },
  {
    videoId: "cF1Na4AIecM",
    title: "Sabrina Carpenter - Please Please Please (Official Video)",
    author: { name: "Sabrina Carpenter" },
    timestamp: "4:23",
    views: 313000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/cF1Na4AIecM/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },
  {
    videoId: "KWoTyfPsqbE",
    title: "Sabrina Carpenter - Taste (Official Music Video)",
    author: { name: "Sabrina Carpenter" },
    timestamp: "3:35",
    views: 145000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/KWoTyfPsqbE/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },

  // 2. Kendrick Lamar - Latest Hits
  {
    videoId: "H58vbez_m4E",
    title: "Kendrick Lamar - Not Like Us (Official Music Video)",
    author: { name: "Kendrick Lamar" },
    timestamp: "4:34",
    views: 280000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/H58vbez_m4E/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/0681a28a3f5a2e5d9c57d72c4767aaee/500x500-000000-80-0-0.jpg",
    category: "Hip-Hop"
  },
  {
    videoId: "9c3w1g4q9h0",
    title: "Kendrick Lamar, SZA - luther",
    author: { name: "Kendrick Lamar" },
    timestamp: "3:02",
    views: 95000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/9c3w1g4q9h0/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/0681a28a3f5a2e5d9c57d72c4767aaee/500x500-000000-80-0-0.jpg",
    category: "Hip-Hop"
  },

  // 3. Billie Eilish - Hit Me Hard and Soft (2024)
  {
    videoId: "V9PVRfjEBTI",
    title: "Billie Eilish - BIRDS OF A FEATHER (Official Music Video)",
    author: { name: "Billie Eilish" },
    timestamp: "3:30",
    views: 350000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/V9PVRfjEBTI/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/cf53d9e4a3aa02c2f6d549dd43ba7fe2/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },
  {
    videoId: "MB3VkzPdgLA",
    title: "Billie Eilish - LUNCH (Official Music Video)",
    author: { name: "Billie Eilish" },
    timestamp: "3:10",
    views: 120000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/MB3VkzPdgLA/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/cf53d9e4a3aa02c2f6d549dd43ba7fe2/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },

  // 4. Burna Boy - Latest Afrobeats
  {
    videoId: "3r3XGZ4B7wM",
    title: "Burna Boy - Higher [Official Music Video]",
    author: { name: "Burna Boy" },
    timestamp: "3:24",
    views: 52000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/3r3XGZ4B7wM/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/f1d7a312d83296fa28c2c8f62f3a67d1/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },
  {
    videoId: "0nKq3f3iM78",
    title: "Burna Boy - City Boys [Official Music Video]",
    author: { name: "Burna Boy" },
    timestamp: "2:45",
    views: 140000000,
    ago: "2023",
    releaseYear: 2023,
    thumbnail: "https://i.ytimg.com/vi/0nKq3f3iM78/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/f1d7a312d83296fa28c2c8f62f3a67d1/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },
  {
    videoId: "Ecl8A4olZYs",
    title: "Burna Boy - Last Last [Official Music Video]",
    author: { name: "Burna Boy" },
    timestamp: "2:52",
    views: 270000000,
    ago: "Popular Hit",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/Ecl8A4olZYs/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/f1d7a312d83296fa28c2c8f62f3a67d1/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },

  // 5. Asake - Latest 2024 Releases
  {
    videoId: "P1c3P9vF4aU",
    title: "Asake, Travis Scott - Active (Official Music Video)",
    author: { name: "Asake" },
    timestamp: "3:08",
    views: 38000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/P1c3P9vF4aU/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/97a544b8ee76a77ca519a911a37c00e1/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },
  {
    videoId: "O5aX7_yZ8zE",
    title: "Asake, Wizkid - MMS (Official Visualizer)",
    author: { name: "Asake" },
    timestamp: "3:40",
    views: 42000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/O5aX7_yZ8zE/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/97a544b8ee76a77ca519a911a37c00e1/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },

  // 6. Wizkid - Latest 2024 Releases
  {
    videoId: "M5u9N1L2q3w",
    title: "Wizkid - Piece of My Heart ft. Brent Faiyaz (Official Video)",
    author: { name: "Wizkid" },
    timestamp: "3:46",
    views: 29000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/M5u9N1L2q3w/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/993a408798ca7cf4db0566e133e9d40b/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },
  {
    videoId: "jipQ_BKTe-g",
    title: "Wizkid - Essence ft. Tems (Official Video)",
    author: { name: "Wizkid" },
    timestamp: "4:08",
    views: 195000000,
    ago: "Global Hit",
    releaseYear: 2021,
    thumbnail: "https://i.ytimg.com/vi/jipQ_BKTe-g/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/993a408798ca7cf4db0566e133e9d40b/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },

  // 7. Eminem - The Death of Slim Shady (2024)
  {
    videoId: "22tVWwmTie8",
    title: "Eminem - Houdini [Official Music Video]",
    author: { name: "Eminem" },
    timestamp: "4:05",
    views: 240000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/22tVWwmTie8/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/19cc5b1d30327f27ec4e8eec676a0860/500x500-000000-80-0-0.jpg",
    category: "Hip-Hop"
  },
  {
    videoId: "vXf3C3E4Z1w",
    title: "Eminem - Tobey feat. Big Sean & BabyTron [Official Music Video]",
    author: { name: "Eminem" },
    timestamp: "4:45",
    views: 65000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/vXf3C3E4Z1w/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/19cc5b1d30327f27ec4e8eec676a0860/500x500-000000-80-0-0.jpg",
    category: "Hip-Hop"
  },

  // 8. Taylor Swift - The Tortured Poets Department (2024)
  {
    videoId: "q3zqJs7J240",
    title: "Taylor Swift - Fortnight (feat. Post Malone) (Official Music Video)",
    author: { name: "Taylor Swift" },
    timestamp: "4:09",
    views: 165000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/q3zqJs7J240/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/20703dd7f3f6e1f0e4bbf0cb92e858db/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },
  {
    videoId: "b1kbLwvqugk",
    title: "Taylor Swift - Anti-Hero (Official Music Video)",
    author: { name: "Taylor Swift" },
    timestamp: "3:21",
    views: 210000000,
    ago: "Recent Hit",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/b1kbLwvqugk/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/20703dd7f3f6e1f0e4bbf0cb92e858db/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },

  // 9. Teddy Swims - I've Tried Everything But Therapy (2024)
  {
    videoId: "GZ3zL7De6_c",
    title: "Teddy Swims - Lose Control (Official Music Video)",
    author: { name: "Teddy Swims" },
    timestamp: "3:30",
    views: 295000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/GZ3zL7De6_c/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/672eb4cf78c2e648f02931100344d57c/500x500-000000-80-0-0.jpg",
    category: "R&B"
  },
  {
    videoId: "8aA7hU0k7mE",
    title: "Teddy Swims - The Door (Official Music Video)",
    author: { name: "Teddy Swims" },
    timestamp: "3:32",
    views: 110000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/8aA7hU0k7mE/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/672eb4cf78c2e648f02931100344d57c/500x500-000000-80-0-0.jpg",
    category: "R&B"
  },

  // 10. Chappell Roan - The Rise and Fall of a Midwest Princess (2024)
  {
    videoId: "1RKqOmSkGgM",
    title: "Chappell Roan - Good Luck, Babe! (Official Lyric Video)",
    author: { name: "Chappell Roan" },
    timestamp: "3:38",
    views: 180000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/1RKqOmSkGgM/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/a2a6efcae137f6cb2996d9f9a0a1496a/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },
  {
    videoId: "A_jN_8F9Kz0",
    title: "Chappell Roan - HOT TO GO! (Official Music Video)",
    author: { name: "Chappell Roan" },
    timestamp: "3:04",
    views: 95000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/A_jN_8F9Kz0/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/a2a6efcae137f6cb2996d9f9a0a1496a/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },

  // 11. Lady Gaga & Bruno Mars (2024)
  {
    videoId: "kPa7bsKwL-8",
    title: "Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video)",
    author: { name: "Lady Gaga & Bruno Mars" },
    timestamp: "4:11",
    views: 480000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/kPa7bsKwL-8/hqdefault.jpg",
    category: "Pop"
  },

  // 12. Shaboozey - A Bar Song (Tipsy)
  {
    videoId: "t7bQwAtVlZg",
    title: "Shaboozey - A Bar Song (Tipsy) [Official Music Video]",
    author: { name: "Shaboozey" },
    timestamp: "2:51",
    views: 260000000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/t7bQwAtVlZg/hqdefault.jpg",
    category: "Hip-Hop"
  },

  // 13. Ed Sheeran - Recent & Timeless
  {
    videoId: "2Vv-BfVoq4g",
    title: "Ed Sheeran - Perfect (Official Music Video)",
    author: { name: "Ed Sheeran" },
    timestamp: "4:39",
    views: 3700000000,
    ago: "Top Classic",
    releaseYear: 2017,
    thumbnail: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/57a7d45763df3989c09d57a918a0026f/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },
  {
    videoId: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You (Official Music Video)",
    author: { name: "Ed Sheeran" },
    timestamp: "4:23",
    views: 6200000000,
    ago: "Global Diamond",
    releaseYear: 2017,
    thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/57a7d45763df3989c09d57a918a0026f/500x500-000000-80-0-0.jpg",
    category: "Pop"
  },

  // 14. Tyla - Water & Jump
  {
    videoId: "XoiOOiuH88I",
    title: "Tyla - Water (Official Music Video)",
    author: { name: "Tyla" },
    timestamp: "3:20",
    views: 310000000,
    ago: "Recent Hit",
    releaseYear: 2023,
    thumbnail: "https://i.ytimg.com/vi/XoiOOiuH88I/hqdefault.jpg",
    category: "Afrobeats"
  },

  // 15. Rema & Selena Gomez
  {
    videoId: "WcIcVapfqXw",
    title: "Rema, Selena Gomez - Calm Down (Official Music Video)",
    author: { name: "Rema" },
    timestamp: "3:59",
    views: 920000000,
    ago: "Global Hit",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/WcIcVapfqXw/hqdefault.jpg",
    category: "Afrobeats"
  },

  // 16. Sauti Sol - Suzanna & Midnight Train (Kenya)
  {
    videoId: "mFBJtuQ1Llc",
    title: "Sauti Sol - Suzanna (Official Video)",
    author: { name: "Sauti Sol" },
    timestamp: "4:00",
    views: 39000000,
    ago: "East Africa Anthem",
    releaseYear: 2020,
    thumbnail: "https://i.ytimg.com/vi/mFBJtuQ1Llc/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/f76a07a4a99395ffa717c223b732f26a/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },
  {
    videoId: "mDFbtb9D58E",
    title: "Sauti Sol - Melanin ft. Patoranking (Official Music Video)",
    author: { name: "Sauti Sol" },
    timestamp: "4:43",
    views: 35000000,
    ago: "Pan-African Classic",
    releaseYear: 2018,
    thumbnail: "https://i.ytimg.com/vi/mDFbtb9D58E/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/f76a07a4a99395ffa717c223b732f26a/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 17. Bien - Inauma & Finale (Kenya)
  {
    videoId: "Or2sMfOcTtw",
    title: "Bien - Inauma (Official Music Video)",
    author: { name: "Bien" },
    timestamp: "3:25",
    views: 18000000,
    ago: "Hit Single",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/Or2sMfOcTtw/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/5c6a553de4dc465a5e9a9e21f21517de/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },
  {
    videoId: "dj_zUJNv_zc",
    title: "BIEN X ALIKIBA: FINALE OFFICIAL MUSIC VIDEO",
    author: { name: "Bien" },
    timestamp: "3:42",
    views: 4500000,
    ago: "2024",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/dj_zUJNv_zc/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/5c6a553de4dc465a5e9a9e21f21517de/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 18. Nyashinski - Mungu Pekee & Malaika & Grateful (Kenya)
  {
    videoId: "LfPb88GD1Tc",
    title: "Nyashinski - Mungu Pekee (Official Lyric Video)",
    author: { name: "Nyashinski" },
    timestamp: "3:47",
    views: 18500000,
    ago: "Kenyan Classic",
    releaseYear: 2016,
    thumbnail: "https://i.ytimg.com/vi/LfPb88GD1Tc/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/28aeeda3e775f6e54781a2c40bc8efc8/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },
  {
    videoId: "EELI3ifOXag",
    title: "Nyashinski - Grateful (Live) Greasy Tunes Nairobi",
    author: { name: "Nyashinski" },
    timestamp: "4:15",
    views: 2200000,
    ago: "Live Masterpiece",
    releaseYear: 2024,
    thumbnail: "https://i.ytimg.com/vi/EELI3ifOXag/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/28aeeda3e775f6e54781a2c40bc8efc8/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 19. Otile Brown - Dusuma & Chaguo La Moyo (Kenya)
  {
    videoId: "aY_J2jI2_oQ",
    title: "Otile Brown x Meddy - Dusuma (Official Music Video)",
    author: { name: "Otile Brown" },
    timestamp: "3:39",
    views: 47000000,
    ago: "Record Breaker",
    releaseYear: 2020,
    thumbnail: "https://i.ytimg.com/vi/aY_J2jI2_oQ/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/3068aba8a03149bca11add5710be467e/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 20. Khaligraph Jones - Yes Bana (Kenya)
  {
    videoId: "j_wA840ZgE4",
    title: "KHALIGRAPH JONES - YES BANA ft BIEN (OFFICIAL VIDEO)",
    author: { name: "Khaligraph Jones" },
    timestamp: "4:08",
    views: 7300000,
    ago: "Hip-Hop Banger",
    releaseYear: 2020,
    thumbnail: "https://i.ytimg.com/vi/j_wA840ZgE4/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/d8f476e90d1a9165a00d3b81dc2efa5c/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 21. Wakadinali - Geri Inengi & Last Dance (Kenya)
  {
    videoId: "f0_Y-7o-CjM",
    title: "WAKADINALI - GERI INENGI FT SIR BWOY (OFFICIAL VIDEO)",
    author: { name: "Wakadinali" },
    timestamp: "3:40",
    views: 6500000,
    ago: "Nairobi Drill",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/f0_Y-7o-CjM/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/600da912d6ed64c233b8a302d83aad2f/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 22. Diamond Platnumz - Jeje (Tanzania / East Africa)
  {
    videoId: "i_4iZg63xG0",
    title: "Diamond Platnumz - Jeje (Official Music Video)",
    author: { name: "Diamond Platnumz" },
    timestamp: "3:24",
    views: 91000000,
    ago: "East Africa Mega Hit",
    releaseYear: 2020,
    thumbnail: "https://i.ytimg.com/vi/i_4iZg63xG0/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/81ff238210334863c0a4e37340b61678/500x500-000000-80-0-0.jpg",
    category: "Kenyan & East Africa"
  },

  // 23. Ayra Starr - Rush & Commas (Nigeria / Afrobeats)
  {
    videoId: "crYxEwW7X9Y",
    title: "Ayra Starr - Rush (Official Music Video)",
    author: { name: "Ayra Starr" },
    timestamp: "3:10",
    views: 390000000,
    ago: "Global Hit",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/crYxEwW7X9Y/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/e13f28cfcf650b297920dc55f36e4dbb/500x500-000000-80-0-0.jpg",
    category: "Afrobeats"
  },

  // 24. Bad Bunny - Tití Me Preguntó (Latin)
  {
    videoId: "Cr8K844_lwM",
    title: "Bad Bunny - Tití Me Preguntó (Official Video)",
    author: { name: "Bad Bunny" },
    timestamp: "4:03",
    views: 890000000,
    ago: "Latin Diamond",
    releaseYear: 2022,
    thumbnail: "https://i.ytimg.com/vi/Cr8K844_lwM/hqdefault.jpg",
    artistImage: "https://cdn-images.dzcdn.net/images/artist/044a3f315b041864887a8dd8709e6926/500x500-000000-80-0-0.jpg",
    category: "Latin & World"
  }
];

export function getCuratedTracksByCategory(category: string): Track[] {
  const cat = (category || 'all').toLowerCase().trim();
  if (cat === 'all' || cat === 'trending') return CURATED_TRACKS;
  
  if (cat.includes('kenya') || cat.includes('east') || cat.includes('bongo') || cat.includes('gengetone')) {
    return CURATED_TRACKS.filter(t => 
      (t.category || '').toLowerCase().includes('kenya') || 
      (t.category || '').toLowerCase().includes('east') ||
      ['sauti sol', 'bien', 'nyashinski', 'otile brown', 'khaligraph jones', 'wakadinali', 'diamond platnumz'].includes(t.author.name.toLowerCase())
    );
  }

  if (cat.includes('afro') || cat.includes('amapiano')) {
    return CURATED_TRACKS.filter(t => 
      (t.category || '').toLowerCase().includes('afro') ||
      ['burna boy', 'asake', 'wizkid', 'tyla', 'rema', 'ayra starr', 'sauti sol', 'bien'].includes(t.author.name.toLowerCase())
    );
  }

  if (cat.includes('latin') || cat.includes('world') || cat.includes('global')) {
    return CURATED_TRACKS.filter(t => 
      (t.category || '').toLowerCase().includes('latin') ||
      ['bad bunny', 'arijit singh', 'bts', 'fally ipupa'].includes(t.author.name.toLowerCase())
    );
  }

  return CURATED_TRACKS.filter(t => (t.category || '').toLowerCase().includes(cat));
}

export function findArtistProfile(name: string): ArtistProfile | null {
  const query = (name || '').toLowerCase().trim();
  if (!query) return null;
  return POPULAR_ARTISTS.find(
    a => a.name.toLowerCase() === query || 
         a.name.toLowerCase().includes(query) || 
         query.includes(a.name.toLowerCase())
  ) || null;
}
