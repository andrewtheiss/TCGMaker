import React from 'react';
import CardAbilityText from './CardAbilityText';
import CardStats from './CardStats';

const CardElements = ({ 
  cardData, 
  CardElement, 
  cardColors, 
  helveticaFont, 
  textShadowStyle, 
  scale, 
  cardWidth,
  mode = 'classic', // 'classic', 'modern', 'minimal'
  updateCardData
}) => {
  
  // Define mode-specific styles - all modes are same as classic for now
  // Equipment mode positioning is raised by 50px
  const equipmentOffset = cardData.type === 'equipment' ? 173 : 0;
  
  const classicStyle = {
    typeLine: {
      height: '17px',
      bottom: `${(148 + equipmentOffset) * scale}px`,
      fontSize: '12.5px',
      borderRadius: '0px'
    },
    horizontalBar: {
      height: '3px',
      bottom: `${(176 + equipmentOffset) * scale}px`,
      width: `${cardWidth * 0.7 * scale}px`
    },
    textBox: {
      borderRadius: cardData.fullArt ? '0' : `${32 * scale}px`,
      padding: `${64 * scale}px ${48 * scale}px`,
      backgroundColor: cardData.fullArt ? 'transparent' : 'rgba(255, 255, 255, 0.5)'
    },
    statsDiamonds: {
      attackBg: 'black',
      defenseBg: 'white',
      attackColor: 'white',
      defenseColor: 'black',
      borderRadius: `${11 * scale}px`,
      transform: 'rotate(45deg)'
    }
  };

  const modeStyles = {
    classic: classicStyle,
    modern: classicStyle,
    minimal: classicStyle
  };

  const currentMode = modeStyles[mode];

  return (
    <>
      {/* Type Line - Positioned absolutely to card */}
      <div style={{
        position: 'absolute',
        left: `${96 * scale}px`,
        right: `${96 * scale}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: currentMode.typeLine.height,
        bottom: currentMode.typeLine.bottom,
        zIndex: 1010,
        pointerEvents: 'auto'
      }}>
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          {/* Left triangle edge using SVG */}
          <svg width="12" height="19">
            <polygon 
              points="0,9.5 11,1 11,18"
              fill={cardColors[cardData.cardColor].bg}
            />
          </svg>
          
          {/* Main type bar */}
          <CardElement elementType="type" style={{ height: '100%' }}>
            <div style={{
              height: '100%',
              padding: '0px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: currentMode.typeLine.fontSize,
              fontWeight: '600',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              backgroundColor: cardColors[cardData.cardColor].bg,
              color: 'white',
              lineHeight: currentMode.typeLine.height,
              minWidth: '100px',
              margin: '0px -1px 0px -1px',
              borderRadius: currentMode.typeLine.borderRadius,
              ...helveticaFont
            }}>
              <span style={{ textTransform: 'capitalize' }}>{cardData.typeDisplayText || cardData.type}</span>
              {cardData.showSubtype && cardData.subtype && (
                <>
                  <span style={{ margin: '0 2px' }}>,</span>
                  <span>{cardData.subtype}</span>
                </>
              )}
            </div>
          </CardElement>
          
          {/* Right triangle edge using SVG */}
          <svg width="12" height="19">
            <polygon 
              points="0.999,1 1,18 12,9.5"
              fill={cardColors[cardData.cardColor].bg}
            />
          </svg>
        </div>
      </div>

      {/* Rectangular bar underneath type line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: currentMode.horizontalBar.width,
        height: currentMode.horizontalBar.height,
        backgroundColor: cardColors[cardData.cardColor].bg,
                 bottom: currentMode.horizontalBar.bottom,
         zIndex: 1009
      }} />

      {/* Card Ability Text - positioned absolutely to card */}
      <CardAbilityText 
        cardData={cardData}
        CardElement={CardElement}
        currentMode={currentMode}
        scale={scale}
        helveticaFont={helveticaFont}
      />

      {/* Card Stats Component */}
      <CardStats 
        cardData={cardData}
        CardElement={CardElement}
        currentMode={currentMode}
        scale={scale}
        helveticaFont={helveticaFont}
      />


    </>
  );
};

export default CardElements; 