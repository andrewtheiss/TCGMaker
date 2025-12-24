import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import CardAbilityText from './CardAbilityText';
import CardStats from './CardStats';

const CardElements = ({ 
  cardData, 
  CardElement, 
  cardColors, 
  helveticaFont, 
  textShadowStyle: _textShadowStyle, 
  scale, 
  cardWidth,
  mode = 'classic', // 'classic', 'modern', 'minimal'
  updateCardData: _updateCardData,
  isExporting = false
}) => {
  
  // Define mode-specific styles - all modes are same as classic for now
  // Equipment mode positioning is raised by 50px
  const equipmentOffset = cardData.type === 'equipment' ? 160 : 0;

  // Type-line label: render as ONE SVG-backed shape (no seams in-browser or html2canvas exports)
  const TYPE_CAP_PX = 12;      // width of each angled cap
  const TYPE_PAD_PX = 16;      // horizontal padding for text inside the bar
  const labelTextRef = useRef(null);
  const [typeLabelWidth, setTypeLabelWidth] = useState(120);

  const typeLineLabel = useMemo(() => {
    const base = cardData.typeDisplayText || cardData.type;
    if (cardData.showSubtype && cardData.subtype) return `${base}, ${cardData.subtype}`;
    return base;
  }, [cardData.typeDisplayText, cardData.type, cardData.showSubtype, cardData.subtype]);
  
  const classicStyle = {
    typeLine: {
      height: '17px',
      bottom: `${(148 + equipmentOffset) * scale}px`,
      fontSize: '12.5px',
      lineHeight: '12.5px',
      borderRadius: '0px'
    },
    horizontalBar: {
      height: '3px',
      bottom: `${(176 + equipmentOffset) * scale}px`,
      width: cardData.type === 'equipment' ? `${cardWidth * 0.69 * scale}px` : `${cardWidth * 0.7 * scale}px`
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

  const typeLineHeightPx = Number.parseInt(currentMode.typeLine.height, 10) || 17;

  useLayoutEffect(() => {
    const el = labelTextRef.current;
    if (!el) return;

    // Measure the text width in the actual rendered font, then size the SVG shape in px.
    const textWidth = el.getBoundingClientRect().width;
    const nextWidth = Math.max(
      120,
      Math.ceil(textWidth + (TYPE_PAD_PX * 2) + (TYPE_CAP_PX * 2))
    );

    setTypeLabelWidth((prev) => (prev === nextWidth ? prev : nextWidth));
  }, [typeLineLabel, TYPE_CAP_PX, TYPE_PAD_PX]);

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
          {/* Single-piece type bar (caps + center as one polygon). */}
          <CardElement elementType="type" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              height: '100%',
              width: `${typeLabelWidth}px`,
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg
                viewBox={`0 0 ${typeLabelWidth} ${typeLineHeightPx}`}
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              >
                <polygon
                  points={[
                    `0,${typeLineHeightPx / 2}`,
                    `${TYPE_CAP_PX},0`,
                    `${typeLabelWidth - TYPE_CAP_PX},0`,
                    `${typeLabelWidth},${typeLineHeightPx / 2}`,
                    `${typeLabelWidth - TYPE_CAP_PX},${typeLineHeightPx}`,
                    `${TYPE_CAP_PX},${typeLineHeightPx}`
                  ].join(' ')}
                  fill={cardColors[cardData.cardColor].bg}
                />
              </svg>

              <span style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0px ${TYPE_PAD_PX}px`,
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                lineHeight: currentMode.typeLine.height,
                ...helveticaFont
              }}>
                <span ref={labelTextRef} style={{ textTransform: 'capitalize' }}>
                  {typeLineLabel}
                </span>
              </span>
            </div>
          </CardElement>
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
        isExporting={isExporting}
      />

      {/* Card Stats Component */}
      <CardStats 
        cardData={cardData}
        CardElement={CardElement}
        currentMode={currentMode}
        scale={scale}
        helveticaFont={helveticaFont}
      />


    </>
  );
};

export default CardElements; 