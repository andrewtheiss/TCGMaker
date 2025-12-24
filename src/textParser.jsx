import React from 'react';
import { textFormattingConfig } from './textFormattingConfig';

// Parse text and return JSX elements with formatting applied
export const parseFormattedText = (text, baseStyle = {}, options = {}) => {
  if (!text) return null;
  const { isExporting = false } = options;

  // Set a compact line height for keyword elements
  const keywordLineHeight = 1;

  const getFontSizeMultiplier = (keywordFontSize) => {
    if (typeof keywordFontSize === 'number') return keywordFontSize;
    if (typeof keywordFontSize === 'string') {
      const parsed = Number.parseFloat(keywordFontSize);
      return Number.isFinite(parsed) ? parsed : 1;
    }
    return 1;
  };

  const getPxNumber = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  // Split text by newlines first, then process each line
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Split line into parts, preserving all formatting tokens
    const parts = splitTextWithTokens(line);
    
    const lineContent = parts.map((part, partIndex) => {
      // Check if this part is a keyword token
      const keywordConfig = textFormattingConfig.keywords[part.toLowerCase()];
      if (keywordConfig) {
        const keywordFontScale = getFontSizeMultiplier(keywordConfig.fontSize);
        // Special handling for tap image
        if (keywordConfig.isImage) {
          return (
            <span key={partIndex} 
            style={{ 
              display: 'inline-block', 
              margin: '0', 
              fontWeight: 'bold',
              lineHeight: keywordLineHeight,
              paddingTop: '2px'  // Fixes export alignment issue for line height
             }}>
              <img 
                src={keywordConfig.imageSrc} 
                alt="tap" 
                style={{ 
                  height: baseStyle.fontSize || '1em',
                  verticalAlign: 'middle',
                  margin: '0'
                }} 
              />
              <span style={{ 
                fontWeight: keywordConfig.fontWeight,
                textShadow: keywordConfig.textShadow,
                lineHeight: keywordLineHeight,
                ...baseStyle
              }}>
                {keywordConfig.displayText}
              </span>
            </span>
          );
        }
        
        // Special handling for triangle shapes
        if (keywordConfig.isTriangle) {
          // Calculate dimensions based on text content
          const textLength = keywordConfig.displayText.length;
          const baseWidth = Math.max(textLength * 8, 60); // Minimum 60px width
          const height = '20px'; 
          
          // Add padding for triangle sides
          const leftPadding = keywordConfig.triangleType === 'diamond' ? '2px' : '0px';
          const rightPadding = (keywordConfig.triangleType === 'right' || keywordConfig.triangleType === 'diamond') ? '2px' : '0px';
          
          return (
            <span
              key={partIndex}
              style={{
                display: 'inline-block',
                position: 'relative',
                margin: '0 0 0 0',
                lineHeight: keywordLineHeight,
                verticalAlign: 'middle',
                width: `${baseWidth}px`,
                height: height,
                paddingLeft: leftPadding,
                paddingTop: '2px',  // Fixes export alignment issue for line height
                paddingRight: rightPadding
              }}
            >
              <svg
                width={`${baseWidth}px`}
                height={height}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%'
                }}
                viewBox={`0 0 ${baseWidth} 20`}
                preserveAspectRatio="xMidYMid meet"
              >
                {keywordConfig.triangleType === 'right' ? (
                  // Right-pointing triangle (for Attacker)
                  <polygon
                    points={`6,2 ${baseWidth-6},2 ${baseWidth},10 ${baseWidth-6},18 6,18`}
                    fill={keywordConfig.backgroundColor}
                    stroke="none"
                  />
                ) : keywordConfig.triangleType === 'diamond' ? (
                  // Diamond shape (for Defender)
                  <polygon
                    points={`6,2 ${baseWidth-6},2 ${baseWidth},10 ${baseWidth-6},18 6,18 0,10`}
                    fill={keywordConfig.backgroundColor}
                    stroke="none"
                  />
                ) : (
                  // Fallback rectangle
                  <rect
                    x="0"
                    y="0"
                    width={baseWidth}
                    height="22"
                    fill={keywordConfig.backgroundColor}
                  />
                )}
              </svg>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: keywordConfig.color,
                  fontSize: `calc(${baseStyle.fontSize || '1em'} * ${keywordFontScale})`,
                  fontWeight: keywordConfig.fontWeight,
                  textShadow: keywordConfig.textShadow || 'none',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                {keywordConfig.displayText}
              </span>
            </span>
          );
        }
        
        // Regular keyword handling
        const baseFontSizePx = getPxNumber(baseStyle.fontSize);
        const keywordFontSizePx = baseFontSizePx ? baseFontSizePx * keywordFontScale : null;
        // Export centering: html2canvas can shift glyphs within the line box.
        // For export, render the pill as a fixed-height container and absolutely center the text inside it.
        const exportPillHeightPx = keywordFontSizePx ? Math.max(12, Math.round(keywordFontSizePx * 1.35)) : null;
        const exportPillHeight = exportPillHeightPx ? `${exportPillHeightPx}px` : undefined;

        const regularKeywordOuterStyle = {
          display: isExporting ? 'inline-block' : 'inline-flex',
          alignItems: isExporting ? undefined : 'center',
          justifyContent: isExporting ? undefined : 'center',
          position: isExporting ? 'relative' : undefined,
          verticalAlign: 'middle',
          margin: '0px 2px 0px 0px',
          ...keywordConfig,
          height: isExporting ? exportPillHeight : undefined,
          lineHeight: isExporting ? exportPillHeight : keywordLineHeight,
          fontSize: `calc(${baseStyle.fontSize || '1em'} * ${keywordFontScale})`,
          textShadow: 'none',
          // Browser: symmetric vertical padding looks best.
          // Export: let the fixed height + absolute centering handle vertical alignment.
          paddingTop: isExporting ? undefined : '2px',
          paddingBottom: isExporting ? undefined : '2px'
        };

        if (isExporting) {
          return (
            <span key={partIndex} style={regularKeywordOuterStyle}>
              {/*
                Keep a flow-layout "sizer" so the pill auto-sizes to the text width.
                The visible label is absolutely centered for stable html2canvas exports.
              */}
              <span
                style={{
                  opacity: 0,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                {keywordConfig.displayText}
              </span>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  // Export-only nudge: html2canvas tends to draw glyphs slightly low even when centered.
                  transform: 'translate(-50%, -50%) translateY(-0.12em)',
                  display: 'inline-block',
                  color: keywordConfig.color,
                  fontWeight: keywordConfig.fontWeight,
                  textShadow: keywordConfig.textShadow || 'none',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                {keywordConfig.displayText}
              </span>
            </span>
          );
        }

        return (
          <span key={partIndex} style={regularKeywordOuterStyle}>
            {keywordConfig.displayText}
          </span>
        );
      }

      // Check for bold formatting: *text*
      const boldMatch = part.match(/^\*(.*)\*$/);
      if (boldMatch) {
        return (
          <span key={partIndex} style={{ ...baseStyle, fontWeight: 'bold' }}>
            {boldMatch[1]}
          </span>
        );
      }

      // Check for italic formatting: $text$
      const italicMatch = part.match(/^\$(.*)\$$/);
      if (italicMatch) {
        return (
          <span
            key={partIndex}
            style={{
              ...baseStyle,
              fontStyle: 'italic',
              opacity: 0.8
            }}
          >
            {italicMatch[1]}
          </span>
        );
      }

      // Check for cost formatting: ^text^
      const costMatch = part.match(/^\^(.*)\^$/);
      if (costMatch) {
        return (
          <span
            key={partIndex}
            style={{
              backgroundColor: '#000000',
              color: 'white',
              borderRadius: '50%',
              padding: '0px 0px 0px 0px',
              lineHeight: '16px',
              fontSize: `calc(${baseStyle.fontSize || '1em'} * 0.9)`,
              fontWeight: 'bold',
              textShadow: 'none',
              minWidth: '16px',
              textAlign: 'center',
              display: 'inline-block',
              margin: '1px 2px 0px'
            }}
          >
            {costMatch[1]}
          </span>
        );
      }

      // Regular text
      return (
        <span key={partIndex} style={baseStyle}>
          {part}
        </span>
      );
    });

    // Return each line as a div, with line breaks between them
    return (
      <div key={lineIndex} style={{ margin: '0' }}>
        {lineContent}
        {lineIndex < lines.length - 1 && <br />}
      </div>
    );
  });
};

