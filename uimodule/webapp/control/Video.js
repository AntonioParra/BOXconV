sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	return Control.extend("com.cubiclan.boxconv.control.Video", {
		metadata : {
            properties: {
                url: {type: "string", defaultValue: ""},
                controls: {type: "boolean", defaultValue: true},
                autoplay: {type: "boolean", defaultValue: true}
            }
		},
		init : function () {
		},
		renderer : function (oRM, oControl) {
			oRM.openStart("div", oControl);
            oRM.class("videoPlayer");
            oRM.openEnd();

            oRM.openStart("video");
            oRM.attr("src", oControl.getProperty("url"));
            if(oControl.getProperty("controls")) {
                oRM.attr("controls", "");
            }
            if(oControl.getProperty("autoplay")) {
                oRM.attr("autoplay", "");
            }
			oRM.openEnd();
            oRM.close("video");

            oRM.close("div");
		}
	});
});