import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Lead } from '../models/Lead.js';
import { Prize } from '../models/Prize.js';
import { Setting } from '../models/Setting.js';
import { DEFAULT_PRIZES, INITIAL_LEAD } from './defaultPrizes.js';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI not provided. Please check your .env file.');
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected successfully to database: "${mongoose.connection.name}"`);

    // Listen for disconnections and auto-reconnect
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected! Attempting auto-reconnect in 3s...');
      isConnected = false;
      setTimeout(connectDB, 3000);
    });

    // Seed default data if collections are empty
    await seedDefaultData();
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    setTimeout(connectDB, 3000);
    return false;
  }
};

const seedDefaultData = async () => {
  try {
    // 1. Seed or update all 8 prizes
    for (const p of DEFAULT_PRIZES) {
      await Prize.findOneAndUpdate(
        { prizeId: p.id },
        {
          $set: {
            headline: p.headline,
            subline: p.subline,
            code: p.code,
            bgType: p.bgType,
            bgColor: p.bgColor,
            textColor: p.textColor,
            subtextColor: p.subtextColor,
            pillBg: p.pillBg,
            pillText: p.pillText,
            pillBorder: p.pillBorder,
            icon: p.icon,
            description: p.description,
            terms: p.terms,
            probability: p.probability,
          },
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ All wheel prizes verified in MongoDB.');

    // 2. Ensure customer lead with winning prize MSCHOT10 is recorded
    const existingLead = await Lead.findOne({ email: INITIAL_LEAD.email });
    if (!existingLead) {
      console.log('🌱 Seeding customer lead into MongoDB...');
      await Lead.create({
        name: INITIAL_LEAD.name,
        mobile: INITIAL_LEAD.mobile,
        email: INITIAL_LEAD.email,
        spectaclesUser: INITIAL_LEAD.spectaclesUser,
        whatsappUpdates: INITIAL_LEAD.whatsappUpdates,
        wonPrize: INITIAL_LEAD.wonPrize,
        voucherCode: INITIAL_LEAD.voucherCode || 'MSCHOT10',
        submittedAt: new Date(),
      });
      console.log('✅ Customer lead seeded successfully.');
    } else {
      // Update Sanjay's lead with the won prize MSCHOT10
      existingLead.name = INITIAL_LEAD.name;
      existingLead.mobile = INITIAL_LEAD.mobile;
      existingLead.wonPrize = INITIAL_LEAD.wonPrize;
      existingLead.voucherCode = INITIAL_LEAD.voucherCode || 'MSCHOT10';
      existingLead.submittedAt = new Date();
      await existingLead.save();
      console.log('✅ Existing customer lead updated with winning spin in MongoDB.');
    }

    // 3. Seed Settings if empty
    const settingCount = await Setting.countDocuments({ key: 'global_settings' });
    if (settingCount === 0) {
      console.log('🌱 Seeding default admin settings into MongoDB...');
      await Setting.create({
        key: 'global_settings',
        targetPrizeIndex: null,
        storeName: 'MY SPECZ',
        tagline: 'THE EYE LOVER',
        supportPhone: '+91 7868000645',
        spinsPerDay: '1',
        whatsappAutoNotify: true,
        soundEnabled: true,
        minBillAmount: '1999',
      });
      console.log('✅ Default settings seeded successfully.');
    }
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
};

// Re-export models and connection status
export { Lead, Prize, Setting, isConnected };
