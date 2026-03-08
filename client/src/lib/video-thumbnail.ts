/**
 * Video thumbnail and URL helpers for YouTube and Vimeo.
 * QB Trainings and Workouts use Vimeo links (e.g. player.vimeo.com/video/ID).
 */

export function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getVimeoVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  // player.vimeo.com/video/1166702748 or vimeo.com/1166702748
  const m = url.match(/(?:vimeo\.com\/video\/|vimeo\.com\/)(\d+)/);
  return m ? m[1] : null;
}

/**
 * Returns a thumbnail URL for YouTube or Vimeo, or null if unknown.
 * Vimeo thumbnails via vumbnail.com (public service for Vimeo thumbnails).
 */
export function getVideoThumbnail(url: string): string | null {
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }
  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) {
    return `https://vumbnail.com/${vimeoId}.jpg`;
  }
  return null;
}
