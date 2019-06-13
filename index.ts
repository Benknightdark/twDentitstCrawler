import axios from 'axios';
import cheerio from 'cheerio';
import iconvlite from 'iconv-lite';
import request from 'request';
 const  aa=async()=>{

  request({ url: 'http://tw-dentist.com/front/bin/cglist.phtml?Category=421169',encoding:null} , function(err,     response, body) {
        if (!err && response.statusCode == 200) {
          var str = iconvlite.decode(new Buffer(body), "big5");
          console.log(str);
        }
      })
  
 
  ;
    
}
aa();


// , function(err,     response, body) {
//     if (!err && response.statusCode == 200) {
//       var str = iconvlite.decode(new Buffer(body), "big5");
//       console.log(str);
//     }
//   }