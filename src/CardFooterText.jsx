import React from 'react';

const CardFooterText = ({ cardData, CardElement, helveticaFont, scale }) => {
  // Footer rarity sizing (keep everything scaled so glyphs remain visually centered)
  const rarityFontSize = 25 * scale;
  const rarityBorder = 5 * scale;
  const rarityPadY = 2 * scale;
  const rarityPadX = 6 * scale;

  // Reserved slot for a future rarity star icon (keeps layout stable when added)
  const rarityIconSize = 27 * scale; // 25% smaller than the previous 36*scale
  const rarityIconGap = 6 * scale;   // keep spacing proportional
  const showRarityStar = !!cardData.footerRarityShowStar;
  const rarityStarStrokeWidth = 2 * 0.8; // 20% smaller white outline (was 2px)
  const rarityStarNudgeY = -0.5; // px (negative = up)
  const rarityBadgeNudgeY = 0.5; // px (positive = down)

  const OutlinedText = ({
    text,
    strokeWidth,
    strokeColor,
    fillColor = 'black',
    fontWeight = '900',
    fontStyle,
    fontSize,
    extraStyle = {}
  }) => (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        lineHeight: 1,
        ...extraStyle
      }}
    >
      <span
        style={{
          gridArea: '1 / 1',
          color: 'transparent',
          fontWeight,
          fontStyle,
          fontSize,
          lineHeight: 1,
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          ...helveticaFont
        }}
      >
        {text}
      </span>
      <span
        style={{
          gridArea: '1 / 1',
          color: fillColor,
          fontWeight,
          fontStyle,
          fontSize,
          lineHeight: 1,
          ...helveticaFont
        }}
      >
        {text}
      </span>
    </div>
  );

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
        lineHeight: 1,
        bottom: `${102 * scale}px`,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * scale}px` }}>
          <CardElement elementType="footerRarity">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Optional rarity star icon (black star with ~2px white outline) */}
              <div
                style={{
                  width: showRarityStar ? `${rarityIconSize}px` : '0px',
                  height: showRarityStar ? `${rarityIconSize}px` : '0px',
                  marginRight: showRarityStar ? `${rarityIconGap}px` : '0px',
                  display: showRarityStar ? 'grid' : 'none',
                  placeItems: 'center',
                  flex: '0 0 auto',
                  overflow: 'hidden',
                  transform: `translateY(${rarityStarNudgeY}px)`
                }}
              >
                <OutlinedText
                  text="★"
                  strokeWidth={rarityStarStrokeWidth}
                  strokeColor="white"
                  fillColor="black"
                  fontWeight="900"
                  fontSize={`${rarityIconSize}px`}
                />
              </div>

              {/* Rarity letters badge */}
              <div style={{
                backgroundColor: 'white',
                border: `${rarityBorder}px solid black`,
                borderRadius: '35%',
                padding: `${rarityPadY}px ${rarityPadX}px`,
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                transform: `translateY(${rarityBadgeNudgeY}px)`
              }}>
                <OutlinedText
                  text={cardData.footerRarity}
                  strokeWidth={0.3}
                  strokeColor="black"
                  fillColor="black"
                  fontWeight="900"
                  fontSize={`${rarityFontSize}px`}
                />
              </div>
            </div>
          </CardElement>
          <CardElement elementType="footerLeft">
            <OutlinedText
              text={cardData.footerLeft}
              strokeWidth={1}
              strokeColor="white"
              fillColor="black"
              fontWeight="900"
            />
          </CardElement>
          <CardElement elementType="footerCenter">
            <OutlinedText
              text={cardData.footerCenter}
              strokeWidth={1}
              strokeColor="white"
              fillColor="black"
              fontWeight="900"
              fontStyle="italic"
            />
          </CardElement>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${3 * scale}px` }}>
          <CardElement elementType="setCode">
            <OutlinedText
              text={cardData.setCode}
              strokeWidth={1}
              strokeColor="white"
              fillColor="black"
              fontWeight="900"
            />
          </CardElement>
          <CardElement elementType="cardNumber">
            <OutlinedText
              text={`#${cardData.cardNumber}`}
              strokeWidth={1}
              strokeColor="white"
              fillColor="black"
              fontWeight="900"
            />
          </CardElement>
        </div>
      </div>
    </>
  );
};

export default CardFooterText; 