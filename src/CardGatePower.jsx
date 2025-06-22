import React from 'react';
import gatePowerImage from './assets/gatepower.png';

const CardGatePower = ({ cardData, CardElement, cardColors, scale }) => {
  return (
    <>
      {/* Gate Power Overlay - Left Side, Top Layer */}
      <CardElement elementType="gatePower" style={{
        position: 'absolute',
        left: `${22 * scale}px`,
        top: `${306 * scale}px`,
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
            fontFamily: 'system-ui',
            transform: 'translate(-50%, calc(-50% - 1px))',
            width: `${195 * scale}px`,
            height: `${195 * scale}px`,
            backgroundColor: cardColors[cardData.cardColor].bg,
            borderRadius: '50%',
            WebkitTextStroke: '1px white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: `${75 * scale}px`,
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
    </>
  );
};

export default CardGatePower; 