import mongoose from 'mongoose';
import { Lead } from '../models/Lead.js';
import { Prize } from '../models/Prize.js';
import { Setting } from '../models/Setting.js';
import { DEFAULT_PRIZES } from '../config/defaultPrizes.js';

const pickPrizeByProbability = (prizes) => {
  const totalWeight = prizes.reduce((sum, p) => sum + (p.probability || 0.15), 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < prizes.length; i++) {
    const weight = prizes[i].probability || 0.15;
    if (random < weight) {
      return { prize: prizes[i], index: i };
    }
    random -= weight;
  }
  return { prize: prizes[0], index: 0 };
};

export const executeSpin = async (req, res) => {
  try {
    const {
      leadId,
      mobile,
      email,
      name,
      spectaclesUser,
      forceIndex,
      prize,
      prizeCode,
      prizeId,
      voucherCode: customVoucherCode,
    } = req.body;

    let prizes = await Prize.find().sort({ createdAt: 1 });
    if (!prizes || prizes.length === 0) {
      prizes = DEFAULT_PRIZES;
    }

    const settings = (await Setting.findOne({ key: 'global_settings' })) || { targetPrizeIndex: null };

    // 1. Locate Lead in MongoDB safely (avoiding CastError on custom string ids)
    let lead = null;
    if (leadId && mongoose.Types.ObjectId.isValid(leadId)) {
      lead = await Lead.findById(leadId);
    }
    if (!lead && email) {
      lead = await Lead.findOne({ email: String(email).trim().toLowerCase() });
    }
    if (!lead && mobile) {
      lead = await Lead.findOne({ mobile: String(mobile).replace(/\D/g, '') });
    }

    // 2. If no lead exists in MongoDB, create one so the spin is NEVER lost!
    if (!lead) {
      const cleanEmail = email ? String(email).trim().toLowerCase() : `visitor-${Date.now()}@myspecz.com`;
      const cleanMobile = mobile ? String(mobile).replace(/\D/g, '') : `98${Math.floor(10000000 + Math.random() * 90000000)}`;
      lead = new Lead({
        name: name || 'Sanjay S N',
        email: cleanEmail,
        mobile: cleanMobile,
        spectaclesUser: spectaclesUser || 'yes',
        whatsappUpdates: true,
        submittedAt: new Date(),
      });
    }

    // 3. Determine winning segment
    let winningIndex = 0;
    let winningPrize = null;

    // Check if the client provided the exact prize won on the wheel (e.g. MSCHOT10)
    const targetCode = prizeCode || prize?.code;
    if (targetCode) {
      const matchIdx = prizes.findIndex((p) => p.code.toUpperCase() === targetCode.toUpperCase());
      if (matchIdx !== -1) {
        winningIndex = matchIdx;
        winningPrize = prizes[matchIdx];
      }
    }

    if (!winningPrize && prizeId) {
      const matchIdx = prizes.findIndex((p) => (p.prizeId || p.id) === prizeId);
      if (matchIdx !== -1) {
        winningIndex = matchIdx;
        winningPrize = prizes[matchIdx];
      }
    }

    // If not matched, evaluate by forceIndex or probability
    if (!winningPrize) {
      if (forceIndex !== undefined && forceIndex !== null && forceIndex >= 0 && forceIndex < prizes.length) {
        winningIndex = Number(forceIndex);
        winningPrize = prizes[winningIndex];
      } else if (settings.targetPrizeIndex !== null && settings.targetPrizeIndex >= 0 && settings.targetPrizeIndex < prizes.length) {
        winningIndex = Number(settings.targetPrizeIndex);
        winningPrize = prizes[winningIndex];
      } else {
        const outcome = pickPrizeByProbability(prizes);
        winningIndex = outcome.index;
        winningPrize = outcome.prize;
      }
    }

    // 4. Voucher Code - Lifetime validity, no expiry
    const voucherCode = customVoucherCode || winningPrize.code;

    const voucherDetails = {
      code: voucherCode,
      baseCode: winningPrize.code,
      headline: winningPrize.headline,
      subline: winningPrize.subline,
      description: winningPrize.description,
      terms: winningPrize.terms,
      issuedAt: new Date().toISOString(),
      expiresAt: null, // Lifetime validity, no expiry
      validity: 'Lifetime Validity (No Expiry)',
      redeemed: false,
    };

    // 5. Update lead in MongoDB
    const prizePayload = {
      id: winningPrize.prizeId || winningPrize.id,
      headline: winningPrize.headline,
      subline: winningPrize.subline,
      code: winningPrize.code,
      description: winningPrize.description,
      terms: winningPrize.terms,
      voucherCode,
      validity: 'Lifetime Validity (No Expiry)',
      wonAt: new Date(),
    };

    lead.wonPrize = prizePayload;
    lead.voucherCode = voucherCode;
    lead.submittedAt = new Date(); // Update timestamp so it appears at top of live activity stream
    if (name) lead.name = name;
    if (mobile) lead.mobile = String(mobile).replace(/\D/g, '');
    if (spectaclesUser) lead.spectaclesUser = spectaclesUser;

    const savedLead = await lead.save();

    console.log(`🎯 [SPIN SAVED] Customer: ${savedLead.name} (${savedLead.email}) won ${winningPrize.code} (${winningPrize.headline} ${winningPrize.subline})`);

    res.json({
      success: true,
      alreadySpun: false,
      message: 'Spin recorded in MongoDB successfully',
      targetPrizeIndex: winningIndex,
      prize: winningPrize,
      voucher: voucherDetails,
      lead: savedLead,
    });
  } catch (err) {
    console.error('Spin Execution Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearLeadSpin = async (req, res) => {
  try {
    const { leadId, email, mobile } = req.body;
    let lead = null;
    if (leadId && mongoose.Types.ObjectId.isValid(leadId)) {
      lead = await Lead.findById(leadId);
    }
    if (!lead && email) {
      lead = await Lead.findOne({ email: String(email).trim().toLowerCase() });
    }
    if (!lead && mobile) {
      lead = await Lead.findOne({ mobile: String(mobile).replace(/\D/g, '') });
    }

    if (lead) {
      lead.wonPrize = null;
      lead.voucherCode = null;
      await lead.save();
      console.log(`🔄 [SPIN CLEARED] Customer: ${lead.name} (${lead.email}) spin reset in MongoDB`);
    }

    res.json({ success: true, message: 'User spin cleared successfully in MongoDB', lead });
  } catch (err) {
    console.error('Clear Lead Spin Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Voucher code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();

    const matchedLead = await Lead.findOne({
      $or: [
        { voucherCode: cleanCode },
        { 'wonPrize.voucherCode': cleanCode },
        { 'wonPrize.code': cleanCode },
      ],
    });

    if (!matchedLead) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid voucher code. Not found in MongoDB database.',
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Voucher verified successfully from MongoDB',
      data: {
        customerName: matchedLead.name,
        customerMobile: matchedLead.mobile,
        customerEmail: matchedLead.email,
        prize: matchedLead.wonPrize,
        voucherCode: cleanCode,
        validity: 'Lifetime Validity (No Expiry)',
        claimedAt: matchedLead.submittedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
