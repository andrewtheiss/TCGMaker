import React from 'react';

const LeaderHeader = ({ 
  cardData, 
  CardElement, 
  cardColors,
  scale, 
  helveticaFont 
}) => {
  return (
    <div className="leader-header-container" style={{
      position: 'absolute',
      top: `${50 * scale}px`,
      left: `${38 * scale}px`,
      right: `${36 * scale}px`,
      height: `${128 * scale}px`,
      backgroundColor: 'transparent',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: `${20 * scale}px`,
      zIndex: 15
    }}>
      {/* Leader Name - Left Side - Single Line with Grey Text and White Outline */}
      <CardElement elementType="cardName" style={{ flex: 0 }}>
        <h2 className="leader-name" style={{ 
          fontSize: `${84 * scale}px`, 
          fontWeight: 'bold', 
          margin: 0, 
          lineHeight: `${80 * scale}px`,
          color: 'rgba(128, 128, 128, 0.3)', // Transparent grey
          WebkitTextStroke: '2px white', // Double thick white outline
          whiteSpace: 'nowrap', // Single line
          ...helveticaFont 
        }}>
          {cardData.name}
        </h2>
      </CardElement>

      {/* Leader Descriptions - Right Side with Diagonal Border Pattern */}
      <div className="leader-descriptions-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: `${2 * scale}px`,
        position: 'relative'
      }}>
        {/* Top Level - Longer */}
        <CardElement elementType="leaderDescription1" style={{ position: 'relative' }}>
          {/* Left triangle edge using SVG */}
          <svg className="leader-desc1-left-triangle" width="12" height={`${17 * scale}px`} style={{ position: 'absolute', left: '-12px', top: '0' }}>
            <polygon 
              points={`0,${8.5 * scale} 11,${1 * scale} 11,${16 * scale}`}
              fill={cardColors[cardData.cardColor].bg}
            />
          </svg>
          
          <div className="leader-description1-bar" style={{
            height: `${50 * scale}px`,
            padding: `0 ${16 * scale}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: `${120 * scale}px`,
            fontSize: `${32.5 * scale}px`,
            fontWeight: '600',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            backgroundColor: cardColors[cardData.cardColor].bg,
            color: 'white',
            lineHeight: `${17 * scale}px`,
            minWidth: `${120 * scale}px`,
            borderRadius: '0px',
            ...helveticaFont
          }}>
            {cardData.leaderDescription1}
          </div>
        </CardElement>

        {/* Bottom Level - Shorter */}
        <CardElement elementType="leaderDescription2" style={{ position: 'relative' }}>
          {/* Left triangle edge using SVG */}
          <svg className="leader-desc2-left-triangle" width="12" height={`${17 * scale}px`} style={{ position: 'absolute', left: '-12px', top: '0' }}>
            <polygon 
              points={`0,${8.5 * scale} 11,${1 * scale} 11,${16 * scale}`}
              fill={cardColors[cardData.cardColor].bg}
            />
          </svg>
          
          <div className="leader-description2-bar" style={{
            height: `${50 * scale}px`,
            padding: `0 ${12 * scale}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: `${100 * scale}px`,
            fontSize: `${12.5 * scale}px`,
            fontWeight: '600',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            backgroundColor: cardColors[cardData.cardColor].bg,
            color: 'white',
            lineHeight: `${17 * scale}px`,
            minWidth: `${80 * scale}px`,
            borderRadius: '0px',
            ...helveticaFont
          }}>
            {cardData.leaderDescription2}
          </div>
        </CardElement>
      </div>
    </div>
  );
};

export default LeaderHeader; 