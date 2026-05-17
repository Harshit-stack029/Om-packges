import Certificate from '../models/Certificate.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/certificates — public (active only)
export const getCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: certs });
  } catch (err) { next(err); }
};

// GET /api/certificates/admin/all — admin
export const getCertificatesAdmin = async (req, res, next) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: certs });
  } catch (err) { next(err); }
};

// POST /api/certificates — admin
export const createCertificate = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Certificate file is required.' });
    const { name, description, issuedBy, issuedDate, expiryDate, isActive, order } = req.body;
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';

    const cert = await Certificate.create({
      name, description, issuedBy,
      issuedDate: issuedDate || undefined,
      expiryDate: expiryDate || undefined,
      isActive: isActive !== 'false',
      order: Number(order) || 0,
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      fileType,
    });
    res.status(201).json({ success: true, data: cert });
  } catch (err) { next(err); }
};

// PUT /api/certificates/:id — admin
export const updateCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });

    const { name, description, issuedBy, issuedDate, expiryDate, isActive, order } = req.body;
    if (name !== undefined) cert.name = name;
    if (description !== undefined) cert.description = description;
    if (issuedBy !== undefined) cert.issuedBy = issuedBy;
    if (issuedDate !== undefined) cert.issuedDate = issuedDate || undefined;
    if (expiryDate !== undefined) cert.expiryDate = expiryDate || undefined;
    if (isActive !== undefined) cert.isActive = isActive !== 'false';
    if (order !== undefined) cert.order = Number(order);

    if (req.file) {
      await cloudinary.uploader.destroy(cert.filePublicId, { resource_type: cert.fileType === 'pdf' ? 'raw' : 'image' }).catch(() => {});
      cert.fileUrl = req.file.path;
      cert.filePublicId = req.file.filename;
      cert.fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    await cert.save();
    res.json({ success: true, data: cert });
  } catch (err) { next(err); }
};

// DELETE /api/certificates/:id — admin
export const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });
    await cloudinary.uploader.destroy(cert.filePublicId, { resource_type: cert.fileType === 'pdf' ? 'raw' : 'image' }).catch(() => {});
    await cert.deleteOne();
    res.json({ success: true, message: 'Certificate deleted.' });
  } catch (err) { next(err); }
};
