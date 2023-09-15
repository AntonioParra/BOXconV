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
                this.getProgressModel();
            },

            onPath: function(path) {
                this.load(path);
            },

            load: function(path) {
                this.getView().setBusy(true);
                this.setModelData();

                var url = this.getBaseUrl() + "/listDirectory" + "?Directory=" + path;
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
                this.download(object.path, object.nombre);
            },

            onStreamSelected: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();
                this.stream(object.label, object.path);
            },

            onUnknownSelected: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();

                this.setModelData({
                    object: object
                }, "file");
                this.openDownloadPopup();
            },

            onItemPress: function(evt) {
                var object = evt.getSource().getBindingContext().getObject();

                if(object.isDirectory) {
                    return this.onDirectorySelected(evt);
                } else if(object.webAccessible) {
                    return this.onStreamSelected(evt);
                } else {
                    return this.onUnknownSelected(evt);
                }
            },

            navToDirectory: function(path) {
                if(!path) {
                    this.navTo("RouteMainView");
                } else {
                    this.navTo("RouteMainViewWithBase64Path", {base64Path: btoa(path)});
                }
            },

            download: function(path, blobName) {
                var url = this.getBaseUrl() + "/download" + "?FileName=" + path;
                // var link = document.createElement("a");
                // link.setAttribute('download', '');
                // link.href = url;
                // document.body.appendChild(link);
                // link.click();
                // link.remove();

                var id = new Date().getTime();
                var blob;
                var xmlHTTP = new XMLHttpRequest();
                xmlHTTP.open('GET', url, true);
                xmlHTTP.responseType = 'arraybuffer';
                xmlHTTP.onload = function(e) {
                    blob = new Blob([this.response]);   
                };
                xmlHTTP.onprogress = function(pr) {
                    this.addProgressData(id, "download", blobName, xmlHTTP, pr);
                }.bind(this);
                xmlHTTP.onloadend = function(e){
                    if(blob) {
                        var fileName = blobName;
                        var tempEl = document.createElement("a");
                        document.body.appendChild(tempEl);
                        tempEl.style = "display: none";
                        url = window.URL.createObjectURL(blob);
                        tempEl.href = url;
                        tempEl.download = fileName;
                        tempEl.click();
                        window.URL.revokeObjectURL(url);
                    }
                    this.removeProgressData(id);
                }.bind(this);
                this.addProgressData(id, "download", blobName, xmlHTTP, null);
                xmlHTTP.send();
            },

            formatterPreviewUrl: function(path) {
                return this.getBaseUrl() + "/preview" + "?FileName=" + path;
            },

            stream: function(title, path) {
                var url = this.getBaseUrl() + "/stream" + "?FileName=" + path;
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
            },

            getDownloadPopup: function() {
                if(!this._downloadPopup) {
                    this._downloadPopup = sap.ui.xmlfragment("com.cubiclan.boxconv.fragment.Download", this);
                    this.getView().addDependent(this._downloadPopup);
                }
                return this._downloadPopup;
            },

            openDownloadPopup: function() {
                var popup = this.getDownloadPopup();
                popup.open();
            },

            closeDownloadPopup: function() {
                this._downloadPopup.destroy();
                this._downloadPopup = null;
            },

            onDownloadPopup: function() {
                var object = this.getModel("file").getProperty("/object");
                this.download(object.path, object.nombre);
                this.closeDownloadPopup();
            },

            getProgressModel: function() {
                var model = this.getView().getModel("progress");
                if(!model) {
                    model = new JSONModel({
                        list: []
                    });
                    this.setModel(model, "progress");
                }
                return model;
            },

            addProgressData: function(id, type, name, xhr, pr) {
                var model = this.getProgressModel();
                var list = model.getProperty("/list");
                var found = list.find(function(item) {
                    return item.id === id;
                });
                if(found) {
                    found.pr = pr;
                } else {
                    list.push({id, type, name, xhr, pr});
                }
                list = list.reduce(function(acc, cur){
                    acc.push(cur);
                    return acc;
                }, []);
                this.setModel(new JSONModel({list: list}), "progress");
            },

            removeProgressData: function(id) {
                var model = this.getProgressModel();
                var list = model.getProperty("/list");
                list = list.filter(function(item) {
                    return item.id !== id;
                });
                model.setProperty("/list", list);
                model.refresh();
            },

            getTasksPopup: function() {
                if(!this._tasksPlayerPopup) {
                    this._tasksPlayerPopup = sap.ui.xmlfragment("com.cubiclan.boxconv.fragment.Tasks", this);
                    this.getView().addDependent(this._tasksPlayerPopup);
                }
                return this._tasksPlayerPopup;
            },

            openTasksPopup: function() {
                var popup = this.getTasksPopup();
                popup.open();
            },

            closeTasksPopup: function() {
                this._tasksPlayerPopup.destroy();
                this._tasksPlayerPopup = null;
            },

            onPressAbort: function(evt) {
                var object = evt.getSource().getBindingContext("progress").getObject();
                object.xhr.abort()
            }

        });
    },
);
