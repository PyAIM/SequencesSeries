// Main JavaScript file for the Calculus Explorer website

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Solution toggle for exercises
    const solutionButtons = document.querySelectorAll('.toggle-solution');
    
    solutionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const solution = this.nextElementSibling;
            if (solution.style.display === 'none' || solution.style.display === '') {
                solution.style.display = 'block';
                this.textContent = 'Hide Solution';
            } else {
                solution.style.display = 'none';
                this.textContent = 'Show Solution';
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize MathJax if it's loaded (MathJax v3 configuration)
    if (typeof MathJax !== 'undefined') {
        if (MathJax.version && MathJax.version[0] === '3') {
            // MathJax v3
            MathJax.typeset();
        } else if (MathJax.Hub) {
            // MathJax v2 fallback
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    }
});

// Function to create a simple line chart
function createLineChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    if (!data || data.length === 0) {
        console.error('No data provided for the chart.');
        return;
    }

    // Clear previous content
    container.innerHTML = '';

    // Set default options
    const defaultOptions = {
        width: container.clientWidth,
        height: 400,
        marginTop: 20,
        marginRight: 30,
        marginBottom: 50,
        marginLeft: 60,
        xLabel: 'x',
        yLabel: 'y',
        pointRadius: 4
    };

    const chartOptions = { ...defaultOptions, ...options };

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', chartOptions.width);
    svg.setAttribute('height', chartOptions.height);
    svg.style.overflow = 'visible';
    container.appendChild(svg);

    // Calculate chart dimensions
    const chartWidth = chartOptions.width - chartOptions.marginLeft - chartOptions.marginRight;
    const chartHeight = chartOptions.height - chartOptions.marginTop - chartOptions.marginBottom;

    // Find min and max values for x and y
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;

    data.forEach(series => {
        series.points.forEach(point => {
            if (point.x < xMin) xMin = point.x;
            if (point.x > xMax) xMax = point.x;
            if (point.y < yMin) yMin = point.y;
            if (point.y > yMax) yMax = point.y;
        });
    });

    // Add some padding to y-axis
    const yPadding = (yMax - yMin) * 0.1;
    yMin -= yPadding;
    yMax += yPadding;

    // Create scales
    const xScale = value => chartOptions.marginLeft + (value - xMin) / (xMax - xMin) * chartWidth;
    const yScale = value => chartOptions.marginTop + chartHeight - (value - yMin) / (yMax - yMin) * chartHeight;

    // Draw x-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', chartOptions.marginLeft);
    xAxis.setAttribute('y1', yScale(0));
    xAxis.setAttribute('x2', chartOptions.marginLeft + chartWidth);
    xAxis.setAttribute('y2', yScale(0));
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', 1);
    svg.appendChild(xAxis);

    // Draw y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', xScale(0));
    yAxis.setAttribute('y1', chartOptions.marginTop);
    yAxis.setAttribute('x2', xScale(0));
    yAxis.setAttribute('y2', chartOptions.marginTop + chartHeight);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', 1);
    svg.appendChild(yAxis);

    // Draw data lines
    data.forEach((series) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = series.points.map((point, i) => {
            const x = xScale(point.x);
            const y = yScale(point.y);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', series.color || '#000'); // Use the color property or default to black
        path.setAttribute('stroke-width', 2);
        svg.appendChild(path);
    });

    // Draw axis labels
    const xLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabelElement.setAttribute('x', chartOptions.marginLeft + chartWidth / 2);
    xLabelElement.setAttribute('y', chartOptions.marginTop + chartHeight + 40);
    xLabelElement.setAttribute('text-anchor', 'middle');
    xLabelElement.setAttribute('font-size', '14px');
    xLabelElement.textContent = chartOptions.xLabel;
    svg.appendChild(xLabelElement);

    const yLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabelElement.setAttribute('x', chartOptions.marginLeft - 40);
    yLabelElement.setAttribute('y', chartOptions.marginTop + chartHeight / 2);
    yLabelElement.setAttribute('text-anchor', 'middle');
    yLabelElement.setAttribute('font-size', '14px');
    yLabelElement.setAttribute('transform', `rotate(-90, ${chartOptions.marginLeft - 40}, ${chartOptions.marginTop + chartHeight / 2})`);
    yLabelElement.textContent = chartOptions.yLabel;
    svg.appendChild(yLabelElement);
}

// Function to generate points for a function
function generateFunctionPoints(func, xMin, xMax, numPoints = 100) {
    const points = [];
    const step = (xMax - xMin) / (numPoints - 1);
    
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * step;
        const y = func(x);
        if (!isNaN(y) && isFinite(y)) {
            points.push({ x, y });
        }
    }
    
    return points;
}
