define(function (require, exports, module) {

    exports.extend = function (childCtor, parentCtor) {
        var fnTest = /\bsuperclass\b/,
            parent = parentCtor.prototype,
            fackParent = {},
            tempCtor = function(){},
            name;
        if (parent.superclass) {
            for (name in parent) {
                if (typeof parent[name] === 'function' && fnTest.test(parent[name])) {
                    fackParent[name] = (function (name, fn) {
                        return function () {
                            var bak = this.superclass[name], res;
                            this.superclass[name] = parent.superclass[name];
                            res = fn.apply(this, arguments);
                            this.superclass[name] = bak;
                            return res;
                        };
                    })(name, parent[name]);
                }
                else {
                    fackParent[name] = parent[name];
                }
            }
            parent = fackParent;
        }
        tempCtor.prototype = parent;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.superclass = parent;
        childCtor.prototype.constructor = childCtor;
    };

    exports.mixin = function (childCtor, interface) {
        interface = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, len = interface.length, name ; i < len ; i += 1) {
            for (name in interface[i]) {
                childCtor.prototype[name] = interface[i][name];
            }
        }
    };

    exports.Class = function (parent, interface, props) {
        var Class = function () {
            this.init.apply(this, arguments);
        };
        if (arguments.length === 1) {
            Class.prototype = parent;
        }
        else {
            if (typeof parent === 'function') {
                exports.extend(Class, parent);
                interface = Array.prototype.slice.call(arguments, 1);
            }
            else {
                interface = Array.prototype.slice.call(arguments, 0);
            }
            interface.unshift(Class);
            exports.mixin.apply(null, interface);
        }
        Class.prototype.constructor = Class;
        return Class;
    };

    exports.Class = function (parent, interface, props) {
        var Class = function () {
                this.init.apply(this, arguments);
            },
            fnTest = /\$super\b/,
            tempCtor = function(){},
            name,
            i;
        props = arguments[arguments.length - 1];
        if (typeof parent === 'function') {
            props = arguments[arguments.length - 1];
            Class.prototype = new tempCtor();
            tempCtor.prototype = parent.prototype;
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
    };
});
'西夏红'
