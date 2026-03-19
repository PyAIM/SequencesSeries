// JavaScript for the Power Series page interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive power series visualizer if it exists on the page
    initPowerSeriesVisualizer();
});

function initPowerSeriesVisualizer() {
    const visualizerContainer = document.getElementById('interactive-power-series-graph');
    if (!visualizerContainer) return;
    
    const functionSelect = document.getElementById('function-select');
    const termsSlider = document.getElementById('terms-slider');
    const termsValue = document.getElementById('terms-value');
    
    // Update the terms value display when the slider changes
    if (termsSlider && termsValue) {
        termsSlider.addEventListener('input', function() {
            termsValue.textContent = this.value;
            updatePowerSeriesVisualization();
        });
    }
    
    // Update the visualization when the function type changes
    if (functionSelect) {
        functionSelect.addEventListener('change', function() {
            updatePowerSeriesVisualization();
        });
    }
    
    // Initial visualization
    updatePowerSeriesVisualization();
}

function updatePowerSeriesVisualization() {
    const functionSelect = document.getElementById('function-select');
    const termsSlider = document.getElementById('terms-slider');
    const functionFormula = document.getElementById('function-formula');
    const powerSeriesFormula = document.getElementById('power-series-formula');
    const approximationFormula = document.getElementById('approximation-formula');
    const radiusConvergence = document.getElementById('radius-convergence');
    
    if (!functionSelect || !termsSlider) return;
    
    const functionType = functionSelect.value;
    const numTerms = parseInt(termsSlider.value);
    
    // Define function and its power series based on the selected type
    let actualFunction;
    let powerSeriesTerms = [];
    let formulaText = '';
    let powerSeriesText = '';
    let approximationText = '';
    let radiusText = '';
    let xMin, xMax;
    
    switch (functionType) {
        case '1': // e^x
            actualFunction = x => Math.exp(x);
            for (let n = 0; n < numTerms; n++) {
                powerSeriesTerms.push(x => Math.pow(x, n) / factorial(n));
            }
            formulaText = 'f(x) = e^x';
            powerSeriesText = '1 + x + x²/2! + x³/3! + ...';
            approximationText = getApproximationText(numTerms, 'e^x');
            radiusText = '∞';
            xMin = -2;
            xMax = 2;
            break;
        case '2': // 1/(1-x)
            actualFunction = x => 1 / (1 - x);
            for (let n = 0; n < numTerms; n++) {
                powerSeriesTerms.push(x => Math.pow(x, n));
            }
            formulaText = 'f(x) = 1/(1-x)';
            powerSeriesText = '1 + x + x² + x³ + ...';
            approximationText = getApproximationText(numTerms, '1/(1-x)');
            radiusText = '1';
            xMin = -0.9;
            xMax = 0.9;
            break;
        case '3': // ln(1+x)
            actualFunction = x => Math.log(1 + x);
            for (let n = 0; n < numTerms; n++) {
                if (n === 0) {
                    powerSeriesTerms.push(x => 0);
                } else {
                    powerSeriesTerms.push(x => Math.pow(-1, n+1) * Math.pow(x, n) / n);
                }
            }
            formulaText = 'f(x) = ln(1+x)';
            powerSeriesText = 'x - x²/2 + x³/3 - x⁴/4 + ...';
            approximationText = getApproximationText(numTerms, 'ln(1+x)');
            radiusText = '1';
            xMin = -0.9;
            xMax = 0.9;
            break;
        case '4': // sin(x)
            // Each index n contributes exactly one nonzero term: (-1)^n * x^(2n+1) / (2n+1)!
            // n=0 → x/1!, n=1 → -x³/3!, n=2 → x⁵/5!, ...
            actualFunction = x => Math.sin(x);
            for (let n = 0; n < numTerms; n++) {
                powerSeriesTerms.push(x => Math.pow(-1, n) * Math.pow(x, 2*n+1) / factorial(2*n+1));
            }
            formulaText = 'f(x) = sin(x)';
            powerSeriesText = 'x - x³/3! + x⁵/5! - x⁷/7! + ...';
            approximationText = getApproximationText(numTerms, 'sin(x)');
            radiusText = '∞';
            xMin = -Math.PI;
            xMax = Math.PI;
            break;
        case '5': // cos(x)
            // Each index n contributes exactly one nonzero term: (-1)^n * x^(2n) / (2n)!
            // n=0 → 1, n=1 → -x²/2!, n=2 → x⁴/4!, ...
            actualFunction = x => Math.cos(x);
            for (let n = 0; n < numTerms; n++) {
                powerSeriesTerms.push(x => Math.pow(-1, n) * Math.pow(x, 2*n) / factorial(2*n));
            }
            formulaText = 'f(x) = cos(x)';
            powerSeriesText = '1 - x²/2! + x⁴/4! - x⁶/6! + ...';
            approximationText = getApproximationText(numTerms, 'cos(x)');
            radiusText = '∞';
            xMin = -Math.PI;
            xMax = Math.PI;
            break;
        default:
            actualFunction = x => Math.exp(x);
            for (let n = 0; n < numTerms; n++) {
                powerSeriesTerms.push(x => Math.pow(x, n) / factorial(n));
            }
            formulaText = 'f(x) = e^x';
            powerSeriesText = '1 + x + x²/2! + x³/3! + ...';
            approximationText = getApproximationText(numTerms, 'e^x');
            radiusText = '∞';
            xMin = -2;
            xMax = 2;
    }
    
    // Generate points for the actual function
    const actualPoints = generateFunctionPoints(actualFunction, xMin, xMax);
    
    // Generate points for the power series approximation
    const approximationFunction = x => {
        let sum = 0;
        for (let i = 0; i < powerSeriesTerms.length; i++) {
            sum += powerSeriesTerms[i](x);
        }
        return sum;
    };
    
    const approximationPoints = generateFunctionPoints(approximationFunction, xMin, xMax);
    
    // Update the visualization
    createLineChart('interactive-power-series-graph', [
        { name: 'Actual Function', points: actualPoints, color: '#FF5733' },
        { name: 'Power Series Approximation', points: approximationPoints, color: '#33FF57' }
    ], {
        xLabel: 'x',
        yLabel: 'f(x)',
        width: document.getElementById('interactive-power-series-graph').clientWidth
    });
    
    // Update the information display
    if (functionFormula) {
        functionFormula.textContent = `Function: ${formulaText}`;
    }
    
    if (powerSeriesFormula) {
        powerSeriesFormula.textContent = `Power Series: ${powerSeriesText}`;
    }
    
    if (approximationFormula) {
        approximationFormula.textContent = `Current Approximation: ${approximationText}`;
    }
    
    if (radiusConvergence) {
        radiusConvergence.textContent = `Radius of Convergence: ${radiusText}`;
    }
}

