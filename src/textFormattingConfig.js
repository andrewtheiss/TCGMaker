// Text Formatting Configuration
// This file defines the styling rules for special tokens in card ability text

export const textFormattingConfig = {
  // Special keyword tokens with custom styling
  keywords: {
    '%onceaturn%': {
      displayText: 'ONCE A TURN',
      backgroundColor: '#ff6b6b',
      color: 'white',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    '%whenattacking%': {
      displayText: 'WHEN ATTACKING',
      backgroundColor: '#ffd93d',
      color: '#333',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    '%tap%': {
      displayText: '⟲',
      backgroundColor: '#95a5a6',
      color: 'white',
      borderRadius: '50%',
      padding: '4px 6px',
      fontSize: '1.1em',
      fontWeight: 'bold',
      minWidth: '20px',
      textAlign: 'center'
    },
    '%defender%': {
      displayText: 'DEFENDER',
      backgroundColor: '#3498db',
      color: 'white',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    '%onplay%': {
      displayText: 'ON PLAY',
      backgroundColor: '#4285f4',
      color: 'white',
      borderRadius: '16px',
      padding: '3px 10px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  },
  
  // Text formatting rules
  formatting: {
    bold: {
      pattern: /\*(.*?)\*/g,
      style: {
        fontWeight: 'bold'
      }
    },
    italic: {
      pattern: /\$(.*?)\$/g,
      style: {
        fontStyle: 'italic',
        textDecoration: 'underline',
        opacity: 0.8
      }
    }
  }
};

// Function to add custom keywords at runtime
export const addCustomKeyword = (token, config) => {
  textFormattingConfig.keywords[token] = config;
};

// Function to update existing keyword styling
export const updateKeywordStyle = (token, styleUpdates) => {
  if (textFormattingConfig.keywords[token]) {
    textFormattingConfig.keywords[token] = {
      ...textFormattingConfig.keywords[token],
      ...styleUpdates
    };
  }
};

export default textFormattingConfig; 