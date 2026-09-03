import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url') || searchParams.get('id');
  const format = (searchParams.get('format') || 'mp4').toLowerCase();
  const quality = searchParams.get('quality') || '';
  const rawTitle = searchParams.get('title') || 'Tubeflow_Track';
  const cleanTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, '').trim() || 'Track';

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing URL or video ID' }, { status: 400 });
  }

  let videoId = rawUrl;
  if (rawUrl.includes('v=')) {
    videoId = rawUrl.split('v=')[1]?.split('&')[0] || rawUrl;
  } else if (rawUrl.includes('youtu.be/')) {
    videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0] || rawUrl;
  }
  const inputUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const isAudio = format === 'mp3' || format === 'm4a' || format === 'flac' || format === 'wav';

  let loaderFormat = 'mp3';
  if (format === 'mp4' || format === 'video') {
    if (quality.includes('1080')) loaderFormat = '1080';
    else if (quality.includes('720') || quality.includes('hd')) loaderFormat = '720';
    else if (quality.includes('480')) loaderFormat = '480';
    else if (quality.includes('360')) loaderFormat = '360';
    else loaderFormat = '720';
  } else if (format === 'm4a') loaderFormat = 'm4a';
  else if (format === 'flac') loaderFormat = 'flac';

  // Primary High-Speed Converter
  try {
    const initRes = await fetch(
      `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${loaderFormat}&url=${encodeURIComponent(inputUrl)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      }
    );

    if (initRes.ok) {
      const initData: any = await initRes.json();
      const pollUrl = initData.progress_url || `https://lto2.affadaffa.com/api/progress?id=${initData.id}`;

      let downloadUrl: string | null = null;
      for (let attempt = 0; attempt < 25; attempt++) {
        await new Promise((r) => setTimeout(r, 1200));
        const pRes = await fetch(pollUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          },
        });

        if (pRes.ok) {
          const pData: any = await pRes.json();
          if (pData.download_url) {
            downloadUrl = pData.download_url;
            break;
          }
        }
      }

      if (downloadUrl) {
        if (searchParams.get('direct') === 'true') {
          return NextResponse.redirect(downloadUrl);
        }

        const mediaRes = await fetch(downloadUrl);
        if (mediaRes.ok && mediaRes.body) {
          const ext = isAudio ? (format === 'm4a' ? 'm4a' : 'mp3') : 'mp4';
          const contentType = isAudio ? (format === 'm4a' ? 'audio/mp4' : 'audio/mpeg') : 'video/mp4';

          const headers = new Headers();
          headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(cleanTitle)}.${ext}"`);
          headers.set('Content-Type', contentType);
          const contentLength = mediaRes.headers.get('content-length');
          if (contentLength) {
            headers.set('Content-Length', contentLength);
          }

          return new NextResponse(mediaRes.body, { headers });
        }
      }
    }
  } catch (e) {
    console.warn('Next.js route converter error:', e);
  }

  try {
    // Determine yt-dlp arguments based on format selection
    const ytDlpArgs = isAudio
      ? ['-x', '--audio-format', 'mp3', '--audio-quality', '0', '-o', '-', inputUrl]
      : ['-f', 'bv*+ba/b', '--merge-output-format', 'mp4', '-o', '-', inputUrl];

    const localBinary = path.join(process.cwd(), 'yt-dlp');
    const binCmd = fs.existsSync(localBinary) ? localBinary : 'yt-dlp';

    const ytDlpProcess = spawn(binCmd, ytDlpArgs, {
      env: {
        ...process.env,
        PATH: `${path.join(process.cwd(), 'node_modules', '.bin')}:${process.env.PATH}`,
      },
    });

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(cleanTitle)}.${isAudio ? 'mp3' : 'mp4'}"`);
    headers.set('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

    const webStream = new ReadableStream({
      start(controller) {
        ytDlpProcess.stdout.on('data', (chunk) => controller.enqueue(chunk));
        ytDlpProcess.stdout.on('end', () => controller.close());
        ytDlpProcess.on('error', (err) => controller.error(err));
      },
      cancel() {
        ytDlpProcess.kill();
      },
    });

    return new NextResponse(webStream, { headers });
  } catch (error) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: 'Failed to process media stream' }, { status: 500 });
  }
}
