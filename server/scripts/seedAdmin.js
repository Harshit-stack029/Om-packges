import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await Admin.findOne({ email: 'admin@ompack.in' });
  if (existing) {
    console.log('Superadmin already exists. Skipping seed.');
    process.exit(0);
  }

  await Admin.create({
    name: 'OM Packaging Admin',
    email: 'admin@ompack.in',
    password: 'ChangeMe@123',
    role: 'superadmin',
  });

  console.log('Superadmin created — email: admin@ompack.in  password: ChangeMe@123');
  console.log('IMPORTANT: Change the password immediately after first login.');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
