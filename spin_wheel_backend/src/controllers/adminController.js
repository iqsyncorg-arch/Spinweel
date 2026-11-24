import { Lead } from '../models/Lead.js';
import { Prize } from '../models/Prize.js';
import { Setting } from '../models/Setting.js';
import { DEFAULT_PRIZES } from '../config/defaultPrizes.js';

// Pre-configured Admin Credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@myspecz.com',
  altEmail: 'admin',
  password: 'admin123',
  altPassword: 'specz2026',
  user: {
    id: 'admin-1',
    name: 'Sanjay S N',
    email: 'admin@myspecz.com',
    role: 'Super Admin',
  },
};

export const loginAdmin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const isEmailValid =
      cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() ||
      cleanEmail === ADMIN_CREDENTIALS.altEmail.toLowerCase();
    const isPasswordValid =
      cleanPass === ADMIN_CREDENTIALS.password ||
      cleanPass === ADMIN_CREDENTIALS.altPassword;

    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials. Use admin@myspecz.com / admin123',
      });
    }

    const token = `specz_admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: ADMIN_CREDENTIALS.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyAdminSession = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    res.json({
      success: true,
      user: ADMIN_CREDENTIALS.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Setting.create({
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
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({
      success: true,
      message: 'Settings updated successfully in MongoDB',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTargetIndex = async (req, res) => {
  try {
    const settings = (await Setting.findOne({ key: 'global_settings' })) || { targetPrizeIndex: null };
    let prizes = await Prize.find().sort({ createdAt: 1 });
    if (!prizes || prizes.length === 0) prizes = DEFAULT_PRIZES;

    const targetIdx = settings.targetPrizeIndex;

    res.json({
      success: true,
      targetPrizeIndex: targetIdx,
      targetPrize: targetIdx !== null && prizes[targetIdx] ? prizes[targetIdx] : null,
      mode: targetIdx === null ? 'random_probability' : 'forced_admin_target',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const setTargetIndex = async (req, res) => {
  try {
    const { targetIndex } = req.body;
    let prizes = await Prize.find().sort({ createdAt: 1 });
    if (!prizes || prizes.length === 0) prizes = DEFAULT_PRIZES;

    const updatedSettings = await Setting.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: { targetPrizeIndex: targetIndex } },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message:
        targetIndex === null
          ? 'Fair random probability distribution enabled'
          : `Forced outcome configured to segment #${targetIndex + 1}: ${prizes[targetIndex]?.code || targetIndex}`,
      targetPrizeIndex: updatedSettings.targetPrizeIndex,
      targetPrize: targetIndex !== null ? prizes[targetIndex] : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalLeads, totalSpins, specUsersCount, sunUsersCount, nonUsersCount, leads, prizesDoc, settings] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ wonPrize: { $ne: null } }),
        Lead.countDocuments({ spectaclesUser: 'yes' }),
        Lead.countDocuments({ spectaclesUser: 'sunglasses_only' }),
        Lead.countDocuments({ spectaclesUser: 'no' }),
        Lead.find().sort({ submittedAt: -1 }).limit(10),
        Prize.find().sort({ createdAt: 1 }),
        Setting.findOne({ key: 'global_settings' }),
      ]);

    const prizes = prizesDoc.length > 0 ? prizesDoc : DEFAULT_PRIZES;

    // Real Prize Win Breakdown
    const prizeWins = {};
    prizes.forEach((p) => {
      prizeWins[p.code] = {
        id: p.prizeId || p.id,
        code: p.code,
        headline: p.headline,
        subline: p.subline,
        probability: p.probability,
        bgType: p.bgType,
        count: 0,
      };
    });

    const allWonLeads = await Lead.find({ wonPrize: { $ne: null } });
    allWonLeads.forEach((l) => {
      if (l.wonPrize?.code && prizeWins[l.wonPrize.code]) {
        prizeWins[l.wonPrize.code].count += 1;
      }
    });

    // Compute Day of Week spins
    const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    allWonLeads.forEach((l) => {
      if (l.submittedAt) {
        const d = new Date(l.submittedAt);
        const dayName = dayMap[d.getDay()];
        if (dayCounts[dayName] !== undefined) dayCounts[dayName] += 1;
      }
    });

    res.json({
      success: true,
      stats: {
        totalLeads,
        totalSpins,
        totalPrizes: prizes.length,
        claimRate: totalLeads > 0 ? Math.round((totalSpins / totalLeads) * 100) : 100,
        demographics: {
          spectaclesUsers: { count: specUsersCount, percent: totalLeads ? Math.round((specUsersCount / totalLeads) * 100) : 0 },
          sunglassesOnly: { count: sunUsersCount, percent: totalLeads ? Math.round((sunUsersCount / totalLeads) * 100) : 0 },
          nonUsers: { count: nonUsersCount, percent: totalLeads ? Math.round((nonUsersCount / totalLeads) * 100) : 0 },
        },
        prizesWonBreakdown: Object.values(prizeWins),
        forcedTargetIndex: settings?.targetPrizeIndex ?? null,
        recentLeads: leads,
        dailySpinsTimeline: [
          { day: 'Mon', spins: dayCounts.Mon },
          { day: 'Tue', spins: dayCounts.Tue },
          { day: 'Wed', spins: dayCounts.Wed },
          { day: 'Thu', spins: dayCounts.Thu },
          { day: 'Fri', spins: dayCounts.Fri },
          { day: 'Sat', spins: dayCounts.Sat },
          { day: 'Sun', spins: dayCounts.Sun },
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
