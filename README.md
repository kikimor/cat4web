CAT4Web.js
======
CAT4Web - CAT features on the Web! 

What is it?
------------------
CAT4Web - Software that makes it possible to control a radio amateur transceiver from a web browser via JavaScript.

You can get and set the following parameters:
* Frequency.
* Modulation.
* Rig number.

Only for get:
* PTT status.
* Omni-Rig connection status.

How to use?
------------------
```js
var cat4web = new CAT4Web();
cat4web.onChangeFrequency = function (rig, value) {
    console.log(rig, value); 
};
cat4web.onChangeMode = function (rig, value) {
    console.log(rig, value); 
};
cat4web.connect();
...
cat4web.setFrequency(1, 145500000);
```

Before use
------------------
You will need to contact for me before using this library, because the CAT4Web restricts sites where the application can be used to avoid of  the security problems.

Dependencies
------------------
Of course, you can not control the transceiver directly from the browser. 

You need install of a special program - CAT4Web, which, in turn, requires installation Omni-Rig.

So, you need to download and install:
* CAT4Web - https://cat4web.r8acc.ru/
* Omni-Rig - http://dxatlas.com/omnirig/
