// const excelToJson = require('convert-excel-to-json');
import * as excelToJson from  'convert-excel-to-json';
const result = excelToJson({
    sourceFile: 'DentistQnAFinal.xlsx',
    columnToKey: {
        A: 'ID',
        B: 'QnATypeID',
        C: 'Question',
        D: 'Answer',
        F: 'SourceUrl',

    }
});

let data=result['QnAData'].filter(a=>a.ID!='ID')
console.log(data.length)
// const sql = require('sql')
import * as sql from  'mssql';

(async function () {
    const config = {
        user: '',
        password: '',
        server: '', // You can use 'localhost\\instance' to connect to named instance
        database: '',
     
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }
    }
    try {
        let pool = await sql.connect(config)
        // let result1 = await pool.request()
        //    // .input('input_parameter', sql.Int, value)
        //     .query('select * from QnACategory')
            
        // console.dir(result1)
        data.map(async (a:any)=>{
            let querystring=`insert into [dbo].[QnAData]  (
                [ID]
                ,[QnATypeID]
                ,[Question]
                ,[Answer]
                ,[SourceUrl])
                 values (
                     '${a.ID}',
                     '${a.QnATypeID}',
                     N'${a.Question}',
                     N'${a.Answer}',
                     '${a.SourceUrl}'
                 )`;
                 console.log(querystring)
            await pool.request()
           // .input('input_parameter', sql.Int, value)
            .query(`${querystring}`, (err, result) => {
                    // ... error checks
             
                //   console.log(err)
                })
        })
        // Stored procedure
        

        
    } catch (err) {
        // ... error checks
    }
})()
 
sql.on('error', err => {
    // ... error handler
})