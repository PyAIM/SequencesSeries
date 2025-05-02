// Ensure MathJax is properly initialized on all pages
document.addEventListener('DOMContentLoaded', function() {
    // Function to initialize MathJax
    function initMathJax() {
        if (typeof MathJax !== 'undefined') {
            if (MathJax.version && MathJax.version[0] === '3') {
                // MathJax v3
                MathJax.typeset();
            } else if (MathJax.Hub) {
                // MathJax v2 fallback
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            }
        } else {
            // If MathJax isn't loaded yet, try again after a delay
            setTimeout(initMathJax, 500);
        }
    }
    
    // Initialize MathJax
    initMathJax();
});
