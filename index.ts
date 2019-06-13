import cheerio from 'cheerio';
import iconvlite from 'iconv-lite';
import request from 'request';
var json2xls = require('json2xls');
const fs = require('fs');

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
(async () => {
  let websiteBody = await crawlUrl(`${rootUrl}/cglist.phtml?Category=421169`)
  const patientQAList = $(websiteBody).find('.shadow-ptname');
  let patientQAListData: any = [];
  for (let index = 0; index < patientQAList.length; index++) {
    const element = $(patientQAList[index]).find('a');
    patientQAListData.push({
      title: element.text(),
      url: rootUrl + "/" + element.attr('href')
    })

  }
  await getNestBodyData(patientQAListData);


})()
