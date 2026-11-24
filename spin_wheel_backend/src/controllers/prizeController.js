import { Prize } from '../models/Prize.js';
import { DEFAULT_PRIZES } from '../config/defaultPrizes.js';

export const getPrizes = async (req, res) => {
  try {
    let prizes = await Prize.find().sort({ createdAt: 1 });
    if (!prizes || prizes.length === 0) {
      prizes = DEFAULT_PRIZES;
    }
    res.json({
      success: true,
      count: prizes.length,
      data: prizes,
    });
  } catch (err) {
    res.json({
      success: true,
      count: DEFAULT_PRIZES.length,
      data: DEFAULT_PRIZES,
    });
  }
};

export const getPrizeById = async (req, res) => {
  try {
    const prize =
      (await Prize.findOne({ prizeId: req.params.id })) ||
      (await Prize.findById(req.params.id).catch(() => null));

    if (!prize) {
      return res.status(404).json({ success: false, message: 'Prize not found' });
    }
    res.json({ success: true, data: prize });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePrize = async (req, res) => {
  try {
    const updated = await Prize.findOneAndUpdate(
      { $or: [{ prizeId: req.params.id }, { _id: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Prize not found' });
    }
    res.json({
      success: true,
      message: 'Prize configuration updated in MongoDB',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
