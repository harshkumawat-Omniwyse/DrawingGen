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
            var tb = document.querySelector("#" + id + "_echo .app-echo-toolbar");
            if (tb) tb.style.display = "none";
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


// Remove trial watermark
(function () {
    function purgeWatermark() {
        var selectors = ['.app-acc-footer', '#PageFooterBar', 'footer', 'footer small', '.app-copyright'];
        selectors.forEach(function (sel) {
            var elements = document.querySelectorAll(sel);
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                el.innerHTML = '';
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', purgeWatermark);
    } else {
        purgeWatermark();
    }
    document.addEventListener('click', function () {
        setTimeout(purgeWatermark, 10);
        setTimeout(purgeWatermark, 100);
        setTimeout(purgeWatermark, 300);
    });
    if (window.jQuery) {
        jQuery(document).on('pageready.app pageinit.app panelopen.app', function () {
            purgeWatermark();
            setTimeout(purgeWatermark, 100);
        });
    }
})();


// Force top navbar SPX blue styling
(function () {
  function injectNavbarStyle() {
    if (!document.getElementById('spx-navbar-force-style')) {
      var st = document.createElement('style');
      st.id = 'spx-navbar-force-style';
      st.innerHTML = `
/* Force Top Navbar solid SPX blue #0089ce */
#app-bar-toolbar,
.app-bar-toolbar,
.ui-header.app-bar-toolbar,
.ui-header-fixed.app-bar-toolbar,
div#app-bar-toolbar.ui-bar-a,
div#app-bar-toolbar {
  background-color: #0089ce !important;
  background: #0089ce !important;
  background-image: none !important;
  border-color: #0089ce !important;
}
#app-bar-toolbar .app-logo,
.app-bar-toolbar .app-logo,
#app-bar-toolbar .ui-title,
.app-bar-toolbar .ui-title,
#app-bar-toolbar #app-btn-menu,
.app-bar-toolbar #app-btn-menu,
#app-bar-toolbar .app-btn,
.app-bar-toolbar .app-btn,
#app-bar-toolbar .app-icon,
.app-bar-toolbar .app-icon,
#app-bar-toolbar .app-back-text,
.app-bar-toolbar .app-back-text,
#app-bar-toolbar .app-bar-heading {
  color: #ffffff !important;
  fill: #ffffff !important;
  opacity: 1 !important;
}
#app-bar-toolbar .app-menu-strip ul li a,
#app-bar-toolbar .app-menu-strip ul li .ui-btn,
#app-bar-toolbar .app-menu-strip .ui-btn:not(.ui-btn-active),
.app-bar-toolbar .app-menu-strip .ui-btn:not(.ui-btn-active),
body:not(.app-hosted) .app-bar-toolbar .app-menu-strip .ui-btn:not(.ui-btn-active),
body:not(.app-hosted) .ui-bar-a .app-menu-strip .ui-btn:not(.ui-btn-active) {
  color: #ffffff !important;
  opacity: 1 !important;
}
#app-bar-toolbar .app-menu-strip .ui-btn.app-selected,
#app-bar-toolbar .app-menu-strip .ui-btn.app-selected:not(.ui-btn-active),
#app-bar-toolbar .app-menu-strip .ui-btn.ui-btn-active,
.app-bar-toolbar .app-menu-strip .ui-btn.app-selected,
body:not(.app-hosted) .ui-bar-a .app-menu-strip .ui-btn.app-selected:not(.ui-btn-active) {
  background-color: rgba(0, 0, 0, 0.25) !important;
  color: #ffffff !important;
}
#app-bar-toolbar .app-menu-strip .ui-btn:hover:not(.ui-btn-active) {
  background-color: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
}
/* Watermark suppression */
.app-acc-footer, .app-copyright, #PageFooterBar, footer, footer small {
  display: none !important;
  visibility: hidden !important;
}
/* Hide duplicate banner on Report Issue */
.pages_report_issue_html .app-page-header,
#pages-report-issue .app-page-header,
.ui-page:has(.ri-root-container) .app-page-header {
  display: none !important;
}
`;
      (document.head || document.documentElement).appendChild(st);
    }
  }

  function applyNavbarDirect() {
    injectNavbarStyle();
    var tb = document.getElementById('app-bar-toolbar') || document.querySelector('.app-bar-toolbar');
    if (tb) {
      tb.style.setProperty('background-color', '#0089ce', 'important');
      tb.style.setProperty('background', '#0089ce', 'important');
      tb.style.setProperty('border-color', '#0089ce', 'important');
      var items = tb.querySelectorAll('.app-menu-strip .ui-btn, .app-logo, .app-icon, .ui-title, #app-btn-menu, .app-btn, .app-back-text');
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.classList.contains('app-selected') || el.classList.contains('ui-btn-active')) {
          el.style.setProperty('background-color', 'rgba(0,0,0,0.25)', 'important');
        }
        el.style.setProperty('color', '#ffffff', 'important');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNavbarDirect);
  } else {
    applyNavbarDirect();
  }
  window.addEventListener('load', applyNavbarDirect);
  setInterval(applyNavbarDirect, 150);

  if (window.jQuery) {
    jQuery(document).on('pageready.app pageinit.app panelopen.app', function () {
      applyNavbarDirect();
      setTimeout(applyNavbarDirect, 50);
      setTimeout(applyNavbarDirect, 200);
      setTimeout(applyNavbarDirect, 500);
    });
  }
})();
