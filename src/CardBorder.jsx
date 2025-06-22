import React from 'react';

const CardBorder = ({ cardData, CardElement, scale }) => {
  return (
    <>
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
    </>
  );
};

export default CardBorder; 