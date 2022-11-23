const multer = require('multer');
const path = require('path');


// 文件上传配置
const fileStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/avatar'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
// 导出配置
module.exports = {
    fileUpdate: multer({ 'storage': fileStorage }),
}