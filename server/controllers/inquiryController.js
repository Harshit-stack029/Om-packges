import Inquiry from '../models/Inquiry.js';
import { sendInquiryEmail, sendAutoReply } from '../utils/emailSender.js';
import { sendWhatsAppAlert } from '../utils/whatsappAlert.js';

// POST /api/inquiries — public
export const submitInquiry = async (req, res, next) => {
  try {
    const { name, company, email, phone, productInterest, quantity, message } = req.body;

    const inquiry = await Inquiry.create({
      name, company, email, phone,
      productInterest, quantity, message,
      sourceUrl: req.headers.referer || '',
    });

    // Fire-and-forget notifications — never let them block the 201 response
    const emailData = {
      name, company: company || '—', email, phone,
      product: productInterest || '—',
      quantity: quantity || '—',
      message,
      sourceUrl: req.headers.referer || '',
    };

    Promise.allSettled([
      sendInquiryEmail(emailData, req.file || null),
      sendAutoReply(email, name),
      sendWhatsAppAlert(emailData),
    ]).catch(() => {});

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully.', data: { id: inquiry._id } });
  } catch (err) {
    next(err);
  }
};

// GET /api/inquiries — admin
export const getInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { productInterest: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: inquiries, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/inquiries/:id — admin
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

    // Auto-mark as read when opened
    if (inquiry.status === 'new') {
      inquiry.status = 'read';
      await inquiry.save();
    }

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/inquiries/:id/status — admin
export const updateStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ['new', 'read', 'replied', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNote !== undefined && { adminNote }) },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/inquiries/:id — admin
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) {
    next(err);
  }
};
