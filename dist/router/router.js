"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var router = express_1.Router();
router.get('/productos', function (req, res) {
    var sql = "\n        SELECT id, modelo, marca, descripcion\n        FROM PRODUCTO\n    ";
    mysql_1.default.ejecutarQuery(sql, function (err, productosDB) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            productosDB: productosDB
        });
    });
});
exports.default = router;
