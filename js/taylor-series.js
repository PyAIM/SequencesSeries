// JavaScript for the Taylor Series page interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive Taylor series visualizer if it exists on the page
    initTaylorSeriesVisualizer();
});

function initTaylorSeriesVisualizer() {
    const visualizerContainer = document.getElementById('interactive-taylor-graph');
    if (!visualizerContainer) return;
    
    const functionSelect = document.getElementById('taylor-function-select');
    const termsSlider = document.getElementById('taylor-terms-slider');
    const termsValue = document.getElementById('taylor-terms-value');
    const centerSlider = document.getElementById('taylor-center-slider');
    const centerValue = document.getElementById('taylor-center-value');
    
    // Update the terms value display when the slider changes
    if (termsSlider && termsValue) {
        termsSlider.addEventListener('input', function() {
            termsValue.textContent = this.value;
            updateTaylorSeriesVisualization();
        });
    }
    
    // Update the center value display when the slider changes
    if (centerSlider && centerValue) {
        centerSlider.addEventListener('input', function() {
            centerValue.textContent = this.value;
            updateTaylorSeriesVisualization();
        });
    }
    
    // Update the visualization when the function type changes
    if (functionSelect) {
        functionSelect.addEventListener('change', function() {
            updateTaylorSeriesVisualization();
        });
    }
    
    // Initial visualization
    updateTaylorSeriesVisualization();
}