// Split text while preserving formatting tokens
const splitTextWithTokens = (text) => {
  // Create regex pattern that matches all keywords and formatting
  const keywordPattern = Object.keys(textFormattingConfig.keywords).join('|');
  const boldPattern = '\\*[^*]+\\*';
  const italicPattern = '\\$[^$]+\\$';
  const costPattern = '\\^[^^]+\\^';
  
  const combinedPattern = new RegExp(
    `(${keywordPattern}|${italicPattern}|${boldPattern}|${costPattern})`,
    'gi'
  );

  // Split text while keeping the delimiters
  const parts = text.split(combinedPattern).filter(part => part !== '');
  
  return parts;
};

// Convert display text back to raw markup for editing
export const convertToRawText = (formattedElements) => {
  // This would be used when switching from display mode to edit mode
  // For now, we'll store the raw text separately to avoid this complexity
  return formattedElements;
};

// Validate if text contains valid formatting
export const validateFormatting = (text) => {
  const errors = [];
  
  // Check for unmatched asterisks (bold)
  const singleAsterisks = (text.match(/\*/g) || []).length;
  if (singleAsterisks % 2 !== 0) {
    errors.push('Unmatched asterisk for bold formatting');
  }
  
  // Check for unmatched dollar signs (italic)
  const dollarSigns = (text.match(/\$/g) || []).length;
  if (dollarSigns % 2 !== 0) {
    errors.push('Unmatched dollar sign for italic formatting');
  }
  
  // Check for unmatched carets (cost)
  const carets = (text.match(/\^/g) || []).length;
  if (carets % 2 !== 0) {
    errors.push('Unmatched caret for cost formatting');
  }
  
  return errors;
};

export default parseFormattedText; 