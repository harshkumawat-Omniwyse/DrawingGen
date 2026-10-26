(function () {
    var WORKFLOW = [
        "Request Submitted",
        "Caller",
        "AutoCAD",
        "SAP Processing",
        "File Transfer",
        "DWG Download Email"
    ];

    var SUB_STATUS_STEP = {
        "Request Submitted": 0,
        "Caller": 1,
        "AutoCAD Processing": 2,
        "AutoCAD": 2,
        "SAP": 3,
        "SAP Processing": 3,
        "File Transfer": 4,
        "DWG Download Email": 5
    };

    function isRequestQueuePage() {
        return /tbl-dwggen-requestqueue/i.test(location.pathname);
    }

    function workflowIndex(subStatus) {
        if (!subStatus)
            return 0;
        if (SUB_STATUS_STEP.hasOwnProperty(subStatus))
            return SUB_STATUS_STEP[subStatus];
        var i = WORKFLOW.indexOf(subStatus);
        return i >= 0 ? i : 0;
    }

    function injectAssets() {
        if (!document.querySelector("link[data-drawinggen-request-queue-css]")) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/css/request-queue-detail.css";
            link.setAttribute("data-drawinggen-request-queue-css", "true");
            (document.head || document.documentElement).appendChild(link);
        }
    }

    function buildWizardHtml(activeIndex) {
        var items = [];
        for (var i = 0; i < WORKFLOW.length; i++) {
            var cls = "rq-future";
            if (i < activeIndex)
                cls = "rq-complete";
            else if (i === activeIndex)
                cls = "rq-active";
            items.push('<li class="' + cls + '">' + WORKFLOW[i] + "</li>");
        }
        return '<ul class="rq-wizard" role="navigation" aria-label="Request progress">' + items.join("") + "</ul>";
    }

    function readField(page, name) {
        var input = page.find('[data-field="' + name + '"] [data-control="field"], [data-field="' + name + '"] .app-field-value, [data-field="' + name + '"] input, [data-field="' + name + '"] textarea');
        if (!input.length)
            return "";
        var el = input.first();
        if (el.is("input, textarea, select"))
            return (el.val() || "").toString().trim();
        return (el.text() || "").trim();
    }

    function disableReadingPane(dv) {
        var touch = window.$app && $app.touch;
        if (!touch || !dv)
            return;
        try {
            var info = touch.pageInfo && touch.pageInfo(dv);
            if (info && info.pageProp)
                info.pageProp("readingPane", false);
        } catch (e) { }
        if (touch.readingPane)
            touch.readingPane(dv, false);
        jQuery(".app-reading-pane-bkg,.app-reading-pane-splitter").hide();
        jQuery(".ui-page").removeClass("app-reading-pane-master");
    }

    function configureGrid(dv) {
        if (!dv || dv.get_controllerName() !== "TblDwggenRequestqueue")
            return;
        if (dv.set_showModalForms)
            dv.set_showModalForms(true);
        if (dv.set_showInSummary)
            dv.set_showInSummary(false);
        disableReadingPane(dv);
    }

    function openDetailModal(dv) {
        if (!dv || dv.get_controllerName() !== "TblDwggenRequestqueue")
            return;
        if (dv.get_view() !== "grid1")
            return;
        if (dv.get_isModal && dv.get_isModal())
            return;

        disableReadingPane(dv);

        var action = { commandName: "Select", commandArgument: "requestDetailForm" };
        if (dv._showModal)
            dv._showModal(action);
        else
            dv.executeAction(action);
    }

    function styleCloseButton(page) {
        page.find('[data-action-path="cancel"], [data-action-path="Cancel"]').filter(function () {
            return jQuery(this).closest('[data-view="requestDetailForm"]').length;
        }).each(function () {
            var btn = jQuery(this);
            if (!btn.data("rq-close-styled")) {
                btn.data("rq-close-styled", true);
                btn.addClass("rq-close-btn");
                var label = btn.find(".app-text, .ui-btn-text").first();
                if (label.length)
                    label.text("CLOSE");
            }
        });
    }

    function enhanceDetailModal(page) {
        if (!page || !page.length)
            return;
        if (!page.find('[data-view="requestDetailForm"]').length)
            return;

        page.addClass("request-queue-detail");
        page.removeClass("app-reading-pane-detail");

        var requestId = readField(page, "RequestID");
        var subStatus = readField(page, "SubStatusText");
        var heading = page.find(".app-bar-heading, .app-bar h1").first();

        if (requestId && heading.length) {
            heading.html(
                '<span class="rq-modal-title"><span class="rq-label">REQUEST</span><span class="rq-id">' +
                requestId +
                "</span></span>"
            );
        }

        var host = page.find('[data-view="requestDetailForm"] [data-layout="form"]').first();
        if (!host.length)
            host = page.find('[data-layout="form"]').first();
        if (!host.length)
            host = page.find(".app-form").first();
        if (!host.length)
            return;

        var wizard = host.children(".rq-wizard");
        var html = buildWizardHtml(workflowIndex(subStatus));
        if (!wizard.length)
            host.prepend(html);
        else
            wizard.replaceWith(html);

        styleCloseButton(page);
    }

    function scheduleEnhance(page) {
        if (!page || !page.length)
            return;
        enhanceDetailModal(page);
        setTimeout(function () { enhanceDetailModal(page); }, 100);
        setTimeout(function () { enhanceDetailModal(page); }, 400);
    }

    function init() {
        if (!isRequestQueuePage())
            return;

        injectAssets();

        var $ = window.jQuery;
        var touch = window.$app && $app.touch;
        if (!$ || !touch)
            return;

        touch.whenPageShown(function (page) {
            scheduleEnhance(page);
        });

        $(document).on("pageready.app", function () {
            setTimeout(function () {
                var dv = window.$app.findDataView("view1");
                configureGrid(dv);
                scheduleEnhance(touch.activePage());
            }, 0);
        });

        $(document).on("dataitemselect.dataview.app", function (e) {
            var dv = e.dataView;
            if (!dv || dv.get_controllerName() !== "TblDwggenRequestqueue")
                return;
            if (dv.get_view() !== "grid1")
                return;
            configureGrid(dv);
            setTimeout(function () {
                openDetailModal(dv);
            }, 0);
        });
    }

    function boot() {
        if (!window.jQuery) {
            setTimeout(boot, 50);
            return;
        }
        init();
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", boot);
    else
        boot();
})();
