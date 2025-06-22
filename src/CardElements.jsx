import React from 'react';
import CardAbilityText from './CardAbilityText';

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
  const classicStyle = {
    typeLine: {
      height: '17px',
      bottom: `${148 * scale}px`,
      fontSize: '12.5px',
      borderRadius: '0px'
    },
    horizontalBar: {
      height: '3px',
      bottom: `${176 * scale}px`,
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
              <span style={{ textTransform: 'capitalize' }}>{cardData.type}</span>
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

      {/* Attack/Defense stats - positioned absolutely to card */}
      {(cardData.showAttack || cardData.showDefense) && (
        <CardElement elementType="stats">
          <div style={{
            position: 'absolute',
            right: `${210 * scale}px`,
            bottom: `${474 * scale}px`,
            zIndex: 1012
          }}>
            {/* Attack Box - Top */}
            {cardData.showAttack && (
              <div style={{
                position: 'absolute',
                top: '-21px',
                left: -1.5,
                zIndex: 999
              }}>
                {/* Outer black border */}
                <div style={{
                  width: `${157 * scale}px`,
                  height: `${157 * scale}px`,
                  backgroundColor: 'black',
                  transform: currentMode.statsDiamonds.transform,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* White border */}
                  <div style={{
                    width: `${142 * scale}px`,
                    height: `${142 * scale}px`,
                    backgroundColor: 'white',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Inner content */}
                    <div style={{
                      width: `${133 * scale}px`,
                      height: `${133 * scale}px`,
                      backgroundColor: currentMode.statsDiamonds.attackBg,
                      color: currentMode.statsDiamonds.attackColor,
                      display: 'flex',
                      top: 5.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      borderRadius: currentMode.statsDiamonds.borderRadius,
                      WebkitTextStroke: '1px white',
                      fontSize: `${95 * scale}px`,
                      ...helveticaFont
                    }}>
                      <span style={{ transform: 'rotate(-45deg)' }}>
                        {cardData.attack}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Defense Box - Bottom */}
            {cardData.showDefense && (
              <div style={{
                position: 'absolute',
                top: `${126 * scale}px`,
                left: -1.5,
                zIndex: 999
              }}>
                {/* Outer black border */}
                <div style={{
                  width: `${157 * scale}px`,
                  height: `${157 * scale}px`,
                  backgroundColor: 'black',
                  transform: currentMode.statsDiamonds.transform,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* White border */}
                  <div style={{
                    width: `${142 * scale}px`,
                    height: `${142 * scale}px`,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Inner content */}
                    <div style={{
                      width: `${116 * scale}px`,
                      height: `${116 * scale}px`,
                      backgroundColor: currentMode.statsDiamonds.defenseBg,
                      color: currentMode.statsDiamonds.defenseColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      borderRadius: currentMode.statsDiamonds.borderRadius,
                      WebkitTextStroke: '1px black',
                      fontSize: `${100 * scale}px`,
                      ...helveticaFont
                    }}>
                      <span style={{ transform: 'rotate(-45deg)' }}>
                        {cardData.defense}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardElement>
      )}


    </>
  );
};

export default CardElements; 