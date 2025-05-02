// JavaScript for the Series page interactive elements

document.addEventListener('DOMContentLoaded', function() {
    initSeriesVisualizer();
});

function initSeriesVisualizer() {
    const seriesSelect = document.getElementById('series-select');
    const termsSlider = document.getElementById('terms-slider');
    const termsValue = document.getElementById('terms-value');
    const seriesFormula = document.getElementById('series-formula');
    const seriesBehavior = document.getElementById('series-behavior');
    const seriesPartialSums = document.getElementById('series-partial-sums');

    if (!seriesSelect || !termsSlider || !termsValue || !seriesFormula || !seriesBehavior || !seriesPartialSums) {
        console.error('Missing required elements for series visualization.');
        return;
    }

    const seriesData = {
        '1': {
            formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n}',
            behavior: 'Diverges',
            generator: n => 1 / n
        },
        '2': {
            formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}',
            behavior: '\\frac{\\pi^2}{6}',
            generator: n => 1 / (n * n)
        },
        '3': {
            formula: '\\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{1}{n}',
            behavior: '\\ln(2)',
            generator: n => ((-1) ** (n + 1)) / n
        },
        '4': {
            formula: '\\sum_{n=0}^{\\infty} \\left(\\frac{1}{2}\\right)^n',
            behavior: '2',
            generator: n => (1 / 2) ** n
        },
        '5': {
            formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)}',
            behavior: '1',
            generator: n => 1 / (n * (n + 1))
        }
    };

    function updateSeriesVisualization() {
        const selectedSeries = seriesSelect.value;
        const numTerms = parseInt(termsSlider.value);

        if (!seriesData[selectedSeries]) {
            console.error('Invalid series selected.');
            return;
        }

        const { formula, behavior, generator } = seriesData[selectedSeries];

        // Update series information
        seriesFormula.innerHTML = `Formula: $$${formula}$$`;

        // Update series behavior
        if (selectedSeries === '1') {
            seriesBehavior.innerHTML = `Behavior: $$${behavior}$$`;
        }
        else {
            seriesBehavior.innerHTML = `Behavior: Converges to $$${behavior}$$`;
        }
               
        
        // Generate partial sums
        const partialSums = [];
        let sum = 0;
        for (let n = 1; n <= numTerms; n++) {
            sum += generator(n);
            partialSums.push(sum);
        }

        const partialSumsText = partialSums.slice(0, 5).map((s, i) => `S${i + 1} = ${s.toFixed(3)}`).join(', ');
        seriesPartialSums.textContent = `Partial sums: ${partialSumsText}`;

        // Generate points for the graph
        const points = partialSums.map((s, i) => ({ x: i + 1, y: s }));

        createLineChart('interactive-series-graph', [
            { name: 'Partial Sums', points: points }
        ], {
            xLabel: 'n',
            yLabel: 'S_n'
        });

        // Re-render MathJax for LaTeX
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise();
        }
    }

    // Event listeners
    termsSlider.addEventListener('input', function () {
        termsValue.textContent = this.value;
        updateSeriesVisualization();
    });

    seriesSelect.addEventListener('change', function () {
        updateSeriesVisualization();
    });

    // Initial visualization
    updateSeriesVisualization();
}
