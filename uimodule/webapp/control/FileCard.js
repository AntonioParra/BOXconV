sap.ui.define([
	"sap/ui/core/Control",
    "sap/ui/core/Icon",
    "sap/m/Label",
    "sap/m/Image",
    "sap/m/Button",
    "sap/m/Toolbar",
    "sap/m/ToolbarSpacer",
    "sap/m/MenuButton",
    "sap/m/Menu"
], function (Control, Icon, Label, Image, Button, Toolbar, ToolbarSpacer, MenuButton, Menu) {
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
                image: {type : "sap.m.Image", multiple: false},
                actions: {type : "sap.m.MenuItem", multiple: true},
                _toolbar: {type : "sap.m.IBar", multiple: false}
            },
            events : {
				press : {}
			}
		},
		init : function () {
            var toolbar = new Toolbar();
            this.setAggregation("_toolbar", toolbar);
		},
        onAfterRendering : function() {
            if (Control.prototype.onAfterRendering) {
                Control.prototype.onAfterRendering.apply(this, arguments);
            }
            this.$().dblclick(this.firePress.bind(this));
        },
		renderer : function (oRM, oControl) {
            var toolbar = oControl.getAggregation("_toolbar");
            if(toolbar.getContent().length === 0) {
                toolbar.addContent(oControl.getAggregation("icon"));
                toolbar.addContent(oControl.getAggregation("label"));
                toolbar.addContent(new ToolbarSpacer());

                var actions = oControl.getAggregation("actions");
                if(actions && actions.length) {
                    toolbar.addContent(new Button({
                        icon: "sap-icon://menu",
                        press: function(evt) {
                            var menu = new Menu({
                                items: actions.map(action => action.clone())
                            });
                            evt.getSource().addDependent(menu);
                            menu.openBy(evt.getSource());
                        }
                    }));
                }
            }

			oRM.openStart("div", oControl);
            oRM.class("fileCard");

            oRM.openEnd();

            oRM.renderControl(toolbar);
            oRM.renderControl(oControl.getAggregation("image"));

            oRM.close("div");
		}
	});
});