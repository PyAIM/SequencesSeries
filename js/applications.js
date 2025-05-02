// JavaScript for the Applications page interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive applications visualizer if it exists on the page
    initApplicationsVisualizer();
});

function initApplicationsVisualizer() {
    const visualizerContainer = document.getElementById('interactive-application-graph');
    if (!visualizerContainer) return;
    
    const applicationSelect = document.getElementById('application-select');
    const termsSlider = document.getElementById('terms-slider');
    const termsValue = document.getElementById('terms-value');
    const parameterSlider = document.getElementById('parameter-slider');
    const parameterValue = document.getElementById('parameter-value');
    
    // Update the terms value display when the slider changes
    if (termsSlider && termsValue) {
        termsSlider.addEventListener('input', function() {
            termsValue.textContent = this.value;
            updateApplicationVisualization();
        });
    }
    
    // Update the parameter value display when the slider changes
    if (parameterSlider && parameterValue) {
        parameterSlider.addEventListener('input', function() {
            parameterValue.textContent = this.value;
            updateApplicationVisualization();
        });
    }
    
    // Update the visualization when the application type changes
    if (applicationSelect) {
        applicationSelect.addEventListener('change', function() {
            updateApplicationVisualization();
        });
    }
    
    // Initial visualization
    updateApplicationVisualization();
}

