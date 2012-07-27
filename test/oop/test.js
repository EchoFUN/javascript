require.config({
    baseUrl: 'http://localhost:8080/scripts'
});
require(['oop'], function (o) {
    var Person = o.Class({
        init: function (name, sex) {
            this.name = name;
            this.sex = sex;
            console.log('Person init');
        },
        speak: function () {
            console.log('I am not a geek');
        },
        walk: function () {
            console.log('walking');
        }
    });

    var Programmer = o.Class(Person, {
        init: function (name, sex) {
            this.superclass.init.apply(this, arguments);
            console.log('Programmer init');
        },
        speak: function () {
            this.superclass.speak.call(this);
            console.log('Programmer is alone.');
        },
        program: function () {
            console.log('coding');
        }
    });

    var FrontendEngineers = o.Class(Programmer, {
        init: function (name, sex) {
            this.superclass.init.apply(this, arguments);
            console.log('FrontendEngineers init');
        },
        speak: function () {
            this.superclass.speak.call(this);
            console.log('Google is God');
        }
    });

    var SoftwareEnginee = o.Class(Programmer, {
        init: function (name, sex) {
            this.superclass.init.apply(this, arguments);
            console.log('SoftwareEnginee init');
        },
        speak: function () {
            this.superclass.speak.call(this);
            console.log('C++ or Java?');
        }
    });


    new FrontendEngineers().speak();
    new SoftwareEnginee().speak();

});

