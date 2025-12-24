import React, { useEffect, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';
import { bakeEditedImageToPngDataUrl } from './imageProcessing';

function useMediaQuery(query) {
  const getMatch = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    // Safari < 14 fallback
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

const TARGET_WIDTH = 1500;
const TARGET_HEIGHT = 2100;
const CARD_ASPECT = TARGET_WIDTH / TARGET_HEIGHT; // 5:7

export default function OverlayImageEditorModal({
  isOpen,
  imageSrc,
  title = 'Edit Reference Image',
  onCancel,
  onApply,
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  const [mode, setMode] = useState('crop'); // 'crop' | 'shrink_to_fit'
  const [aspectMode, setAspectMode] = useState('card'); // 'card' | 'original'

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY] = useState(false); // keep option internally; not exposed yet

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [mediaAspect, setMediaAspect] = useState(null);

  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);

  // Reset editor state each time we open a new image.
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setIsApplying(false);
    setMode('crop');
    setAspectMode('card');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipX(false);
    setCroppedAreaPixels(null);
    setMediaAspect(null);
  }, [isOpen, imageSrc]);

  // Prevent background scroll while modal is open (especially important on mobile).
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const effectiveAspect = useMemo(() => {
    if (mode === 'shrink_to_fit') return CARD_ASPECT;
    if (aspectMode === 'original' && mediaAspect) return mediaAspect;
    return CARD_ASPECT;
  }, [aspectMode, mediaAspect, mode]);

  const cropperMinZoom = mode === 'shrink_to_fit' ? 1 : 1;
  const cropperMaxZoom = mode === 'shrink_to_fit' ? 1 : 4;

  const outerStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 3000,
    display: 'flex',
    alignItems: isMobile ? 'stretch' : 'center',
    justifyContent: 'center',
    padding: isMobile ? 0 : 16,
  };

  const modalStyle = {
    width: isMobile ? '100%' : 'min(100%, 980px)',
    height: isMobile ? '100%' : 'min(80vh, 720px)',
    backgroundColor: '#111827',
    borderRadius: isMobile ? 0 : 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    padding: '12px 14px',
    color: 'white',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    boxSizing: 'border-box',
  };

  const buttonBase = {
    border: 'none',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44, // mobile-friendly tap target
  };

  const controlLabelStyle = {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginBottom: 6,
  };

  const selectStyle = {
    width: '100%',
    padding: '10px 10px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    backgroundColor: '#0b1220',
    color: 'white',
    fontSize: 14,
    minHeight: 44,
  };

  const rangeStyle = {
    width: '100%',
    accentColor: '#60a5fa',
  };

  const controlsStyle = {
    width: isMobile ? '100%' : 320,
    padding: isMobile ? 10 : 12,
    color: 'white',
    backgroundColor: '#0b1220',
    borderTop: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none',
    borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)',
    position: isMobile ? 'relative' : 'relative',
    bottom: 0,
    boxSizing: 'border-box',
    // On very short phones, allow the controls to scroll instead of overflowing the viewport.
    maxHeight: isMobile ? '48vh' : 'none',
    overflowY: isMobile ? 'auto' : 'visible',
    WebkitOverflowScrolling: 'touch',
  };

  const cropAreaWrapperStyle = {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
    touchAction: 'none', // prevent scroll/pinch-to-zoom page while interacting with cropper
  };

  const applyNow = async () => {
    if (!imageSrc) return;
    setIsApplying(true);
    setError(null);
    try {
      const baked = await bakeEditedImageToPngDataUrl({
        imageSrc,
        mode,
        pixelCrop: mode === 'crop' ? croppedAreaPixels : null,
        rotation,
        flipX,
        flipY,
        targetWidth: TARGET_WIDTH,
        targetHeight: TARGET_HEIGHT,
        // If user picked "Original" aspect in crop mode, preserve that crop aspect via letterboxing.
        fit: aspectMode === 'original' ? 'contain' : 'cover',
      });
      await onApply?.(baked);
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Failed to apply edits');
      setIsApplying(false);
      return;
    }
    setIsApplying(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="edit-panel overlay-image-editor-modal"
      style={outerStyle}
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={headerStyle}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
            <button
              type="button"
              onClick={onCancel}
              style={{ ...buttonBase, backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            >
              Close
            </button>
          </div>

          <div style={cropAreaWrapperStyle}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={effectiveAspect}
              minZoom={cropperMinZoom}
              maxZoom={cropperMaxZoom}
              cropShape="rect"
              objectFit={mode === 'shrink_to_fit' ? 'contain' : 'cover'}
              showGrid={mode === 'crop'}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={(croppedArea, croppedAreaPx) => {
                setCroppedAreaPixels(croppedAreaPx);
              }}
              onMediaLoaded={(mediaSize) => {
                if (mediaSize?.naturalWidth && mediaSize?.naturalHeight) {
                  setMediaAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
                }
              }}
              style={{
                containerStyle: { backgroundColor: '#000', touchAction: 'none' },
                mediaStyle: {},
                cropAreaStyle: { border: '2px solid rgba(255,255,255,0.9)' },
              }}
            />
          </div>
        </div>

        <div style={controlsStyle}>
          {error && (
            <div style={{ marginBottom: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgba(220,38,38,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Error</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{error}</div>
            </div>
          )}

          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <div style={controlLabelStyle}>Mode</div>
              <select
                value={mode}
                onChange={(e) => {
                  const next = e.target.value;
                  setMode(next);
                  if (next === 'shrink_to_fit') {
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                  }
                }}
                style={selectStyle}
                disabled={isApplying}
              >
                <option value="crop">Crop</option>
                <option value="shrink_to_fit">Shrink to fit</option>
              </select>
            </div>

            <div>
              <div style={controlLabelStyle}>Aspect ratio</div>
              <select
                value={mode === 'shrink_to_fit' ? 'card' : aspectMode}
                onChange={(e) => setAspectMode(e.target.value)}
                style={selectStyle}
                disabled={isApplying || mode === 'shrink_to_fit'}
              >
                <option value="card">Card (5:7)</option>
                <option value="original">Original</option>
              </select>
              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                Original preserves aspect by adding padding if needed.
              </div>
            </div>

            <div>
              <div style={controlLabelStyle}>Zoom</div>
              <input
                type="range"
                min={cropperMinZoom}
                max={cropperMaxZoom}
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={rangeStyle}
                disabled={isApplying || mode === 'shrink_to_fit'}
              />
            </div>

            <div>
              <div style={controlLabelStyle}>Rotate</div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                style={rangeStyle}
                disabled={isApplying}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  style={{ ...buttonBase, backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', flex: 1 }}
                  disabled={isApplying}
                >
                  +90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 270) % 360)}
                  style={{ ...buttonBase, backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', flex: 1 }}
                  disabled={isApplying}
                >
                  -90°
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setFlipX((v) => !v)}
                style={{
                  ...buttonBase,
                  backgroundColor: flipX ? '#2563eb' : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  flex: 1,
                }}
                disabled={isApplying}
              >
                Flip
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('crop');
                  setAspectMode('card');
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setRotation(0);
                  setFlipX(false);
                  setError(null);
                }}
                style={{ ...buttonBase, backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', flex: 1 }}
                disabled={isApplying}
              >
                Reset
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <button
                type="button"
                onClick={onCancel}
                style={{ ...buttonBase, backgroundColor: 'rgba(255,255,255,0.10)', color: 'white', flex: 1 }}
                disabled={isApplying}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyNow}
                style={{
                  ...buttonBase,
                  backgroundColor: isApplying ? 'rgba(16,185,129,0.6)' : '#10b981',
                  color: 'white',
                  flex: 1,
                }}
                disabled={isApplying || (mode === 'crop' && !croppedAreaPixels)}
              >
                {isApplying ? 'Applying…' : 'Apply'}
              </button>
            </div>

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              Tip: pinch-to-zoom and drag work on mobile.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