function updateApplicationVisualization() {
    const applicationSelect = document.getElementById('application-select');
    const termsSlider = document.getElementById('terms-slider');
    const parameterSlider = document.getElementById('parameter-slider');
    const applicationDescription = document.getElementById('application-description');
    const applicationFormula = document.getElementById('application-formula');
    const applicationError = document.getElementById('application-error');
    
    if (!applicationSelect || !termsSlider || !parameterSlider) return;
    
    const applicationType = applicationSelect.value;
    const numTerms = parseInt(termsSlider.value);
    const parameterValue = parseFloat(parameterSlider.value);
    
    // Define visualization data based on the selected application
    let seriesData = [];
    let descriptionText = '';
    let formulaText = '';
    let errorText = '';
    let xMin, xMax;
    
    switch (applicationType) {
        case '1': // Function Approximation
            // Approximate e^x with Taylor polynomial
            const actualFunction = x => Math.exp(x);
            
            // Generate Taylor polynomial approximation
            const taylorFunction = x => {
                let sum = 0;
                for (let n = 0; n < numTerms; n++) {
                    sum += Math.pow(x, n) / factorial(n);
                }
                return sum;
            };
            
            // Generate points
            const actualPoints = generateFunctionPoints(actualFunction, -parameterValue, parameterValue);
            const taylorPoints = generateFunctionPoints(taylorFunction, -parameterValue, parameterValue);
            
            seriesData = [
                { name: 'Actual Function (e^x)', points: actualPoints },
                { name: `Taylor Polynomial (${numTerms} terms)`, points: taylorPoints }
            ];
            
            descriptionText = `Function Approximation: Using Taylor polynomials to approximate e^x`;
            formulaText = `Formula: e^x ≈ P₍${numTerms}₎(x) = ${getTaylorApproximation(numTerms)}`;
            errorText = `Error: |e^x - P₍${numTerms}₎(x)| ≤ ${calculateApproximationError(numTerms, parameterValue).toExponential(4)} for |x| ≤ ${parameterValue}`;
            
            xMin = -parameterValue;
            xMax = parameterValue;
            break;
            
        case '2': // Numerical Integration
            // Integrate sin(x^2) using power series
            const integrandFunction = x => Math.sin(x*x);
            
            // Power series for sin(x^2)
            const powerSeriesIntegrand = x => {
                let sum = 0;
                for (let n = 0; n < numTerms; n++) {
                    if (n % 2 === 0) {
                        sum += Math.pow(-1, n/2) * Math.pow(x, 4*n+2) / factorial(2*n+1);
                    }
                }
                return sum;
            };
            
            // Generate points for the integrand
            const integrandPoints = generateFunctionPoints(integrandFunction, 0, parameterValue);
            const powerSeriesPoints = generateFunctionPoints(powerSeriesIntegrand, 0, parameterValue);
            
            // Calculate the integral using the power series
            const integralValue = calculateIntegral(powerSeriesIntegrand, 0, parameterValue);
            
            seriesData = [
                { name: 'sin(x²)', points: integrandPoints },
                { name: `Power Series Approximation (${numTerms} terms)`, points: powerSeriesPoints }
            ];
            
            descriptionText = `Numerical Integration: Evaluating ∫₀^${parameterValue} sin(x²) dx using power series`;
            formulaText = `Formula: sin(x²) ≈ ${getPowerSeriesApproximation(numTerms, 'sin(x²)')}`;
            errorText = `Integral Value: ∫₀^${parameterValue} sin(x²) dx ≈ ${integralValue.toFixed(6)}`;
            
            xMin = 0;
            xMax = parameterValue;
            break;
            
        case '3': // Differential Equation Solution
            // Solve y' = y using power series
            const exactSolution = x => Math.exp(x);
            
            // Power series solution y = 1 + x + x²/2! + x³/3! + ...
            const seriesSolution = x => {
                let sum = 0;
                for (let n = 0; n < numTerms; n++) {
                    sum += Math.pow(x, n) / factorial(n);
                }
                return sum;
            };
            
            // Generate points
            const exactPoints = generateFunctionPoints(exactSolution, 0, parameterValue * 2);
            const seriesPoints = generateFunctionPoints(seriesSolution, 0, parameterValue * 2);
            
            seriesData = [
                { name: 'Exact Solution (e^x)', points: exactPoints },
                { name: `Series Solution (${numTerms} terms)`, points: seriesPoints }
            ];
            
            descriptionText = `Differential Equation Solution: Solving y' = y, y(0) = 1 using power series`;
            formulaText = `Solution: y(x) = ${getTaylorApproximation(numTerms)}`;
            errorText = `Error at x = ${parameterValue}: |e^${parameterValue} - y(${parameterValue})| ≈ ${Math.abs(exactSolution(parameterValue) - seriesSolution(parameterValue)).toExponential(4)}`;
            
            xMin = 0;
            xMax = parameterValue * 2;
            break;
            
        case '4': // Pendulum Period Analysis
            // Analyze pendulum period using series approximation
            const simpleFormula = angle => 2 * Math.PI * Math.sqrt(1 / 9.8);
            const firstOrderCorrection = angle => 2 * Math.PI * Math.sqrt(1 / 9.8) * (1 + Math.pow(Math.sin(angle/2), 2) / 4);
            const secondOrderCorrection = angle => 2 * Math.PI * Math.sqrt(1 / 9.8) * (1 + Math.pow(Math.sin(angle/2), 2) / 4 + 9 * Math.pow(Math.sin(angle/2), 4) / 64);
            
            // Generate points for different approximations
            const angles = [];
            const simplePoints = [];
            const firstOrderPoints = [];
            const secondOrderPoints = [];
            
            for (let i = 0; i <= 20; i++) {
                const angle = i * Math.PI / 40; // 0 to π/2
                angles.push(angle);
                simplePoints.push({ x: angle, y: simpleFormula(angle) });
                firstOrderPoints.push({ x: angle, y: firstOrderCorrection(angle) });
                secondOrderPoints.push({ x: angle, y: secondOrderCorrection(angle) });
            }
            
            // Select which approximations to show based on numTerms
            seriesData = [{ name: 'Simple Pendulum Formula', points: simplePoints }];
            
            if (numTerms >= 2) {
                seriesData.push({ name: 'First-Order Correction', points: firstOrderPoints });
            }
            
            if (numTerms >= 3) {
                seriesData.push({ name: 'Second-Order Correction', points: secondOrderPoints });
            }
            
            const selectedAngle = parameterValue * Math.PI / 2; // Scale to [0, π/2]
            
            descriptionText = `Pendulum Period Analysis: Effect of amplitude on pendulum period`;
            formulaText = `Period for ${(selectedAngle * 180 / Math.PI).toFixed(1)}° amplitude: T = ${secondOrderCorrection(selectedAngle).toFixed(4)} s`;
            errorText = `Relative increase from simple formula: ${(((secondOrderCorrection(selectedAngle) / simpleFormula(selectedAngle)) - 1) * 100).toFixed(2)}%`;
            
            xMin = 0;
            xMax = Math.PI / 2;
            break;
            
        default:
            // Default to function approximation
            const defaultFunction = x => Math.exp(x);
            const defaultApprox = x => {
                let sum = 0;
                for (let n = 0; n < 3; n++) {
                    sum += Math.pow(x, n) / factorial(n);
                }
                return sum;
            };
            
            seriesData = [
                { name: 'Actual Function (e^x)', points: generateFunctionPoints(defaultFunction, -1, 1) },
                { name: 'Approximation (3 terms)', points: generateFunctionPoints(defaultApprox, -1, 1) }
            ];
            
            descriptionText = 'Function Approximation: Using Taylor polynomials to approximate functions';
            formulaText = 'Formula: e^x ≈ P₃(x) = 1 + x + x²/2 + x³/6';
            errorText = 'Error: |e^x - P₃(x)| ≤ 0.0041 for |x| ≤ 0.5';
            
            xMin = -1;
            xMax = 1;
    }
    
    // Update the visualization
    createLineChart('interactive-application-graph', seriesData, {
        xLabel: applicationType === '4' ? 'Amplitude (radians)' : 'x',
        yLabel: applicationType === '4' ? 'Period (seconds)' : 'y',
        width: document.getElementById('interactive-application-graph').clientWidth
    });
    
    // Update the information display
    if (applicationDescription) {
        applicationDescription.textContent = descriptionText;
    }
    
    if (applicationFormula) {
        applicationFormula.textContent = formulaText;
    }
    
    if (applicationError) {
        applicationError.textContent = errorText;
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

// Helper function to get Taylor approximation text for e^x
function getTaylorApproximation(numTerms) {
    let text = '1';
    for (let i = 1; i < numTerms; i++) {
        if (i === 1) {
            text += ' + x';
        } else {
            text += ` + x^${i}/${i}!`;
        }
    }
    return text;
}

// Helper function to get power series approximation text
function getPowerSeriesApproximation(numTerms, functionType) {
    if (functionType === 'sin(x²)') {
        let text = 'x²';
        for (let i = 1; i < numTerms && i < 5; i++) {
            if (i % 2 === 0) continue; // Skip even terms
            const n = i;
            const sign = n % 2 === 0 ? '+' : '-';
            text += ` ${sign} x^${4*n+2}/${(2*n+1)}!`;
        }
        return text;
    }
    return '';
}

// Helper function to calculate approximation error
function calculateApproximationError(numTerms, range) {
    // For e^x, the error is bounded by e^|x| * |x|^(n+1) / (n+1)!
    const maxExpValue = Math.exp(range);
    return maxExpValue * Math.pow(range, numTerms) / factorial(numTerms);
}

// Helper function to calculate a definite integral using trapezoidal rule
function calculateIntegral(func, a, b, steps = 100) {
    const h = (b - a) / steps;
    let sum = 0.5 * (func(a) + func(b));
    
    for (let i = 1; i < steps; i++) {
        const x = a + i * h;
        sum += func(x);
    }
    
    return sum * h;
}
