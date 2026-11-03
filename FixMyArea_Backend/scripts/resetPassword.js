import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];
const newPassword = process.argv[3];
const role = process.argv[4] || 'admin';

if (!email || !newPassword) {
  console.log('Usage: node scripts/resetPassword.js <email> <newPassword> [role]');
  console.log('Example: node scripts/resetPassword.js admin@example.com admin123 admin');
  process.exit(1);
}

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    let user = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (user) {
      user.password = hashedPassword;
      if (role) user.role = role;
      await user.save();
      console.log(`✅ Success: Password for '${email}' has been updated (Role: ${user.role}).`);
    } else {
      user = await User.create({
        name: 'Admin User',
        email,
        password: hashedPassword,
        role: role,
      });
      console.log(`✅ Success: Created new user '${email}' with password '${newPassword}' and role '${role}'.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
};

resetPassword();
