# JMC
==================================================

JMC是山寨版的requirejs，只具备部分requirejs的功能，代码精练
包含的功能如下
* 模块异步加载
* Class-style继承

## JMC.config(opt)

  {{NAME}}和{{VERSION}}是特殊占位符，不可修改，如果没有版本号可以不提供{{VERSION}}
  ```
  JMC.config({
    path: 'http://somedomain/{{VERSION}}/somepath/{{NAME}}.js',
    versions: {
      add: '12324'
    }
  })
  ```

## JMC.define([name], [depend], fn)
  
  如果不指定模块名，默认是文件名
  依赖模块以字符串数组的形式传参
  通过返回暴露公用接口
  ```
  JMC.define(function () {
    var add = function (num1, num2) {
      return num1 + num2;
    }
    return {
      add: add
    }
  })
  ```

## JMC.use(mods*, fn)
 
  可以同时加载多个模块
  ```
  JMC.use('add, minus', function (add, minus) {
    add.add(1, 2);
  })
  ```

## JMC.Class([parentctr], [interface*], prop)
  
  Class-style继承
  ```
  JMC.Class({
    init: function () {
      this.a = 'a';
    }
  })

  JMC.Class(A, {
    init: function () {
    }
  })
  ```

# waterfall.js
--------------------------------------
瀑布流实现，参数支持CSS3 Column

参数说明
* colWidth<'auto'>:列宽度
* colCount<'auto'>:列数
* colGap<10>:列间距
* verticalGap<10>:垂直块间距
* autoExpand<true>:自动扩展列宽度以充满容器
* container<'body'>:容器
* template<{}>:如果数据单元包含type属性，可以为每一种类型指定不同的模板，type为键值。如果只有一种type类型，直接指定字符串模板，无需构造哈希对象
* rule<function (t) {}>:根据type进行特殊排列, 根据type判断返回'left'/'right'可以使对应的类型块一直放在最左边/最右边

实例
```
new waterfall({
    colWidth: 234,
    colGap: 12,
    verticalGap: 15,
    autoExpand: false,
    template: {
      image: '<img src="<%=data.pic%>">',
      text: '<p><%=data.text%></p>'
    },
    rule: function (t) {
      if (t === 'image') {
        return 'right';
    }
});
```