# 🎡 Spectacle & Eyewear Spin-the-Wheel React Application

A high-converting promotional **Spin & Win Lucky Wheel** built in **React + Vite** designed for optical stores, spectacle retailers, and eyewear brands.

---

## 🌟 Key Features

1. **Pre-Spin Lead Capture Modal**:
   - Compulsory lead form before spinning:
     - **Full Name** (validation enabled)
     - **10-Digit Mobile Number** (validation enabled)
     - **Email Address** (format validation)
     - **Spectacles User Option**: `Yes, I wear daily` | `Sunglasses / Plano only` | `No, looking for family`
     - **WhatsApp Updates checkbox** for instant voucher delivery.
   - User identity persistence in `localStorage`.
   - Verified user chip with "Change" option.

2. **Accurate 7-Segment Lucky Wheel**:
   - Styled after high-conversion optical wheel promotions:
     - **Segment 1**: `70% Discount on Spectacle` (Code: `MSC70OFF`)
     - **Segment 2**: `Get Powered Sunglasses Free on Your Specz Purchase` (Code: `MSCSUNFREE`)
     - **Segment 3**: `10% Hot Cash Back` (Code: `MSCHOT10`)
     - **Segment 4**: `1st Lens or 1st Frame Free` (Code: `MSC1STFREE`)
     - **Segment 5**: `Spectacle Kit Free` (Code: `MSCKITFREE`)
     - **Segment 6**: `Sunglasses Free on Contact Lenses*` (Code: `MSCSUNONCL`)
     - **Segment 7**: `Extra Mileage (2nd Option)` (Code: `MSCXM2`)
   - Alternating crimson red & pure white segments with golden borders and metallic hub.
   - Segment-specific vector icons (prescription frames, sunglasses, wallet cashback, spray cleaning kit, contact lenses, speed warranty).
   - Dynamic ticker tick sound on each segment pass using Web Audio API synthesis (no external audio files needed).

3. **Prize Celebration Modal**:
   - Multi-stage confetti celebration cannon via `canvas-confetti`.
   - Instant voucher code display with 1-click **Copy to Clipboard**.
   - Direct **Share to WhatsApp** with pre-formatted winning message.
   - 24-hour urgency countdown timer.
   - "Play Again / Next Visitor" reset trigger.

4. **Admin & Developer Testing Drawer**:
   - Force any segment (1 through 7) or keep true weighted random probability to test wheel precision.
   - Real-time customer lead tracker showing submitted details, won prize, and coupon codes.
   - One-click **Export to CSV** for marketing team import into CRM.
   - Clear test leads button.

---

## 🚀 Running the Project

```bash
# Navigate to project directory
cd spectacle-spin-wheel

# Install dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
Local dev server runs at: `http://localhost:5175/` (or next available port).
