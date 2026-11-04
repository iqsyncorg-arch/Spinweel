import React, { useState } from 'react';
import { User, Phone, Mail, Glasses, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

export const LeadModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    spectaclesUser: initialData?.spectaclesUser || 'yes', // 'yes' | 'sunglasses_only' | 'no'
    whatsappUpdates: true,
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      errs.mobile = 'Please enter your 10-digit mobile number';
    } else if (cleanMobile.length !== 10) {
      errs.mobile = 'Mobile number must be exactly 10 digits';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.spectaclesUser) {
      errs.spectaclesUser = 'Please choose whether you wear spectacles';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playClick();

    if (validate()) {
      const cleanData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.replace(/\D/g, ''),
        submittedAt: new Date().toISOString(),
      };
      onSubmit(cleanData);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="lead-modal-card">
        {/* Close Button */}
        {onClose && (
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        )}

        {/* Header Badge */}
        <div className="modal-header-badge">
          <Sparkles size={16} className="badge-sparkle-icon" />
          <span>EXCLUSIVE EYEWEAR REWARDS</span>
        </div>

        <h2 className="modal-title">Enter Details to Spin & Win! 🎯</h2>
        <p className="modal-subtitle">
          Unlock the golden wheel to win up to <strong>70% OFF</strong>, free frames, sunglasses & instant cashback!
        </p>

        <form onSubmit={handleSubmit} className="lead-form">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              <User size={15} />
              <span>Full Name</span>
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.name ? 'has-error' : ''}`}>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                className="form-input"
              />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label">
              <Phone size={15} />
              <span>Mobile Number (WhatsApp)</span>
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper prefix-wrapper ${errors.mobile ? 'has-error' : ''}`}>
              <span className="country-prefix">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="98765 43210"
                value={formData.mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, mobile: val });
                  if (errors.mobile) setErrors({ ...errors, mobile: null });
                }}
                className="form-input prefix-input"
              />
            </div>
            {errors.mobile && <span className="field-error">{errors.mobile}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={15} />
              <span>Email Address</span>
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                className="form-input"
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Spectacles User Question */}
          <div className="form-group">
            <label className="form-label">
              <Glasses size={15} />
              <span>Are you a Spectacles User?</span>
              <span className="required-star">*</span>
            </label>
            <div className="spectacles-options-grid">
              <button
                type="button"
                className={`option-btn ${formData.spectaclesUser === 'yes' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, spectaclesUser: 'yes' })}
              >
                <span className="option-icon">👓</span>
                <span className="option-text">Yes, I wear daily</span>
                {formData.spectaclesUser === 'yes' && <CheckCircle2 size={16} className="checked-icon" />}
              </button>

              <button
                type="button"
                className={`option-btn ${formData.spectaclesUser === 'sunglasses_only' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, spectaclesUser: 'sunglasses_only' })}
              >
                <span className="option-icon">🕶️</span>
                <span className="option-text">Sunglasses / Lenses</span>
                {formData.spectaclesUser === 'sunglasses_only' && <CheckCircle2 size={16} className="checked-icon" />}
              </button>

              <button
                type="button"
                className={`option-btn ${formData.spectaclesUser === 'no' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, spectaclesUser: 'no' })}
              >
                <span className="option-icon">🔍</span>
                <span className="option-text">No / First Time</span>
                {formData.spectaclesUser === 'no' && <CheckCircle2 size={16} className="checked-icon" />}
              </button>
            </div>
            {errors.spectaclesUser && <span className="field-error">{errors.spectaclesUser}</span>}
          </div>

          {/* WhatsApp updates consent */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.whatsappUpdates}
              onChange={(e) => setFormData({ ...formData, whatsappUpdates: e.target.checked })}
              className="checkbox-input"
            />
            <span className="checkbox-text">
              Send winning coupon code and voucher claim link directly to my WhatsApp & SMS
            </span>
          </label>

          {/* Submit Button */}
          <button type="submit" className="submit-lead-btn">
            <span>Unlock My Lucky Spin</span>
            <span className="btn-arrow">➔</span>
          </button>
        </form>

        <div className="modal-privacy-note">
          🔒 Your details are 100% secure. Only 1 spin per registered mobile number.
        </div>
      </div>
    </div>
  );
};
