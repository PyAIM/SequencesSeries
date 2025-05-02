// JavaScript for the Sequences page interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive sequence visualizer if it exists on the page
    initSequenceVisualizer();
});

function initSequenceVisualizer() {
    const visualizerContainer = document.getElementById('interactive-sequence-graph');
    if (!visualizerContainer) return;
    
    const sequenceSelect = document.getElementById('sequence-select');
    const termsSlider = document.getElementById('terms-slider');
    const termsValue = document.getElementById('terms-value');
    
    // Update the terms value display when the slider changes
    if (termsSlider && termsValue) {
        termsSlider.addEventListener('input', function() {
            termsValue.textContent = this.value;
            updateSequenceVisualization();
        });
    }
    
    // Update the visualization when the sequence type changes
    if (sequenceSelect) {
        sequenceSelect.addEventListener('change', function() {
            updateSequenceVisualization();
        });
    }
    
    // Initial visualization
    updateSequenceVisualization();
}

function updateSequenceVisualization() {
    const sequenceSelect = document.getElementById('sequence-select');
    const termsSlider = document.getElementById('terms-slider');
    const sequenceFormula = document.getElementById('sequence-formula');
    const sequenceConvergence = document.getElementById('sequence-behavior');
    const sequenceTerms = document.getElementById('sequence-first-terms');

    if (!sequenceSelect || !termsSlider) return;

    const sequenceType = sequenceSelect.value;
    const numTerms = parseInt(termsSlider.value);

    // Generate sequence data based on the selected type
    let sequenceFunction;
    let convergenceValue = '';
    let formulaText = '';

    // Get the selected option text to ensure correct display
    const selectedOption = sequenceSelect.options[sequenceSelect.selectedIndex].text;

    switch (sequenceType) {
        case '1': // 1/n
            sequenceFunction = n => 1 / (n + 1);
            formulaText = selectedOption;
            convergenceValue = 'Converges to 0';
            break;
        case '2': // n/(n+1)
            sequenceFunction = n => (n + 1) / (n + 2);
            formulaText = selectedOption;
            convergenceValue = 'Converges to 1';
            break;
        case '3': // (n+1)/n^2
            sequenceFunction = n => (n + 2) / Math.pow(n + 1, 2);
            formulaText = selectedOption;
            convergenceValue = 'Converges to 0';
            break;
        case '4': // (-1)^n
            sequenceFunction = n => Math.pow(-1, n+1);
            formulaText = selectedOption;
            convergenceValue = 'Oscillates between -1 and 1';
            break;
        case '5': // n
            sequenceFunction = n => n + 1;
            formulaText = selectedOption;
            convergenceValue = 'Diverges to ∞';
            break;
        case '6': // 1 + 1/n
            sequenceFunction = n => 1 + 1 / (n + 1);
            formulaText = selectedOption;
            convergenceValue = 'Converges to 1';
            break;
        default:
            sequenceFunction = n => 1 / (n + 1);
            formulaText = selectedOption;
            convergenceValue = 'Converges to 0';
    }

    // Generate sequence points
    const points = [];
    for (let i = 0; i < numTerms; i++) {
        let yValue = sequenceFunction(i);
        if (yValue !== undefined && !isNaN(yValue)) {
            points.push({ x: i + 1, y: yValue });
        }
    }

    // Generate first 5 terms for display (a_1 to a_5, using index 0 to 4)
    let sequenceData = [];
    for (let i = 0; i < 5; i++) {
        let termValue = sequenceFunction(i);
        if (termValue !== undefined && !isNaN(termValue)) {
            let formattedTerm = termValue.toFixed(3).replace(/\.0+$/, '');
            sequenceData.push(formattedTerm === '' ? '0' : formattedTerm);
        } else {
            sequenceData.push('undef');
        }
    }

    // Update the visualization
    createLineChart('interactive-sequence-graph', [
        { name: 'Sequence', points: points, color: '#3498db', drawLine: false }
    ], {
        xLabel: 'n',
        yLabel: 'a_n',
        width: document.getElementById('interactive-sequence-graph').clientWidth
    });

    // Update the information display
    if (sequenceFormula) {
        sequenceFormula.textContent = `Formula: ${formulaText}`;
    } else {
        console.error('Element with id "sequence-formula" not found.');
    }

    if (sequenceConvergence) {
        sequenceConvergence.textContent = `Behavior: ${convergenceValue}`;
    } else {
        console.error('Element with id "sequence-convergence" not found.');
    }

    if (sequenceTerms) {
        sequenceTerms.textContent = `First 5 terms: ${sequenceData.join(', ')}`;
    } else {
        console.error('Element with id "sequence-terms" not found.');
    }
}
