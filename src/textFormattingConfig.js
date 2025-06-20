// Text Formatting Configuration
// This file defines the styling rules for special tokens in card ability text

export const textFormattingConfig = {
  // Special keyword tokens with custom styling
  keywords: {
    '%onceaturn%': {
      displayText: 'Once / Turn',
      backgroundColor: '#f2419a',
      color: 'white',
      borderRadius: '12px',
      padding: '0 8px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textShadow: 'none'
    },
    '%whenattacking%': {
      displayText: 'Attacker',
      backgroundColor: '#d61f35',
      color: 'white',
      borderRadius: '0',
      padding: '0 8px 0 5px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textShadow: 'none',
      clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 0% 100%)'
    },
    '%tap%': {
      displayText: ':',
      isImage: true,
      imageSrc: '/src/assets/tap.png',
      fontWeight: 'bold',
      textShadow: 'none'
    },
    '%defender%': {
      displayText: 'Defender',
      backgroundColor: '#faa43c',
      color: 'white',
      borderRadius: '0',
      padding: '0 8px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textShadow: 'none',
      clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%)'
    },
    '%onplay%': {
      displayText: 'On Play',
      backgroundColor: '#3d5daa',
      color: 'white',
      borderRadius: '12px',
      padding: '0 10px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      textShadow: 'none'
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
        opacity: 0.8
      }
    },
    cost: {
      pattern: /\^(.*?)\^/g,
      style: {
        backgroundColor: '#000000',
        color: 'white',
        borderRadius: '50%',
        padding: '0 6px',
        fontSize: '0.9em',
        fontWeight: 'bold',
        textShadow: 'none',
        minWidth: '20px',
        textAlign: 'center',
        display: 'inline-block'
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