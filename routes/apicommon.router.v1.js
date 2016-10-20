/**
 * Created by wk on 2015/12/13.
 */
var express = require('express');
var router = express.Router();
var apiCommon = require("../api/common");

router.get("/auth/getclientid.json", apiCommon.auth.getClientId);
module.exports = router;