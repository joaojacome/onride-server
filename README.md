# OnRide Server

## Requirements

* RethinkDB server

## Configure

* Configure database in `src/lib/database.ts`
* Configure OneSignal push notification key in `src/lib/util/push/onesignal.ts`
* Configure your SSL certificates in `src/lib/eserver.ts`

## Build 

* Run `gulp compile`

## Run

* Inside the build folder just run `nodejs onride.js`

## License

Copyright (c) 2014-2017 Joao Jacome ([LinkedIn](https://www.linkedin.com/in/joao-jacome)), Alexandre Strehle ([LinkedIn](https://www.linkedin.com/in/alexandre-strehle-b40a4121/))

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.