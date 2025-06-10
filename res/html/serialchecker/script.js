// Cache DOM elements
const body = document.body;
const toggleBtn = document.getElementById('toggle-dark');
const serialInput = document.getElementById('serial');
const resultDiv = document.getElementById('result');
const explanationDiv = document.getElementById('explanation');
const yearSpan = document.getElementById('year');
const modelInfoDiv = document.getElementById('model-info');
const modelImageDiv = document.getElementById('model-image');
const modelDetailsDiv = document.getElementById('model-details');
const guideLinksDiv = document.getElementById('guide-links');

// Constants and Configuration
const CONFIG = {
  SERIAL_LENGTH: 14,
  DEBOUNCE_DELAY: 300,
  SERIAL_RANGES: {
    XAW1: [74000000, 120000000, 130000000],
    XAW4: [11000000, 12000000, 13000000],
    XAW7: [17800000, 30000000, 31000000],
    XAJ1: [10200000, 30000000, 31000000],
    XAJ4: [40460000, 40600000, 40700000],
    XAJ7: [40000000, 50000000, 60000000]
  },
  PATCHED_PREFIXES: new Set([
    // Mariko (HAC-001(-01)) combinations
    'XKC', 'XKE', 'XKJ', 'XKK', 'XKL', 'XKM', 'XKW',  // China, Europe, Japan, Korea, Dev, Malaysia, Americas
    
    // OLED (HEG-001) combinations
    'XTC', 'XTE', 'XTJ', 'XTK', 'XTL', 'XTM', 'XTW',  // China, Europe, Japan, Korea, Dev, Malaysia, Americas
    
    // Switch Lite (HDH-001) combinations
    'XJC', 'XJE', 'XJJ', 'XJK', 'XJL', 'XJM', 'XJW'   // China, Europe, Japan, Korea, Dev, Malaysia, Americas
  ]),
  MESSAGES: {
    unpatched: "✅ Unpatched – CFW ohne Modchip möglich!",
    maybe: "⚠️ Vielleicht – 50/50 Chance.",
    patched: "❌ Gepatcht – keine CFW ohne Modchip.",
    tooShort: "❗ Seriennummer zu kurz – bitte vollständige Nummer eingeben.",
    tooLong: "❗ Seriennummer zu lang – bitte nur die letzten 14 Zeichen eingeben.",
    invalid: "❗ Ungültiges Format – bitte nur gültige Seriennummern eingeben.",
    unknown: "❓ Unbekannte Seriennummer."
  },
  EXPLANATIONS: {
    unpatched: "Deine Switch ist definitiv ungepatcht und kann mit CFW modifiziert werden.",
    maybe: "Deine Switch könnte gepatcht sein. Es wird empfohlen, weitere Checks durchzuführen.",
    patched: "Deine Switch ist definitiv gepatcht. CFW ist nur mit einem Modchip möglich.",
    unknown: "Diese Seriennummer ist nicht in unserer Datenbank. Bitte überprüfe die Eingabe."
  },
  MODELS: {
    HAC001: {
      name: 'Nintendo Switch (Original) (V1)',
      image: 'https://i.imgur.com/B2qzwtH.png',
      details: {
        'Display': '6.2" LCD (720p)',
        'Akkulaufzeit': '2.5 bis 6.5 Stunden',
        'Gewicht': 'ca. 398g (mit Joy-Cons)',
        'Erscheinungsdatum': 'März 2017',
        'Modellnummer': 'HAC-001'
      }
    },
    HAC001_01: {
      name: 'Nintendo Switch (Verbesserte Akkulaufzeit) (V2)',
      image: 'https://i.imgur.com/t9l6zpm.png',
      details: {
        'Display': '6.2" LCD (720p)',
        'Akkulaufzeit': '4.5 bis 9 Stunden',
        'Gewicht': 'ca. 398g (mit Joy-Cons)',
        'Erscheinungsdatum': 'August 2019',
        'Modellnummer': 'HAC-001(-01)'
      }
    },
    HDH001: {
      name: 'Nintendo Switch Lite',
      image: 'https://i.imgur.com/3uHxflH.png',
      details: {
        'Display': '5.5" LCD (720p)',
        'Akkulaufzeit': '3 bis 7 Stunden',
        'Gewicht': 'ca. 275g',
        'Erscheinungsdatum': 'September 2019',
        'Modellnummer': 'HDH-001'
      }
    },
    HEG001: {
      name: 'Nintendo Switch OLED',
      image: 'https://i.imgur.com/wF5mgEL.png',
      details: {
        'Display': '7" OLED (720p)',
        'Akkulaufzeit': '4.5 bis 9 Stunden',
        'Gewicht': 'ca. 420g (mit Joy-Cons)',
        'Erscheinungsdatum': 'Oktober 2021',
        'Modellnummer': 'HEG-001'
      }
    }
  },
  GUIDES: {
    unpatched: [
      {
        title: '📷 Niklas CFW Guide',
        url: 'https://youtu.be/hYoEoa9p_P0?si=bE2faptffgLtNahe',
        description: 'Anleitung zur Installation von Atmosphere CFW'
      }
    ],
    maybe: [
      {
        title: '❓ RCM Test Guide',
        url: 'https://nh-server.github.io/switch-guide/user_guide/rcm/',
        description: 'Teste ob deine Switch RCM-fähig ist'
      }
    ],
    patched: [
      {
        title: '⚠️ Modchip Einbau',
        url: 'https://discord.gg/niklascfw',
        description: 'Informationen zu Modchip-Optionen'
      }
    ]
  }
};

