sap.ui.define([
	"sap/ui/core/Control",
    "sap/ui/core/Icon",
    "sap/m/Label",
    "sap/m/Image"
], function (Control, Icon, Label, Image) {
	"use strict";
	return Control.extend("com.cubiclan.boxconv.control.FileCard", {
		metadata : {
            properties: {
                isDirectory: {type: "boolean", defaultValue: "true"},
                preview: {type: "string"}
            },
            aggregations: {
                icon: {type : "sap.ui.core.Icon", multiple: false},
                label: {type : "sap.m.Label", multiple: false},
                image: {type : "sap.m.Image", multiple: false}
            }
		},
		init : function () {
		},
		renderer : function (oRM, oControl) {

			oRM.openStart("div", oControl);
            oRM.class("fileCard");
            oRM.openEnd();

            oRM.renderControl(oControl.getAggregation("icon"));
            oRM.renderControl(oControl.getAggregation("label"));

            if(!oControl.getProperty("isDirectory")){
                oRM.renderControl(oControl.getAggregation("image"));
            }
            

            oRM.close("div");
		}
	});
});