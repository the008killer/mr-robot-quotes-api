const themes = {
    mrrobot: {
        bg: '#0a0a0a',
        border: '#00ff41',
        quote: '#00ff41',
        accent: '#f8d847',
        character: '#00aa2a',
        category: '#00ff41'
    },
    hacker: {
        bg: '#000000',
        border: '#00ff00',
        quote: '#00ff00',
        accent: '#ff0000',
        character: '#00aa00',
        category: '#00ff00'
    },
    cyberpunk: {
        bg: '#0d0221',
        border: '#ff2a6d',
        quote: '#05d9e8',
        accent: '#ff2a6d',
        character: '#d1f7ff',
        category: '#ff2a6d'
    },
    default: {
        bg: '#fffefe',
        border: '#4c71f2',
        quote: '#333333',
        accent: '#4c71f2',
        character: '#2f80ed',
        category: '#4c71f2'
    },
    default_dark: {
        bg: '#151515',
        border: '#79ff97',
        quote: '#9f9f9f',
        accent: '#79ff97',
        character: '#ffffff',
        category: '#79ff97'
    },
    chartreuse_dark: {
        bg: '#000000',
        border: '#00AEFF',
        quote: '#ffffff',
        accent: '#00AEFF',
        character: '#7fff00',
        category: '#00AEFF'
    },
    radical: {
        bg: '#141321',
        border: '#f8d847',
        quote: '#a9fef7',
        accent: '#f8d847',
        character: '#fe428e',
        category: '#f8d847'
    },
    merko: {
        bg: '#0a0f0b',
        border: '#b7d364',
        quote: '#68b587',
        accent: '#b7d364',
        character: '#abd200',
        category: '#b7d364'
    },
    gruvbox: {
        bg: '#282828',
        border: '#fe8019',
        quote: '#8ec07c',
        accent: '#fe8019',
        character: '#fabd2f',
        category: '#fe8019'
    },
    tokyonight: {
        bg: '#1a1b27',
        border: '#bf91f3',
        quote: '#38bdae',
        accent: '#bf91f3',
        character: '#70a5fd',
        category: '#bf91f3'
    },
    catppuccin: {
        bg: '#161320',
        border: '#DDB6F2',
        quote: '#96CDFB',
        accent: '#DDB6F2',
        character: '#D9E0EE',
        category: '#DDB6F2'
    },
    catppuccin_latte: {
        bg: '#eff1f5',
        border: '#8839ef',
        quote: '#179299',
        accent: '#8839ef',
        character: '#4c4f69',
        category: '#8839ef'
    },
    catppuccin_frappe: {
        bg: '#303446',
        border: '#ca9ee6',
        quote: '#81c8be',
        accent: '#ca9ee6',
        character: '#c6d0f5',
        category: '#ca9ee6'
    },
    catppuccin_macchiato: {
        bg: '#24273a',
        border: '#c6a0f6',
        quote: '#8bd5ca',
        accent: '#c6a0f6',
        character: '#cad3f5',
        category: '#c6a0f6'
    },
    catppuccin_mocha: {
        bg: '#1e1e2e',
        border: '#cba6f7',
        quote: '#94e2d5',
        accent: '#cba6f7',
        character: '#cdd6f4',
        category: '#cba6f7'
    },
    algolia: {
        bg: '#050F2C',
        border: '#26BB85',
        quote: '#00ADFE',
        accent: '#26BB85',
        character: '#FEFEFE',
        category: '#26BB85'
    },
    monokai: {
        bg: '#272822',
        border: '#E18905',
        quote: '#EA1F6A',
        accent: '#E18905',
        character: '#CFCFC9',
        category: '#E18905'
    },
    dracula: {
        bg: '#282A36',
        border: '#FF79c6',
        quote: '#F8F8F2',
        accent: '#FF79c6',
        character: '#6272A4',
        category: '#FF79c6'
    },
    nord: {
        bg: '#2E3440',
        border: '#88C0D0',
        quote: '#D8DEE9',
        accent: '#88C0D0',
        character: '#4C566A',
        category: '#88C0D0'
    },
    github: {
        bg: '#0D1117',
        border: '#43C293',
        quote: '#FFFFFF',
        accent: '#43C293',
        character: '#4C566A',
        category: '#43C293'
    },
    github_dark: {
        bg: '#0D1117',
        border: '#1F6FEB',
        quote: '#C3D1D9',
        accent: '#1F6FEB',
        character: '#58A6FF',
        category: '#1F6FEB'
    },
    github_blue: {
        bg: '#0D1117',
        border: '#F9826C',
        quote: '#C7D5E0',
        accent: '#F9826C',
        character: '#56A1F7',
        category: '#F9826C'
    },
    graywhite: {
        bg: '#FFFFFF',
        border: '#24292E',
        quote: '#24292E',
        accent: '#24292E',
        character: '#24292E',
        category: '#24292E'
    },
    moonlight: {
        bg: '#222436',
        border: '#599DFF',
        quote: '#F8F8F8',
        accent: '#599DFF',
        character: '#FF757F',
        category: '#599DFF'
    },
    hackerman: {
        bg: '#000000',
        border: '#00B3D6',
        quote: '#00B3D6',
        accent: '#00B3D6',
        character: '#00B3D6',
        category: '#00B3D6'
    },
    shadow_red: {
        bg: '#151515',
        border: '#4F0000',
        quote: '#9A0000',
        accent: '#4F0000',
        character: '#9A0000',
        category: '#4F0000'
    },
    shadow_green: {
        bg: '#151515',
        border: '#003D00',
        quote: '#007A00',
        accent: '#003D00',
        character: '#007A00',
        category: '#003D00'
    },
    shadow_blue: {
        bg: '#151515',
        border: '#004490',
        quote: '#00779A',
        accent: '#004490',
        character: '#00779A',
        category: '#004490'
    }
};