// UI State Management
class UIState {
  constructor() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.loadSavedTheme();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && this.isDarkMode)) {
      body.classList.add('dark-mode');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}

// Serial Number Validator
class SerialValidator {
  static validate(serial) {
    serial = serial.toUpperCase().trim();
    
    if (!serial) {
      return { status: 'empty', message: '', explanation: '' };
    }

    if (serial.length !== CONFIG.SERIAL_LENGTH) {
      return {
        status: 'warning',
        message: serial.length < CONFIG.SERIAL_LENGTH ? CONFIG.MESSAGES.tooShort : CONFIG.MESSAGES.tooLong,
        explanation: ''
      };
    }

    const prefix = serial.slice(0, 4);
    // Take the full number part
    const numberPart = serial.slice(4);
    // Convert to number, removing any leading zeros
    const number = parseInt(numberPart, 10);

    if (isNaN(number)) {
      return {
        status: 'warning',
        message: CONFIG.MESSAGES.invalid,
        explanation: ''
      };
    }

    // Check for patched prefixes
    if (CONFIG.PATCHED_PREFIXES.has(serial.slice(0, 3))) {
      return {
        status: 'danger',
        message: CONFIG.MESSAGES.patched,
        explanation: CONFIG.EXPLANATIONS.patched,
        model: SerialValidator.getModelInfo(serial.slice(0, 3)),
        guides: CONFIG.GUIDES.patched
      };
    }

    // Check known ranges
    if (prefix in CONFIG.SERIAL_RANGES) {
      const [unpatchedMax, maybeMax, patchedMax] = CONFIG.SERIAL_RANGES[prefix];
      
      console.log('Debug:', {
        serial: serial,
        prefix: prefix,
        numberPart: numberPart,
        parsedNumber: number,
        unpatchedMax: unpatchedMax,
        maybeMax: maybeMax,
        patchedMax: patchedMax,
        isUnpatched: number < unpatchedMax,
        isMaybe: number >= unpatchedMax && number < maybeMax,
        isPatched: number >= maybeMax
      });

      // For XAJ7 specifically
      if (prefix === 'XAJ7') {
        // Convert the number to match the range format
        const normalizedNumber = parseInt(number.toString().padStart(8, '0'), 10);
        
        if (normalizedNumber >= maybeMax) {
          return {
            status: 'danger',
            message: CONFIG.MESSAGES.patched,
            explanation: CONFIG.EXPLANATIONS.patched,
            model: CONFIG.MODELS.HAC001_01,
            guides: CONFIG.GUIDES.patched
          };
        } else if (normalizedNumber >= unpatchedMax) {
          return {
            status: 'warning',
            message: CONFIG.MESSAGES.maybe,
            explanation: CONFIG.EXPLANATIONS.maybe,
            model: CONFIG.MODELS.HAC001,
            guides: CONFIG.GUIDES.maybe
          };
        } else {
          return {
            status: 'success',
            message: CONFIG.MESSAGES.unpatched,
            explanation: CONFIG.EXPLANATIONS.unpatched,
            model: CONFIG.MODELS.HAC001,
            guides: CONFIG.GUIDES.unpatched
          };
        }
      }
      
      // For other prefixes
      if (number >= maybeMax) {
        return {
          status: 'danger',
          message: CONFIG.MESSAGES.patched,
          explanation: CONFIG.EXPLANATIONS.patched,
          model: CONFIG.MODELS.HAC001_01,
          guides: CONFIG.GUIDES.patched
        };
      } else if (number >= unpatchedMax) {
        return {
          status: 'warning',
          message: CONFIG.MESSAGES.maybe,
          explanation: CONFIG.EXPLANATIONS.maybe,
          model: CONFIG.MODELS.HAC001,
          guides: CONFIG.GUIDES.maybe
        };
      } else {
        return {
          status: 'success',
          message: CONFIG.MESSAGES.unpatched,
          explanation: CONFIG.EXPLANATIONS.unpatched,
          model: CONFIG.MODELS.HAC001,
          guides: CONFIG.GUIDES.unpatched
        };
      }
    }

    return {
      status: 'unknown',
      message: CONFIG.MESSAGES.unknown,
      explanation: CONFIG.EXPLANATIONS.unknown,
      model: null,
      guides: []
    };
  }

