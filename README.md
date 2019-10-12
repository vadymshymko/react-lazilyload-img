# react-lazilyload-img

[![npm version](https://img.shields.io/npm/v/react-lazilyload-img.svg?style=flat)](https://www.npmjs.com/package/react-lazilyload-img)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-lazilyload-img?label=size)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vadymshymko/react-lazilyload-img/blob/master/LICENSE)

Simple && small React.js component for lazy load images

## Table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Demo](#demo)

## Installation

**npm**

```bash
npm install react-lazilyload-img --save
```

**yarn**

```bash
yarn add react-lazilyload-img
```

## Usage

#### Basic Example:

```js
import React, { Component } from 'react';
import Img from 'react-lazilyload-img';

const App = () => {
  return(
    <Img
      src="//images.unsplash.com/photo-1539250632877-c12b7d5d6fcb"
      placeholderSrc="//images.unsplash.com/photo-1539250632877-c12b7d5d6fcb?w=27&q=8"
    >
  );
};
```

## Props

Name | Type | Default Value | Description   
---- | ---- | ------------- | --------------
className | string | `''` | image className
loadingClassName | string | `''` | className for main image in loading state (applied when main image start loading and delete after loading end)
mainImgClassName | string | `''` | className for main image (applied when main image start loading)
mainImgOnLoad | func | `null` | function that will be called after main image load end
onLoad | func | `null` | function that will be called after placeholder image or main image load end
placeholderClassName | string | `''` | placeholder image className (deleted before main image start loading)
placeholderOnLoad | func | `null` | function that will be called after placeholder image load end
placeholderSrc | string | `''` | placeholder image src attr value
placeholderSrcSet | string | `''` | placeholder image srcset attr value
src | string | `''` | main image src attr value
srcSet | string | `''` | main image srcset attr value
... | | | any other image attributes

## Demo

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-lazilyload-img-69wd6)
