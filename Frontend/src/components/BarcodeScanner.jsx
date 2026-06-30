import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';

// Presentational/reusable scanner. Calls onScan(value) once a barcode is read.
// Pass a changing `resetKey` to restart the camera for another scan.
export default function BarcodeScanner({ onScan, resetKey = 0 }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Starting camera…');

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 100,
    });
    let cancelled = false;

    async function start() {
      try {
        if (!videoRef.current || cancelled) return;
        setError(null);
        setStatus('Point the front camera at the barcode…');

        // Target hardware is an M4 iPad Pro: always use the front-facing
        // (user) camera. The 1920x1080 hint keeps the standard wide lens
        // rather than the ultra-wide framing.
        const constraints = {
          video: {
            facingMode: { exact: 'user' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        const controls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result) => {
            if (result) {
              const value = result.getText();
              controls.stop();
              onScan(value);
            }
          },
        );
        controlsRef.current = controls;
      } catch (err) {
        setError('Could not access camera: ' + (err?.message || err));
      }
    }

    start();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
    // onScan is intentionally excluded; restart only on resetKey change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  if (error) {
    return <p style={{ color: '#ff6b6b' }}>{error}</p>;
  }

  return (
    <div>
      <p>{status}</p>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '640px',
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            width: '100%',
            display: 'block',
            borderRadius: '12px',
            background: '#000',
          }}
        />
      </div>
    </div>
  );
}