function updateTaylorSeriesVisualization() {
    const functionSelect = document.getElementById('taylor-function-select');
    const termsSlider = document.getElementById('taylor-terms-slider');
    const centerSlider = document.getElementById('taylor-center-slider');
    const functionFormula = document.getElementById('taylor-function-formula');
    const seriesFormula = document.getElementById('taylor-series-formula');
    const approximationFormula = document.getElementById('taylor-approximation-formula');
    const errorInfo = document.getElementById('taylor-error');
    
    if (!functionSelect || !termsSlider || !centerSlider) return;
    
    const functionType = functionSelect.value;
    const numTerms = parseInt(termsSlider.value);
    const centerPoint = parseFloat(centerSlider.value);
    
    // Define function and its derivatives based on the selected type
    let actualFunction;
    let derivatives = [];
    let formulaText = '';
    let seriesText = '';
    let approximationText = '';
    let errorText = '';
    let xMin, xMax;
    
    switch (functionType) {
        case '1': // sin(x)
            actualFunction = x => Math.sin(x);
            derivatives = [
                x => Math.sin(x),
                x => Math.cos(x),
                x => -Math.sin(x),
                x => -Math.cos(x)
            ];
            formulaText = 'f(x) = sin(x)';
            seriesText = getTaylorSeriesText('sin', centerPoint);
            approximationText = getTaylorApproximationText('sin', centerPoint, numTerms);
            errorText = `Maximum Error in [${(centerPoint-Math.PI).toFixed(2)},${(centerPoint+Math.PI).toFixed(2)}]: ${calculateMaxError('sin', centerPoint, numTerms).toFixed(4)}`;
            xMin = centerPoint - Math.PI;
            xMax = centerPoint + Math.PI;
            break;
        case '2': // cos(x)
            actualFunction = x => Math.cos(x);
            derivatives = [
                x => Math.cos(x),
                x => -Math.sin(x),
                x => -Math.cos(x),
                x => Math.sin(x)
            ];
            formulaText = 'f(x) = cos(x)';
            seriesText = getTaylorSeriesText('cos', centerPoint);
            approximationText = getTaylorApproximationText('cos', centerPoint, numTerms);
            errorText = `Maximum Error in [${(centerPoint-Math.PI).toFixed(2)},${(centerPoint+Math.PI).toFixed(2)}]: ${calculateMaxError('cos', centerPoint, numTerms).toFixed(4)}`;
            xMin = centerPoint - Math.PI;
            xMax = centerPoint + Math.PI;
            break;
        case '3': // e^x
            actualFunction = x => Math.exp(x);
            derivatives = [
                x => Math.exp(x),
                x => Math.exp(x),
                x => Math.exp(x),
                x => Math.exp(x)
            ];
            formulaText = 'f(x) = e^x';
            seriesText = getTaylorSeriesText('exp', centerPoint);
            approximationText = getTaylorApproximationText('exp', centerPoint, numTerms);
            errorText = `Maximum Error in [${(centerPoint-2).toFixed(2)},${(centerPoint+2).toFixed(2)}]: ${calculateMaxError('exp', centerPoint, numTerms).toFixed(4)}`;
            xMin = centerPoint - 2;
            xMax = centerPoint + 2;
            break;
        case '4': // ln(1+x)
            actualFunction = x => Math.log(1 + x);
            derivatives = [
                x => Math.log(1 + x),
                x => 1 / (1 + x),
                x => -1 / Math.pow(1 + x, 2),
                x => 2 / Math.pow(1 + x, 3)
            ];
            formulaText = 'f(x) = ln(1+x)';
            seriesText = getTaylorSeriesText('ln', centerPoint);
            approximationText = getTaylorApproximationText('ln', centerPoint, numTerms);
            errorText = `Maximum Error in [${Math.max(-0.9, centerPoint-0.9).toFixed(2)},${Math.min(0.9, centerPoint+0.9).toFixed(2)}]: ${calculateMaxError('ln', centerPoint, numTerms).toFixed(4)}`;
            xMin = Math.max(-0.9, centerPoint - 0.9);
            xMax = Math.min(0.9, centerPoint + 0.9);
            break;
        case '5': // 1/(1+x)
            actualFunction = x => 1 / (1 + x);
            derivatives = [
                x => 1 / (1 + x),
                x => -1 / Math.pow(1 + x, 2),
                x => 2 / Math.pow(1 + x, 3),
                x => -6 / Math.pow(1 + x, 4)
            ];
            formulaText = 'f(x) = 1/(1+x)';
            seriesText = getTaylorSeriesText('frac', centerPoint);
            approximationText = getTaylorApproximationText('frac', centerPoint, numTerms);
            errorText = `Maximum Error in [${Math.max(-0.9, centerPoint-0.9).toFixed(2)},${Math.min(0.9, centerPoint+0.9).toFixed(2)}]: ${calculateMaxError('frac', centerPoint, numTerms).toFixed(4)}`;
            xMin = Math.max(-0.9, centerPoint - 0.9);
            xMax = Math.min(0.9, centerPoint + 0.9);
            break;
        default:
            actualFunction = x => Math.sin(x);
            derivatives = [
                x => Math.sin(x),
                x => Math.cos(x),
                x => -Math.sin(x),
                x => -Math.cos(x)
            ];
            formulaText = 'f(x) = sin(x)';
            seriesText = getTaylorSeriesText('sin', centerPoint);
            approximationText = getTaylorApproximationText('sin', centerPoint, numTerms);
            errorText = `Maximum Error in [${(centerPoint-Math.PI).toFixed(2)},${(centerPoint+Math.PI).toFixed(2)}]: ${calculateMaxError('sin', centerPoint, numTerms).toFixed(4)}`;
            xMin = centerPoint - Math.PI;
            xMax = centerPoint + Math.PI;
    }
    
    // Generate points for the actual function
    const actualPoints = generateFunctionPoints(actualFunction, xMin, xMax);
    
    // Generate points for the Taylor polynomial approximation
    const taylorFunction = x => {
        let sum = 0;
        for (let n = 0; n < numTerms; n++) {
            // Calculate the nth term of the Taylor series
            const derivativeValue = derivatives[n % derivatives.length](centerPoint);
            sum += (derivativeValue / factorial(n)) * Math.pow(x - centerPoint, n);
        }
        return sum;
    };
    
    const taylorPoints = generateFunctionPoints(taylorFunction, xMin, xMax);
    
    // Update the visualization
    createLineChart('interactive-taylor-graph', [
        { name: 'Actual Function', points: actualPoints },
        { name: 'Taylor Polynomial', points: taylorPoints }
    ], {
        xLabel: 'x',
        yLabel: 'f(x)',
        width: document.getElementById('interactive-taylor-graph').clientWidth
    });
    
    // Update the information display
    if (functionFormula) {
        functionFormula.textContent = `Function: ${formulaText}`;
    }
    
    if (seriesFormula) {
        seriesFormula.textContent = `Taylor Series: ${seriesText}`;
    }
    
    if (approximationFormula) {
        approximationFormula.textContent = `Current Approximation: ${approximationText}`;
    }
    
    if (errorInfo) {
        errorInfo.textContent = errorText;
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

// Helper function to generate Taylor series text
function getTaylorSeriesText(functionType, centerPoint) {
    const a = centerPoint;
    switch (functionType) {
        case 'sin':
            if (a === 0) {
                return 'x - x³/3! + x⁵/5! - x⁷/7! + ...';
            } else {
                return `sin(${a}) + cos(${a})(x-${a}) - sin(${a})(x-${a})²/2! - cos(${a})(x-${a})³/3! + ...`;
            }
        case 'cos':
            if (a === 0) {
                return '1 - x²/2! + x⁴/4! - x⁶/6! + ...';
            } else {
                return `cos(${a}) - sin(${a})(x-${a}) - cos(${a})(x-${a})²/2! + sin(${a})(x-${a})³/3! + ...`;
            }
        case 'exp':
            if (a === 0) {
                return '1 + x + x²/2! + x³/3! + ...';
            } else {
                return `e^${a} + e^${a}(x-${a}) + e^${a}(x-${a})²/2! + e^${a}(x-${a})³/3! + ...`;
            }
        case 'ln':
            if (a === 0) {
                return 'x - x²/2 + x³/3 - x⁴/4 + ...';
            } else {
                return `ln(1+${a}) + (x-${a})/(1+${a}) - (x-${a})²/(2(1+${a})²) + (x-${a})³/(3(1+${a})³) - ...`;
            }
        case 'frac':
            if (a === 0) {
                return '1 - x + x² - x³ + ...';
            } else {
                return `1/(1+${a}) - (x-${a})/(1+${a})² + (x-${a})²/(1+${a})³ - (x-${a})³/(1+${a})⁴ + ...`;
            }
        default:
            return '';
    }
}

// Helper function to generate Taylor approximation text
function getTaylorApproximationText(functionType, centerPoint, numTerms) {
    const a = centerPoint;
    let text = '';
    
    switch (functionType) {
        case 'sin':
            if (a === 0) {
                if (numTerms <= 0) return '0';
                text = 'x';
                for (let n = 1; n < numTerms; n++) {
                    if (n % 2 === 0) continue; // Skip even terms (they're zero)
                    const power = 2*n + 1;
                    const sign = n % 2 === 0 ? '+' : '-';
                    text += ` ${sign} x^${power}/${power}!`;
                }
            } else {
                text = `sin(${a})`;
                if (numTerms > 1) text += ` + cos(${a})(x-${a})`;
                if (numTerms > 2) text += ` - sin(${a})(x-${a})²/2!`;
                if (numTerms > 3) text += ` - cos(${a})(x-${a})³/3!`;
                // Add more terms as needed
            }
            break;
        case 'cos':
            if (a === 0) {
                text = '1';
                for (let n = 1; n < numTerms; n++) {
                    if (n % 2 === 1) continue; // Skip odd terms (they're zero)
                    const power = 2*n;
                    const sign = n % 2 === 0 ? '-' : '+';
                    text += ` ${sign} x^${power}/${power}!`;
                }
            } else {
                text = `cos(${a})`;
                if (numTerms > 1) text += ` - sin(${a})(x-${a})`;
                if (numTerms > 2) text += ` - cos(${a})(x-${a})²/2!`;
                if (numTerms > 3) text += ` + sin(${a})(x-${a})³/3!`;
                // Add more terms as needed
            }
            break;
        case 'exp':
            if (a === 0) {
                text = '1';
                for (let n = 1; n < numTerms; n++) {
                    text += ` + x^${n}/${n}!`;
                }
            } else {
                text = `e^${a}`;
                for (let n = 1; n < numTerms; n++) {
                    text += ` + e^${a}(x-${a})^${n}/${n}!`;
                }
            }
            break;
        case 'ln':
            if (a === 0) {
                if (numTerms <= 1) return '0';
                text = 'x';
                for (let n = 2; n < numTerms; n++) {
                    const sign = n % 2 === 0 ? '-' : '+';
                    text += ` ${sign} x^${n}/${n}`;
                }
            } else {
                text = `ln(1+${a})`;
                if (numTerms > 1) text += ` + (x-${a})/(1+${a})`;
                if (numTerms > 2) text += ` - (x-${a})²/(2(1+${a})²)`;
                if (numTerms > 3) text += ` + (x-${a})³/(3(1+${a})³)`;
                // Add more terms as needed
            }
            break;
        case 'frac':
            if (a === 0) {
                text = '1';
                for (let n = 1; n < numTerms; n++) {
                    const sign = n % 2 === 1 ? '-' : '+';
                    text += ` ${sign} x^${n}`;
                }
            } else {
                text = `1/(1+${a})`;
                if (numTerms > 1) text += ` - (x-${a})/(1+${a})²`;
                if (numTerms > 2) text += ` + (x-${a})²/(1+${a})³`;
                if (numTerms > 3) text += ` - (x-${a})³/(1+${a})⁴`;
                // Add more terms as needed
            }
            break;
        default:
            text = '';
    }
    
    return text;
}

// Helper function to calculate maximum error
function calculateMaxError(functionType, centerPoint, numTerms) {
    // This is a simplified error estimation
    // In a real application, we would use Taylor's Remainder Theorem
    
    const a = centerPoint;
    let maxError = 0;
    
    switch (functionType) {
        case 'sin':
            // For sin(x), the error is bounded by 1/(n+1)! in the interval [-π,π]
            maxError = 1 / factorial(numTerms);
            break;
        case 'cos':
            // For cos(x), the error is bounded by 1/(n+1)! in the interval [-π,π]
            maxError = 1 / factorial(numTerms);
            break;
        case 'exp':
            // For e^x, the error depends on the interval
            const maxX = Math.max(Math.abs(a - 2), Math.abs(a + 2));
            const maxExpValue = Math.exp(maxX);
            maxError = maxExpValue / factorial(numTerms);
            break;
        case 'ln':
            // For ln(1+x), the error is more complex
            maxError = 1 / (numTerms * Math.pow(0.1, numTerms));
            break;
        case 'frac':
            // For 1/(1+x), the error is also complex
            maxError = 1 / Math.pow(0.1, numTerms);
            break;
        default:
            maxError = 0;
    }
    
    return Math.min(maxError, 1); // Cap at 1 for better display
}
