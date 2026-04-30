export const getYouTubeVideoId = (rawUrl?: string | null) => {
  if (!rawUrl) return '';

  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) return '';

  const safeUrl = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;

  try {
    const parsedUrl = new URL(safeUrl);
    const host = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      return parsedUrl.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (host.includes('youtube.com')) {
      return (
        parsedUrl.searchParams.get('v') ||
        parsedUrl.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ||
        ''
      );
    }
  } catch {
    return '';
  }

  return '';
};

