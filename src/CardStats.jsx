import React from 'react';

const CardStats = ({ cardData, CardElement, currentMode, scale, helveticaFont }) => {
  // Helper function to check if attack value contains + or - symbols
  const hasModifierSymbol = (value) => {
    return value && (value.toString().includes('+') || value.toString().includes('-'));
  };

  const attackHasModifier = hasModifierSymbol(cardData.attack);

  return (
    <>
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
                {/* Extra outer border for +/- values */}
                {attackHasModifier && (
                  <div style={{
                    position: 'absolute',
                    top: `${-8 * scale}px`,
                    left: `${-8 * scale}px`,
                    width: `${173 * scale}px`,
                    height: `${173 * scale}px`,
                    backgroundColor: '#c2cdd5',
                    transform: currentMode.statsDiamonds.transform,
                    borderRadius: '8px',
                    zIndex: -1
                  }} />
                )}
                
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
                      WebkitTextStroke: '0.5px white',
                      fontSize: `${95 * scale}px`,
                      ...helveticaFont
                    }}>
                      <span style={{ 
                        transform: 'rotate(-45deg)',
                        // Better centering for +/- text
                        marginTop: attackHasModifier ? `${10 * scale}px` : '-2px',
                        marginLeft: attackHasModifier ? `${-30 * scale}px` : '-1px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {attackHasModifier && (cardData.attack.includes('+') || cardData.attack.includes('-')) ? (
                          <>
                            <span style={{ 
                              fontSize: `${(95 - 20) * scale}px`,
                              lineHeight: 1,
                              marginRight: `${2 * scale}px`
                            }}>
                              {cardData.attack.charAt(0)}
                            </span>
                            <span style={{ 
                              marginTop: `${10 * scale}px`,
                              lineHeight: 1
                            }}>
                              {cardData.attack.slice(1)}
                            </span>
                          </>
                        ) : (
                          cardData.attack
                        )}
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
                      <span style={{ 
                        transform: 'rotate(-45deg)',
                         marginLeft: '-3px',
                         marginTop: '-2px'
                         }}>
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

export default CardStats; 