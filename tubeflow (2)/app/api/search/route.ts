import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

let youtube: Innertube | null = null;

async function getYouTubeClient() {
  if (!youtube) {
    youtube = await Innertube.create({ lang: 'en', location: 'US', retrieve_player: true });
  }
  return youtube;
}

function parseSafeTitle(rawTitle: any): string {
  if (!rawTitle) return 'Unknown Title';
  if (typeof rawTitle === 'string') return rawTitle.trim();
  if (typeof rawTitle.text === 'string') return rawTitle.text.trim();
  if (Array.isArray(rawTitle.runs)) {
    const joined = rawTitle.runs.map((r: any) => r?.text || '').join('').trim();
    if (joined) return joined;
  }
  try {
    const str = String(rawTitle);
    return str === '[object Object]' ? 'Unknown Title' : str.trim();
  } catch {
    return 'Unknown Title';
  }
}

function parseSafeAuthor(rawAuthor: any): string {
  if (!rawAuthor) return 'Unknown Artist';
  if (typeof rawAuthor === 'string') return rawAuthor.trim();
  if (typeof rawAuthor.name === 'string') return rawAuthor.name.trim();
  if (typeof rawAuthor.text === 'string') return rawAuthor.text.trim();
  try {
    const str = String(rawAuthor);
    return str === '[object Object]' ? 'Unknown Artist' : str.trim();
  } catch {
    return 'Unknown Artist';
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q');
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : '';

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const yt = await getYouTubeClient();
    const searchResults = await yt.search(query, { type: 'video' });
    const rawList = (searchResults as any).results || (searchResults as any).videos || [];

    const items: any[] = [];
    for (const video of rawList) {
      const videoId = video.id || video.videoId;
      if (!videoId || typeof videoId !== 'string') continue;

      items.push({
        id: videoId,
        videoId: videoId,
        title: parseSafeTitle(video.title),
        duration:
          typeof video.duration?.text === 'string'
            ? video.duration.text
            : (typeof video.duration?.toString === 'function' ? video.duration.toString() : '3:45'),
        thumbnail:
          video.thumbnails?.[0]?.url ||
          video.thumbnail ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channel: parseSafeAuthor(video.author),
        author: { name: parseSafeAuthor(video.author) },
        views: video.short_view_count?.text || video.view_count?.text || '1.2M views',
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });

      if (items.length >= 24) break;
    }

    return NextResponse.json({ results: items });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch songs from YouTube' },
      { status: 500 }
    );
  }
}
