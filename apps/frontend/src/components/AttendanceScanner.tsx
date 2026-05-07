import { useEffect, useRef, useState } from 'react';
import {
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType,
} from 'html5-qrcode';
import { attendanceApi, type AttendanceScanResult } from '../services/attendance';

interface AttendanceScannerProps {
  token: string;
}

// ─── Info Item ────────────────────────────────────────────────────────────────
function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', lineHeight: 1.3 }}>
        {value}
      </div>
    </div>
  );
}

// ─── Verification Modal ───────────────────────────────────────────────────────
interface VerificationModalProps {
  result: AttendanceScanResult;
  onClose: () => void;
}

function VerificationModal({ result, onClose }: VerificationModalProps) {
  const { employee, attendance } = result;

  const roleLabel: Record<string, string> = {
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
  };

  const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
    present: { text: 'Hadir Tepat Waktu', color: '#065f46', bg: '#d1fae5' },
    late: { text: `Terlambat ${attendance.late_minutes} menit`, color: '#92400e', bg: '#fef3c7' },
  };

  const statusInfo = statusLabel[attendance.status] ?? { text: attendance.status, color: '#374151', bg: '#f3f4f6' };

  const checkInTime = attendance.check_in_at
    ? new Date(attendance.check_in_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <>
      <style>{`
        @keyframes verif-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes verif-slideUp {
          from { transform: translateY(28px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'verif-fadeIn 0.2s ease',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            animation: 'verif-slideUp 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                Verifikasi Identitas
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            {/* Photo + name */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '3px solid #e0e7ff',
                  background: '#f1f5f9',
                }}
              >
                {employee.photo_url ? (
                  <img
                    src={employee.photo_url}
                    alt={employee.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default-profile.svg';
                    }}
                  />
                ) : (
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                    <rect width="80" height="80" fill="#e0e7ff" />
                    <circle cx="40" cy="30" r="14" fill="#818cf8" />
                    <ellipse cx="40" cy="66" rx="24" ry="16" fill="#818cf8" />
                  </svg>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '4px' }}>
                  {employee.full_name}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>
                  {employee.employee_number}
                </div>
                {employee.user && (
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#ede9fe',
                    color: '#5b21b6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    {roleLabel[employee.user.role] ?? employee.user.role}
                  </span>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <InfoItem icon="🏢" label="Department" value={employee.department?.name ?? '-'} />
              <InfoItem icon="💼" label="Jabatan" value={employee.job_title ?? '-'} />
              <InfoItem icon="🕐" label="Jam Masuk" value={checkInTime} />
              <InfoItem icon="📅" label="Tanggal" value={attendance.date} />
            </div>

            {/* Status badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: statusInfo.bg,
                marginBottom: '20px',
                border: `1.5px solid ${statusInfo.color}33`,
              }}
            >
              <span style={{ fontSize: '20px' }}>
                {attendance.status === 'present' ? '✅' : '⚠️'}
              </span>
              <span style={{ fontWeight: 700, fontSize: '14px', color: statusInfo.color }}>
                {statusInfo.text}
              </span>
            </div>

            {/* Confirmation note */}
            <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '16px', lineHeight: 1.5 }}>
              Pastikan identitas di atas sesuai dengan orang yang melakukan scan.
            </p>

            {/* CTA button */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'opacity 0.15s',
              }}
            >
              Konfirmasi &amp; Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Scanner ─────────────────────────────────────────────────────────────
export function AttendanceScanner({ token }: AttendanceScannerProps) {
  const scannerContainerIdRef = useRef(`attendance-scanner-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const lastDecodedTokenRef = useRef('');
  const [cameraError, setCameraError] = useState('');
  const [cameraMessage, setCameraMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<AttendanceScanResult | null>(null);

  const handleCloseModal = () => {
    setVerificationResult(null);
  };

  const submitToken = async (qrToken: string) => {
    if (!qrToken || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setCameraError('');
    setCameraMessage('Memproses QR...');

    try {
      const result = await attendanceApi.scanQrCode(token, qrToken);

      // Show verification popup modal
      setVerificationResult(result);
      setCameraMessage('');

      // Auto-dismiss after 8 seconds
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = window.setTimeout(() => {
        setVerificationResult(null);
        successTimerRef.current = null;
      }, 8000);

      try {
        await scannerRef.current?.clear();
      } catch {
        // ignore clear errors after success
      }
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : 'QR gagal diproses');
      setCameraMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const containerId = scannerContainerIdRef.current;

    const renderScanner = async () => {
      try {
        setCameraError('');
        setCameraMessage('Menyalakan kamera...');

        const scanner = new Html5QrcodeScanner(
          containerId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
            disableFlip: false,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          },
          false,
        );

        scannerRef.current = scanner;

        scanner.render(
          async (decodedText) => {
            if (!mounted) {
              return;
            }

            const raw = String(decodedText || '').trim();
            if (!raw || raw === lastDecodedTokenRef.current || isSubmitting) {
              return;
            }

            lastDecodedTokenRef.current = raw;
            await submitToken(raw);
          },
          (errorMessage) => {
            if (!mounted) {
              return;
            }

            const message = String(errorMessage || '').trim();
            if (message) {
              setCameraMessage('Arahkan kamera ke QR absensi admin.');
            }
          },
        );
      } catch (error) {
        if (!mounted) return;
        setCameraMessage('');
        setCameraError(
          error instanceof Error
            ? error.message
            : 'Kamera tidak bisa diaktifkan.',
        );
      }
    };

    void renderScanner();

    return () => {
      mounted = false;
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        void scanner.clear().catch(() => {
          // ignore cleanup errors
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* Verification Modal */}
      {verificationResult && (
        <VerificationModal result={verificationResult} onClose={handleCloseModal} />
      )}

      <div className="scanner-card">
        {cameraError && <div className="alert-error">{cameraError}</div>}
        {cameraMessage && <div className="alert-info">{cameraMessage}</div>}

        <div className="scanner-preview-wrap">
          <div id={scannerContainerIdRef.current} className="scanner-preview scanner-live-region" />
          <div className="scanner-frame" aria-hidden="true" />
        </div>

        <div className="scanner-hint">
          <p className="subtext">Arahkan QR ke dalam frame untuk scan otomatis.</p>
        </div>

        <div className="scanner-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => window.location.reload()}
            disabled={isSubmitting}
          >
            Mulai Ulang
          </button>
        </div>
      </div>
    </>
  );
}
