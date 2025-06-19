import React from 'react';

const CardElements = ({ 
  cardData, 
  CardElement, 
  cardColors, 
  helveticaFont, 
  textShadowStyle, 
  scale, 
  cardWidth,
  mode = 'classic' // 'classic', 'modern', 'minimal'
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
      powerBg: 'black',
      toughnessBg: 'white',
      powerColor: 'white',
      toughnessColor: 'black',
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
                     {/* Left diamond edge */}
           <div style={{
             height: '100%',
             width: '12px',
             backgroundColor: cardColors[cardData.cardColor].bg,
             clipPath: 'polygon(0px 50%, 96% 0px, 100% 104%)',
             marginLeft: '2px'
           }} />
          
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
              minWidth: '160px',
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
          
                     {/* Right diamond edge */}
           <div style={{
             height: '100%',
             width: '13px',
             backgroundColor: cardColors[cardData.cardColor].bg,
             clipPath: 'polygon(0px -1px, 100% 50%, 0px 104%)'
           }} />
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
      <CardElement elementType="textBox">
        <div style={{
          position: 'absolute',
          left: cardData.fullArt ? `${104 * scale}px` : `${152 * scale}px`,
          right: cardData.type === 'creature' || cardData.type === 'equipment' ? `${288 * scale}px` : `${104 * scale}px`,
          top: `${1164 * scale}px`,
          bottom: `${464 * scale}px`,
          backgroundColor: currentMode.textBox.backgroundColor,
          borderRadius: currentMode.textBox.borderRadius,
          padding: currentMode.textBox.padding,
          zIndex: 1005,
          pointerEvents: 'auto',
                     border: 'none'
        }}>
          <p style={{
            fontSize: `${56 * scale}px`,
            margin: 0,
                         color: 'black',
             fontWeight: '500',
             ...(cardData.fullArt ? { ...helveticaFont, ...textShadowStyle } : helveticaFont)
          }}>
            {cardData.textBox}
          </p>
        </div>
      </CardElement>

      {/* Power/Toughness for creatures - positioned absolutely to card */}
      {cardData.type === 'creature' && (
        <CardElement elementType="stats">
          <div style={{
            position: 'absolute',
            right: `${210 * scale}px`,
            bottom: `${474 * scale}px`,
            zIndex: 1003
          }}>
            {/* Power Box - Top */}
            <div style={{
              width: `${128 * scale}px`,
              height: `${128 * scale}px`,
              backgroundColor: currentMode.statsDiamonds.powerBg,
              color: currentMode.statsDiamonds.powerColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transform: currentMode.statsDiamonds.transform,
              borderRadius: currentMode.statsDiamonds.borderRadius,
              fontSize: `${95 * scale}px`,
              border: `${6 * scale}px solid white`,
                             boxShadow: `0 0 0 ${7 * scale}px black`,
               ...helveticaFont,
               position: 'absolute',
               top: '-19px',
              left: 0,
              zIndex: 999
            }}>
              <span style={{ transform: 'rotate(-45deg)' }}>
                {cardData.power}
              </span>
            </div>
            
            {/* Toughness Box - Bottom */}
            <div style={{
              width: `${128 * scale}px`,
              height: `${128 * scale}px`,
              backgroundColor: currentMode.statsDiamonds.toughnessBg,
              color: currentMode.statsDiamonds.toughnessColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transform: currentMode.statsDiamonds.transform,
              borderRadius: currentMode.statsDiamonds.borderRadius,
              fontSize: `${100 * scale}px`,
              border: `${6 * scale}px solid white`,
              boxShadow: `0 0 0 ${7 * scale}px black`,
              ...helveticaFont,
              position: 'absolute',
              top: `${134 * scale}px`,
              left: 0,
              zIndex: 999
            }}>
              <span style={{ transform: 'rotate(-45deg)' }}>
                {cardData.toughness}
              </span>
            </div>
          </div>
        </CardElement>
      )}

      {/* Equipment cost diamond - positioned absolutely to card */}
      {cardData.type === 'equipment' && (
        <CardElement elementType="stats">
          <div style={{
            position: 'absolute',
            right: `${100 * scale}px`,
            bottom: `${180 * scale}px`,
            zIndex: 1003
          }}>
            <div style={{
              width: `${128 * scale}px`,
              height: `${128 * scale}px`,
              backgroundColor: currentMode.statsDiamonds.powerBg,
              color: currentMode.statsDiamonds.powerColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transform: currentMode.statsDiamonds.transform,
              borderRadius: currentMode.statsDiamonds.borderRadius,
              fontSize: `${80 * scale}px`,
              border: `${8 * scale}px solid white`,
              boxShadow: `0 0 0 ${7 * scale}px black`,
              ...helveticaFont,
              zIndex: 999
            }}>
              <span style={{ transform: 'rotate(-45deg)' }}>2</span>
            </div>
          </div>
        </CardElement>
      )}
    </>
  );
};

export default CardElements; 