// escape special xml/html chars so SVG doesn't break
function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&lt;')
        .replace(/</g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

// generate CSS styles based on theme colors
function generateStyles(theme) {
    return `
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    .container {
      font-family: 'Courier New', Consolas, monospace;
      padding: 25px;
      width: 600px;
      border-radius: 10px;
      background-color: ${theme.bg};
      border: 1px solid ${theme.border};
      box-shadow: 0 0 20px ${theme.border}33;
    }
    .terminal-header {
      font-size: 11px;
      color: ${theme.character};
      margin-bottom: 15px;
      letter-spacing: 1px;
    }
    .terminal-header::before {
      content: '● ● ●  ';
      color: ${theme.accent};
    }
    .quote-text {
      font-size: 17px;
      line-height: 1.6;
      color: ${theme.quote};
      font-style: italic;
      padding: 15px 0 15px 15px;
      border-left: 3px solid ${theme.accent};
      margin-bottom: 15px;
    }
    .quote-text::before {
      content: open-quote;
      font-size: 30px;
      color: ${theme.accent};
      vertical-align: sub;
      margin-right: 3px;
    }
    .quote-text::after {
      content: close-quote;
      font-size: 30px;
      color: ${theme.accent};
      vertical-align: sub;
      margin-left: 3px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px dashed ${theme.border}66;
    }
    .character {
      color: ${theme.character};
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .character::before {
      content: '— ';
    }
    .category {
      color: ${theme.bg};
      background-color: ${theme.category};
      padding: 3px 10px;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      border-radius: 3px;
    }
  `;
}

/**
 * Generate complete SVG quote card
 *
 * @param {Object} quote - Quote object with text, character, category
 * @param {Object} options - Options { theme: 'mrrobot' }
 * @returns {string} SVG markup
 */

function generateQuoteSVG(quote, options = {}) {
    const themeName = options.theme || 'mrrobot';
    const theme = themes[themeName] || themes.mrrobot;

    const text = escapeXml(quote.text);
    const character = escapeXml(quote.character);
    const category = escapeXml(quote.category || '');

    const estimatedLines = Math.ceil(text.length / 38);
    const calculatedHeight = 160 + (estimatedLines * 28) + 20;

    return `<svg width="600" height="${calculatedHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>${generateStyles(theme)}</style>
      <div class="container" style="height: ${calculatedHeight}px; display: flex; flex-direction: column; justify-content: center;">
        <div class="quote-text">${text}</div>
        <div class="footer">
          <span class="character">${character}</span>
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;
}

function getAvailableThemes(){
    return Object.keys(themes);
}

module.exports = {
    generateQuoteSVG,
    getAvailableThemes
};