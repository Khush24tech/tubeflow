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
  }
];

export function getCuratedTracksByCategory(category: string): Track[] {
  const cat = (category || 'all').toLowerCase();
  if (cat === 'all') return CURATED_TRACKS;
  return CURATED_TRACKS.filter(t => (t.category || '').toLowerCase() === cat);
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
