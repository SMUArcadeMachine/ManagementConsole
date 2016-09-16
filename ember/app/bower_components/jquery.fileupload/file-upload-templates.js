(function (n) {
    var r = function (n, a) {
        var s = r.cache[n];
        return a ? s(a, r) : function (n) {
            return s(n, r)
        }
    };
    r.cache = {
        "template-download": function (n, r) {
            for (var a, s = r.encode, t = "", e = 0; a = n.files[e]; e++) t += '\r\n<tr class="template-download fade">\r\n    ', a.error ? t += '\r\n    <td class="preview"></td>\r\n    <td class="name"><b><span title="' + s(a.name) + '">' + s(a.name) + '</span></b></td>\r\n    <td class="size"><p>' + s(n.formatFileSize(a.size)) + '</p></td>\r\n    <td class="error" colspan="2"><span class="label label-important">Error</span> ' + s(a.error) + "</td>\r\n    " : (t += '\r\n    <td class="preview">', a.thumbnail_url && (t += '\r\n        <span title="' + s(a.name) + '"><img src="' + s(a.thumbnail_url) + '"></span>\r\n        '), t += '</td>\r\n    <td class="name">\r\n        <b>\r\n            <span title="' + s(a.name) + '">' + s(a.name) + '</span>\r\n        </b>\r\n    </td>\r\n    <td class="size"><p>' + s(n.formatFileSize(a.size)) + '</p></td>\r\n    <td colspan="1" class="progress-col"></td>\r\n    '), t += '\r\n    <td class="delete" colspan="2">\r\n    </td>\r\n</tr>\r\n';
            return t
        },
        "template-upload": function (n, r) {
            for (var a, s = r.encode, t = "", e = 0; a = n.files[e]; e++) t += '\r\n<tr class="template-upload fade">\r\n    <td class="preview"></td>\r\n    <td class="name"><b><p title="' + s(a.name) + '">' + s(a.name) + '</p></b></td>\r\n    <td class="size"><p>' + s(n.formatFileSize(a.size)) + "</p></td>\r\n    ", a.error ? t += '\r\n    <td class="error" colspan="2"><span class="label label-important">Error</span> ' + s(a.error) + "</td>\r\n    " : n.files.valid && !e ? (t += '\r\n    <td class="progress-col">\r\n        <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>\r\n    </td>\r\n    <td class="start" style="padding:8px 0px 8px 0px">', n.options.autoUpload || (t += '\r\n        <button class="btn btn-primary btn-small">\r\n            <i class="icon-upload icon-white"></i>\r\n            <span>Start</span>\r\n        </button>\r\n        '), t += "</td>\r\n    ") : t += '\r\n    <td colspan="2"></td>\r\n    ', t += '\r\n    <td class="cancel">', e || (t += '\r\n        <button class="btn btn-warning btn-small">\r\n            <i class="icon-ban-circle icon-white"></i>\r\n            <span>Cancel</span>\r\n        </button>\r\n        '), t += "</td>\r\n</tr>\r\n";
            return t
        },
        "template-download-delivery": function (n, r) {
            for (var a, s = r.encode, t = "", e = 0; a = n.files[e]; e++) t += '\r\n<tr class="template-download fade">\r\n    ', t += a.error ? '\r\n    <td class="name" colspan="3"><p title="' + s(a.name) + '">' + s(a.name) + '</p></td>\r\n    <td class="size" colspan="1"><p>' + s(n.formatFileSize(a.size)) + '</p></td>\r\n    <td class="error" colspan="1"><span class="label label-important">Error</span> ' + s(a.error) + "</td>\r\n    " : '\r\n    <td class="name" colspan="3">\r\n        <p title="' + s(a.name) + '">' + s(a.name) + '</p>\r\n    </td>\r\n    <td class="size" colspan="2"><p>' + s(n.formatFileSize(a.size)) + "</p></td>\r\n    ", t += "\r\n    </td>\r\n</tr>\r\n";
            return t
        },
        "template-upload-delivery": function (n, r) {
            for (var a, s = r.encode, t = "", e = 0; a = n.files[e]; e++) t += '\r\n<tr class="template-upload fade">\r\n    <td class="name"><p title="' + s(a.name) + '">' + s(a.name) + '</p></td>\r\n    <td class="size"><p>' + s(n.formatFileSize(a.size)) + "</p></td>\r\n    ", a.error ? t += '\r\n    <td class="error" colspan="2"><span class="label label-important">Error</span> ' + s(a.error) + "</td>\r\n    " : n.files.valid && !e ? (t += '\r\n    <td class="progress-col">\r\n        <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>\r\n    </td>\r\n    <td class="start" style="padding:8px 0px 8px 0px">', n.options.autoUpload || (t += '\r\n        <button class="btn btn-primary btn-small">\r\n            <i class="icon-upload icon-white"></i>\r\n            <span>Start</span>\r\n        </button>\r\n        '), t += "</td>\r\n    ") : t += '\r\n    <td colspan="2"></td>\r\n    ', t += '\r\n    <td class="cancel">', e || (t += '\r\n        <button class="btn btn-warning btn-small">\r\n            <i class="icon-ban-circle icon-white"></i>\r\n            <span>Cancel</span>\r\n        </button>\r\n        '), t += "</td>\r\n</tr>\r\n";
            return t
        }
    }, r.encReg = /[<>&"'\x00]/g, r.encMap = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;"
    }, r.encode = function (n) {
        return (null == n ? "" : "" + n).replace(r.encReg, function (n) {
            return r.encMap[n] || ""
        })
    }, "function" == typeof define && define.amd ? define(function () {
        return r
    }) : n.tmpl = r
})(this);