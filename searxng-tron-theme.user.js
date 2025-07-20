// ==UserScript==
// @name         SearXNG Tron Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply Tron-style dark theme to SearXNG
// @author       You
// @match        https://search.theronlindsay.dev/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Create and inject custom CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Tron-style SearXNG Theme */
        :root {
            --tron-primary: #00D2FF;
            --tron-secondary: #00FF88;
            --tron-dark: #0A0A0A;
            --tron-darker: #050505;
            --tron-accent: #FF0080;
            --tron-text: #E0E0E0;
            --tron-border: #333;
        }

        body {
            background: linear-gradient(135deg, var(--tron-dark) 0%, var(--tron-darker) 100%) !important;
            color: var(--tron-text) !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        .navbar, nav {
            background: rgba(10, 10, 10, 0.95) !important;
            border-bottom: 1px solid var(--tron-primary) !important;
            backdrop-filter: blur(10px);
        }

        #search, #q {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 2px solid var(--tron-primary) !important;
            border-radius: 25px !important;
            color: var(--tron-text) !important;
            padding: 12px 20px !important;
            transition: all 0.3s ease !important;
        }

        #search:focus, #q:focus {
            outline: none !important;
            border-color: var(--tron-secondary) !important;
            box-shadow: 0 0 20px rgba(0, 210, 255, 0.3) !important;
        }

        button[type="submit"], .btn-primary {
            background: linear-gradient(45deg, var(--tron-primary), var(--tron-secondary)) !important;
            border: none !important;
            border-radius: 20px !important;
            color: white !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
        }

        button[type="submit"]:hover, .btn-primary:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px rgba(0, 210, 255, 0.4) !important;
        }

        .result, .search_result {
            background: rgba(255, 255, 255, 0.03) !important;
            border: 1px solid var(--tron-border) !important;
            border-radius: 10px !important;
            margin-bottom: 20px !important;
            padding: 20px !important;
            transition: all 0.3s ease !important;
        }

        .result:hover, .search_result:hover {
            border-color: var(--tron-primary) !important;
            box-shadow: 0 5px 20px rgba(0, 210, 255, 0.1) !important;
            transform: translateY(-2px) !important;
        }

        .result h3 a, .search_result h3 a {
            color: var(--tron-primary) !important;
            text-decoration: none !important;
            font-weight: 600 !important;
        }

        .result h3 a:hover, .search_result h3 a:hover {
            color: var(--tron-secondary) !important;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5) !important;
        }

        .url {
            color: var(--tron-secondary) !important;
            font-size: 0.9em !important;
        }

        .content {
            color: var(--tron-text) !important;
            line-height: 1.6 !important;
            margin-top: 8px !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--tron-dark);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--tron-primary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--tron-secondary);
        }
    `;
    
    document.head.appendChild(style);
    
    // Add Tron-style glow effect to search input
    const searchInput = document.querySelector('#q, #search');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 30px rgba(0, 210, 255, 0.5)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    }
})();
