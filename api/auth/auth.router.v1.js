/**
 * Created by wk on 2015/12/13.
 */
var express = require('express');
var router = express.Router();
var apiAuth = require("./index");
router.post("/perm/addperm.json",apiAuth.perm.addPerm);
router.post("/perm/updperm.json",apiAuth.perm.updPerm);
router.post("/perm/delperm.json",apiAuth.perm.delPerm);
router.post("/perm/userpermsassignment.json",apiAuth.perm.userPermsAssignment);
router.post("/perm/rolepermsassignment.json",apiAuth.perm.rolePermsAssignment);
router.post("/perm/userroleassignment.json",apiAuth.perm.userRoleAssignment);
module.exports = router;