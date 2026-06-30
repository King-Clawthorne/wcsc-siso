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
  const [devices, setDevices] = useState([]);
  const [deviceIndex, setDeviceIndex] = useState(0);

  // Enumerate available cameras once so we can offer a toggle.
  useEffect(() => {
    let cancelled = false;
    BrowserMultiFormatReader.listVideoInputDevices()
      .then((found) => {
        if (!cancelled) setDevices(found);
      })
      .catch(() => {
        // Device enumeration may be blocked until permission is granted;
        // the scanner still works with the default camera.
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        setStatus('Point your camera at the barcode…');

        // Use the explicitly selected camera if we have one, otherwise prefer
        // the rear-facing camera.
        const selectedDevice = devices[deviceIndex];
        const constraints = {
          video: selectedDevice
            ? { deviceId: { exact: selectedDevice.deviceId } }
            : { facingMode: { ideal: 'environment' } },
          audio: false,
        };
        constraints.video.width = { ideal: 1920 };
        constraints.video.height = { ideal: 1080 };

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

        // First successful start reveals the full device list (labels need
        // permission), so refresh it if we didn't have it yet.
        if (devices.length === 0) {
          const found = await BrowserMultiFormatReader.listVideoInputDevices();
          if (!cancelled) setDevices(found);
        }
      } catch (err) {
        setError('Could not access camera: ' + (err?.message || err));
      }
    }

    start();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
    // onScan is intentionally excluded; restart only on resetKey/device change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, deviceIndex, devices]);

  function switchCamera() {
    if (devices.length < 2) return;
    controlsRef.current?.stop();
    setDeviceIndex((i) => (i + 1) % devices.length);
  }

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

        {devices.length > 1 && (
          <button
            type="button"
            className="action-btn"
            onClick={switchCamera}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
            }}
          >
            Switch camera
          </button>
        )}
      </div>
    </div>
  );
}
