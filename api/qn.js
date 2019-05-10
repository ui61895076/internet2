const qiniu =require('qiniu');
const express = require('express');
const router= express.Router();

router.get('/qiniu',(req,res)=>{
    let accessKey = '96G1tJ7yXrLJK-GVlr4G409xvxCdBqEUV-r2PGzF'
    let secretKey = 'larkKfBrSj_O2DI9qz98eKB8oqKiyiESUKuSQewM'
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let bucket = 'blog2'
    //要上传的空间
    let options = {
        scope: bucket,
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };

    // 构建上传凭证
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken=putPolicy.uploadToken(mac);
    res.json(uploadToken)

})

module.exports= router