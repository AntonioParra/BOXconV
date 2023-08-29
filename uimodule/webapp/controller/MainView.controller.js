sap.ui.define(
    [
        "./BaseController",
        "/sap/ui/model/json/JSONModel",
        "sap/ui/model/Sorter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Sorter) {
        "use strict";

        return Controller.extend("com.cubiclan.boxconv.controller.MainView", {
            onInit: function () {
                this.getView().setBusyIndicatorDelay(0);
                var router = this.getRouter();
                router.getRoute("RouteMainView").attachMatched(function(oEvent) {
                    this.onPath("/");
                }, this);
                router.getRoute("RouteMainViewWithBase64Path").attachMatched(function(oEvent) {
                    this.onPath(atob(oEvent.getParameter("arguments").base64Path));
                }, this);
            },

            onPath: function(path) {
                this.load(path);
            },

            load: function(path) {
                this.getView().setBusy(true);
                this.setModelData();

                var url = "http://" + this.getBaseUrl() + "/listDirectory" + "?Directory=" + path;
                fetch(url).then(function(response){
                    return response.json();
                }).then(function(data) {
                    this.getView().setBusy(false);
                    this.setModelData(data);
                }.bind(this));

                this.setListMode();
            },

            setListMode: function() {
                var model = this.getView().getModel("itemsMode");
                if(!model) {
                    this.onPressListMode();
                }
            },

            onPressListMode: function() {
                this.setModelData({
                    mode: "list"
                }, "itemsMode");
            },

            onPressGridMode: function() {
                this.setModelData({
                    mode: "grid"
                }, "itemsMode");
            },

            onNavParent: function() {
                var object = this.getModel().getData();
                this.navToDirectory(object.DATA.parent);
            },

            toggleSort: function(evt) {
                var table = this.getView().byId("listTable");
                var binding = table.getBindingInfo("items").binding;

                if(evt && evt.getParameter("pressed")) {
                    binding.sort(new Sorter({path: "label", comparator: this.alphabeticalComparator.bind(this)}));
                } else {
                    binding.sort(new Sorter({path: "", comparator: this.typeComparator.bind(this)}));
                }
            },

            alphabeticalComparator: function(a, b) {
                if(a < b) {
                    return -1;
                } else if(a > b) {
                    return 1;
                } else {
                    return 0;
                }
            },

            typeComparator: function(a, b) {
                if(a.isDirectory && !b.isDirectory) {
                    return -1;
                } else if(!a.isDirectory && b.isDirectory) {
                    return 1;
                } else {
                    return this.alphabeticalComparator(a, b);
                }
            },

            onBreadcrumbs: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();
                this.navToDirectory(object.path);
            },

            onDirectorySelected: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();
                this.navToDirectory(object.path);
            },

            onDownloadSelected: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();
                this.download(object.path);
            },

            onStreamSelected: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();
                this.stream(object.label, object.path);
            },

            navToDirectory: function(path) {
                if(!path) {
                    this.navTo("RouteMainView");
                } else {
                    this.navTo("RouteMainViewWithBase64Path", {base64Path: btoa(path)});
                }
            },

            download: function(path) {
                var url = "http://" + this.getBaseUrl() + "/download" + "?FileName=" + path;
                var link = document.createElement("a");
                link.setAttribute('download', '');
                link.href = url;
                document.body.appendChild(link);
                link.click();
                link.remove();
            },

            formatterPreviewUrl: function(path) {
                return "http://" + this.getBaseUrl() + "/preview" + "?FileName=" + path;
            },

            stream: function(title, path) {
                var url = "http://" + this.getBaseUrl() + "/stream" + "?FileName=" + path;
                this.setModelData({
                    title: title,
                    url: url
                }, "stream");
                this.openVideoPlayerPopup();
            },

            getVideoPlayerPopup: function() {
                if(!this._videoPlayerPopup) {
                    this._videoPlayerPopup = sap.ui.xmlfragment("com.cubiclan.boxconv.fragment.VideoPlayer", this);
                    this.getView().addDependent(this._videoPlayerPopup);
                }
                return this._videoPlayerPopup;
            },

            openVideoPlayerPopup: function() {
                var popup = this.getVideoPlayerPopup();
                popup.open();
            },

            closeVideoPlayerPopup: function() {
                this._videoPlayerPopup.destroy();
                this._videoPlayerPopup = null;
            }

        });
    },
);