// Helper function to calculate factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Helper function to generate approximation text
function getApproximationText(numTerms, functionType) {
    switch (functionType) {
        case 'e^x':
            let expText = '1';
            for (let i = 1; i < numTerms; i++) {
                if (i === 1) {
                    expText += ' + x';
                } else {
                    expText += ` + x^${i}/${i}!`;
                }
            }
            return expText;
        case '1/(1-x)':
            let geoText = '1';
            for (let i = 1; i < numTerms; i++) {
                if (i === 1) {
                    geoText += ' + x';
                } else {
                    geoText += ` + x^${i}`;
                }
            }
            return geoText;
        case 'ln(1+x)':
            if (numTerms <= 1) return '0';
            let lnText = 'x';
            for (let i = 2; i < numTerms; i++) {
                if (i % 2 === 0) {
                    lnText += ` - x^${i}/${i}`;
                } else {
                    lnText += ` + x^${i}/${i}`;
                }
            }
            return lnText;
        case 'sin(x)':
            // n=0 → x, n=1 → -x³/3!, n=2 → x⁵/5!, ...
            if (numTerms <= 0) return '0';
            let sinText = 'x';
            for (let n = 1; n < numTerms; n++) {
                const power = 2*n + 1;
                const sign = (n % 2 === 0) ? '+' : '-';
                sinText += ` ${sign} x^${power}/${power}!`;
            }
            return sinText;
        case 'cos(x)':
            // n=0 → 1, n=1 → -x²/2!, n=2 → x⁴/4!, ...
            if (numTerms <= 0) return '0';
            let cosText = '1';
            for (let n = 1; n < numTerms; n++) {
                const power = 2*n;
                const sign = (n % 2 === 0) ? '+' : '-';
                cosText += ` ${sign} x^${power}/${power}!`;
            }
            return cosText;
        default:
            return '';
    }
}