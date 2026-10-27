(function () {
    function inject(src) {
        if (document.querySelector("script[data-drawinggen-charts]"))
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
        if (window.__drawingGenChartsPackages) {
            finish();
            return;
        }
        window.__drawingGenChartsPackages = true;
        google.charts.load("current", {
            packages: ["corechart", "bar", "line"],
            callback: finish
        });
    }

    function finish() {
        if (window.$app && $app.touch)
            $app.touch._chartsAPI = true;
        if (window.jQuery)
            jQuery(window).trigger("charts.init.app");
        showHomeCharts();
    }

    function chartsReady() {
        return !!(window.jQuery && window.$app && $app.touch &&
            window.google && google.visualization);
    }

    function showHomeCharts() {
        if (!chartsReady())
            return false;
        if (window.$app && $app.touch)
            $app.touch._chartsAPI = true;
        jQuery(window).trigger("charts.init.app");

        var shown = false;
        ["view1", "view2"].forEach(function (id) {
            var dv = $app.findDataView(id);
            if (!dv)
                return;
            var echo = document.querySelector("#" + id + "_echo .app-echo-inner");
            if (!echo)
                return;
            if (echo.querySelector(".app-chart-inner svg, .app-chart-inner [aria-label]")) {
                shown = true;
                return;
            }

            try {
                var ext = dv.extension && dv.extension();
                if (ext && typeof ext.viewStyle === "function" && ext.viewStyle() !== "Charts")
                    ext.viewStyle("Charts");
            } catch (e) { }

            try {
                var container = jQuery("#" + id + "_echo").closest(".app-wrapper");
                if (!container.length)
                    container = jQuery(echo);
                $app.touch.presenter("show", {
                    name: "Charts",
                    id: id,
                    container: container
                });
            } catch (e) { }

            jQuery(echo).find(".app-echo-empty").remove();
            if (echo.querySelector(".app-chart-inner, svg"))
                shown = true;
        });
        return shown;
    }

    function kick() {
        if (window.google && google.charts)
            loadPackages();
        else
            inject("/js/daf/charts-loader.js");

        var n = 0;
        var timer = setInterval(function () {
            if (showHomeCharts() || ++n > 80)
                clearInterval(timer);
        }, 250);

        if (window.jQuery) {
            jQuery(document).on("pageready.app pageinit.app", function () {
                setTimeout(showHomeCharts, 100);
                setTimeout(showHomeCharts, 500);
                setTimeout(showHomeCharts, 1500);
            });
        }
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", kick);
    else
        kick();
})();
