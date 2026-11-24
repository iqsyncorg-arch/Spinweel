export const validateLead = (req, res, next) => {
  const { name, mobile, email, spectaclesUser } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  if (!cleanMobile || cleanMobile.length !== 10) {
    errors.mobile = 'Mobile number must be exactly 10 digits';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    errors.email = 'Please provide a valid email address';
  }

  const validSpectacles = ['yes', 'sunglasses_only', 'no'];
  if (spectaclesUser && !validSpectacles.includes(spectaclesUser)) {
    errors.spectaclesUser = 'Spectacles user must be one of: yes, sunglasses_only, no';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body.name = name.trim();
  req.body.mobile = cleanMobile;
  req.body.email = email.trim().toLowerCase();
  req.body.spectaclesUser = spectaclesUser || 'yes';
  req.body.whatsappUpdates = req.body.whatsappUpdates !== false;

  next();
};

export const validateTargetIndex = (req, res, next) => {
  const { targetIndex } = req.body;

  if (targetIndex === null || targetIndex === undefined || targetIndex === '') {
    req.body.targetIndex = null;
    return next();
  }

  const idx = Number(targetIndex);
  if (!Number.isInteger(idx) || idx < 0 || idx > 6) {
    return res.status(400).json({
      success: false,
      message: 'targetIndex must be an integer between 0 and 6, or null',
    });
  }

  req.body.targetIndex = idx;
  next();
};

