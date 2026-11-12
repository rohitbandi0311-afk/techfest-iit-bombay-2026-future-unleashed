import { GeneratedCyberPass } from '../types/techfest';

/**
 * Procedural High-Resolution Cyber Pass Canvas Image Generator
 * Generates an authentic 1200x675 PNG pass with holographic accents,
 * attendee data, IIT Bombay branding, and simulated QR matrix.
 */
export function generateCyberPassDataUrl(pass: GeneratedCyberPass): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Background Cyber Gradients
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.5, '#030a1c');
    bgGrad.addColorStop(1, '#051329');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 675);

    // 2. Cyber Hex Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < 1200; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 675);
      ctx.stroke();
    }
    for (let y = 0; y < 675; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // 3. Glowing Cyber Border & Corner Brackets
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 615);

    // Corner Accents
    const cornerSize = 28;
    ctx.fillStyle = '#06b6d4';
    // Top-Left
    ctx.fillRect(26, 26, cornerSize, 6);
    ctx.fillRect(26, 26, 6, cornerSize);
    // Top-Right
    ctx.fillRect(1174 - cornerSize, 26, cornerSize, 6);
    ctx.fillRect(1168, 26, 6, cornerSize);
    // Bottom-Left
    ctx.fillRect(26, 643, cornerSize, 6);
    ctx.fillRect(26, 649 - cornerSize, 6, cornerSize);
    // Bottom-Right
    ctx.fillRect(1174 - cornerSize, 643, cornerSize, 6);
    ctx.fillRect(1168, 649 - cornerSize, 6, cornerSize);

    // 4. Holographic Foil Strip on Left Flank
    const holoGrad = ctx.createLinearGradient(50, 0, 85, 675);
    holoGrad.addColorStop(0, '#06b6d4');
    holoGrad.addColorStop(0.25, '#3b82f6');
    holoGrad.addColorStop(0.5, '#a855f7');
    holoGrad.addColorStop(0.75, '#f97316');
    holoGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = holoGrad;
    ctx.fillRect(50, 50, 16, 575);

    // 5. Techfest Brand Header
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText('TECHFEST IIT BOMBAY 2026 // 29TH EDITION', 95, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Arial Black", sans-serif';
    ctx.fillText('FUTURE UNLEASHED', 95, 135);

    // Access Tier Badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(95, 155, 260, 36);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(95, 155, 260, 36);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText(`TIER: ${pass.accessTier}`, 110, 179);

    // Zone Code Badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(370, 155, 180, 36);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(370, 155, 180, 36);
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText(pass.zoneCode, 385, 179);

    // 6. Attendee Details Table
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(95, 220, 680, 310);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.strokeRect(95, 220, 680, 310);

    // Label Helper
    const drawField = (label: string, value: string, x: number, y: number, isHighlight = false) => {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText(label.toUpperCase(), x, y);

      ctx.fillStyle = isHighlight ? '#06b6d4' : '#ffffff';
      ctx.font = isHighlight ? 'bold 24px "Arial Black", sans-serif' : 'bold 20px sans-serif';
      ctx.fillText(value, x, y + 28);
    };

    drawField('Authorized Attendee', pass.fullName, 120, 260, true);
    drawField('Academic Institution / Org', pass.institution, 120, 340);
    drawField('Primary Domain Track', pass.domainInterest, 120, 420);
    drawField('Official Pass ID', pass.passId, 480, 260, true);
    drawField('Accreditation Type', pass.attendeeType, 480, 340);
    drawField('Date Issued', pass.issuedAt, 480, 420);

    // 7. Simulated QR Code Matrix on Right Box
    const qrX = 820;
    const qrY = 220;
    const qrSize = 310;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

    // Procedural pseudo-QR pattern
    ctx.fillStyle = '#030712';
    const cells = 17;
    const cellSize = qrSize / cells;

    // Corner QR targets
    const drawQrTarget = (cx: number, cy: number) => {
      ctx.fillRect(cx * cellSize + qrX, cy * cellSize + qrY, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((cx + 1) * cellSize + qrX, (cy + 1) * cellSize + qrY, 3 * cellSize, 3 * cellSize);
      ctx.fillStyle = '#030712';
      ctx.fillRect((cx + 2) * cellSize + qrX, (cy + 2) * cellSize + qrY, cellSize, cellSize);
    };

    drawQrTarget(1, 1);
    drawQrTarget(11, 1);
    drawQrTarget(1, 11);

    // Random but deterministic hash cells based on passId
    let seed = 0;
    for (let i = 0; i < pass.passId.length; i++) {
      seed = (seed * 31 + pass.passId.charCodeAt(i)) % 100000;
    }

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        // Skip corner targets
        if ((r < 7 && c < 7) || (r < 7 && c > 9) || (r > 9 && c < 7)) continue;
        seed = (seed * 9301 + 49297) % 233280;
        if (seed / 233280 > 0.5) {
          ctx.fillRect(c * cellSize + qrX, r * cellSize + qrY, cellSize, cellSize);
        }
      }
    }

    // QR Label
    ctx.fillStyle = '#030712';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText('OFFICIAL SCAN AT GATE 1', qrX + 55, qrY + qrSize - 12);

    // 8. Barcode Simulation across bottom
    const barX = 95;
    const barY = 555;
    const barW = 680;
    const barH = 45;
    ctx.fillStyle = '#020617';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#ffffff';
    let curX = barX + 15;
    while (curX < barX + barW - 15) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const w = (seed % 4) + 1;
      const gap = (seed % 3) + 2;
      ctx.fillRect(curX, barY + 5, w, barH - 18);
      curX += w + gap;
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText(`*${pass.passId}* // CONVOCATION HALL & GYMKHANA ARENAS // VALID DEC 26-28 2026`, barX + 15, barY + barH - 3);

    // 9. Venue & Patronage Notice
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText('IIT BOMBAY, POWAI, MUMBAI - 400076 | PATRONAGE: UNESCO & UNICEF', 820, 565);
    ctx.fillText('STRICTLY NON-TRANSFERABLE | CARRIES GOVT ID REQUIREMENT', 820, 588);

    resolve(canvas.toDataURL('image/png'));
  });
}

/**
 * Triggers instant file download in browser
 */
export async function downloadCyberPassImage(pass: GeneratedCyberPass): Promise<void> {
  const dataUrl = await generateCyberPassDataUrl(pass);
  if (!dataUrl) return;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `Techfest2026_CyberPass_${pass.passId}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
