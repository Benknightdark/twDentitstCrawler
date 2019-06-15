"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var cheerio = require("cheerio");
var iconvlite = require("iconv-lite");
var request = require("request");
// import request = require('request');
//var json2xls = require('json2xls');
var json2xls = require("json2xls");
var fs = require("fs");
// const fs = require('fs');
var rootUrl = "http://tw-dentist.com/front/bin";
var $ = cheerio;
var crawlUrl = function (requestUrl) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                request({ url: requestUrl, encoding: null }, function (err, response, body) {
                    if (!err && response.statusCode == 200) {
                        var str = iconvlite.decode(new Buffer(body), "big5");
                        resolve(str);
                    }
                });
            })];
    });
}); };
//分開下載excel檔
var getNestBodyData = function (root) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        // console.log(root)
        return [2 /*return*/, new Promise(function (resolve, reject) {
                root.map(function (a) { return __awaiter(_this, void 0, void 0, function () {
                    var nestedPatientQAListData, nestWebsiteBody, nestDataList, index, element, answer, _a, _b, xls;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                nestedPatientQAListData = [];
                                return [4 /*yield*/, crawlUrl(a.url)];
                            case 1:
                                nestWebsiteBody = _c.sent();
                                nestDataList = $(nestWebsiteBody).find('.shadow-link');
                                index = 0;
                                _c.label = 2;
                            case 2:
                                if (!(index < nestDataList.length)) return [3 /*break*/, 5];
                                element = $(nestDataList[index]);
                                _a = $;
                                _b = $;
                                return [4 /*yield*/, crawlUrl(rootUrl + "/" + element.attr('href'))];
                            case 3:
                                answer = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).find('.ptdet-text').children('p')[0]]).text();
                                nestedPatientQAListData.push({
                                    title: element.text(),
                                    answer: answer,
                                    url: rootUrl + "/" + element.attr('href')
                                });
                                _c.label = 4;
                            case 4:
                                index++;
                                return [3 /*break*/, 2];
                            case 5:
                                console.log(nestedPatientQAListData);
                                xls = json2xls(nestedPatientQAListData);
                                fs.writeFileSync(a.title + ".xlsx", xls, 'binary');
                                return [2 /*return*/];
                        }
                    });
                }); });
            })];
    });
}); };
//start:合併為一個excel檔下載
var getNestBodyDataUrl = function (root) { return __awaiter(_this, void 0, void 0, function () {
    var UrlArray, bb;
    var _this = this;
    return __generator(this, function (_a) {
        UrlArray = root.map(function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crawlUrl(r.url)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
        bb = Promise.all(UrlArray).then(function (a) {
            var newUrl = [];
            a.map(function (b) {
                var nestDataList = $(b).find('.shadow-link');
                for (var index = 0; index < nestDataList.length; index++) {
                    var element = $(nestDataList[index]);
                    newUrl.push({
                        title: element.text(),
                        url: rootUrl + "/" + element.attr('href')
                    });
                }
            });
            return newUrl;
        });
        return [2 /*return*/, bb];
    });
}); };
var getNestBodyDataExcel = function (root) { return __awaiter(_this, void 0, void 0, function () {
    var bb1, bb;
    var _this = this;
    return __generator(this, function (_a) {
        bb1 = root.map(function (b1) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crawlUrl(b1.url)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
        console.log(bb1);
        bb = Promise.all(bb1).then(function (a) {
            var nestedPatientQAListData = [];
            //   const nestDataList = 
            a.map(function (o) {
                var element = $(o);
                //let aa=element.find('.ptdet-text').find('p').last().text('')
                var answerArray = element.find('.ptdet-text').text();
                var title = element.find('.ptdet-topic').text();
                nestedPatientQAListData.push({
                    question: title,
                    answer: answerArray //answers
                });
            });
            console.log(nestedPatientQAListData);
            var xls = json2xls(nestedPatientQAListData);
            fs.writeFileSync("DentistQnA.xlsx", xls, 'binary');
        });
        return [2 /*return*/];
    });
}); };
//end:合併為一個excel檔下載
(function () { return __awaiter(_this, void 0, void 0, function () {
    var websiteBody, patientQAList, patientQAListData, index, element, ss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("哏");
                return [4 /*yield*/, crawlUrl(rootUrl + "/cglist.phtml?Category=421169")];
            case 1:
                websiteBody = _a.sent();
                patientQAList = $(websiteBody).find('.shadow-ptname');
                patientQAListData = [];
                for (index = 0; index < patientQAList.length; index++) {
                    element = $(patientQAList[index]).find('a');
                    patientQAListData.push({
                        title: element.text(),
                        url: rootUrl + "/" + element.attr('href')
                    });
                }
                return [4 /*yield*/, getNestBodyDataUrl(patientQAListData)
                    //console.log(ss)
                ];
            case 2:
                ss = _a.sent();
                //console.log(ss)
                return [4 /*yield*/, getNestBodyDataExcel(ss)];
            case 3:
                //console.log(ss)
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
