import * as cheerio from "cheerio"
import * as iconvlite from 'iconv-lite';
import *  as uuid from 'uuid';
import *  as request from 'request';
// import request = require('request');
//var json2xls = require('json2xls');
import *  as json2xls from 'json2xls';
import *  as fs from 'fs';

// const fs = require('fs');

const rootUrl = `http://tw-dentist.com/front/bin`;
const $ = cheerio;

const crawlUrl = async (requestUrl: any) => {
  return new Promise((resolve, reject) => {
    request({ url: requestUrl, encoding: null }, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        var str = iconvlite.decode(new Buffer(body), "big5");
        resolve(str)
      }
    })
  });
}
//分開下載excel檔
const getNestBodyData = async (root: any) => {
  // console.log(root)

  return new Promise((resolve, reject) => {
    root.map(async (a: any) => {
      let nestedPatientQAListData: any[] = [];

      const nestWebsiteBody = await crawlUrl(a.url);
      const nestDataList = $(nestWebsiteBody).find('.shadow-link')
      for (let index = 0; index < nestDataList.length; index++) {
        const element = $(nestDataList[index]);
        const answer = $($(await crawlUrl(rootUrl + "/" + element.attr('href'))).find('.ptdet-text').children('p')[0]).text();
        nestedPatientQAListData.push({
          title: element.text(),
          answer: answer,
          url: rootUrl + "/" + element.attr('href')
        })
      }
      console.log(nestedPatientQAListData)
      let xls = json2xls(nestedPatientQAListData);
      fs.writeFileSync(`${a.title}.xlsx`, xls, 'binary');
    })

  });



}
//start:合併為一個excel檔下載
const getNestBodyDataUrl = async (root: any) => {
  const UrlArray = root.map(async (r: any) => await crawlUrl(r.url));
  const bb = Promise.all(UrlArray).then(a => {
    let newUrl: any[] = [];
    a.map((b: any) => {
      const nestDataList = $(b).find('.shadow-link')
      for (let index = 0; index < nestDataList.length; index++) {
        const element = $(nestDataList[index]);
        newUrl.push({
          title: element.text(),
          url: rootUrl + "/" + element.attr('href')
        })
      }
    })
    return newUrl;
  })
  return bb;
}
const getNestBodyDataExcel = async (root: any, patientQAListData: any) => {
  const bb1 = root.map(async (b1: any) => {
    return {
      url: b1.url,
      content: await crawlUrl(b1.url)
    }
  });
  // console.log(bb1)
  const bb = Promise.all(bb1).then((a: any) => {
    let nestedPatientQAListData: any[] = [];
    //   const nestDataList = 
    a.map((o: any) => {
      const element = $(o.content);
      const typeid = element.find('.path').last().text();
      //let aa=element.find('.ptdet-text').find('p').last().text('')
      // let answerArray=element.find('.ptdet-text')
      // .children().filter(':last').parent().text()//.text()
      let answerArray = element.find('.ptdet-text')
      if(answerArray.children().length==2){
        answerArray.children().last().remove();

      }else{
        answerArray.children().last().prev().remove();

      }
      let answerdata = answerArray.text();
      // .children().filter(':last').parent().text()//.text()
      const title = element.find('.ptdet-topic').text();
      nestedPatientQAListData.push({
        question: title,
        answer: answerdata,//answerArray//answers
        typeid: patientQAListData.filter(a => a.title === typeid)[0].id,
        url: o.url,
        id: uuid()
      })
    })

    console.log(nestedPatientQAListData)
    let xls = json2xls(nestedPatientQAListData);
    fs.writeFileSync(`DentistQnA.xlsx`, xls, 'binary');
  })
}
//end:合併為一個excel檔下載
(async () => {
  console.log("哏")
  let websiteBody = await crawlUrl(`${rootUrl}/cglist.phtml?Category=421169`)
  const patientQAList = $(websiteBody).find('.shadow-ptname');
  let patientQAListData: any = [];
  for (let index = 0; index < patientQAList.length; index++) {
    const element = $(patientQAList[index]).find('a');
    patientQAListData.push({
      title: element.text(),
      url: rootUrl + "/" + element.attr('href'),
      id: uuid()
    })

  }
  let xls = json2xls(patientQAListData);
  fs.writeFileSync(`DentistQnACategory.xlsx`, xls, 'binary');
  //await getNestBodyData(patientQAListData);
  let ss = await getNestBodyDataUrl(patientQAListData)
  //console.log(ss)
  await getNestBodyDataExcel(ss, patientQAListData);

})()
