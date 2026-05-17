import Subscriber from '../models/Subscriber.js';

// POST /api/newsletter — public
export const subscribe = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const source = (req.body.source || 'footer').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      // Re-activate if previously unsubscribed; otherwise treat as success (idempotent).
      if (!existing.isActive) {
        existing.isActive = true;
        existing.source = source;
        await existing.save();
      }
      return res.json({ success: true, message: 'You\'re subscribed.' });
    }

    await Subscriber.create({ email, source });
    res.status(201).json({ success: true, message: 'Thanks for subscribing!' });
  } catch (err) {
    next(err);
  }
};

// GET /api/newsletter — admin
export const listSubscribers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (search) filter.email = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [subscribers, total] = await Promise.all([
      Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Subscriber.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: subscribers.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: subscribers,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/newsletter/export — admin (CSV)
export const exportSubscribers = async (_req, res, next) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true }).sort({ createdAt: -1 });

    const escape = (v) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const header = 'email,source,subscribed_at\n';
    const rows = subscribers
      .map((s) => [escape(s.email), escape(s.source), escape(s.createdAt.toISOString())].join(','))
      .join('\n');

    const filename = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(header + rows + (rows ? '\n' : ''));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/newsletter/:id — admin
export const deleteSubscriber = async (req, res, next) => {
  try {
    const sub = await Subscriber.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'Subscriber not found.' });
    await sub.deleteOne();
    res.json({ success: true, message: 'Subscriber removed.' });
  } catch (err) {
    next(err);
  }
};
