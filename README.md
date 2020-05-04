Ray tracer
==========

Approaches the field from a naive perspective to find out where compiler and loader need to improve.

<img src="./preview.jpg" />

Instructions
------------

First, install the development dependencies:

```
$> npm install
```

Now, to build [assembly/index.ts](./assembly/index.ts) to an untouched and an optimized `.wasm` including their respective `.wat` representations, run:

```
$> npm run asbuild
```

Afterwards, run

```
$> npm start
```

to start a <a href="http://127.0.0.1:8080">local server</a>. Should also automatically launch a browser.
