import { PRIZES } from './prizes';

export const LOCAL_STORAGE_LEADS_KEY = 'myspecs_wheel_leads_v2';
export const LOCAL_STORAGE_CURRENT_LEAD_KEY = 'myspecs_current_lead_v2';
export const LOCAL_STORAGE_TARGET_KEY = 'myspecs_target_prize_index_v2';

// Specific initial lead requested by user:
// Sanjay S N | 7868000645 | snsanjay2002@gmail.com | 👓 Yes | MSC70OFF | 21:08
export const INITIAL_LEAD = {
  id: 'lead-sanjay-sn-1',
  name: 'Sanjay S N',
  mobile: '7868000645',
  email: 'snsanjay2002@gmail.com',
  spectaclesUser: 'yes',
  whatsappUpdates: true,
  wonPrize: PRIZES[0], // 70% Discount on Spectacle (MSC70OFF)
  submittedAt: new Date(new Date().setHours(21, 8, 0, 0)).toISOString(),
};

export const getStoredLeads = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return [INITIAL_LEAD];
};

export const getStoredTargetIndex = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TARGET_KEY);
    if (saved !== null && saved !== undefined && saved !== '') {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < PRIZES.length) return idx;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};
