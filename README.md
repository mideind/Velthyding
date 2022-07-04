<img src="src/velthyding_logo.png" align="right" width="224" height="224" style="margin-left:20px;">

# Velthyding.is — Icelandic Machine Translation Website

## Introduction

_Velthyding.is_ is a web front end for [Miðeind](https://miðeind.is)'s neural machine
translation engine, implemented in Javascript and React.

The website allows translation of text and documents between Icelandic and English.
Both the web and the engine are under rapid development.

Try Velthyding at [https://velthyding.is](https://velthyding.is)!

## Development

### Configuration

See `config.js` for setting endpoint domains. Endpoints need to follow the [Google translate REST specification](https://cloud.google.com/translate/docs/reference/rest) for compatibility with the interface.

### Setup and development

You’ll need to have Node >= 14 and yarn >= 1.0. To install dependencies run

```bash
yarn install
```

To start the development server run

```bash
yarn start
```

To create a production build run

```bash
yarn build
```

If you have problems when building or running the development server, try increasing the available memory with

```bash
export NODE_OPTIONS=--max_old_space_size=4096
```

### Linting

The code should follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
Linting is configured in `.eslintrc.json` and the code can be fixed using prettier by running

```bash
npx eslint 'src/**/*.{js,jsx}' --fix
```

## Release

- Bump the version number `package.json`.
- Build the frontend with `build_web_frontend.sh`. This script uses Docker to build.
- Follow the instructions from the script to upload the bundle.

## About

This work is partially funded by the Language Technology Programme of the Icelandic Government, managed by Almannarómur.

### Copyright and licensing

<img src="https://github.com/mideind/GreynirPackage/blob/master/doc/_static/MideindLogoVert100.png?raw=true" align="right" style="margin-left:20px;" alt="Miðeind ehf.">

Velthyding is _copyright © 2022 Miðeind ehf._

This software is licensed under the **MIT License**:

_Permission is hereby granted, free of charge, to any person_
_obtaining a copy of this software and associated documentation_
_files (the "Software"), to deal in the Software without restriction,_
_including without limitation the rights to use, copy, modify, merge,_
_publish, distribute, sublicense, and/or sell copies of the Software,_
_and to permit persons to whom the Software is furnished to do so,_
_subject to the following conditions:_

**The above copyright notice and this permission notice shall be**
**included in all copies or substantial portions of the Software.**

_THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,_
_EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF_
_MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT._
_IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY_
_CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,_
_TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE_
_SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE._

If you would like to use this software in ways that are incompatible
with the standard MIT license, [contact Miðeind ehf.](mailto:mideind@mideind.is)
to negotiate custom arrangements.
