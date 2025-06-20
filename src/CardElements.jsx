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
      <CardElement elementType="abilityText">
        <div style={{
          position: 'absolute',
          left: cardData.fullArt ? `${85 * scale}px` : `${85 * scale}px`,
          right: cardData.type === 'creature' || cardData.type === 'equipment' ? `${85 * scale}px` : `${85 * scale}px`,
          top: `${1326 * scale}px`,
          bottom: `${180 * scale}px`,
          backgroundColor: currentMode.textBox.backgroundColor,
          borderRadius: currentMode.textBox.borderRadius,
          padding: currentMode.textBox.padding,
          textAlign: 'justify',
          zIndex: 1005,
          pointerEvents: 'auto',
          border: '0px solid black'
        }}>
          <p style={{
            fontSize: `${50 * scale}px`,
            lineHeight: `${70 * scale}px`,
            margin: '-5px -3px',
                         color: 'black',
             fontWeight: '600',
             textShadow: cardData.fullArt ? `
               -1px -1px 0 white,
               1px -1px 0 white,
               -1px 1px 0 white,
               1px 1px 0 white,
               0 1px 0 white,
               1px 0 0 white,
               0 -1px 0 white,
               -1px 0 0 white
             ` : 'none',
             ...helveticaFont
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
            zIndex: 1012
          }}>
            {/* Power Box - Top */}
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
                    backgroundColor: currentMode.statsDiamonds.powerBg,
                    color: currentMode.statsDiamonds.powerColor,
                    display: 'flex',
                    top: 5.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    borderRadius: currentMode.statsDiamonds.borderRadius,
                    fontSize: `${95 * scale}px`,
                    ...helveticaFont
                  }}>
                    <span style={{ transform: 'rotate(-45deg)' }}>
                      {cardData.power}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Toughness Box - Bottom */}
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
                    backgroundColor: currentMode.statsDiamonds.toughnessBg,
                    color: currentMode.statsDiamonds.toughnessColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    borderRadius: currentMode.statsDiamonds.borderRadius,
                    fontSize: `${100 * scale}px`,
                    ...helveticaFont
                  }}>
                    <span style={{ transform: 'rotate(-45deg)' }}>
                      {cardData.toughness}
                    </span>
                  </div>
                </div>
              </div>
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
            zIndex: 1012
          }}>
            <div style={{ zIndex: 999 }}>
              {/* Outer black border */}
              <div style={{
                width: `${142 * scale}px`,
                height: `${142 * scale}px`,
                backgroundColor: 'black',
                transform: currentMode.statsDiamonds.transform,
                borderRadius: currentMode.statsDiamonds.borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* White border */}
                <div style={{
                  width: `${128 * scale}px`,
                  height: `${128 * scale}px`,
                  backgroundColor: 'white',
                  borderRadius: currentMode.statsDiamonds.borderRadius,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Inner content */}
                  <div style={{
                    width: `${112 * scale}px`,
                    height: `${112 * scale}px`,
                    backgroundColor: currentMode.statsDiamonds.powerBg,
                    color: currentMode.statsDiamonds.powerColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    borderRadius: currentMode.statsDiamonds.borderRadius,
                    fontSize: `${80 * scale}px`,
                    ...helveticaFont
                  }}>
                    <span style={{ transform: 'rotate(-45deg)' }}>2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardElement>
      )}
    </>
  );
};

export default CardElements; 