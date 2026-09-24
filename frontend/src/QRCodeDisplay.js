import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeDisplay({ requestId, verificationCode }) {

  // IMPORTANT:
  // QR must open the public verification page directly.
  const verificationUrl =
    `https://legend.ngrok-free.dev/verify/${verificationCode}`;

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');

    if (!canvas) {
      alert('QR code not found');
      return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `QR_${requestId}.png`;
    link.click();
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#f3f4f6',
        borderRadius: '0.5rem',
        marginTop: '1.5rem'
      }}
    >
      <h3
        style={{
          margin: '0 0 1rem 0',
          color: '#1f2937',
          fontWeight: '600'
        }}
      >
        📱 Scan for Verification
      </h3>

      <div
        style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          display: 'inline-block',
          marginBottom: '1rem'
        }}
      >
        <QRCodeCanvas
          value={verificationUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p
          style={{
            margin: '0 0 0.5rem 0',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}
        >
          Verification Code:
        </p>

        <p
          style={{
            margin: '0',
            color: '#1f2937',
            fontWeight: '600',
            wordBreak: 'break-all',
            fontFamily: 'monospace'
          }}
        >
          {verificationCode}
        </p>
      </div>

      <button
        onClick={downloadQR}
        style={{
          marginTop: '1rem',
          background: '#1f2937',
          color: '#ffffff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        ⬇️ Download QR
      </button>

      <p
        style={{
          margin: '1rem 0 0 0',
          color: '#9ca3af',
          fontSize: '0.75rem'
        }}
      >
        Scan with your phone camera to verify authenticity
      </p>
    </div>
  );
}