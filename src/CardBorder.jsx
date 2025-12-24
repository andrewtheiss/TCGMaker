import React from 'react';

const CardBorder = ({ cardData, CardElement, scale }) => {
  const px = (n) => Math.round(n * scale);

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
            borderTop: `${px(56)}px solid black`,
            borderLeft: `${px(56)}px solid black`,
            borderRight: `${px(56)}px solid black`,
            borderBottom: `${px(51)}px solid black`,
            borderRadius: `${px(64)}px`,
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
              height: `${px(92)}px`,
              backgroundColor: 'black',
              borderRadius: `0 0 ${px(64)}px ${px(64)}px`,
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