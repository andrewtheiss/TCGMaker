import React from 'react';
import { textFormattingConfig } from './textFormattingConfig';

// Parse text and return JSX elements with formatting applied
export const parseFormattedText = (text, baseStyle = {}) => {
  if (!text) return null;

  // Split text into parts, preserving all formatting tokens
  const parts = splitTextWithTokens(text);
  
  return parts.map((part, index) => {
    // Check if this part is a keyword token
    const keywordConfig = textFormattingConfig.keywords[part.toLowerCase()];
    if (keywordConfig) {
      return (
        <span
          key={index}
          style={{
            display: 'inline-block',
            margin: '0 2px',
            ...keywordConfig,
            fontSize: `calc(${baseStyle.fontSize || '1em'} * ${keywordConfig.fontSize || '1'})`,
          }}
        >
          {keywordConfig.displayText}
        </span>
      );
    }

    // Check for bold formatting: *text*
    const boldMatch = part.match(/^\*(.*)\*$/);
    if (boldMatch) {
      return (
        <span key={index} style={{ ...baseStyle, fontWeight: 'bold' }}>
          {boldMatch[1]}
        </span>
      );
    }

    // Check for italic formatting: $text$
    const italicMatch = part.match(/^\$(.*)\$$/);
    if (italicMatch) {
      return (
        <span
          key={index}
          style={{
            ...baseStyle,
            fontStyle: 'italic',
            textDecoration: 'underline',
            opacity: 0.8
          }}
        >
          {italicMatch[1]}
        </span>
      );
    }

    // Regular text
    return (
      <span key={index} style={baseStyle}>
        {part}
      </span>
    );
  });
};

// Split text while preserving formatting tokens
const splitTextWithTokens = (text) => {
  // Create regex pattern that matches all keywords and formatting
  const keywordPattern = Object.keys(textFormattingConfig.keywords).join('|');
  const boldPattern = '\\*[^*]+\\*';
  const italicPattern = '\\$[^$]+\\$';
  
  const combinedPattern = new RegExp(
    `(${keywordPattern}|${italicPattern}|${boldPattern})`,
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
  
  return errors;
};

export default parseFormattedText; 