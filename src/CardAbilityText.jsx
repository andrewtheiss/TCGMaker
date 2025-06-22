import React from 'react';
import { parseFormattedText } from './textParser.jsx';

const CardAbilityText = ({ 
  cardData, 
  CardElement, 
  currentMode, 
  scale, 
  helveticaFont
}) => {
  // Split text into lines and group them for different rendering
  const renderTextContent = () => {
    const baseTextStyle = {
      fontSize: `${50 * scale}px`,
      lineHeight: `${70 * scale}px`,
      color: 'black',
      fontWeight: 'normal',
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
    };

    // For classic mode, we need different line widths
    if (currentMode && currentMode.typeLine && cardData.textBox) {
      const lines = cardData.textBox.split('\n');
      const firstTwoLines = lines.slice(0, 2);
      const remainingLines = lines.slice(2);

      return (
        <div style={{ margin: '-5px 0px' }}>
          {/* First two lines - full width */}
          {firstTwoLines.length > 0 && (
            <div style={{
              width: '100%',
              textAlign: 'justify',
              ...baseTextStyle
            }}>
              {parseFormattedText(firstTwoLines.join('\n'), baseTextStyle)}
            </div>
          )}
          
          {/* Remaining lines - 80% width (20% margin from right) */}
          {remainingLines.length > 0 && (
            <div style={{
              width: '80%',
              textAlign: 'justify',
              ...baseTextStyle
            }}>
              {parseFormattedText(remainingLines.join('\n'), baseTextStyle)}
            </div>
          )}
        </div>
      );
    }

    // Fallback to original rendering for non-classic modes or when no special handling needed
    return (
      <p style={{
        ...baseTextStyle,
        margin: '-5px 0px'
      }}>
        {parseFormattedText(cardData.textBox, baseTextStyle)}
      </p>
    );
  };



  return (
    <CardElement elementType="abilityText">
      <div style={{
        position: 'absolute',
        left: cardData.fullArt ? `${85 * scale}px` : `${85 * scale}px`,
        right: cardData.type === 'creature' || cardData.type === 'equipment' ? `${85 * scale}px` : `${85 * scale}px`,
        top: `${(1326 - (cardData.type === 'equipment' ? 220 : 0)) * scale}px`,
        bottom: `${(180 + (cardData.type === 'equipment' ? 310 : 0)) * scale}px`,
        backgroundColor: currentMode.textBox.backgroundColor,
        borderRadius: currentMode.textBox.borderRadius,
        padding: currentMode.textBox.padding,
        textAlign: 'justify',
        zIndex: 1005,
        pointerEvents: 'auto',
        border: '0px solid black'
      }}>
        {renderTextContent()}
      </div>
    </CardElement>
  );
};

export default CardAbilityText; 