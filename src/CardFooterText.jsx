import React from 'react';

const CardFooterText = ({ cardData, CardElement, helveticaFont, scale }) => {
  return (
    <>
      {/* Footer text - positioned relative to card edges */}
      <div style={{
        position: 'absolute',
        left: `${175 * scale}px`,
        right: `${188 * scale}px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...helveticaFont,
        fontSize: `${24 * scale}px`,
        bottom: `${102 * scale}px`,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * scale}px`, marginBottom: '0px' }}>
          <CardElement elementType="footerRarity">
            <div style={{
              backgroundColor: 'white',
              border: `${5 * scale}px solid black`,
              borderRadius: '35%',
              padding: `${0 * scale}px ${6 * scale}px ${0 * scale}px ${6 * scale}px`,
              display: 'flex',
              alignItems: 'center',
              lineHeight: '0px',
              marginBottom: '-2px',
              marginLeft: '3px',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* First render: Stroke outline */}
              <span style={{
                color: 'transparent',
                fontWeight: '900',
                lineHeight: '4px',
                fontSize: `${25 * scale}px`,
                WebkitTextStroke: '0.3px black',
                position: 'absolute',
                zIndex: 1,
                marginTop: '-2px'
              }}>
                {cardData.footerRarity}
              </span>
              {/* Second render: Clean text */}
              <span style={{
                color: 'black',
                fontWeight: '900',
                lineHeight: '8px',
                fontSize: `${25 * scale}px`,
                position: 'relative',
                marginTop: '-2px',
                zIndex: 2
              }}>
                {cardData.footerRarity}
              </span>
            </div>
          </CardElement>
          <CardElement elementType="footerLeft">
            <div style={{ position: 'relative' }}>
              {/* First render: Stroke outline */}
              <span style={{
                color: 'transparent',
                fontWeight: '900',
                WebkitTextStroke: '1px white',
                position: 'absolute',
                zIndex: 1,
                ...helveticaFont
              }}>
                {cardData.footerLeft}
              </span>
              {/* Second render: Clean text */}
              <span style={{
                color: 'black',
                fontWeight: '900',
                position: 'relative',
                zIndex: 2,
                ...helveticaFont
              }}>
                {cardData.footerLeft}
              </span>
            </div>
          </CardElement>
          <CardElement elementType="footerCenter">
            <div style={{ position: 'relative' }}>
              {/* First render: Stroke outline */}
              <span style={{
                color: 'transparent',
                fontWeight: '900',
                fontStyle: 'italic',
                WebkitTextStroke: '1px white',
                position: 'absolute',
                zIndex: 1,
                ...helveticaFont
              }}>
                {cardData.footerCenter}
              </span>
              {/* Second render: Clean text */}
              <span style={{
                color: 'black',
                fontWeight: '900',
                fontStyle: 'italic',
                position: 'relative',
                zIndex: 2,
                ...helveticaFont
              }}>
                {cardData.footerCenter}
              </span>
            </div>
          </CardElement>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${3 * scale}px` }}>
          <CardElement elementType="setCode">
            <div style={{ position: 'relative' }}>
              {/* First render: Stroke outline */}
              <span style={{
                color: 'transparent',
                fontWeight: '900',
                WebkitTextStroke: '1px white',
                position: 'absolute',
                zIndex: 1,
                ...helveticaFont
              }}>
                {cardData.setCode}
              </span>
              {/* Second render: Clean text */}
              <span style={{
                color: 'black',
                fontWeight: '900',
                position: 'relative',
                zIndex: 2,
                ...helveticaFont
              }}>
                {cardData.setCode}
              </span>
            </div>
          </CardElement>
          <CardElement elementType="cardNumber">
            <div style={{ position: 'relative' }}>
              {/* First render: Stroke outline */}
              <span style={{
                color: 'transparent',
                fontWeight: '900',
                WebkitTextStroke: '1px white',
                position: 'absolute',
                zIndex: 1,
                ...helveticaFont
              }}>
                #{cardData.cardNumber}
              </span>
              {/* Second render: Clean text */}
              <span style={{
                color: 'black',
                fontWeight: '900',
                position: 'relative',
                zIndex: 2,
                ...helveticaFont
              }}>
                #{cardData.cardNumber}
              </span>
            </div>
          </CardElement>
        </div>
      </div>
    </>
  );
};

export default CardFooterText; 