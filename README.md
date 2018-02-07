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
cat4web.onChangeFrequency = function (value) {
    console.log(value); 
};
cat4web.onChangeMode = function (value) {
    console.log(value);
};
cat4web.connect();
...
cat4web.setFrequency(145500000);
```

Dependencies
------------------
Of course, you can not control the transceiver directly from the browser. 

You need install of a special program - CAT4Web, which, in turn, requires installation Omni-Rig.

So, you need to download and install:
* CAT4Web - https://kikimor.ru/cat4web
* Omni-Rig - http://dxatlas.com/omnirig/
