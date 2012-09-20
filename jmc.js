(function () {

    var config = {
        rootDIR: 'mall/common/js/',
        rootPath: 'http://s.xnimg.cn/'
    },

    modsLoaded = [],

    modsDeferred = {},

    //script元素管理
    scriptPool = {},

    //存放加载的模块和版本号
    modules = {},

    //存放类和类的内容
    classes = {},

    loadJS = function (mod, fn) {
        var file = config.rootPath + (modules[mod] ? modules[mod] + '/' : '') + config.rootDIR + mod + '.js'
        if (scriptPool[file]) {
            fn(true);
        }
        else {
            var tag = document.createElement('script');
            tag.onload = tag.onerror = tag.onreadystatechange = function () {
                if (tag && tag.readyState && tag.readyState !== 'loaded' && tag.readyState !== 'complete') {
                    return;
                }
                try {
                    tag.parentNode.removeChild(tag);
                    tag = null;
                    scriptPool[file] = true;
                }
                catch (ex) {}
                fn();
            }
            tag.src = file;
            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    };

    window.JMC = {

        debug: false,

        Class: function () {
            var Class = function () {
                this.init.apply(this, arguments);
            },
            fnTest = /\$super\b/,
            tempCtor = function(){},
            name,
            i,
            parent = arguments[0],
            props = arguments[arguments.length - 1],
            interface;
            if (typeof parent === 'function') {
                tempCtor.prototype = parent.prototype;
                Class.prototype = new tempCtor();
                props = arguments[arguments.length - 1];
                for (name in props) {
                    if (typeof props[name] === 'function' && fnTest.test(props[name])) {
                        Class.prototype[name] = (function (name, fn, fnSuper) {
                            return function () {
                                var bak = this.$super, res;
                                this.$super = fnSuper;
                                res = fn.apply(this, arguments);
                                this.$super = bak;
                                return res;
                            };
                        })(name, props[name], parent.prototype[name]);
                    }
                    else {
                        Class.prototype[name] = props[name];
                    }
                }
                Class.prototype.$super = parent.prototype;
                interface = Array.prototype.slice.call(arguments, 1, -1);
            }
            else {
                Class.prototype = props;
                interface = Array.prototype.slice.call(arguments, 0, -1);
            }
            for (i = 0, name ; i < interface.length ; i += 1) {
                for (name in interface[i]) {
                    Class.prototype[name] = interface[i][name];
                }
            }
            Class.prototype.constructor = Class;
            return Class;
        },

        define: function (name, depends, fn) {
            if (typeof name === 'function') {
                fn = name;
                depends = [];
                name = null;
            }
            else if (/array/i.test(Object.prototype.toString.call(name))) {
                fn = depends;
                depends = name;
                name = null;
            }
            else if (typeof name === 'string') {
                if (typeof depends === 'function') {
                    fn = depends;
                    depends = [];
                }
                else if (!/array/i.test(Object.prototype.toString.call(depends))) {
                    depends = [];
                }
            }
            else {
                depends = [];
                name = null;
            }

            if (depends.length) {
                var self = this, nickname = +new Date();
                modsLoaded.push(nickname);
                this.use(depends.join(','), function () {
                    for (var key in classes) {
                        if (classes[key] === nickname) {
                            classes[key] = fn();
                            for (var i in modsDeferred) {
                                if (i == nickname) {
                                    modsDeferred[i]();
                                    break;
                                }
                            }
                            break;
                        }
                    }
                });
            }
            else {
                modsLoaded.push(fn());
            }
        },

        use: function (mods, fn) {
            var counter = 0,
                modsDeferredCounter = 0,
                rNickname = /^\d+$/,
                run = function () {
                    if (modsDeferredCounter === 0 && counter === mods.length && typeof fn === 'function') {
                        try {
                            var modules = [];
                            for (var i = 0; i < mods.length ; i += 1) {
                                modules.push(classes[mods[i]]);
                            }
                            fn.apply(window, modules);
                        }
                        catch (ex) {
                            if (JMC.debug) { throw ex; }
                        }
                    }
                };

            if (typeof mods == 'string') {
                mods = mods.replace(/\s*/g, '').split(',');
            }

            for (var i = 0 ; i < mods.length ; i += 1) {
                (function (mod) {
                    loadJS(mod, function (hasLoaded) {
                        counter += 1;
                        if (!hasLoaded) {
                            var exports = modsLoaded.shift();
                            classes[mod] = exports;
                            if (rNickname.test(exports)) {
                                modsDeferredCounter += 1;
                                modsDeferred[exports] = function () {
                                    modsDeferredCounter -= 1;
                                    run();
                                };
                            }
                        }
                        run();
                    });
                }(mods[i]));
            }
        },

        getVersion: function (path) {
            for (var i = 0, len = path.length; i < len; i += 1) {
                var info = path[i].split('/'),
                mod = info[info.length - 1].split('.')[0],
                version = false;
                if (/\w\d\d\d\d\d/.test(info[3])) {
                    version = info[3];
                }
                modules[mod] = version;
            }
        }

    };

})();
