sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/ui/core/routing/History", 
    "sap/ui/core/UIComponent", 
    "com/cubiclan/boxconv/model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, History, UIComponent, formatter, JSONModel) {
    "use strict";

    return Controller.extend("com.cubiclan.boxconv.controller.BaseController", {
        formatter: formatter,

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.core.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        setModelData: function(data, modelName) {
            var model = new JSONModel(data);
            model.setSizeLimit(999999);
            this.setModel(model, modelName);
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Method for navigation to specific view
         * @public
         * @param {string} psTarget Parameter containing the string for the target navigation
         * @param {Object.<string, string>} pmParameters? Parameters for navigation
         * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
         */
        navTo: function (psTarget, pmParameters, pbReplace) {
            this.getRouter().navTo(psTarget, pmParameters, pbReplace);
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getRouter().navTo("appHome", {}, true /* no history*/);
            }
        },

        getBaseUrl: function () {
            return "192.168.68.122:8080/Cuberite/api/boxconv";
        }
    });
});
