/**
 * Created by wk on 2016/9/22.
 */
var _ = require("lodash");
var fileManagerModel = require("./filemanager.model");

exports.folderList = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {filemanger: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;

    opts.filemanger.pfileId = parseInt(param.pfileId) || 0;

    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    return fileManagerModel.folderListAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        body.response_params.total = result.total;
        res.status(200).json(body);
    });
};


/**
 * 文件名称
 * 文件类型
 * @param req
 * @param res
 * @param next
 */
exports.addFolder = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {folder: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.folder.folderName = param.folderName;
    opts.folder.fileType = param.fileType;
    opts.folder.title = param.title || '';
    opts.folder.fileSize = 0;
    opts.folder.createDate = '';
    opts.folder.updateDate = '';
    opts.folder.authorId = param.authorName || -1;
    opts.folder.authorName = param.authorName || '未知';
    opts.folder.path = param.path || '';
    opts.folder.remark = param.remark || '';
    opts.folder.pfileId = param.pfileId || 0;
    return fileManagerModel.addFolderAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};