  static getModelInfo(prefix) {
    if (prefix.startsWith('XJ')) return CONFIG.MODELS.HDH001;
    if (prefix.startsWith('XT')) return CONFIG.MODELS.HEG001;
    if (prefix.startsWith('XK')) return CONFIG.MODELS.HAC001_01;
    return CONFIG.MODELS.HAC001;
  }
}

// UI Manager
class UIManager {
  static updateResult(result, explanation, type) {
    resultDiv.className = '';
    resultDiv.textContent = result;
    resultDiv.classList.add(`result-${type}`);
    explanationDiv.textContent = explanation || '';
  }

  static showModelInfo(model) {
    if (!model) {
      modelInfoDiv.classList.remove('visible');
      return;
    }

    const img = new Image();
    img.onload = () => {
      requestAnimationFrame(() => {
        modelImageDiv.innerHTML = `<img src="${model.image}" alt="${model.name}" />`;
        
        const detailsHTML = `<h4>${model.name}</h4><ul>${
          Object.entries(model.details)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('')
        }</ul>`;
        
        modelDetailsDiv.innerHTML = detailsHTML;
        modelInfoDiv.classList.add('visible');
      });
    };
    img.src = model.image;
  }

  static showGuides(guides) {
    if (!guides || guides.length === 0) {
      document.getElementById('guide-info').classList.remove('visible');
      return;
    }
    
    const guidesHTML = guides.map(guide => `
      <a href="${guide.url}" target="_blank" rel="noopener noreferrer" class="guide-link">
        ${guide.title}
        <div class="guide-description">${guide.description}</div>
      </a>
    `).join('');
    
    requestAnimationFrame(() => {
      guideLinksDiv.innerHTML = guidesHTML;
      document.getElementById('guide-info').classList.add('visible');
    });
  }

  static clearResults() {
    resultDiv.className = '';
    resultDiv.textContent = '';
    explanationDiv.textContent = '';
    modelInfoDiv.classList.remove('visible');
    document.getElementById('guide-info').classList.remove('visible');
  }
}

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Initialize UI
const uiState = new UIState();
yearSpan.textContent = new Date().getFullYear();

// Event Listeners
toggleBtn.addEventListener('click', () => uiState.toggleDarkMode());

const handleSerialInput = debounce((serial) => {
  UIManager.clearResults();
  
  if (!serial) return;

  const result = SerialValidator.validate(serial);
  UIManager.updateResult(result.message, result.explanation, result.status);
  UIManager.showModelInfo(result.model);
  UIManager.showGuides(result.guides);
}, CONFIG.DEBOUNCE_DELAY);

serialInput.addEventListener('input', (e) => handleSerialInput(e.target.value)); 
