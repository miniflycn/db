# db

> 我们在`齐齐互动视频`用的数据处理层方法集。

### Why?

* 业务通用处理jQuery.ajax满足不了
    1. 登陆态续期
    2. 通用错误码处理
    3. 数据本地化
* 模版复用性导致数据需要重新组装，前端需要一定的数据处理，转化为抽象的View可识别的数据
* 各业务通用需求各不相同，怎么做一个高可扩展的数据处理层库？

### 管道过滤器模式

大多数插件系统使用的设计模式，具体请参见：

https://github.com/miniflycn/Q.js/issues/17

### API

* DB.extend

扩展DB的方法，类似jQuery.extend：

```javascript
DB.extend({
    test: 'test'
});

// test
DB.test;
```

* DB.httpMethod

创建一个httpMethod，其他参数同jQuery.ajax，特殊参数如下：

1. succHandles 成功管道
2. errHanles 错误管道
3. succ 成功回调
4. err 失败回调


```javascript
DB.extend({
    my_cgi: DB.httpMethod({
        url: '/my_cgi',
        succHandles: [function (res) {
            return res.res;
        }]
    })
})
```

* DB.options

同DB.httpMethod，所有DB.httpMethod生成的实例传入的参数都会继承DB.options

```javascript
// 所以类似下面这个cgi，参数首先继承DB.httpMethod中传的参数，然后再继承DB.options中的参数
DB.my_cgi({
    succ: function (res) {
        console.log(res);
    },
    err: function (res) {
        console.error(res)
    }
})
```


