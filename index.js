const fs = require('fs');
const csv  = require('csvtojson');
const { Transform } = require('stream');
const { error } = require('console');
const main= () =>{
    // const readStream = fs.createReadStream('./annual-enterprise-survey-2021-financial-year-provisional-csv.csv');
    const readStream = fs.createReadStream('./import.csv');
    const writeStream = fs.createWriteStream('./write.csv')
    // readStream.on('data',(buffer)=>{
    //     console.log('DATA>>>');
    //     console.log(buffer);
    //     writeStream.write(buffer);
    // })
    // readStream.on('end',()=>{
    //     console.log('Stream Ended');
    //     writeStream.end()
    // })
    // readStream.pipe(writeStream)
    
    // readStream.pipe(
    //     csv({
    //         delimiter:';'
    //     },{objectMode:true})
    // ).on('data',data=>{
    //     console.log(data)
    // }) 

    const myTransform = new Transform({
            objectMode:true,
            transform(chunk,enc,callback){
            console.log('>> Chunk ',chunk);
            const user ={
                name:chunk.name,
                email: chunk.email.toLowerCase(),
                age: Number(chunk.age),
                isActive:chunk.isActive === 'true'
            }
            callback(null,user)    
            }
        })
    const myFilter = new Transform( {
        objectMode :true,
        transform(user,enc,callback){
            if(!user.isActive){
                callback(null)
                return
            }
            callback(null,user)
        }
    })

    readStream.pipe(
        csv({
            delimiter:';'
        },{objectMode:true})
    ).pipe(myFilter).pipe(myTransform).on('data',data=>{
        console.log('--Data ');
        console.log(data);
        writeStream.write(data)
    }).on('error',error=>{
        console.log('error',error)
    }).on('end',()=>{
        console.log('stream ended')
    })
    
}
main()