/**
 * bootbox.js v4.0.0
 *
 * http://bootboxjs.com/license.txt
 */
// @see https://github.com/makeusabrew/bootbox/issues/71
window.bootbox = window.bootbox || (function init($, undefined) {
        "use strict";

        // the base DOM structure needed to create a modal
        var templates = {
            dialog:
            "<div class='bootbox modal' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog'>" +
            "<div class='modal-content'>" +
            "<div class='modal-body'><div class='bootbox-body' style='word-break: break-all'></div></div>" +
            "</div>" +
            "</div>" +
            "</div>",
            header:
            "<div class='modal-header'>" +
            "<h4 class='modal-title'></h4>" +
            "</div>",
            footer:
                "<div class='modal-footer'></div>",
            closeButton:
                "<button type='button' class='bootbox-close-button close'>&times;</button>",
            form:
                "<form class='bootbox-form'></form>",
            inputs: {
                text:
                    "<input class='bootbox-input form-control' autocomplete=off type=text />"
            }
        };

        // cache a reference to the jQueryfied body element
        var appendTo = $("body");

        var defaults = {
            // default language
            locale: "en",
            // show backdrop or not
            backdrop: true,
            // animate the modal in/out
            animate: true,
            // additional class string applied to the top level dialog
            className: null,
            // whether or not to include a close button
            closeButton: true,
            // show the dialog immediately by default
            show: true
        };

        // our public object; augmented after our private API
        var exports = {};

        /**
         * @private
         */
        function _t(key) {
            var locale = locales[defaults.locale];
            return locale ? locale[key] : locales.en[key];
        }

        function processCallback(e, dialog, callback) {
            e.preventDefault();

            // by default we assume a callback will get rid of the dialog,
            // although it is given the opportunity to override this

            // so, if the callback can be invoked and it *explicitly returns false*
            // then we'll set a flag to keep the dialog active...
            var preserveDialog = $.isFunction(callback) && callback(e) === false;

            // ... otherwise we'll bin it
            if (!preserveDialog) {
                dialog.modal("hide");
            }
        }

        function getKeyLength(obj) {
            // @TODO defer to Object.keys(x).length if available?
            var k, t = 0;
            for (k in obj) {
                t ++;
            }
            return t;
        }

        function each(collection, iterator) {
            var index = 0;
            $.each(collection, function(key, value) {
                iterator(key, value, index++);
            });
        }

        function sanitize(options) {
            var buttons;
            var total;


            if (typeof options !== "object") {
                throw new Error("Please supply an object of options");
            }

            if (!options.message) {
                throw new Error("Please specify a message");
            }

            // make sure any supplied options take precedence over defaults
            options = $.extend({}, defaults, options);

            if (!options.buttons) {
                options.buttons = {};
            }

            // we only support Bootstrap's "static" and false backdrop args
            // supporting true would mean you could dismiss the dialog without
            // explicitly interacting with it
            options.backdrop = options.backdrop ? "static" : false;

            buttons = options.buttons;

            total = getKeyLength(buttons);

            each(buttons, function(key, button, index) {

                if ($.isFunction(button)) {
                    // short form, assume value is our callback. Since button
                    // isn't an object it isn't a reference either so re-assign it
                    button = buttons[key] = {
                        callback: button
                    };
                }

                // before any further checks make sure by now button is the correct type
                if ($.type(button) !== "object") {
                    throw new Error("button with key " + key + " must be an object");
                }

                if (!button.label) {
                    // the lack of an explicit label means we'll assume the key is good enough
                    button.label = key;
                }

                if (!button.className && button.className !== false) {
                    if (total <= 2 && index === total-1) {
                        // always add a primary to the main option in a two-button dialog
                        button.className = "btn-primary";
                    } else {
                        button.className = "btn-default";
                    }
                }
            });

            return options;
        }

        function mapArguments(args, properties) {
            var argn = args.length;
            var options = {};

            if (argn < 1 || argn > 2) {
                throw new Error("Invalid argument length");
            }

            if (argn === 2 || typeof args[0] === "string") {
                options[properties[0]] = args[0];
                options[properties[1]] = args[1];
            } else {
                options = args[0];
            }

            return options;
        }

        function mergeArguments(defaults, args, properties) {
            return $.extend(true, {}, defaults, mapArguments(args, properties));
        }

        function mergeButtons(labels, args, properties) {
            return validateButtons(
                mergeArguments(createButtons.apply(null, labels), args, properties),
                labels
            );
        }

        function createLabels() {
            var buttons = {};

            for (var i = 0, j = arguments.length; i < j; i++) {
                var argument = arguments[i];
                var key = argument.toLowerCase();
                var value = argument.toUpperCase();

                buttons[key] = {
                    label: _t(value)
                };
            }

            return buttons;
        }

        function createButtons() {
            return {
                buttons: createLabels.apply(null, arguments)
            };
        }

        function validateButtons(options, buttons) {
            var allowedButtons = {};
            each(buttons, function(key, value) {
                allowedButtons[value] = true;
            });

            each(options.buttons, function(key) {
                if (allowedButtons[key] === undefined) {
                    throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
                }
            });

            return options;
        }

        exports.alert = function() {
            var options;

            options = mergeButtons(["ok"], arguments, ["message", "callback"]);

            if (options.callback && !$.isFunction(options.callback)) {
                throw new Error("alert requires callback property to be a function when provided");
            }

            /**
             * overrides
             */
            options.buttons.ok.callback = options.onEscape = function() {
                if ($.isFunction(options.callback)) {
                    return options.callback();
                }
                return true;
            };

            return exports.dialog(options);
        };

        exports.confirm = function() {
            var options;

            options = mergeButtons(["cancel", "confirm"], arguments, ["message", "callback"]);

            /**
             * overrides; undo anything the user tried to set they shouldn't have
             */
            options.buttons.cancel.callback = options.onEscape = function() {
                return options.callback(false);
            };

            options.buttons.confirm.callback = function() {
                return options.callback(true);
            };

            // confirm specific validation
            if (!$.isFunction(options.callback)) {
                throw new Error("confirm requires a callback");
            }

            return exports.dialog(options);
        };

        exports.prompt = function() {
            var options;
            var defaults;
            var dialog;
            var form;
            var input;
            var shouldShow;

            // we have to create our form first otherwise
            // its value is undefined when gearing up our options
            // @TODO this could be solved by allowing message to
            // be a function instead...
            form = $(templates.form);

            defaults = {
                buttons: createLabels("cancel", "confirm"),
                value: ""
            };

            options = validateButtons(
                mergeArguments(defaults, arguments, ["title", "callback"]),
                ["cancel", "confirm"]
            );

            // capture the user's show value; we always set this to false before
            // spawning the dialog to give us a chance to attach some handlers to
            // it, but we need to make sure we respect a preference not to show it
            shouldShow = (options.show === undefined) ? true : options.show;

            /**
             * overrides; undo anything the user tried to set they shouldn't have
             */
            options.message = form;

            options.buttons.cancel.callback = options.onEscape = function() {
                return options.callback(null);
            };

            options.buttons.confirm.callback = function() {
                return options.callback(input.val());
            };

            options.show = false;

            // prompt specific validation
            if (!options.title) {
                throw new Error("prompt requires a title");
            }

            if (!$.isFunction(options.callback)) {
                throw new Error("prompt requires a callback");
            }

            // create the input
            input = $(templates.inputs.text);
            input.val(options.value);

            // now place it in our form
            form.append(input);

            form.on("submit", function(e) {
                e.preventDefault();
                // @TODO can we actually click *the* button object instead?
                // e.g. buttons.confirm.click() or similar
                dialog.find(".btn-primary").click();
            });

            dialog = exports.dialog(options);

            // clear the existing handler focusing the submit button...
            dialog.off("shown.bs.modal");

            // ...and replace it with one focusing our input, if possible
            dialog.on("shown.bs.modal", function() {
                input.focus();
            });

            if (shouldShow === true) {
                dialog.modal("show");
            }

            return dialog;
        };

        exports.dialog = function(options) {
            options = sanitize(options);

            var dialog = $(templates.dialog);
            var body = dialog.find(".modal-body");
            var buttons = options.buttons;
            var buttonStr = "";
            var callbacks = {
                onEscape: options.onEscape
            };

            each(buttons, function(key, button) {

                // @TODO I don't like this string appending to itself; bit dirty. Needs reworking
                // can we just build up button elements instead? slower but neater. Then button
                // can just become a template too
                buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
                callbacks[key] = button.callback;
            });

            body.find(".bootbox-body").html(options.message);

            if (options.animate === true) {
                dialog.addClass("fade");
            }

            if (options.className) {
                dialog.addClass(options.className);
            }

            if (options.title) {
                body.before(templates.header);
            }

            if (options.closeButton) {
                var closeButton = $(templates.closeButton);

                if (options.title) {
                    dialog.find(".modal-header").prepend(closeButton);
                } else {
                    closeButton.css("margin-top", "-10px").prependTo(body);
                }
            }

            if (options.title) {
                dialog.find(".modal-title").html(options.title);
            }

            if (buttonStr.length) {
                body.after(templates.footer);
                dialog.find(".modal-footer").html(buttonStr);
            }


            /**
             * Bootstrap event listeners; used handle extra
             * setup & teardown required after the underlying
             * modal has performed certain actions
             */

            dialog.on("hidden.bs.modal", function(e) {
                // ensure we don't accidentally intercept hidden events triggered
                // by children of the current dialog. We shouldn't anymore now BS
                // namespaces its events; but still worth doing
                if (e.target === this) {
                    dialog.remove();
                }
            });

            /*
             dialog.on("show.bs.modal", function() {
             // sadly this doesn't work; show is called *just* before
             // the backdrop is added so we'd need a setTimeout hack or
             // otherwise... leaving in as would be nice
             if (options.backdrop) {
             dialog.next(".modal-backdrop").addClass("bootbox-backdrop");
             }
             });
             */

            dialog.on("shown.bs.modal", function() {
                dialog.find(".btn-primary:first").focus();
            });

            /**
             * Bootbox event listeners; experimental and may not last
             * just an attempt to decouple some behaviours from their
             * respective triggers
             */

            dialog.on("escape.close.bb", function(e) {
                if (callbacks.onEscape) {
                    processCallback(e, dialog, callbacks.onEscape);
                }
            });

            /**
             * Standard jQuery event listeners; used to handle user
             * interaction with our dialog
             */

            dialog.on("click", ".modal-footer button", function(e) {
                var callbackKey = $(this).data("bb-handler");

                processCallback(e, dialog, callbacks[callbackKey]);

            });

            dialog.on("click", ".bootbox-close-button", function(e) {
                // onEscape might be falsy but that's fine; the fact is
                // if the user has managed to click the close button we
                // have to close the dialog, callback or not
                processCallback(e, dialog, callbacks.onEscape);
            });

            dialog.on("keyup", function(e) {
                if (e.which === 27) {
                    dialog.trigger("escape.close.bb");
                }
            });

            // the remainder of this method simply deals with adding our
            // dialogent to the DOM, augmenting it with Bootstrap's modal
            // functionality and then giving the resulting object back
            // to our caller

            appendTo.append(dialog);

            dialog.modal({
                backdrop: options.backdrop,
                keyboard: false,
                show: false
            });

            if (options.show) {
                dialog.modal("show");
            }

            // @TODO should we return the raw element here or should
            // we wrap it in an object on which we can expose some neater
            // methods, e.g. var d = bootbox.alert(); d.hide(); instead
            // of d.modal("hide");

            /*
             function BBDialog(elem) {
             this.elem = elem;
             }

             BBDialog.prototype = {
             hide: function() {
             return this.elem.modal("hide");
             },
             show: function() {
             return this.elem.modal("show");
             }
             };
             */

            return dialog;

        };

        exports.setDefaults = function(values) {
            $.extend(defaults, values);
        };

        exports.hideAll = function() {
            $(".bootbox").modal("hide");
        };


        /**
         * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
         * unlikely to be required. If this gets too large it can be split out into separate JS files.
         */
        var locales = {
            br : {
                OK      : "OK",
                CANCEL  : "Cancelar",
                CONFIRM : "Sim"
            },
            da : {
                OK      : "OK",
                CANCEL  : "Annuller",
                CONFIRM : "Accepter"
            },
            de : {
                OK      : "OK",
                CANCEL  : "Abbrechen",
                CONFIRM : "Akzeptieren"
            },
            en : {
                OK      : "OK",
                CANCEL  : "Cancel",
                CONFIRM : "OK"
            },
            es : {
                OK      : "OK",
                CANCEL  : "Cancelar",
                CONFIRM : "Aceptar"
            },
            fi : {
                OK      : "OK",
                CANCEL  : "Peruuta",
                CONFIRM : "OK"
            },
            fr : {
                OK      : "OK",
                CANCEL  : "Annuler",
                CONFIRM : "D'accord"
            },
            it : {
                OK      : "OK",
                CANCEL  : "Annulla",
                CONFIRM : "Conferma"
            },
            nl : {
                OK      : "OK",
                CANCEL  : "Annuleren",
                CONFIRM : "Accepteren"
            },
            pl : {
                OK      : "OK",
                CANCEL  : "Anuluj",
                CONFIRM : "Potwierdź"
            },
            ru : {
                OK      : "OK",
                CANCEL  : "Отмена",
                CONFIRM : "Применить"
            },
            zh_CN : {
                OK      : "OK",
                CANCEL  : "取消",
                CONFIRM : "确认"
            },
            zh_TW : {
                OK      : "OK",
                CANCEL  : "取消",
                CONFIRM : "確認"
            }
        };

        exports.init = function(_$) {
            window.bootbox = init(_$ || $);
        };

        return exports;

    }(window.jQuery));
