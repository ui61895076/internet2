<template>
    <div>
        <el-upload
                class="upload-demo"
                :action='domain'
                :show-file-list="false"
                :http-request = upqiniu
                :before-upload="beforeAvatarUpload"
        >
            <el-button size="small" type="primary">点击上传</el-button>

        </el-upload>
        <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                qiniuToken:'',
                domain:'https://upload.qiniup.com',
                qiniuaddr:'pr9qeh93n.bkt.clouddn.com',
                imageUrl:'',
            }
        },
        created(){
            this.$axios.get('/qn/qiniu').then(res=>{
                this.qiniuToken = res.data
            })
        },
        methods:{
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            upqiniu(req){
                const config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                let filetype = ''
                if (req.file.type === 'image/png') {
                    filetype = 'png'
                } else {
                    filetype = 'jpg'
                }
                // 重命名要上传的文件
                const keyname = 'yhb' + new Date().getTime()+Math.floor(Math.random() * 100) + '.' + filetype
                const formdata = new FormData()
                formdata.append('file', req.file)
                formdata.append('token', this.qiniuToken)
                formdata.append('key', keyname)
                this.$axios.post(this.domain,  formdata, config).then(res => {
                    this.imageUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.upload-demo{
    width: 100%;
    height: 32px;
    overflow: hidden;
}

</style>
