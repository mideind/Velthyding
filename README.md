<img src="src/velthyding_logo.png" align="right" width="224" height="224" style="margin-left:20px;">

# Velthyding.is — Icelandic Machine Translation Website

### Introduction

*Velthyding.is* is a web front end for [Miðeind](https://miðeind.is)'s neural machine
translation engine, implemented in Javascript and React.

The website allows translation of text and documents between Icelandic and English.
Both the web and the engine are under rapid development.

Try Velthyding at [https://velthyding.is](https://velthyding.is)!

### Requirements and installation

You’ll need to have Node >= 8.10 and npm >= 5.6 on your machine. Run `yarn run` for a local development server and `yarn build` to package the interface for public use.

### Configuration

See `config.js` for setting endpoint domains, default selections and customizing branding (logo, colors). Endpoints need to follow the [Google translate REST specification](https://cloud.google.com/translate/docs/reference/rest) for compatibility with the interface.

### About

This work is partially funded by the Language Technology Programme of the Icelandic Government.

### Copyright and licensing

<img src="https://github.com/mideind/GreynirPackage/blob/master/doc/_static/MideindLogoVert100.png?raw=true" align="right" style="margin-left:20px;" alt="Miðeind ehf.">

Velthyding is *copyright ©2021 Miðeind ehf.*

This software is licensed under the **MIT License**:

*Permission is hereby granted, free of charge, to any person*
*obtaining a copy of this software and associated documentation*
*files (the "Software"), to deal in the Software without restriction,*
*including without limitation the rights to use, copy, modify, merge,*
*publish, distribute, sublicense, and/or sell copies of the Software,*
*and to permit persons to whom the Software is furnished to do so,*
*subject to the following conditions:*

**The above copyright notice and this permission notice shall be**
**included in all copies or substantial portions of the Software.**

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,*
*EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF*
*MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.*
*IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY*
*CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,*
*TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE*
*SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*

If you would like to use this software in ways that are incompatible
with the standard MIT license, [contact Miðeind ehf.](mailto:mideind@mideind.is)
to negotiate custom arrangements.
