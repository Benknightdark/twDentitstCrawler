"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
axios_1["default"].get('http://tw-dentist.com/front/bin/cglist.phtml?Category=421169').then(function (r) {
    console.log(r);
});
