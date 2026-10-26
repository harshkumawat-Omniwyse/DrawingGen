(function () {
    function inject(src) {
        if (document.querySelector('script[data-drawinggen-charts]'))
            return;
        var script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.setAttribute("data-drawinggen-charts", "true");
        script.onload = loadPackages;
        (document.head || document.documentElement).appendChild(script);
    }

    function loadPackages() {
        if (!(window.google && google.charts))
            return;
        if (window.__drawingGenChartsPackages)
            return;
        window.__drawingGenChartsPackages = true;
        google.charts.load("current", {
            packages: ["corechart", "bar", "line"],
            callback: function () {
                if (window.$app && $app.touch)
                    $app.touch._chartsAPI = true;
                if (window.jQuery)
                    jQuery(window).trigger("charts.init.app");
            }
        });
    }

    if (window.google && google.charts)
        loadPackages();
    else
        inject("/js/daf/charts-loader.js");
})();
