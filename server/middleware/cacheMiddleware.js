/**
 * Sets Cache-Control header for public GETs.
 *   publicCache(60) → public, max-age=60, stale-while-revalidate=300
 * Only applies on GET; mutations always bypass.
 */
export const publicCache = (seconds = 60) => (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=${seconds * 5}`);
  }
  next();
};

export const noCache = (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};
