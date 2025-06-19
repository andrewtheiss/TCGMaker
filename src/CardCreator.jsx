import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import beanImage from './assets/bean.png';
import cardogImage from './assets/jade.png';
import gatePowerImage from './assets/gatepower.png';
import izkWhiteImage from './assets/ikz_white.png';
import CardElements from './CardElements';

const CardCreator = () => {
  const [cardData, setCardData] = useState({
    name: 'Card Name',
    cardColor: 'purp',
    type: 'creature',
    subtype: 'Elder Warrior',
    showSubtype: true,
    textBox: 'Card ability text goes here.',
    power: '3',
    toughness: '4',
    fullArt: false,
    domain: 'water',
    backgroundImage: null,
    rarity: 'rare',
    leftIcon: '1',
    rightIcon: '⚔️',
    rightIconColor: 'water',
    setCode: 'Elemental',
    cardNumber: '10002',
    overlayImage: cardogImage,
    gatePower: '2',
    showGatePower: true,
    footerLeft: 'STT 01-069',
    footerCenter: 'BBB',
    footerRarity: 'U',
    copyrightText: 'Your Name Here',
    elementMode: 'classic'
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const fileInputRef = useRef(null);
  const overlayInputRef = useRef(null);
  const cardRef = useRef(null);

  const helveticaFont = { fontFamily: 'Helvetica, Arial, sans-serif' };

  // Card dimensions: 63.5mm x 88.9mm at 600 DPI = 1500px x 2100px
  const cardWidth = 1500;
  const cardHeight = 2100;
  const scale = 0.25; // Scale down for display (375px x 525px)

  const domainColors = {
    earth: { primary: '#8B4513', secondary: '#D2691E', symbol: '🗿' },
    water: { primary: '#1E90FF', secondary: '#4682B4', symbol: '💧' },
    lightning: { primary: '#9370DB', secondary: '#8A2BE2', symbol: '⚡' },
    fire: { primary: '#FF4500', secondary: '#DC143C', symbol: '🔥' },
    nature: { primary: '#228B22', secondary: '#32CD32', symbol: '🌿' },
    gray: { primary: '#808080', secondary: '#A9A9A9', symbol: '⚙️' }
  };

  const cardColors = {
    purp: { bg: '#6c449a', fg: '#dc8fc7' },
    yellow: { bg: '#ca722b', fg: '#ffbf2e' },
    smoke: { bg: '#686463', fg: '#cec5c0' },
    blue: { bg: '#5289c9', fg: '#75d0e2' }
  };

  const rarityColors = {
    common: '#000000',
    uncommon: '#C0C0C0',
    rare: '#FFD700',
    mythic: '#FF8C00'
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardData({ ...cardData, backgroundImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardData({ ...cardData, overlayImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          width: cardWidth,
          height: cardHeight,
          scale: 4, // High resolution multiplier
          backgroundColor: null,
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        const link = document.createElement('a');
        link.download = `${cardData.name.replace(/\s+/g, '_')}_card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error downloading card:', error);
        alert('Error downloading card. Please try again.');
      }
    }
  };

  const updateCardData = (field, value) => {
    setCardData({ ...cardData, [field]: value });
  };

  const CardElement = ({ children, elementType, style = {} }) => (
    <div
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s',
        outline: selectedElement === elementType ? '2px solid #3b82f6' : 'none',
        outlineOffset: '0px',
        marginLeft: '-0px',
        ...style
      }}
      onClick={() => setSelectedElement(elementType)}
    >
      {children}
    </div>
  );

  const EditPanel = () => {
    if (!selectedElement) return null;

    const panelStyle = {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      width: '256px',
      zIndex: 50,
      ...helveticaFont
    };

    const inputStyle = {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginBottom: '8px'
    };

    const buttonStyle = {
      width: '100%',
      padding: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '12px'
    };

    return (
      <div style={panelStyle}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Edit {selectedElement}</h3>
        
        {selectedElement === 'name' && (
          <input
            type="text"
            value={cardData.name}
            onChange={(e) => updateCardData('name', e.target.value)}
            style={inputStyle}
            placeholder="Card Name"
          />
        )}
        
        {selectedElement === 'cardColor' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Card Color
            </label>
            {Object.entries(cardColors).map(([colorKey, colorConfig]) => (
              <button
                key={colorKey}
                onClick={() => updateCardData('cardColor', colorKey)}
                style={{
                  ...inputStyle,
                  backgroundColor: cardData.cardColor === colorKey ? '#e5e7eb' : '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{colorKey}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: colorConfig.bg,
                    border: '1px solid #ccc'
                  }} />
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: colorConfig.fg,
                    border: '1px solid #ccc'
                  }} />
                </div>
              </button>
            ))}
          </div>
        )}
        
        {selectedElement === 'leftIcon' && (
          <input
            type="text"
            value={cardData.leftIcon}
            onChange={(e) => updateCardData('leftIcon', e.target.value)}
            style={inputStyle}
            placeholder="Left Icon/Number"
          />
        )}
        
        {selectedElement === 'rightIcon' && (
          <div>
            <input
              type="text"
              value={cardData.rightIcon}
              onChange={(e) => updateCardData('rightIcon', e.target.value)}
              style={inputStyle}
              placeholder="Right Icon"
            />
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>
              Icon Color (affects all header icons)
            </label>
            <select
              value={cardData.rightIconColor}
              onChange={(e) => updateCardData('rightIconColor', e.target.value)}
              style={inputStyle}
            >
              {Object.keys(domainColors).map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        )}
        
        {selectedElement === 'type' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>
              Card Type
            </label>
            <input
              type="text"
              value={cardData.type}
              onChange={(e) => updateCardData('type', e.target.value)}
              style={inputStyle}
              placeholder="creature, spell, equipment, etc."
            />
            
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={cardData.showSubtype}
                onChange={(e) => updateCardData('showSubtype', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show Subtype (creature details)
            </label>
            
            {cardData.showSubtype && (
              <>
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Subtype
                </label>
                <input
                  type="text"
                  value={cardData.subtype}
                  onChange={(e) => updateCardData('subtype', e.target.value)}
                  style={inputStyle}
                  placeholder="Elder Warrior, etc."
                />
              </>
            )}
          </div>
        )}
        
        {selectedElement === 'domain' && (
          <div>
            {Object.entries(domainColors).map(([domain, config]) => (
              <button
                key={domain}
                onClick={() => updateCardData('domain', domain)}
                style={{
                  ...inputStyle,
                  backgroundColor: cardData.domain === domain ? '#e5e7eb' : '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{domain}</span>
                <span style={{ fontSize: '24px' }}>{config.symbol}</span>
              </button>
            ))}
          </div>
        )}
        
        {selectedElement === 'background' && (
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                ...inputStyle,
                backgroundColor: '#3b82f6',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Upload Image
            </button>
            <button
              onClick={() => updateCardData('fullArt', !cardData.fullArt)}
              style={{
                ...inputStyle,
                backgroundColor: cardData.fullArt ? '#10b981' : '#e5e7eb',
                color: cardData.fullArt ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Full Art: {cardData.fullArt ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
        
        {selectedElement === 'textBox' && (
          <textarea
            value={cardData.textBox}
            onChange={(e) => updateCardData('textBox', e.target.value)}
            style={{ ...inputStyle, height: '128px', resize: 'vertical' }}
            placeholder="Card ability text..."
          />
        )}
        
        {selectedElement === 'stats' && cardData.type === 'creature' && (
          <div>
            <input
              type="text"
              value={cardData.power}
              onChange={(e) => updateCardData('power', e.target.value)}
              style={inputStyle}
              placeholder="Power"
            />
            <input
              type="text"
              value={cardData.toughness}
              onChange={(e) => updateCardData('toughness', e.target.value)}
              style={inputStyle}
              placeholder="Toughness"
            />
          </div>
        )}
        

        
        {selectedElement === 'rarity' && (
          <div>
            {Object.entries(rarityColors).map(([rarity, color]) => (
              <button
                key={rarity}
                onClick={() => updateCardData('rarity', rarity)}
                style={{
                  ...inputStyle,
                  backgroundColor: cardData.rarity === rarity ? '#e5e7eb' : '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{rarity}</span>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: color
                }} />
              </button>
            ))}
          </div>
        )}
        
        {selectedElement === 'setCode' && (
          <select
            value={cardData.setCode}
            onChange={(e) => updateCardData('setCode', e.target.value)}
            style={inputStyle}
          >
            <option value="Azuki">Azuki</option>
            <option value="Elemental">Elemental</option>
            <option value="Beanz">Beanz</option>
          </select>
        )}
        
        {selectedElement === 'cardNumber' && (
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => updateCardData('cardNumber', e.target.value)}
            style={inputStyle}
            placeholder="Card Number"
          />
        )}
        
        {selectedElement === 'gatePower' && (
          <div>
            <input
              type="text"
              value={cardData.gatePower}
              onChange={(e) => updateCardData('gatePower', e.target.value)}
              style={inputStyle}
              placeholder="Gate Power"
            />
            <button
              onClick={() => updateCardData('showGatePower', !cardData.showGatePower)}
              style={{
                ...inputStyle,
                backgroundColor: cardData.showGatePower ? '#10b981' : '#e5e7eb',
                color: cardData.showGatePower ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Show Gate Power: {cardData.showGatePower ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
        
        {selectedElement === 'footerRarity' && (
          <input
            type="text"
            value={cardData.footerRarity}
            onChange={(e) => updateCardData('footerRarity', e.target.value)}
            style={inputStyle}
            placeholder="Rarity (U, C, UC, SAR, etc.)"
          />
        )}
        
        {selectedElement === 'footerLeft' && (
          <input
            type="text"
            value={cardData.footerLeft}
            onChange={(e) => updateCardData('footerLeft', e.target.value)}
            style={inputStyle}
            placeholder="Footer Left Text"
          />
        )}
        
        {selectedElement === 'footerCenter' && (
          <input
            type="text"
            value={cardData.footerCenter}
            onChange={(e) => updateCardData('footerCenter', e.target.value)}
            style={inputStyle}
            placeholder="Footer Center Text (Italic)"
          />
        )}
        
        {selectedElement === 'copyright' && (
          <input
            type="text"
            value={cardData.copyrightText}
            onChange={(e) => updateCardData('copyrightText', e.target.value)}
            style={inputStyle}
            placeholder="Copyright Name"
          />
        )}
        
        {selectedElement === 'elementMode' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Element Display Mode
            </label>
            {['classic', 'modern', 'minimal'].map((mode) => (
              <button
                key={mode}
                onClick={() => updateCardData('elementMode', mode)}
                style={{
                  ...inputStyle,
                  backgroundColor: cardData.elementMode === mode ? '#3b82f6' : '#f9fafb',
                  color: cardData.elementMode === mode ? 'white' : 'black',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  textTransform: 'capitalize'
                }}
              >
                <span>{mode}</span>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  {mode === 'classic' && 'Traditional diamond shapes'}
                  {mode === 'modern' && 'Rounded, colorful styling'}
                  {mode === 'minimal' && 'Clean, simple design'}
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedElement === 'bottomBorder' && (
          <div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              Extended Bottom Border (only visible when Full Art is OFF)
            </p>
            <p style={{ fontSize: '12px', color: '#888' }}>
              This border provides additional visual weight to the bottom of the card.
              Height: {102 * scale}px (double the standard border)
            </p>
          </div>
        )}
        
        <button onClick={() => setSelectedElement(null)} style={buttonStyle}>
          Close
        </button>
      </div>
    );
  };

  const cardConfig = cardColors[cardData.cardColor];

  const textShadowStyle = {
    textShadow: `
      -1px -1px 0 white,
      1px -1px 0 white,
      -1px 1px 0 white,
      1px 1px 0 white,
      0 1px 0 white,
      1px 0 0 white,
      0 -1px 0 white,
      -1px 0 0 white
    `
  };

  const smallTextShadowStyle = {
    textShadow: `
      -0.5px -0.5px 0 white,
      0.5px -0.5px 0 white,
      -0.5px 0.5px 0 white,
      0.5px 0.5px 0 white
    `
  };

  const checkerboardPattern = {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#fff'
  };

  const artCheckerboardPattern = {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#fff'
  };

  return (
    <>
    <div style={{ minHeight: '100vh', backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <input
        ref={overlayInputRef}
        type="file"
        onChange={handleOverlayUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {/* Card Container */}
      <div style={{ position: 'relative' }}>
        <div 
          ref={cardRef}
          style={{
            position: 'relative',
            backgroundColor: 'black',
            borderRadius: `${64 * scale}px`,
            overflow: 'hidden',
            width: `${cardWidth * scale}px`,
            height: `${cardHeight * scale}px`,
            transform: 'scale(1)',
            transformOrigin: 'center'
          }}
        >
          {/* Background Image - Full Card */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {cardData.backgroundImage ? (
              <img 
                src={cardData.backgroundImage} 
                alt="Card background" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', zIndex: -20, ...checkerboardPattern }} />
            )}
          </div>
          

          
                                {/* Header - Absolutely positioned */}
          <div className="card-header-container" style={{
            position: 'absolute',
            top: `${47 * scale}px`,
            left: `${104 * scale}px`,
            right: `${104 * scale}px`,
            height: `${128 * scale}px`,
            backgroundColor: cardData.fullArt ? 'transparent' : 'black',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: `${32 * scale}px`,
            zIndex: 15,
            borderRadius: cardData.fullArt ? '0' : `${48 * scale}px ${48 * scale}px 0 0`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${16 * scale}px`, position: 'relative' }}>
              {/* Connecting background when both are present */}
              {cardData.cardColor && cardData.leftIcon && (
                <div style={{
                  position: 'absolute',
                  borderRadius: `${80 * scale}px`,
                  backgroundColor: cardColors[cardData.cardColor].fg,
                  left: `${-16 * scale}px`,
                  right: `${-16 * scale}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: `${160 * scale}px`
                }} />
              )}
           
              {/* Card Color bubble */}
              <CardElement elementType="cardColor">
                <div style={{
                  width: `${160 * scale}px`,
                  height: `${160 * scale}px`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 10,
                  backgroundColor: cardColors[cardData.cardColor].bg,
                  border: `${8 * scale}px solid white`,
                  overflow: 'hidden'
                }}>
               <img 
                 src={izkWhiteImage}
                 alt="IZK"
                 style={{
                   width: '80%',
                   height: '80%',
                   objectFit: 'contain'
                 }}
               />
             </div>
           </CardElement>
           
              {/* Left Icon */}
              {cardData.leftIcon && (
                <CardElement elementType="leftIcon">
                  <div style={{
                    width: `${160 * scale}px`,
                    height: `${160 * scale}px`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${56 * scale}px`,
                    fontWeight: 'bold',
                    color: 'white',
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: cardColors[cardData.cardColor].bg,
                    border: `${8 * scale}px solid white`,
                    ...helveticaFont
                  }}>
                 {cardData.leftIcon}
               </div>
             </CardElement>
           )}
         </div>
         
            {/* Card Name */}
            <CardElement elementType="name" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: `${80 * scale}px`, minWidth: `${cardWidth * 0.4 * scale}px` }}>
              <h2 style={{ fontSize: `${92 * scale}px`, fontWeight: 'bold', margin: 0, lineHeight: `${80 * scale}px`, textAlign: 'center', ...helveticaFont }}>
                {cardData.name}
              </h2>
            </CardElement>
         
            {/* Right Icon */}
            <CardElement elementType="rightIcon">
              <div style={{
                width: `${160 * scale}px`,
                height: `${160 * scale}px`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${56 * scale}px`,
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: cardColors[cardData.cardColor].bg,
                border: `${8 * scale}px solid white`,
                ...helveticaFont
              }}>
             {cardData.rightIcon}
           </div>
         </CardElement>
       </div>

          {/* Main Card Area - Art positioning stays consistent */}
            <div style={{
              position: 'absolute',
              top: `${128 * scale}px`,
              right: 0,
              bottom: 0,
              left: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1
            }}>
            
            {/* Art Box - Main viewing area */}
            <CardElement elementType="background" style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              {!cardData.backgroundImage && (
                <div style={{ position: 'absolute', inset: 0, zIndex: -20, ...artCheckerboardPattern }} />
              )}
              <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent', position: 'relative', zIndex: 10 }} />
            </CardElement>
          </div>

          {/* Bottom diagonal corners - absolutely positioned independent container */}
          <div 
            className="card-corner-triangles"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 25
            }}
          >
            <div 
              className="card-triangle-left bottom-border-left" 
              style={{
                position: 'absolute',
                width: `${150 * scale}px`,
                height: `${150 * scale}px`,
                backgroundColor: 'black',
                bottom: cardData.fullArt ? `${-200 * scale}px` : `${57 * scale}px`,
                left: cardData.fullArt ? `${-200 * scale}px` : `${56 * scale}px`,
                clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }} 
            />
            
            <div 
              className="card-triangle-right bottom-border-right" 
              style={{
                position: 'absolute',
                width: `${150 * scale}px`,
                height: `${150 * scale}px`,
                backgroundColor: 'black',
                bottom: cardData.fullArt ? `${-200 * scale}px` : `${56 * scale}px`,
                right: cardData.fullArt ? `${-200 * scale}px` : `${56 * scale}px`,
                clipPath: 'polygon(100% 100%, 0 100%, 100% 0)',
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }} 
            />
          </div>
          

          
          {/* Gate Power Overlay - Left Side, Top Layer */}
          <CardElement elementType="gatePower" style={{
            position: 'absolute',
            left: `${25 * scale}px`,
            top: `${308 * scale}px`,
            zIndex: 100,
            opacity: cardData.showGatePower ? 1 : 0,
            pointerEvents: 'all'
          }}>
            <div style={{
              position: 'relative',
              width: `${222 * scale}px`,
              height: `${222 * scale}px`
            }}>
              {/* Colored Circle Background */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, calc(-50% - 1px))',
                width: `${195 * scale}px`,
                height: `${195 * scale}px`,
                backgroundColor: cardColors[cardData.cardColor].bg,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: `${85 * scale}px`,
                ...helveticaFont,
                zIndex: 1
              }}>
                {cardData.gatePower}
              </div>
              
              {/* Gate Power Image */}
              <img 
                src={gatePowerImage}
                alt="Gate Power"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 2
                }}
              />
            </div>
          </CardElement>



          {/* Footer text - positioned relative to card edges */}
          <div style={{
            position: 'absolute',
            left: `${175 * scale}px`,
            right: `${188 * scale}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...helveticaFont,
            fontSize: `${24 * scale}px`,
            bottom: `${102 * scale}px`,
            zIndex: 1000
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * scale}px` }}>
              <CardElement elementType="footerRarity">
                <div style={{
                  backgroundColor: 'white',
                  border: `${1 * scale}px solid black`,
                  borderRadius: '50%',
                  padding: `${1 * scale}px ${4 * scale}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    color: 'black',
                    fontWeight: '900',
                    fontSize: `${6 * scale}px`
                  }}>
                    {cardData.footerRarity}
                  </span>
                </div>
              </CardElement>
              <CardElement elementType="footerLeft">
                <span style={{
                  color: 'black',
                  fontWeight: '900',
                  ...smallTextShadowStyle
                }}>
                  {cardData.footerLeft}
                </span>
              </CardElement>
              <CardElement elementType="footerCenter">
                <span style={{
                  color: 'black',
                  fontWeight: '900',
                  fontStyle: 'italic',
                  ...smallTextShadowStyle
                }}>
                  {cardData.footerCenter}
                </span>
              </CardElement>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${3 * scale}px` }}>
              <CardElement elementType="setCode">
                <span style={{
                  color: 'black',
                  fontWeight: '900',
                  ...smallTextShadowStyle
                }}>
                  {cardData.setCode}
                </span>
              </CardElement>
              <CardElement elementType="cardNumber">
                <span style={{
                  color: 'black',
                  fontWeight: '900',
                  ...smallTextShadowStyle
                }}>
                  #{cardData.cardNumber}
                </span>
              </CardElement>
            </div>
          </div>

          {/* Bean Image - Bottom Left Corner */}
          <div style={{
            scale: '75%',
            position: 'absolute',
            bottom: '6px',
            left: '-2px',
            zIndex: 1001,
            pointerEvents: 'none'
          }}>
            <img 
              src={beanImage} 
              alt="Bean decoration"
              style={{ 
                width: '40px',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>

          {/* Copyright Text - Very Bottom Left */}
          <CardElement elementType="copyright">
            <div style={{
              position: 'absolute',
              bottom: `${50 * scale}px`,
              left: `${200 * scale}px`,
              zIndex: 1002,
              ...helveticaFont,
              fontSize: `${20 * scale}px`,
              fontWeight: '600'
            }}>
              <span style={{
                color: 'black',
                ...smallTextShadowStyle
              }}>
                © {cardData.copyrightText}
              </span>
            </div>
          </CardElement>

          {/* Rarity Stamp (Alpha Logo) - positioned absolutely to card */}
          <CardElement elementType="rarity">
            <div style={{
              position: 'absolute',
              left: `${152 * scale}px`,
              top: `${1100 * scale}px`,
              width: `${128 * scale}px`,
              height: `${128 * scale}px`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: `${48 * scale}px`,
              zIndex: 1010,
              backgroundColor: rarityColors[cardData.rarity],
              ...helveticaFont
            }}>
              α
            </div>
          </CardElement>

          {/* Card Border - positioned absolutely to the outer edge */}
          {!cardData.fullArt && (
            <div 
              className="card-border-frame"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'transparent',
                borderTop: `${56 * scale}px solid black`,
                borderLeft: `${56 * scale}px solid black`,
                borderRight: `${56 * scale}px solid black`,
                borderBottom: `${51 * scale}px solid black`,
                borderRadius: `${64 * scale}px`,
                zIndex: 10,
                pointerEvents: 'none'
              }} 
            />
          )}

          {/* Additional Bottom Border - only when full-art is OFF */}
          {!cardData.fullArt && (
            <CardElement elementType="bottomBorder">
              <div 
                className="card-bottom-border-extended"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${92 * scale}px`,
                  backgroundColor: 'black',
                  borderRadius: `0 0 ${64 * scale}px ${64 * scale}px`,
                  zIndex: 15,
                  pointerEvents: 'auto'
                }} 
              />
            </CardElement>
          )}

          {/* CardElements component - handles type line, horizontal bar, text box, and stats */}
          <CardElements 
            cardData={cardData}
            CardElement={CardElement}
            cardColors={cardColors}
            helveticaFont={helveticaFont}
            textShadowStyle={textShadowStyle}
            scale={scale}
            cardWidth={cardWidth}
            mode={cardData.elementMode}
          />
        </div>
        
        {/* Reference Overlay */}
        {showOverlay && cardData.overlayImage && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '375px',
            height: '523px',
            borderRadius: '16px',
            overflow: 'hidden',
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 1000
          }}>
            <img 
              src={cardData.overlayImage} 
              alt="Reference overlay"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '16px'
              }}
            />
          </div>
        )}
        
        {/* Edit Panel */}
        {EditPanel()}
      </div>
      
      {/* Overlay Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...helveticaFont
      }}>
        <button
          onClick={downloadCard}
          style={{
            padding: '8px 16px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📥 Download Card
        </button>
        
        <button
          onClick={() => overlayInputRef.current?.click()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {cardData.overlayImage ? 'Change Reference' : 'Upload Reference'}
        </button>
        
        <button
          onClick={() => setSelectedElement('elementMode')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🎨 Mode: {cardData.elementMode}
        </button>
        
        {cardData.overlayImage && (
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            style={{
              padding: '8px 16px',
              backgroundColor: showOverlay ? '#059669' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
          </button>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        color: 'white',
        fontSize: '14px',
        ...helveticaFont
      }}>
        <p style={{ margin: 0 }}>Click any element on the card to edit it</p>
      </div>
    </div>
    </>
  );
};

export default CardCreator;