/*
 * Copyright 2012 John Papa and Hans Fjällemark.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: John Papa and Hans Fjällemark
 * Project: https://github.com/CodeSeven/toastr
 */
; (function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var version = '1.3.1',
                $container,
                toastType = {
                    error: 'error',
                    info: 'info',
                    success: 'success',
                    warning: 'warning',
                    loading: 'loading'
                },
                listener,
                toastId = 0,

                defaults = {
                    tapToDismiss: true,
                    toastClass: 'toast',
                    containerId: 'toast-container',
                    debug: false,
                    html: true,
                    fadeIn: 300,
                    onFadeIn: undefined,
                    fadeOut: 1000,
                    onFadeOut: undefined,
                    extendedTimeOut: 1000,
                    iconClasses: {
                        error: 'toast-error',
                        info: 'toast-info',
                        success: 'toast-success',
                        warning: 'toast-warning',
                        loading: 'toast-loading'
                    },
                    iconClass: 'toast-info',
                    positionClass: 'toast-top-right',
                    timeOut: 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
                    titleClass: 'toast-title',
                    messageClass: 'toast-message',
                    target: 'body',
                    newestOnTop: true
                },

                error = function (message, title, optionsOverride) {
                    return notify({
                        type: toastType.error,
                        iconClass: getOptions().iconClasses.error,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                info = function (message, title, optionsOverride) {
                    return notify({
                        type: toastType.info,
                        iconClass: getOptions().iconClasses.info,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },
                loading = function (message, title, optionsOverride) {
                    return notify({
                        type: toastType.loading,
                        iconClass: getOptions().iconClasses.loading,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                subscribe = function (callback) {
                    listener = callback;
                },

                success = function (message, title, optionsOverride) {
                    return notify({
                        type: toastType.success,
                        iconClass: getOptions().iconClasses.success,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                warning = function (message, title, optionsOverride) {
                    return notify({
                        type: toastType.warning,
                        iconClass: getOptions().iconClasses.warning,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                clear = function ($toastElement) {
                    var options = getOptions();
                    if (!$container) {
                        getContainer(options);
                    }
                    if ($toastElement && $(':focus', $toastElement).length === 0) {
                        $toastElement.fadeOut(options.fadeOut, function () {
                            removeToast($toastElement);
                        });
                        return;
                    }
                    if ($container.children().length) {
                        $container.fadeOut(options.fadeOut, function () {
                            $container.remove();
                        });
                    }
                };

            var toastr = {
                clear: clear,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                subscribe: subscribe,
                success: success,
                version: version,
                warning: warning,
                loading: loading
            };

            return toastr;

            //#region Internal Methods

            function publish(args) {
                if (!listener) {
                    return;
                }
                listener(args);
            }

            function notify(map) {
                var
                    options = getOptions(),
                    iconClass = map.iconClass || options.iconClass;

                if (typeof (map.optionsOverride) !== 'undefined') {
                    options = $.extend(options, map.optionsOverride);
                    iconClass = map.optionsOverride.iconClass || iconClass;
                }

                toastId++;

                $container = getContainer(options);
                var
                    intervalId = null,
                    $toastElement = $('<div/>'),
                    $titleElement = $('<div/>'),
                    $messageElement = $('<div/>'),
                    response = {
                        toastId: toastId,
                        state: 'visible',
                        startTime: new Date(),
                        options: options,
                        map: map
                    };

                if (map.iconClass) {
                    $toastElement.addClass(options.toastClass).addClass(iconClass);
                }

                if (map.title) {
                    $titleElement[options.html ? 'append' : 'text'](map.title).addClass(options.titleClass);
                    $toastElement.append($titleElement);
                }

                if (map.message) {
                    $messageElement[options.html ? 'append' : 'text'](map.message).addClass(options.messageClass);
                    $toastElement.append($messageElement);
                }

                $toastElement.hide();
                if (options.newestOnTop) {
                    $container.prepend($toastElement);
                } else {
                    $container.append($toastElement);
                }
                $toastElement.fadeIn(options.fadeIn, options.onFadeIn);
                if (options.timeOut > 0) {
                    intervalId = setTimeout(fadeAway, options.timeOut);
                }

                $toastElement.hover(stickAround, delayedFadeAway);
                if (!options.onclick && options.tapToDismiss) {
                    $toastElement.click(fadeAway);
                }

                if (options.onclick) {
                    $toastElement.click(function () {
                        options.onclick() && fadeAway();
                    });
                }

                publish(response);

                if (options.debug && console) {
                    console.log(response);
                }

                return $toastElement;

                function fadeAway() {
                    if ($(':focus', $toastElement).length > 0) {
                        return;
                    }
                    return $toastElement.fadeOut(options.fadeOut, function () {
                        removeToast($toastElement);
                        if (options.onFadeOut) {
                            options.onFadeOut();
                        }
                        response.state = 'hidden';
                        response.endTime = new Date(),
                            publish(response);
                    });
                }

                function delayedFadeAway() {
                    if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                        intervalId = setTimeout(fadeAway, options.extendedTimeOut);
                    }
                }

                function stickAround() {
                    clearTimeout(intervalId);
                    $toastElement.stop(true, true).fadeIn(options.fadeIn);
                }
            }
            function getContainer(options) {
                if (!options) { options = getOptions(); }
                $container = $('#' + options.containerId);
                if ($container.length) {
                    return $container;
                }
                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass);
                $container.appendTo($(options.target));
                return $container;
            }

            function getOptions() {
                return $.extend({}, defaults, toastr.options);
            }

            function removeToast($toastElement) {
                if (!$container) { $container = getContainer(); }
                if ($toastElement.is(':visible')) {
                    return;
                }
                $toastElement.remove();
                $toastElement = null;
                if ($container.children().length === 0) {
                    $container.remove();
                }
            }
            //#endregion

        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    } else {
        window['toastr'] = factory(window['jQuery']);
    }
}));
function createAlert(title,body,type,sticky,where,input_options){
    var options = {
        positionClass: 'toast-top-left',
        html: false
    };
    sticky = typeof sticky == 'undefined' ? false : sticky;
    if(where != null){
        switch(where){
            case 'top':
                options.positionClass = "toast-top-full-width";
                break;
            case 'bottom':
                options.positionClass = "toast-bottom-full-width";
                break;
            default:
                break;
        }
    }

    if(sticky !== false){
        if(sticky == 'long'){0
            options.extendedTimeOut = 15000;
            options.timeOut = 15000;
        }else if(sticky == 1){
            options.extendedTimeOut = 0;
            options.timeOut = 0;
        }
    }
    options = $.extend(options,input_options);

    if(type == 'success'){
        return toastr.success(body,title,options);
    }else if(type == 'danger' || type == 'error'){
        return toastr.error(body, title,options);
    }else if(type == 'warning'){
        return toastr.warning(title, title,options);
    }else if(type == 'info'){
        return toastr.info(body, title,options);
    }else if(type == 'loading'){
        return toastr.loading(body, title,options);
    }
}
function createError(title,message){
    createAlert(title,message,'danger');
}
function showLoader(){
    $('.toast').remove();
    window["create-alert-loader"] = createAlert('<span style="margin-left: 56px">Loading&nbsp;<i style="color: white" class="fa fa-spin fa-refresh pageLoading"></i></span>','','loading',true,null,{html: true});
    return window.loader;
}
function isLoading(){
    return window["create-alert-loader"] != null;
}
function hideLoader(){
    if(window["create-alert-loader"]){
        window["create-alert-loader"].remove();
        window["create-alert-loader"] = null;
    }
}
function createConfirm(options){
    var default_options = {
        title: 'No title',
        message: 'No message',
        success: function(){},
        shown: function(){},
        cancel_text: 'Cancel',
        success_text: 'Confirm',
        buttons: true,
        extra_options: {}
    };

    //Old support
    //title,message,successCallback,successText,buttons,extraOptions
    if(typeof options == 'string'){
        options = $.extend(default_options,{
            title: arguments[0],
            message: arguments[1],
            success: typeof arguments[2] !== 'undefined' ? arguments[2] : function(){},
            shown: function(){},
            cancel_text: 'Cancel',
            success_text: typeof arguments[3] !== 'undefined' ? arguments[3] : 'Confirm',
            buttons: typeof arguments[4] !== 'undefined' ? arguments[4] : true,
            extra_options: typeof arguments[5] !== 'undefined' ? arguments[5] : {}
        });
    }else{
        options = $.extend(default_options,options);
    }


    var bootbox_options = {};
    if(options.buttons === true){
        bootbox_options['buttons'] = {
            danger: {
                label: options.cancel_text,
                className: false
            },
            success: {
                label: options.success_text,
                className: "btn-primary",
                callback: options.success
            }
        };
    }
    bootbox_options = $.extend(bootbox_options,options.extra_options,{
        title: options.title,
        message: options.message
    });
    return bootbox.dialog(bootbox_options).on({
        'shown.bs.modal': function(e){
            $(e.target).find('input,select').eq(0).focus();
            options.shown.apply(this);
        }
    });
}


