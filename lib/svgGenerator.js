const themes = {
    mrrobot: {
        bg: '#0a0a0a',
        border: '#00ff41',
        quote: '#00ff41',
        accent: '#f8d847',
        character: '#00aa2a',
        category: '#00ff41'
    },
    dark: {
        bg: '#141321',
        border: '#333333',
        quote: '#a9fef7',
        accent: '#f8d847',
        character: '#fe428e',
        category: '#a9fef7'
    },
    hacker: {
        bg: '#000000',
        border: '#00ff00',
        quote: '#00ff00',
        accent: '#ff0000',
        character: '#00aa00',
        category: '#00ff00'
    },
    radical: {
        bg: '#141321',
        border: '#fe428e',
        quote: '#a9fef7',
        accent: '#f8d847',
        character: '#fe428e',
        category: '#a9fef7'
    },
    cyberpunk: {
        bg: '#0d0221',
        border: '#ff2a6d',
        quote: '#05d9e8',
        accent: '#ff2a6d',
        character: '#d1f7ff',
        category: '#ff2a6d'
    }
};

// escape special xml/html chars so SVG doesn't break
function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&lt;')
        .replace(/>/g, '&gt;')
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
    const category = escapeXml(quote.character || '');

    return `<svg width="600" height="auto" fill="none" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>${generateStyles(theme)}</style>
      <div class="container">
        <div class="terminal-header">guest@fsociety:~$ cat quote.txt</div>
        <div class="quote-text">${text}</div>
        <div class="footer">
          <span class="character">${character}</span>
          ${category ? `<span class="category">#${category}</span>` : ''}
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