export const generateLeadsCSV = (leads) => {
  const headers = [
    'Lead ID',
    'Full Name',
    'Mobile Number',
    'Email Address',
    'Spectacles User',
    'WhatsApp Updates',
    'Prize Won',
    'Voucher Code',
    'Submitted At',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map((lead) => {
    const spectaclesLabel =
      lead.spectaclesUser === 'yes'
        ? 'Yes (Spectacles)'
        : lead.spectaclesUser === 'sunglasses_only'
        ? 'Sunglasses Only'
        : 'No';

    const prizeLabel = lead.wonPrize
      ? `${lead.wonPrize.headline} ${lead.wonPrize.subline}`.trim()
      : 'Pending Spin';

    const voucherCode = lead.voucherCode || lead.wonPrize?.voucherCode || lead.wonPrize?.code || 'N/A';

    return [
      escapeCSV(lead.id),
      escapeCSV(lead.name),
      escapeCSV(lead.mobile),
      escapeCSV(lead.email),
      escapeCSV(spectaclesLabel),
      escapeCSV(lead.whatsappUpdates ? 'Yes' : 'No'),
      escapeCSV(prizeLabel),
      escapeCSV(voucherCode),
      escapeCSV(lead.submittedAt),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

