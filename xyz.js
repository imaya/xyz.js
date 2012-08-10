/**
 * XYZ image loader in JavaScript
 *
 * The MIT License
 *
 * Copyright (c) 2012 imaya
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
goog.provide('CanvasTool.XyzLoad');

goog.require('Zlib');
goog.require('Zlib.Inflate');

goog.scope(function() {

/**
 * Load XYZ Image.
 * @param {!(Array.<number>|Uint8Array)} input xyz image binary array.
 * @param {HTMLCanvasElement} canvas target canvas element.
 */
CanvasTool.XyzLoad = function(input, canvas) {
  /** @type {(CanvasRenderingContext2D|Object)} */
  var ctx = canvas.getContext('2d');
  /** @type {number} */
  var ip = 0;
  /** @type {string} */
  var signature;
  /** @type {number} */
  var width;
  /** @type {number} */
  var height;
  /** @type {!(Array.<number>|Uint8Array)} */
  var data;
  /** @type {Zlib.Inflate} */
  var inflate;
  /** @type {!(Array.<number>|Uint8Array)} */
  var palette;
  /** @type {ImageData} */
  var imageData;
  /** @type {!(CanvasPixelArray|Uint8ClampedArray)} */
  var pixel;
  /** @type {number} */
  var limit;
  /** @type {number} */
  var op;
  /** @type {number} */
  var index;

  // signature
  signature =
    String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);
  if (signature !== 'XYZ1') {
    throw new Error('invalid signature');
  }

  // picture size
  width  = (input[ip++] | (input[ip++] << 8)) >>> 0;
  height = (input[ip++] | (input[ip++] << 8)) >>> 0;

  // compressed data
  inflate = new Zlib.Inflate(input, {index: ip});
  data = inflate.decompress();

  // palette
  palette =
    USE_TYPEDARRAY ? data.subarray(0, 256 * 3) : data.slice(0, 256 * 3);
  ip = 256 * 3;

  // draw
  canvas.width = width;
  canvas.height = height;

  imageData = ctx.createImageData(width, height);
  pixel = imageData.data;

  limit = width * height;
  op = 0;
  while (ip < limit) {
    index = data[ip++] * 3;

    pixel[op++] = palette[index];     // Red
    pixel[op++] = palette[index + 1]; // Green
    pixel[op++] = palette[index + 2]; // Blue
    pixel[op++] = 255;                // Alpha
  }

  ctx.putImageData(imageData, 0, 0);
};

// export
goog.exportSymbol('CanvasTool.XyzLoad', CanvasTool.XyzLoad);

// end of scope
});
/* vim:set expandtab ts=2 sw=2 tw=80: */
