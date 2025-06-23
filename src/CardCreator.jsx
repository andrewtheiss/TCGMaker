import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import beanImage from './assets/bean.png';
import cardogImage from './assets/jade.png';
import gatePowerImage from './assets/gatepower.png';
import izkWhiteImage from './assets/ikz_white.png';
import ikzBgImage from './assets/ikzbg.png';
import ikzBackImage from './assets/ikzback.png';
import waterImage from './assets/domain/water.png';
import earthImage from './assets/domain/earth.png';
import smokeImage from './assets/domain/smoke.png';
import lightningImage from './assets/domain/lightning.png';
import fireImage from './assets/domain/fire.png';
import CardElements from './CardElements';
import LeaderHeader from './LeaderHeader';
import CardGatePower from './CardGatePower';
import CardBorder from './CardBorder';
import CardFooterText from './CardFooterText';

const CardCreator = () => {
  const [cardData, setCardData] = useState({
    name: 'Card Name',
    cardColor: 'purp',
    type: 'creature',
    typeDisplayText: 'creature', // Separate field for display text on type line
    subtype: 'Elder Warrior',
    showSubtype: true,
    textBox: 'Card ability text goes here.',
    attack: '3',
    defense: '4',
    showAttack: true,
    showDefense: true,
    fullArt: false,
    domain: 'water',
    backgroundImage: null,
    rarity: 'rare',
    leftIcon: '1',
    rightIcon: '⚔️',
    rightIconDomain: 'water',
    setCode: 'Elemental',
    cardNumber: '10002',
    overlayImage: cardogImage,
    gatePower: '2',
    showGatePower: true,
    footerLeft: 'STT 01-069',
    footerCenter: 'BBB',
    footerRarity: 'SAR',
    copyrightText: 'Your Name Here',
    raritySymbol: 'α',
    showRarityStamp: true,
    elementMode: 'classic',
    circularText: 'ENTITY',
    showLeftIcons: true,
    textRotation: 32,
    flipCircularText: true,
    // Leader-specific fields
    leaderDescription1: 'Primary Title',
    leaderDescription2: 'Secondary Description',
    // Equipment-specific fields
    equipmentShowBackground: true,
    equipmentDescription: 'Equipment description text goes here.  There should be two lines of text for it to render properly!',
    equipmentDescriptionStyle: 'diamond' // 'diamond' or 'rounded'
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showCardBack, setShowCardBack] = useState(false);
  const fileInputRef = useRef(null);
  const overlayInputRef = useRef(null);
  const cardRef = useRef(null);

  const helveticaFont = { fontFamily: 'Helvetica, Arial, sans-serif' };

  // Card dimensions: 63.5mm x 88.9mm at 600 DPI = 1500px x 2100px
  const cardWidth = 1500;
  const cardHeight = 2100;
  const scale = 0.25; // Scale down for display (375px x 525px)

  // Helper function to calculate CSS filter values for WHITE images to achieve target colors
  const getWhiteImageFilter = (targetHex) => {
    // Convert hex to RGB
    const r = parseInt(targetHex.slice(1, 3), 16);
    const g = parseInt(targetHex.slice(3, 5), 16);
    const b = parseInt(targetHex.slice(5, 7), 16);
    
    // Convert RGB to HSL for hue calculation
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / diff) + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = ((bNorm - rNorm) / diff) + 2; break;
        case bNorm: h = ((rNorm - gNorm) / diff) + 4; break;
      }
      h /= 6;
    }
    
    const targetHue = Math.round(h * 360);
    const saturation = Math.round(((max - min) / (max + min)) * 10000);
    const brightness = Math.round((max + min) / 2 * 200);
    
    // For white images: brightness(0) -> invert(100%) -> sepia(100%) -> saturate() -> hue-rotate() -> brightness() -> contrast()
    return `brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(${Math.max(1000, saturation)}%) hue-rotate(${targetHue}deg) brightness(${Math.max(80, brightness)}%) contrast(100%)`;
  };

  // Pre-calculated optimized filters for WHITE images to your specific color palette  
  const whiteImageFilters = {
    '#dc8fc7': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2000%) hue-rotate(287deg) brightness(110%) contrast(100%)', // Purple fg
    '#6c449a': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(3000%) hue-rotate(260deg) brightness(80%) contrast(120%)',  // Purple bg
    '#ffbf2e': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(4000%) hue-rotate(-50deg) brightness(120%) contrast(100%)',  // Yellow fg
    '#ca722b': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2500%) hue-rotate(15deg) brightness(90%) contrast(110%)',   // Yellow bg
    '#cec5c0': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(200%) hue-rotate(20deg) brightness(105%) contrast(90%)',   // Smoke fg
    '#686463': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(500%) hue-rotate(20deg) brightness(70%) contrast(100%)',    // Smoke bg
    '#75d0e2': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2500%) hue-rotate(160deg) brightness(115%) contrast(100%)', // Blue fg - your target color
    '#5289c9': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2000%) hue-rotate(180deg) brightness(90%) contrast(110%)',  // Blue bg
    '#ff4026': 'brightness(0) saturate(100%) invert(100%) sepia(69%) saturate(3000%) hue-rotate(-57deg) brightness(110%) contrast(100%)', // Fire fg
    '#c4353d': 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(3000%) hue-rotate(340deg) brightness(85%) contrast(120%)'   // Fire bg
  };

  // Function to get the optimized filter for WHITE images
  const getOptimizedFilter = (hex) => {
    // Normalize the hex value (ensure it starts with # and is lowercase)
    const normalizedHex = hex.toLowerCase().startsWith('#') ? hex.toLowerCase() : `#${hex.toLowerCase()}`;
    
    // Try exact match first
    const exactMatch = whiteImageFilters[normalizedHex];
    if (exactMatch) {
      return exactMatch;
    }
    
    // Fallback to calculated filter
    return getWhiteImageFilter(normalizedHex);
  };

  // Helper function to get domain image
  const getDomainImage = (domain) => {
    switch (domain) {
      case 'water': return waterImage;
      case 'earth': return earthImage;
      case 'smoke': return smokeImage;
      case 'lightning': return lightningImage;
      case 'fire': return fireImage;
      default: return waterImage;
    }
  };

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
    blue: { bg: '#5289c9', fg: '#75d0e2' },
    fire: { bg: '#c4353d', fg: '#ff4026' }
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
          scale: 4, // High resolution multiplier - this will scale the actual rendered size
          backgroundColor: null,
          logging: false,
          useCORS: true,
          allowTaint: true,
          removeContainer: true,
          imageTimeout: 0,
          ignoreElements: (element) => {
            // Ignore edit panel and overlay elements
            return element.classList.contains('edit-panel') || 
                   element.style.zIndex > 1020;
          }
        });
        
        const link = document.createElement('a');
        const fileName = showCardBack 
          ? `${cardData.name.replace(/\s+/g, '_')}_card_back.png`
          : `${cardData.name.replace(/\s+/g, '_')}_card.png`;
        link.download = fileName;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error downloading card:', error);
        alert('Error downloading card. Please try again.');
      }
    }
  };

  const updateCardData = (field, value) => {
    const newData = { ...cardData, [field]: value };
    
    // Set default stat visibility when card type changes
    if (field === 'type') {
      // Sync the display text when card type changes
      newData.typeDisplayText = value;
      
      switch (value) {
        case 'leader':
          newData.showAttack = false;
          newData.showDefense = true;
          newData.fullArt = true; // Leader cards are full art by default
          break;
        case 'equipment':
          newData.showAttack = true;
          newData.showDefense = false;
          break;
        case 'creature':
        default:
          newData.showAttack = true;
          newData.showDefense = true;
          break;
      }
    }
    
    setCardData(newData);
  };

  // Card Back component
  const CardBack = () => (
    <div style={{
      position: 'relative',
      backgroundColor: '#34404e',
      borderRadius: `${64 * scale}px`,
      overflow: 'hidden',
      width: `${cardWidth * scale}px`,
      height: `${cardHeight * scale}px`,
      boxSizing: 'border-box'
    }}>
      {/* Standard black border like front card */}
      <div style={{
        position: 'absolute',
        top: `${55 * scale}px`,
        left: `${55 * scale}px`,
        right: `${55 * scale}px`,
        bottom: `${55 * scale}px`,
        border: `${8 * scale}px solid black`,
        borderRadius: `${48 * scale}px`,
        zIndex: 1
      }} />
      
      {/* Background area with specified color */}
      <div style={{
        position: 'absolute',
        top: `${63 * scale}px`,
        left: `${63 * scale}px`,
        right: `${63 * scale}px`,
        bottom: `${63 * scale}px`,
        backgroundColor: '#34404e',
        borderRadius: `${40 * scale}px`,
        zIndex: 20
      }} />
      
      {/* Center image */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={ikzBackImage} 
          alt="Card back center" 
          style={{ 
            maxWidth: `${(cardWidth * 0.6) * scale}px`,
            maxHeight: `${(cardHeight * 0.6) * scale}px`,
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );

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

    const outerPanelStyle = {
      position: 'absolute',
      top: '50px',
      right: '16px',
      padding: '3px', // This creates the border thickness
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Border color
      borderRadius: '11px', // Slightly larger radius for outer border
      zIndex: 50,
    };

    const innerPanelStyle = {
      backgroundColor: 'white',
      borderRadius: '8px', // Inner border radius
      padding: '16px',
      width: '256px',
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
      <div style={outerPanelStyle}>
        <div style={innerPanelStyle}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Edit {selectedElement}</h3>
        
        {selectedElement === 'cardName' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Card Name
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => updateCardData('name', e.target.value)}
              style={inputStyle}
              placeholder="Card Name"
            />
            
            {/* Equipment-specific background toggle */}
            {cardData.type === 'equipment' && (
              <>
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '12px' }}>
                  <input
                    type="checkbox"
                    checked={cardData.equipmentShowBackground}
                    onChange={(e) => updateCardData('equipmentShowBackground', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Show Equipment Name Background
                </label>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  Toggle the black background and border for the equipment name bar
                </div>
                
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', marginTop: '16px' }}>
                  Equipment Description (Black Background, Italics)
                </label>
                <textarea
                  value={cardData.equipmentDescription}
                  onChange={(e) => updateCardData('equipmentDescription', e.target.value)}
                  style={{ ...inputStyle, height: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px', fontStyle: 'italic' }}
                  placeholder="Equipment description text... (will appear in italics with black background)"
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  ✨ This text appears with a black background and white italics styling on the card
                </div>
              </>
            )}
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
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Element Power Text
            </label>
            <input
              type="text"
              value={cardData.circularText}
              onChange={(e) => updateCardData('circularText', e.target.value)}
              style={inputStyle}
              placeholder="Element Power Text"
            />
            
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '12px' }}>
              <input
                type="checkbox"
                checked={cardData.flipCircularText}
                onChange={(e) => updateCardData('flipCircularText', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Flip Text Direction
            </label>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              Check this if text appears backwards on the bottom portion
            </div>
            
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
              Domain Element
            </label>
            <select
              value={cardData.rightIconDomain}
              onChange={(e) => updateCardData('rightIconDomain', e.target.value)}
              style={inputStyle}
            >
              <option value="water">Water</option>
              <option value="earth">Earth</option>
              <option value="smoke">Smoke</option>
              <option value="lightning">Lightning</option>
              <option value="fire">Fire</option>
            </select>

            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
              Text Rotation: {cardData.textRotation}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cardData.textRotation}
              onChange={(e) => updateCardData('textRotation', parseFloat(e.target.value))}
              style={{
                ...inputStyle,
                cursor: 'pointer'
              }}
            />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              Adjust the position of text around the icon (0% = top, 25% = right, 50% = bottom, 75% = left)
            </div>
          </div>
        )}
        
        {selectedElement === 'type' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>
              Card Type Text (displayed on type line)
            </label>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              💡 Use the "Card Type" button in the top-left to switch between Creature, Equipment, and Leader layouts
            </div>
            <textarea
              value={cardData.typeDisplayText}
              onChange={(e) => updateCardData('typeDisplayText', e.target.value)}
              style={{ ...inputStyle, height: '60px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
              placeholder="Enter custom type text (e.g., 'Artifact', 'Spell', 'Enhancement', etc.)"
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
            
            {cardData.type === 'equipment' && (
              <>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', marginBottom: '8px' }}>
                  💡 Equipment cards show the name bar positioned under the attack stats
                </div>
                
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '12px' }}>
                  <input
                    type="checkbox"
                    checked={cardData.equipmentShowBackground}
                    onChange={(e) => updateCardData('equipmentShowBackground', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Show Equipment Name Background
                </label>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  Toggle the black background and border for the equipment name bar
                </div>
                
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', marginTop: '16px' }}>
                  Equipment Description (Black Background, Italics)
                </label>
                <textarea
                  value={cardData.equipmentDescription}
                  onChange={(e) => updateCardData('equipmentDescription', e.target.value)}
                  style={{ ...inputStyle, height: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px', fontStyle: 'italic' }}
                  placeholder="Equipment description text... (will appear in italics with black background)"
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  ✨ This text appears with a black background and white italics styling on the card
                </div>
              </>
            )}
            
            {cardData.type === 'leader' && (
              <>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', marginBottom: '8px' }}>
                  💡 Leader cards show special header bars on the top right
                </div>
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '12px' }}>
                  Leader Description 1 (Top Bar)
                </label>
                <input
                  type="text"
                  value={cardData.leaderDescription1}
                  onChange={(e) => updateCardData('leaderDescription1', e.target.value)}
                  style={inputStyle}
                  placeholder="Primary Title"
                />
                
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '8px' }}>
                  Leader Description 2 (Bottom Bar)
                </label>
                <input
                  type="text"
                  value={cardData.leaderDescription2}
                  onChange={(e) => updateCardData('leaderDescription2', e.target.value)}
                  style={inputStyle}
                  placeholder="Secondary Description"
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
        
        {selectedElement === 'abilityText' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Card Ability Text
            </label>
            
            {/* Special Keywords Buttons */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>
                Special Keywords (click to insert):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%onceaturn%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#f2419a',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '0 6px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Once / Turn
                </button>
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%whenattacking%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#d61f35',
                    color: 'white',
                    borderRadius: '0',
                    padding: '0 8px 0 6px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    clipPath: 'polygon(4px 0%, 100% 0%, 100% 100%, 4px 100%, 0% 50%)'
                  }}
                >
                  Attacker
                </button>
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%whenattackingfull%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#d61f35',
                    color: 'white',
                    borderRadius: '0',
                    padding: '0 8px 0 6px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    clipPath: 'polygon(4px 0%, 100% 0%, 100% 100%, 4px 100%, 0% 50%)'
                  }}
                >
                  When Attacking
                </button>
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%tap%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    borderRadius: '4px',
                    padding: '0 6px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: '1px solid #dee2e6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <img src="/tap.png" alt="tap" style={{ height: '10px', verticalAlign: 'middle' }} /> :
                </button>
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%defender%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#faa43c',
                    color: 'white',
                    borderRadius: '0',
                    padding: '0 8px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 50%, calc(100% - 4px) 100%, 4px 100%, 0% 50%)'
                  }}
                >
                  Defender
                </button>
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%onplay%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#3d5daa',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '0 6px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  On Play
                </button>
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '%main%' + textAfter);
                  }}
                  style={{
                    backgroundColor: '#ed6429',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '0 6px',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Main
                </button>
              </div>
              
              {/* Text Formatting Buttons */}
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>
                Text Formatting:
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = cardData.textBox.substring(0, cursorPos);
                    const textAfter = cardData.textBox.substring(cursorPos);
                    updateCardData('textBox', textBefore + '*text*' + textAfter);
                  }}
                  style={{
                    ...inputStyle,
                    height: 'auto',
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    marginBottom: '0'
                  }}
                >
                  *Bold*
                </button>
                
                                 <button
                   onClick={() => {
                     const textarea = document.querySelector('textarea');
                     const cursorPos = textarea.selectionStart;
                     const textBefore = cardData.textBox.substring(0, cursorPos);
                     const textAfter = cardData.textBox.substring(cursorPos);
                     updateCardData('textBox', textBefore + '$text$' + textAfter);
                   }}
                   style={{
                     ...inputStyle,
                     height: 'auto',
                     padding: '4px 8px',
                     fontSize: '10px',
                     fontStyle: 'italic',
                     backgroundColor: '#f8f9fa',
                     border: '1px solid #dee2e6',
                     marginBottom: '0'
                   }}
                 >
                   $Italic$
                 </button>
                 
                 <button
                   onClick={() => {
                     const textarea = document.querySelector('textarea');
                     const cursorPos = textarea.selectionStart;
                     const textBefore = cardData.textBox.substring(0, cursorPos);
                     const textAfter = cardData.textBox.substring(cursorPos);
                     updateCardData('textBox', textBefore + '^1^' + textAfter);
                   }}
                   style={{
                     ...inputStyle,
                     height: 'auto',
                     padding: '4px 8px',
                     fontSize: '10px',
                     backgroundColor: '#f8f9fa',
                     border: '1px solid #dee2e6',
                     marginBottom: '0',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '4px'
                   }}
                 >
                   <span style={{
                     backgroundColor: '#000000',
                     color: 'white',
                     borderRadius: '50%',
                     padding: '0 4px',
                     fontSize: '8px',
                     fontWeight: 'bold',
                     minWidth: '14px',
                     textAlign: 'center',
                     display: 'inline-block'
                   }}>1</span>
                   Cost
                 </button>
              </div>
            </div>

            <textarea
              value={cardData.textBox}
              onChange={(e) => updateCardData('textBox', e.target.value)}
              style={{ ...inputStyle, height: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px' }}
              placeholder="Type here or use buttons above to insert formatting...

Examples: 
• %onplay% *Summon* a 2/2 $defender$ token.
• Pay ^2^ to activate this ability.
• *Bold*, $Italic$, ^Cost^ formatting"
            />
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              ✨ Live preview on card! Changes appear instantly with formatted styling.
            </div>
          </div>
        )}
        
        {selectedElement === 'equipmentDescription' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Equipment Description (Black Background, White Italics)
            </label>
            <textarea
              value={cardData.equipmentDescription}
              onChange={(e) => updateCardData('equipmentDescription', e.target.value)}
              style={{ ...inputStyle, height: '100px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px', fontStyle: 'italic' }}
              placeholder="Equipment description text... This will appear with a black background and white italic text on the card."
            />
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              ✨ This text appears in a black box with white italic styling, always visible on equipment cards.
            </div>
            
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', marginTop: '16px' }}>
              Border Style
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => updateCardData('equipmentDescriptionStyle', 'diamond')}
                style={{
                  ...inputStyle,
                  width: 'auto',
                  flex: 1,
                  backgroundColor: cardData.equipmentDescriptionStyle === 'diamond' ? '#3b82f6' : '#f9fafb',
                  color: cardData.equipmentDescriptionStyle === 'diamond' ? 'white' : 'black',
                  cursor: 'pointer',
                  marginBottom: '0'
                }}
              >
                ◆ Diamond
              </button>
              <button
                onClick={() => updateCardData('equipmentDescriptionStyle', 'rounded')}
                style={{
                  ...inputStyle,
                  width: 'auto',
                  flex: 1,
                  backgroundColor: cardData.equipmentDescriptionStyle === 'rounded' ? '#3b82f6' : '#f9fafb',
                  color: cardData.equipmentDescriptionStyle === 'rounded' ? 'white' : 'black',
                  cursor: 'pointer',
                  marginBottom: '0'
                }}
              >
                ● Rounded
              </button>
            </div>
          </div>
        )}
        
        {selectedElement === 'stats' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Attack & Defense Stats
            </label>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>
                <input
                  type="checkbox"
                  checked={cardData.showAttack}
                  onChange={(e) => updateCardData('showAttack', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Show Attack
              </label>
              {cardData.showAttack && (
                <input
                  type="text"
                  value={cardData.attack}
                  onChange={(e) => updateCardData('attack', e.target.value)}
                  style={inputStyle}
                  placeholder="Attack"
                />
              )}
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>
                <input
                  type="checkbox"
                  checked={cardData.showDefense}
                  onChange={(e) => updateCardData('showDefense', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Show Defense
              </label>
              {cardData.showDefense && (
                <input
                  type="text"
                  value={cardData.defense}
                  onChange={(e) => updateCardData('defense', e.target.value)}
                  style={inputStyle}
                  placeholder="Defense"
                />
              )}
            </div>
            
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              💡 Defaults: Leader = Defense only, Equipment = Attack only, Creature = Both
            </div>
          </div>
        )}
        

        
        {selectedElement === 'rarity' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px', marginTop: '12px' }}>
              <input
                type="checkbox"
                checked={cardData.showRarityStamp}
                onChange={(e) => updateCardData('showRarityStamp', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show Rarity Stamp
            </label>
            
            {cardData.showRarityStamp && (
              <>
                <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
                  Rarity Symbol
                </label>
                {[
                  { symbol: 'α', name: 'Alpha' },
                  { symbol: 'σ', name: 'Sigma' },
                  { symbol: 'β', name: 'Beta' }
                ].map(({ symbol, name }) => (
                  <button
                    key={symbol}
                    onClick={() => updateCardData('raritySymbol', symbol)}
                    style={{
                      ...inputStyle,
                      backgroundColor: cardData.raritySymbol === symbol ? '#e5e7eb' : '#f9fafb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span>{name}</span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{symbol}</span>
                  </button>
                ))}
              </>
            )}
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

        {selectedElement === 'leaderDescription1' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Leader Description 1 (Top Bar)
            </label>
            <input
              type="text"
              value={cardData.leaderDescription1}
              onChange={(e) => updateCardData('leaderDescription1', e.target.value)}
              style={inputStyle}
              placeholder="Primary Title - appears on longer top bar"
            />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              This appears in the top (longer) bar on the right side of leader cards.
            </div>
          </div>
        )}

        {selectedElement === 'leaderDescription2' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Leader Description 2 (Bottom Bar)
            </label>
            <input
              type="text"
              value={cardData.leaderDescription2}
              onChange={(e) => updateCardData('leaderDescription2', e.target.value)}
              style={inputStyle}
              placeholder="Secondary Title - appears on shorter bottom bar"
            />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              This appears in the bottom (shorter) bar on the right side of leader cards.
            </div>
          </div>
        )}
        
        {selectedElement === 'cardType' && (
          <div>
            <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Card Type Selection
            </label>
            {[
              { value: 'creature', label: 'Classic', desc: 'Standard creature cards with attack & defense' },
              { value: 'equipment', label: 'Equipment', desc: 'Equipment cards with attack focus' },
              { value: 'leader', label: 'Leader', desc: 'Leader cards with special header & defense focus' }
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => updateCardData('type', value)}
                style={{
                  ...inputStyle,
                  backgroundColor: cardData.type === value ? '#3b82f6' : '#f9fafb',
                  color: cardData.type === value ? 'white' : 'black',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  padding: '12px'
                }}
              >
                <span style={{ fontWeight: '600', marginBottom: '2px' }}>{label}</span>
                <span style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.3' }}>
                  {desc}
                </span>
              </button>
            ))}
          </div>
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

        {selectedElement === 'circularText' && (
          <input
            type="text"
            value={cardData.circularText}
            onChange={(e) => updateCardData('circularText', e.target.value)}
            style={inputStyle}
            placeholder="Circular Text around Icon"
          />
        )}

        {selectedElement === 'cardColor' && (
          <div>
            <button
              onClick={() => updateCardData('showLeftIcons', !cardData.showLeftIcons)}
              style={{
                ...inputStyle,
                backgroundColor: cardData.showLeftIcons ? '#10b981' : '#e5e7eb',
                color: cardData.showLeftIcons ? 'white' : 'black',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              Show Left Icons: {cardData.showLeftIcons ? 'ON' : 'OFF'}
            </button>
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
        
        <button onClick={() => setSelectedElement(null)} style={buttonStyle}>
          Close
        </button>
        </div>
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
          {showCardBack ? (
            <CardBack />
          ) : (
            <>
              {/* Front card content */}
          {/* Background Image - Full Card */}
          <CardElement elementType="cardBackground" style={{ position: 'absolute', inset: 0 }}>
            {cardData.backgroundImage ? (
              <img 
                src={cardData.backgroundImage} 
                alt="Card background" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: 'center center'
                }}
                className={`card-background card-background-${cardData.type}`}
              />
            ) : (
              <div 
                style={{ width: '100%', height: '100%', zIndex: -20, ...checkerboardPattern }} 
                className={`card-background-placeholder card-background-placeholder-${cardData.type}`}
              />
            )}
          </CardElement>
          

          
          {/* Card Name Background Container - Absolutely positioned (hidden for equipment cards) */}
          {cardData.type !== 'equipment' && (
            <div 
              className={`card-name-background card-name-background-${cardData.type}`}
              style={{
                position: 'absolute',
                top: `${47 * scale}px`,
                left: 0,
                right: cardData.fullArt ? 0 : `${0 * scale}px`,
                height: `${128 * scale}px`,
                backgroundColor: cardData.fullArt ? 'transparent' : 'black',
                borderRadius: cardData.fullArt ? '0' : `${48 * scale}px ${48 * scale}px 0 0`,
                zIndex: 14,
                pointerEvents: 'none'
              }}
            />
          )}

          {/* Leader Header - Only for leader cards */}
          {cardData.type === 'leader' && (
            <LeaderHeader 
              cardData={cardData}
              CardElement={CardElement}
              cardColors={cardColors}
              scale={scale}
              helveticaFont={helveticaFont}
            />
          )}

          {/* Header - Absolutely positioned (hidden for leader cards) */}
          {cardData.type !== 'leader' && (
            <div className={`card-header-container card-header-container-${cardData.type}`} style={{
            position: 'absolute',
            top: `${50 * scale}px`,
            left: cardData.fullArt ? `${38 * scale}px` : `${38 * scale}px`,
            right: cardData.fullArt ? `${36 * scale}px` : `${36 * scale}px`,
            height: `${128 * scale}px`,
            backgroundColor: 'transparent',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: `${32 * scale}px`,
            zIndex: 15
          }}>
            {/* Hidden icons mouseover area - positioned outside the hidden container */}
            {!cardData.showLeftIcons && (
              <div 
                style={{
                  position: 'absolute',
                  left: cardData.fullArt ? `${38 * scale}px` : `${38 * scale}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: `${300 * scale}px`,
                  height: `${149 * scale}px`,
                  cursor: 'pointer',
                  zIndex: 20
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.outline = '3px dashed rgba(255,255,255,0.7)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => updateCardData('showLeftIcons', true)}
                title="Click to show left icons"
              />
            )}

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: `${16 * scale}px`, 
              position: 'relative',
              paddingLeft: cardData.fullArt ? `${0 * scale}px` : `${0 * scale}px`,
              opacity: cardData.showLeftIcons ? 1 : 0,
              visibility: cardData.showLeftIcons ? 'visible' : 'hidden'
            }}>
              {/* Connecting background when both are present */}
              {cardData.cardColor && cardData.leftIcon && cardData.showLeftIcons && (
                <div style={{
                  border: '4px solid black',
                  position: 'absolute',
                  borderRadius: `${90 * scale}px`,
                  backgroundColor: cardColors[cardData.cardColor].bg,
                  left: `${-16 * scale}px`,
                  right: `${0 * scale}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: `${148 * scale}px`
                }} />
              )}
           
              {/* Card Color bubble */}
              {cardData.showLeftIcons && (
                <CardElement elementType="cardColor">
                  <div 
                    className={`card-color-bubble card-color-bubble-${cardData.type}`}
                    style={{
                      width: `${149 * scale}px`,
                      height: `${149 * scale}px`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 10,
                      backgroundColor: cardColors[cardData.cardColor].bg,
                      border: `${0 * scale}px solid white`,
                      overflow: 'hidden'
                    }}
                  >
                   <img 
                     src={izkWhiteImage}
                     alt="IZK"
                     className={`card-color-icon card-color-icon-${cardData.type}`}
                     style={{
                       width: '92%',
                       height: '92%',
                       objectFit: 'contain',
                       filter: getOptimizedFilter(cardColors[cardData.cardColor].fg)
                     }}
                   />

                 </div>
               </CardElement>
              )}
           
              {/* Left Icon */}
              {cardData.leftIcon && cardData.showLeftIcons && (
                <CardElement elementType="leftIcon">
                  <div 
                    className={`left-icon-container left-icon-container-${cardData.type}`}
                    style={{
                      width: `${120 * scale}px`,
                      height: `${140 * scale}px`,
                      paddingTop: '2px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'left',
                      justifyContent: 'left',
                      fontSize: `${105 * scale}px`,
                      lineHeight: `${120 * scale}px`,
                      fontWeight: 'bold',
                      color: 'white',
                      position: 'relative',
                      zIndex: 10,
                      WebkitTextStroke: '1px white',
                      left: `${18 * scale}px`,
                      marginRight: `${36 * scale}px`,
                      backgroundColor: cardColors[cardData.cardColor].bg,
                      fontFamily: 'system-ui !important',
                    }}
                  >
                   <span className={`left-icon-text left-icon-text-${cardData.type}`}>
                     {cardData.leftIcon}
                   </span>
                 </div>
               </CardElement>
              )}
         </div>
         
            {/* Card Name (hidden for equipment cards) */}
            {cardData.type !== 'equipment' && (
              <CardElement elementType="cardName" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: `${80 * scale}px`, minWidth: `${cardWidth * 0.4 * scale}px`, position: 'relative' }}>
                {/* First render: Stroke outline */}
                <h2 
                  className={`card-name-stroke card-name-stroke-${cardData.type}`}
                  style={{ 
                    fontSize: `${92 * scale}px`, 
                    fontWeight: 'bold', 
                    margin: 0, 
                    lineHeight: `${80 * scale}px`, 
                    paddingLeft: cardData.showLeftIcons ? `${0 * scale}px` : `${0 * scale}px`,
                    WebkitTextStroke: cardData.fullArt ? '6px white' : 'none',
                    color: cardData.fullArt ? 'transparent' : 'white',
                    textShadow: cardData.fullArt ? 'none' : `
                      -6px -6px 0 black,
                      6px -6px 0 black,
                      -6px 6px 0 black,
                      6px 6px 0 black,
                      0 6px 0 black,
                      6px 0 0 black,
                      0 -6px 0 black,
                      -6px 0 0 black
                    `,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1,
                    ...helveticaFont 
                  }}
                >
                  {cardData.name}
                </h2>
                
                {/* Second render: Clean text overlay */}
                <h2 
                  className={`card-name-text card-name-text-${cardData.type}`}
                  style={{ 
                    fontSize: `${92 * scale}px`, 
                    fontWeight: 'bold', 
                    margin: 0, 
                    lineHeight: `${80 * scale}px`, 
                    paddingLeft: cardData.showLeftIcons ? `${0 * scale}px` : `${0 * scale}px`,
                    color: cardData.fullArt ? 'black' : 'white',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 2,
                    ...helveticaFont 
                  }}
                >
                  {cardData.name}
                </h2>
              </CardElement>
            )}
         
            {/* RIGHT ICON AREA - Top Right Corner Domain Element */}
            <CardElement elementType="rightIcon" style={{ paddingRight: 0, position: 'relative' }}>
              {/* OUTERMOST CONTAINER - Main positioning container (220x220px) */}
              <div 
                className={`right-icon-outer-container right-icon-outer-container-${cardData.type}`}
                style={{
                  width: `${220 * scale}px`,
                  height: `${220 * scale}px`,
                  position: 'relative',
                  left: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                
                                  {/* CIRCULAR TEXT AREA - Text that curves around the outer perimeter */}
                  <CardElement elementType="circularText" style={{ position: 'absolute', top: -7, left: 2, width: '100%', height: '100%' }}>
                    {/* CIRCULAR TEXT STROKE LEFT - First render with black stroke outline (counter-clockwise) */}
                    <svg 
                      className="circular-text-stroke-svg"
                      width={`${220 * scale}px`} 
                      height={`${520 * scale}px`} 
                      style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                    >
                      <defs>
                                              <path 
                        id="circle-path-stroke" 
                        d={cardData.flipCircularText 
                          ? `M ${109.99 * scale} ${20 * scale} A ${120 * scale} ${120 * scale} 0 1 0 ${110 * scale} ${20 * scale}`
                          : `M ${110 * scale} ${20 * scale} A ${120 * scale} ${120 * scale} 0 1 1 ${109.99 * scale} ${20 * scale}`
                        }
                      />
                      </defs>
                      <text 
                        className="circular-text-stroke"
                        fontSize={`${40 * scale}px`} 
                        fill="transparent"
                        fontWeight="900"
                        stroke="black"
                        strokeWidth={`${14 * scale}px`}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{ 
                          ...helveticaFont,
                          fontWeight: '900',
                          letterSpacing: `${6.975 * scale}px`
                        }}
                      >
                        <textPath href="#circle-path-stroke" startOffset={`${cardData.textRotation}%`}>
                          {cardData.circularText || 'GATE'}
                        </textPath>
                      </text>
                    </svg>

                    {/* CIRCULAR TEXT STROKE RIGHT - Second render with black stroke outline (clockwise) */}
                    <svg 
                      className="circular-text-stroke-right-svg"
                      width={`${220 * scale}px`} 
                      height={`${520 * scale}px`} 
                      style={{ position: 'absolute', top: 0, left: `${2 * scale}px`, zIndex: 1 }}
                    >
                      <defs>
                                              <path 
                        id="circle-path-stroke-right" 
                        d={cardData.flipCircularText 
                          ? `M ${109.99 * scale} ${20 * scale} A ${120 * scale} ${120 * scale} 0 1 0 ${110 * scale} ${20 * scale}`
                          : `M ${110 * scale} ${20 * scale} A ${120 * scale} ${120 * scale} 0 1 1 ${109.99 * scale} ${20 * scale}`
                        }
                      />
                      </defs>
                      <text 
                        className="circular-text-stroke-right"
                        fontSize={`${40 * scale}px`} 
                        fill="transparent"
                        fontWeight="900"
                        stroke="black"
                        strokeWidth={`${14 * scale}px`}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{ 
                          ...helveticaFont,
                          fontWeight: '900',
                          letterSpacing: `${6.975 * scale}px`
                        }}
                      >
                        <textPath href="#circle-path-stroke-right" startOffset={`${cardData.textRotation - 1}%`}>
                          {cardData.circularText || 'GATE'}
                        </textPath>
                      </text>
                    </svg>
                    
                    {/* CIRCULAR TEXT FILL - Second render with clean white text overlay */}
                    <svg 
                      className="circular-text-fill-svg"

                      width={`${220 * scale}px`} 
                      height={`${520 * scale}px`} 
                      style={{ position: 'absolute', top: 0, left: -1, zIndex: 2 }}
                    >
                      <defs>
                                              <path 
                        id="circle-path-fill" 
                        d={cardData.flipCircularText 
                          ? `M ${107.99 * scale} ${20 * scale} A ${120 * scale} ${120 * scale} 0 1 0 ${108 * scale} ${20 * scale}`
                          : `M ${108 * scale} ${20 * scale} A ${120 * scale} ${120 * scale} 0 1 1 ${107.99 * scale} ${20 * scale}`
                        }
                      />
                      </defs>
                      <text 
                        className="circular-text-fill"
                        fontSize={`${40 * scale}px`} 
                        fill="white"
                        fontWeight="900"
                        stroke="none"
                        style={{ 
                          ...helveticaFont,
                          fontWeight: '900',
                          letterSpacing: `${6.975 * scale}px`
                        }}
                      >
                        <textPath href="#circle-path-fill" startOffset={`${cardData.textRotation}%`}>
                          {cardData.circularText || 'GATE'}
                        </textPath>
                      </text>
                    </svg>
                  </CardElement>

                {/* BLACK BORDER RING - Middle ring with black border (200x200px) */}
                <div 
                  className={`white-border-ring white-border-ring-${cardData.type}`}
                                      style={{
                      width: cardData.fullArt ? `${186 * scale}px` : `${280 * scale}px`,
                      height: cardData.fullArt ? `${186 * scale}px` : `${270 * scale}px`,
                      borderRadius: '50%',
                      border: cardData.fullArt ? `${18 * scale}px solid black` : `${65 * scale}px solid black`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      backgroundColor: 'transparent',
                      boxSizing: 'border-box',
                      aspectRatio: '1 / 1'
                    }}
                >
                  {/* DOMAIN ICON CONTAINER - Inner circle with domain image (120x120px) */}
                  <div 
                    className={`domain-icon-container domain-icon-container-${cardData.type}`}
                    style={{
                      width: `${156 * scale}px`, // Increased to accommodate the full circle including border
                      height: `${156 * scale}px`, // Increased to accommodate the full circle including border
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* SVG CIRCLE - Drawn circle with proper color */}
                    <svg 
                      width={`${156 * scale}px`} 
                      height={`${156 * scale}px`} 
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                      <circle
                        cx={`${78 * scale}px`}
                        cy={`${78 * scale}px`}
                        r={`${78 * scale}px`}
                        fill={cardColors[cardData.cardColor].bg}
                        stroke="none"
                      />
                    </svg>
                    
                    {/* DOMAIN IMAGE - Water/Earth/Smoke/Lightning element image */}
                    <img 
                      className={`domain-image domain-image-${cardData.type}`}
                      src={getDomainImage(cardData.rightIconDomain)}
                      alt={`${cardData.rightIconDomain} Domain`}
                      style={{
                        width: `${204 * scale}px`, // Adjusted size for the new container
                        height: `${204 * scale}px`, // Adjusted size for the new container
                        objectFit: 'contain',
                        filter: getOptimizedFilter(cardColors[cardData.cardColor].fg),
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardElement>
       </div>
          )}
          
          {/* End of header container */}

          {/* Main Card Area - Art positioning stays consistent */}
            <div 
              className={`main-card-area main-card-area-${cardData.type}`}
              style={{
                position: 'absolute',
                top: `${128 * scale}px`,
                right: 0,
                bottom: 0,
                left: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1
              }}
            >
            
            {/* Art Box - Main viewing area */}
            <CardElement elementType="background" style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              {!cardData.backgroundImage && (
                <div style={{ position: 'absolute', inset: 0, zIndex: -20, ...artCheckerboardPattern }} />
              )}
              <div 
                className={`card-background-area card-background-area-${cardData.type}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: selectedElement === 'background' ? cardColors[cardData.cardColor].fg : 'transparent', 
                  position: 'relative', 
                  zIndex: 10,
                  transition: 'background-color 0.3s ease'
                }} 
              />
            </CardElement>
          </div>

          {/* Bottom diagonal corners - absolutely positioned independent container */}
          <div 
            className={`card-corner-triangles card-corner-triangles-${cardData.type}`}
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
            {/* Left triangle using CSS borders for better cross-platform compatibility */}
            <div 
              className="card-triangle-left bottom-border-left"
              style={{
                position: 'absolute',
                bottom: cardData.fullArt ? `${-200 * scale}px` : `${57 * scale}px`,
                left: cardData.fullArt ? `${-200 * scale}px` : `${55 * scale}px`,
                width: 0,
                height: 0,
                borderLeft: `${150 * scale}px solid black`,
                borderTop: `${150 * scale}px solid transparent`,
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
            />
            
            {/* Right triangle using CSS borders for better cross-platform compatibility */}
            <div 
              className="card-triangle-right bottom-border-right"
              style={{
                position: 'absolute',
                bottom: cardData.fullArt ? `${-200 * scale}px` : `${57 * scale}px`,
                right: cardData.fullArt ? `${-200 * scale}px` : `${55 * scale}px`,
                width: 0,
                height: 0,
                borderRight: `${150 * scale}px solid black`,
                borderTop: `${150 * scale}px solid transparent`,
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
            />
          </div>
          

          
          {/* Gate Power Component */}
          <CardGatePower 
            cardData={cardData}
            CardElement={CardElement}
            cardColors={cardColors}
            scale={scale}
          />



          {/* Footer Text Component */}
          <CardFooterText 
            cardData={cardData}
            CardElement={CardElement}
            helveticaFont={helveticaFont}
            scale={scale}
          />

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
              <div style={{ position: 'relative' }}>
                {/* First render: Stroke outline */}
                <span style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px white',
                  position: 'absolute',
                  zIndex: 1,
                  ...helveticaFont
                }}>
                  © {cardData.copyrightText}
                </span>
                {/* Second render: Clean text */}
                <span style={{
                  color: 'black',
                  position: 'relative',
                  zIndex: 2,
                  ...helveticaFont
                }}>
                  © {cardData.copyrightText}
                </span>
              </div>
            </div>
          </CardElement>

          {/* Rarity Stamp - positioned absolutely to card */}
          {cardData.showRarityStamp ? (
            <CardElement elementType="rarity">
              <div 
                style={{
                  position: 'absolute',
                  left: `${90 * scale}px`,
                  top: `${(1150 - (cardData.type === 'equipment' ? 250 : 0)) * scale}px`,
                  width: `${132 * scale}px`,
                  height: `${120 * scale}px`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'normal',
                  fontSize: `${120 * scale}px`,
                  zIndex: 1010,
                  backgroundColor: 'black',
                  paddingBottom: `${15 * scale}px`,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  outline: selectedElement === 'rarity' ? '2px solid #3b82f6' : 'none',
                  ...helveticaFont
                }}
                onMouseEnter={(e) => {
                  if (selectedElement !== 'rarity') {
                    e.currentTarget.style.outline = '2px dashed rgba(59, 130, 246, 0.7)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedElement !== 'rarity') {
                    e.currentTarget.style.outline = 'none';
                  }
                }}
                onClick={() => setSelectedElement('rarity')}
              >
                {cardData.raritySymbol}
              </div>
            </CardElement>
          ) : (
            /* Hidden rarity stamp mouseover area */
            <div 
              style={{
                position: 'absolute',
                left: `${95 * scale}px`,
                top: `${(1150 - (cardData.type === 'equipment' ? 250 : 0)) * scale}px`,
                width: `${128 * scale}px`,
                height: `${128 * scale}px`,
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 1010
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.outline = '3px dashed rgba(255,255,255,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => updateCardData('showRarityStamp', true)}
              title="Click to show rarity stamp"
            />
          )}

          {/* Card Border Component */}
          <CardBorder 
            cardData={cardData}
            CardElement={CardElement}
            scale={scale}
          />

          {/* Equipment Card Name Bar - positioned just under attack stats */}
          {cardData.type === 'equipment' && (
            <CardElement elementType="cardName" style={{ 
              position: 'absolute', 
              left: `${cardWidth * 0.05 * scale}px`, 
              right: `${cardWidth * 0.05 * scale}px`, 
              bottom: cardData.equipmentShowBackground ? `${390 * scale}px` : `${410 * scale}px`, 
              zIndex: 1010
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: !cardData.equipmentShowBackground ? `${149 * scale}px` : `${169 * scale}px`,
                // First background layer - gradient from inside to outside
                background: cardData.equipmentShowBackground ? 'radial-gradient(ellipse at center, #eaf3fe 30%, #68717a 100%)' : 'transparent',
                borderRadius: cardData.equipmentShowBackground ? `${75 * scale}px` : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Second background layer - inset with current grey color */}
                {cardData.equipmentShowBackground && (
                  <div style={{
                    position: 'absolute',
                    top: `${12 * scale}px`,
                    left: `${12 * scale}px`,
                    right: `${12 * scale}px`,
                    bottom: `${12 * scale}px`,
                    backgroundColor: '#2f3841',
                    borderRadius: `${63 * scale}px`, // Slightly smaller radius to match the inset
                    zIndex: 1
                  }} />
                )}
                {/* First render: Stroke outline */}
                <h2 
                  className={`equipment-card-name-stroke equipment-card-name-stroke-${cardData.type}`}
                  style={{ 
                    fontSize: `${95 * scale}px`, 
                    fontWeight: 'bold', 
                    margin: 0, 
                    lineHeight: `${119 * scale}px`,
                    WebkitTextStroke: !cardData.equipmentShowBackground ? '4px white' : 'none',
                    color: !cardData.equipmentShowBackground ? 'transparent' : 'transparent',
                    textShadow: !cardData.equipmentShowBackground ? 'none' : 'none',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 3,
                    ...helveticaFont 
                  }}
                >
                  {cardData.name}
                </h2>
                
                {/* Second render: Clean text overlay */}
                <h2 
                  className={`equipment-card-name-text equipment-card-name-text-${cardData.type}`}
                  style={{ 
                    fontSize: `${95 * scale}px`, 
                    fontWeight: 'bold', 
                    margin: 0, 
                    lineHeight: `${119 * scale}px`,
                    color: cardData.equipmentShowBackground ? 'white' : 'black',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 3,
                    ...helveticaFont 
                  }}
                >
                  {cardData.name}
                </h2>
              </div>
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
            updateCardData={updateCardData}
          />

          {/* Equipment Description - Only for equipment cards */}
          {cardData.type === 'equipment' && (
            <CardElement elementType="equipmentDescription" style={{ 
              position: 'absolute', 
              left: `${96 * scale}px`, 
              right: `${96 * scale}px`, 
              bottom: `${165 * scale}px`,
              zIndex: 10
            }}>
              <div style={{
                backgroundColor: 'black',
                color: 'white',
                padding: `${39 * scale}px ${74 * scale}px ${25 * scale}px ${74 * scale}px`,
                fontSize: `${42 * scale}px`, // Increased by 1.3x (32 * 1.3 ≈ 42)
                fontStyle: 'italic',
                lineHeight: 1.3,
                textAlign: 'left', // Changed from center to left to accommodate diamond
                minHeight: `${95 * scale}px`, // Increased proportionally
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                // Conditional styling based on equipmentDescriptionStyle
                ...(cardData.equipmentDescriptionStyle === 'diamond' 
                  ? {
                      clipPath: `polygon(${90 * scale}px 0%, calc(100% - ${90 * scale}px) 0%, 100% 50%, calc(100% - ${90 * scale}px) 100%, ${90 * scale}px 100%, 0% 50%)` // Diamond shape with exact 45-degree angles
                    }
                  : {
                      borderRadius: `${90 * scale}px` // Rounded edges
                    }
                ),
                position: 'relative',
                ...helveticaFont
              }}>
                {/* White diamond on the left */}
                <div style={{
                  width: `${17 * scale}px`,
                  height: `${17 * scale}px`,
                  backgroundColor: 'white',
                  transform: 'rotate(45deg)',
                  marginRight: `${16 * scale}px`,
                  marginLeft: `${10 * scale}px`, // Equal horizontal displacement
                  flexShrink: 0,
                  marginTop: `-${60 * scale}px`,
                  alignSelf: 'center' // Centers the diamond vertically for equal displacement
                }} />
                
                {/* Text content */}
                <div style={{
                  flex: 1,
                  paddingRight: `${12 * scale}px` // Account for the clipped right edge
                }}>
                  {cardData.equipmentDescription}
                </div>
              </div>
            </CardElement>
          )}
            </>
          )}
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
            opacity: 0.9,
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
          📥 Download {showCardBack ? 'Card Back' : 'Card'}
        </button>
        
        <button
          onClick={() => setShowCardBack(!showCardBack)}
          style={{
            padding: '8px 16px',
            backgroundColor: showCardBack ? '#dc2626' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {showCardBack ? '🔄 Show Front' : '🔄 Show Back'}
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
          onClick={() => setSelectedElement('cardType')}
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
          🃏 Card Type: {cardData.type === 'creature' ? 'Classic' : cardData.type === 'equipment' ? 'Equipment' : 'Leader'}
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