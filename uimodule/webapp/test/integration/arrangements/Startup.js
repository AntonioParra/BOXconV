sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return Opa5.extend("com.cubiclan.boxconv.test.integration.arrangements.Startup", {
        iStartMyApp: function () {
            this.iStartMyUIComponent({
                componentConfig: {
                    name: "com.cubiclan.boxconv",
                    async: true,
                    manifest: true,
                },
            });
        },
    });
});
