/**
 * Creates the default admin account.
 * Run once after first deployment:
 *
 *   npm run seed:admin
 *
 * Safe to re-run — skips creation if the email already exists.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.model';

const ADMIN = {
  name:     'Admin',
  email:    'admin@gmail.com',
  password: '123456',
  role:     'admin' as const,
};

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not set. Copy server/.env.example → server/.env and fill it in.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log(`Admin already exists (role: ${existing.role}, isActive: ${existing.isActive}). Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create(ADMIN);
  console.log(`Admin created successfully:`);
  console.log(`  Name:  ${admin.name}`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Role:  ${admin.role}`);
  console.log(`\nYou can now log in with:`);
  console.log(`  Email:    ${ADMIN.email}`);
  console.log(`  Password: ${ADMIN.password}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
