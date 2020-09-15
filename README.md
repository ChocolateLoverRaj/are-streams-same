# are-streams-same
Check if the contents of two Node.js streams are the same.

## Installing
This module does not need any dependencies. [`rollup`](https://www.npmjs.com/package/rollup) is an optional dependency because it can be used to build a commonjs file. If you are using ESModules, then you can install like this:
```shell
npm i are-streams-same --no-optional
```

## Using
There is a default function that takes in two readable streams and returns a promise. See the `index.d.ts` file for typescript definitions.

### Compare two files
```javascript
import { createReadStream } from 'fs';
import areStreamsSame from 'are-streams-same';

//a.txt: Hello
const stream1 = createReadStream('a.txt');

//b.txt: Hello World
const stream2 = createReadStream('b.txt');

areStreamsSame(stream1, stream2)
    .then(result => {
        console.log(result); 
        /* 
        { 
            same: false, 
            reason: 'The length of a stream exceeded the length of the other stream which was finished.' 
        };
        */
    })
```

### Compare a Saved Hash to a file
```javascript
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import areStreamsSame from 'are-streams-same';

//The old hash
const stream1 = createReadStream('hash.dat');

//The new hash
const stream2 = createReadStream('input.txt')
    .pipe(createHash('sha256'));

areStreamsSame(stream1, stream2)
    .then(({ same }) => {
        if(same){
            console.log("File hasn't changed");
        }
        else{
            console.log("File is different");
        }
    })
```

## Features
- Smart
    - If one stream ends and it is shorter than the other stream, then we know for sure that the streams are of different lengths. The promise is resolved right away and event handlers are removed.
- Memory Efficient
    - This module is designed to hold as little memory as possible while chunks come from the two streams. When we get data, the two streams are compared right away. The only buffer that is saved is the new parts of the stream that are still waiting for the other stream in order to be compared. If one stream gets ahead of another, it is paused to prevent a big backlog.
- Lightweight
    - No dependencies. The only dependency is [`rollup`](https://www.npmjs.com/package/rollup), which is only needed for building if you are using commonjs.
    - Just one file. `index.js` is the only file with logic. `index.d.ts` is a small file for typescript definitions. There is also a file called `build/cjs.cjs` which is to transpile `index.js` into commonjs, to support commonjs. 
- Typescript Definitions
    - Definitions are in `index.d.ts`.

## Using with CommonJs
This module is made with ESModules. ESModules are able to use other ESModules and CommonJs modules, but CommonJS modules aren't able to use ESModules. If you are using, CommonJS (`require('are-streams-same')`), or want to support CommonJS, then you can build a CommonJS file by using the `build/cjs.cjs` file. It is a file that exports an async function which uses [`rollup`](https://www.npmjs.com/package/rollup) to generate the `dist/cjs/index.cjs` file. For example, you might have a setup like this:

### build.js
```javascript
const build = require('are-streams-same/build/cjs.cjs');

build();
```

### package.json
```json
{
    "scripts": {
        "build": "node build.js",
        "postinstall": "node build.js"
    }
}
```

Then you can do 
```shell
npm run build
```
to generated `dist/cjs/index.cjs`. Then you can use this package normally by doing:
```javascript
require('are-streams-same');
```