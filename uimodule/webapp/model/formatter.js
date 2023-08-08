sap.ui.define([], function () {
    "use strict";
    return {

        fileSize: function(bytes) {
            var kilobytes = bytes / 1024;
            var megabytes = kilobytes / 1024;
            var gigabytes = megabytes / 1024;
            var terabytes = gigabytes / 1024;

            if(kilobytes < 1) {
                return bytes.toFixed(1) + " B";
            } else if(megabytes < 1) {
                return kilobytes.toFixed(1) + " kB";
            } else if(gigabytes < 1) {
                return megabytes.toFixed(1) + " MB";
            } else if(terabytes < 1) {
                return gigabytes.toFixed(1) + " GB";
            } else {
                return terabytes.toFixed(1) + " TB";
            }

        }

    };
});
