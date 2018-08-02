if (navigator.userAgent.match(/SamsungBrowser/i)) {
	var isSamsungBrowser = true;
}
if (window.navigator.userAgent.indexOf('534.30') > 0) {
	var isSamsungBrowser2 = true;
}
if(navigator.userAgent.match(/SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i)) {
    var isSamsungBrowser3 = true;
}
if((/Galaxy.*Tab|SAMSUNG.*Tablet|Galaxy.*Tab|Android.*GT-/i).test(navigator.userAgent)) {
	var isSamsungBrowser4 = true;
}
if(((navigator.userAgent.indexOf('Mozilla/5.0') > -1 && navigator.userAgent.indexOf('Android ') > -1 &&     navigator.userAgent.indexOf('AppleWebKit') > -1) && !(navigator.userAgent.indexOf('Chrome') > -1))) {
	var isAndroid = true;
}

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1 && ua.indexOf("mobile") && ua.indexOf("chrome")==-1
if(isAndroid) {
   var isAndroid2 = true;
}

console.log('1: ' + isSamsungBrowser);
console.log('2: ' + isSamsungBrowser);
console.log('3: ' + isSamsungBrowser);
console.log('4: ' + isSamsungBrowser);
console.log('6: ' + isAndroid);
console.log('7: ' + isAndroid2);