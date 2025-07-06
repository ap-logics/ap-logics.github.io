// Custom Cursor - Only for desktop - change to deploy
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove', e => {
        cursor.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
    });

    document.querySelectorAll('a, button, .project-card, .contact-card, .tech-tag').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Matrix Rain Background
const matrixCanvas = document.getElementById('matrix-bg');
const matrixCtx = matrixCanvas.getContext('2d');

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = matrixCanvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixCtx.fillStyle = '#00ff88';
    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Trading Chart Background
const tradingCanvas = document.getElementById('trading-bg');
const tradingCtx = tradingCanvas.getContext('2d');

tradingCanvas.width = window.innerWidth;
tradingCanvas.height = window.innerHeight;

const candleWidth = 12;
const candleSpacing = 8;
const numCandles = Math.floor(tradingCanvas.width / (candleWidth + candleSpacing));

// Create array to store candle data
let candles = [];
let basePrice = tradingCanvas.height / 2;
let trend = 0.5; // Start neutral
let volatility = 30;

// Initialize with empty candles
for (let i = 0; i < numCandles; i++) {
    candles.push(null);
}

function addNewCandle() {
    // Create a more realistic price movement pattern
    const trendChange = (Math.random() - 0.5) * 0.1;
    trend = Math.max(-1, Math.min(1, trend + trendChange));
    
    const priceChange = trend * volatility + (Math.random() - 0.5) * volatility * 0.5;
    basePrice = Math.max(tradingCanvas.height * 0.2, Math.min(tradingCanvas.height * 0.8, basePrice + priceChange));
    
    const open = basePrice + (Math.random() - 0.5) * 20;
    const close = basePrice + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 25;
    const low = Math.min(open, close) - Math.random() * 25;

    const newCandle = {
        open: open,
        close: close,
        high: high,
        low: low,
        isBullish: close > open
    };

    // Shift all candles left and add new one at the end
    candles.shift();
    candles.push(newCandle);
}

function drawTradingChart() {
    tradingCtx.clearRect(0, 0, tradingCanvas.width, tradingCanvas.height);

    for (let i = 0; i < candles.length; i++) {
        const candle = candles[i];
        if (!candle) continue; // Skip empty candles

        const x = i * (candleWidth + candleSpacing);
        
        // More visible but still subtle colors
        const neonColor = 'rgba(0, 255, 136, 0.4)'; // More visible neon green
        const purpleColor = 'rgba(153, 69, 255, 0.35)'; // More visible purple
        
        tradingCtx.fillStyle = candle.isBullish ? neonColor : purpleColor;
        tradingCtx.strokeStyle = candle.isBullish ? neonColor : purpleColor;
        tradingCtx.lineWidth = 2;

        // Draw wick
        tradingCtx.beginPath();
        tradingCtx.moveTo(x + candleWidth / 2, candle.high);
        tradingCtx.lineTo(x + candleWidth / 2, candle.low);
        tradingCtx.stroke();

        // Draw body
        tradingCtx.fillRect(x, Math.min(candle.open, candle.close), candleWidth, Math.abs(candle.open - candle.close));
    }
}

// Animation Loop
let lastMatrixTime = 0;
let lastTradingTime = 0;
const matrixInterval = 50; // ms
const tradingInterval = 3000; // ms - Much slower updates

function animate(currentTime) {
    if (currentTime - lastMatrixTime > matrixInterval) {
        drawMatrix();
        lastMatrixTime = currentTime;
    }

    if (currentTime - lastTradingTime > tradingInterval) {
        addNewCandle(); // Add one new candle
        drawTradingChart(); // Then redraw the chart
        lastTradingTime = currentTime;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Handle window resize
window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    tradingCanvas.width = window.innerWidth;
    tradingCanvas.height = window.innerHeight;
    
    // Reinitialize candles array for new screen size
    const newNumCandles = Math.floor(tradingCanvas.width / (candleWidth + candleSpacing));
    candles = [];
    for (let i = 0; i < newNumCandles; i++) {
        candles.push(null);
    }
    
    // Redraw immediately on resize
    drawMatrix();
    drawTradingChart();
});

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.classList.toggle('rainbow-mode');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});