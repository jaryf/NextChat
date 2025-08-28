
// 纯 JS 版 MD5 实现
export function cdnMd5(input:any) {
    function rotateLeft(lValue:any, iShiftBits:any) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX:any, lY:any) {
        const lX4 = lX & 0x40000000;
        const lY4 = lY & 0x40000000;
        const lX8 = lX & 0x80000000;
        const lY8 = lY & 0x80000000;
        const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
            } else {
                return lResult ^ 0x40000000 ^ lX8 ^ lY8;
            }
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    }

    function f(x:any, y:any, z:any) {
        return (x & y) | (~x & z);
    }
    function g(x:any, y:any, z:any) {
        return (x & z) | (y & ~z);
    }
    function h(x:any, y:any, z:any) {
        return x ^ y ^ z;
    }
    function i(x:any, y:any, z:any) {
        return y ^ (x | ~z);
    }

    function convertToWordArray(str:any) {
        const lMessageLength = str.length;
        const lNumberOfWordsTemp1 = lMessageLength + 8;
        const lNumberOfWordsTemp2 =
            (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
        const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
        const wordArray = new Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;

        while (lByteCount < lMessageLength) {
            const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            wordArray[lWordCount] |= str.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
        }

        const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        wordArray[lWordCount] |= 0x80 << lBytePosition;
        wordArray[lNumberOfWords - 2] = lMessageLength << 3;
        wordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return wordArray;
    }

    function wordToHex(lValue:any) {
        let wordToHexValue = "",
            wordToHexValueTemp = "",
            lByte,
            lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValueTemp = "0" + lByte.toString(16);
            wordToHexValue += wordToHexValueTemp.substr(
                wordToHexValueTemp.length - 2,
                2
            );
        }
        return wordToHexValue;
    }

    function utf8Encode(string:any) {
        string = string.replace(/\r\n/g, "\n");
        let utftext = "";

        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    }

    let x = [],
        k,
        aa,
        bb,
        cc,
        dd,
        a,
        b,
        c,
        d;
    const S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    const S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    const S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    const S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    input = utf8Encode(input);
    x = convertToWordArray(input);
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        aa = a;
        bb = b;
        cc = c;
        dd = d;
        a = addUnsigned(a, f(b, c, d) + x[k] + 0xd76aa478);
        a = rotateLeft(a, S11);
        a = addUnsigned(a, b);
        d = addUnsigned(d, f(a, b, c) + x[k + 1] + 0xe8c7b756);
        d = rotateLeft(d, S12);
        d = addUnsigned(d, a);
        c = addUnsigned(c, f(d, a, b) + x[k + 2] + 0x242070db);
        c = rotateLeft(c, S13);
        c = addUnsigned(c, d);
        b = addUnsigned(b, f(c, d, a) + x[k + 3] + 0xc1bdceee);
        b = rotateLeft(b, S14);
        b = addUnsigned(b, c);
        a = addUnsigned(a, g(b, c, d) + x[k + 4] + 0xf57c0faf);
        a = rotateLeft(a, S21);
        a = addUnsigned(a, b);
        d = addUnsigned(d, g(a, b, c) + x[k + 5] + 0x4787c62a);
        d = rotateLeft(d, S22);
        d = addUnsigned(d, a);
        c = addUnsigned(c, g(d, a, b) + x[k + 6] + 0xa8304613);
        c = rotateLeft(c, S23);
        c = addUnsigned(c, d);
        b = addUnsigned(b, g(c, d, a) + x[k + 7] + 0xfd469501);
        b = rotateLeft(b, S24);
        b = addUnsigned(b, c);
        a = addUnsigned(a, h(b, c, d) + x[k + 8] + 0x698098d8);
        a = rotateLeft(a, S31);
        a = addUnsigned(a, b);
        d = addUnsigned(d, h(a, b, c) + x[k + 9] + 0x8b44f7af);
        d = rotateLeft(d, S32);
        d = addUnsigned(d, a);
        c = addUnsigned(c, h(d, a, b) + x[k + 10] + 0xffff5bb1);
        c = rotateLeft(c, S33);
        c = addUnsigned(c, d);
        b = addUnsigned(b, h(c, d, a) + x[k + 11] + 0x895cd7be);
        b = rotateLeft(b, S34);
        b = addUnsigned(b, c);
        a = addUnsigned(a, i(b, c, d) + x[k + 12] + 0x6b901122);
        a = rotateLeft(a, S41);
        a = addUnsigned(a, b);
        d = addUnsigned(d, i(a, b, c) + x[k + 13] + 0xfd987193);
        d = rotateLeft(d, S42);
        d = addUnsigned(d, a);
        c = addUnsigned(c, i(d, a, b) + x[k + 14] + 0xa679438e);
        c = rotateLeft(c, S43);
        c = addUnsigned(c, d);
        b = addUnsigned(b, i(c, d, a) + x[k + 15] + 0x49b40821);
        b = rotateLeft(b, S44);
        b = addUnsigned(b, c);
        a = addUnsigned(a, aa);
        b = addUnsigned(b, bb);
        c = addUnsigned(c, cc);
        d = addUnsigned(d, dd);
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export async function calculateSHA256(string:any) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    // ArrayBuffer 转 Hex
    function arrayBufferToHex(buffer:any) {
        const bytes = new Uint8Array(buffer);
        return Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }
    return arrayBufferToHex(hashBuffer);
}
