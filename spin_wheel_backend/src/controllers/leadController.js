import { Lead } from '../models/Lead.js';
import { INITIAL_LEAD } from '../config/defaultPrizes.js';
import { generateLeadsCSV } from '../utils/csvExporter.js';

export const getLeads = async (req, res) => {
  try {
    const { search, spectaclesUser, sort = 'desc' } = req.query;
    const filter = {};

    if (search) {
      const q = String(search).trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { 'wonPrize.code': { $regex: q, $options: 'i' } },
        { voucherCode: { $regex: q, $options: 'i' } },
      ];
    }

    if (spectaclesUser && spectaclesUser !== 'all') {
      filter.spectaclesUser = spectaclesUser;
    }

    const sortOrder = sort === 'asc' ? 1 : -1;
    const leads = await Lead.find(filter).sort({ submittedAt: sortOrder });

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, mobile, email, spectaclesUser, whatsappUpdates } = req.body;
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = String(mobile).replace(/\D/g, '');

    // Check if customer with this email or mobile already exists
    const existing = await Lead.findOne({
      $or: [{ email: cleanEmail }, { mobile: cleanMobile }],
    });

    if (existing) {
      // Support re-spin if explicitly requested
      if (req.body.allowRespin || req.body.resetSpin) {
        existing.wonPrize = null;
        existing.voucherCode = null;
        if (name) existing.name = name;
        if (cleanMobile) existing.mobile = cleanMobile;
        if (spectaclesUser) existing.spectaclesUser = spectaclesUser;
        const updated = await existing.save();
        return res.status(200).json({
          success: true,
          alreadySpun: false,
          message: 'Lead reset for spin',
          isExisting: true,
          data: updated,
        });
      }

      // If customer has already spun, enforce single spin rule
      if (existing.wonPrize) {
        return res.status(200).json({
          success: true,
          alreadySpun: true,
          message: `This email (${existing.email}) has already spun the wheel and claimed a reward!`,
          isExisting: true,
          data: existing,
        });
      }

      // Customer registered but hasn't spun yet - update contact info
      existing.name = name;
      existing.mobile = cleanMobile;
      existing.email = cleanEmail;
      existing.spectaclesUser = spectaclesUser;
      existing.whatsappUpdates = whatsappUpdates !== false;
      const updated = await existing.save();

      return res.status(200).json({
        success: true,
        alreadySpun: false,
        message: 'Lead updated successfully',
        isExisting: true,
        data: updated,
      });
    }

    const newLead = await Lead.create({
      name,
      mobile: cleanMobile,
      email: cleanEmail,
      spectaclesUser: spectaclesUser || 'yes',
      whatsappUpdates: whatsappUpdates !== false,
      wonPrize: null,
      submittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      alreadySpun: false,
      message: 'Lead registered successfully in MongoDB',
      isExisting: false,
      data: newLead,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted from MongoDB successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetLeads = async (req, res) => {
  try {
    await Lead.deleteMany({});
    const defaultLead = await Lead.create({
      name: INITIAL_LEAD.name,
      mobile: INITIAL_LEAD.mobile,
      email: INITIAL_LEAD.email,
      spectaclesUser: INITIAL_LEAD.spectaclesUser,
      whatsappUpdates: INITIAL_LEAD.whatsappUpdates,
      wonPrize: INITIAL_LEAD.wonPrize,
      voucherCode: INITIAL_LEAD.voucherCode || 'MSCHOT10',
      submittedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'All leads reset to initial test lead in MongoDB successfully',
      data: [defaultLead],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const exportLeadsCSV = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ submittedAt: -1 });
    const csvContent = generateLeadsCSV(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="myspecz_leads_${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
