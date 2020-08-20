"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var router = express_1.Router();
router.get('/productos', function (req, res) {
    var tipoProducto = Number(req.query.tipo) || 0;
    var limite = Number(req.query.limite) || 0;
    var sqlTipo = tipoProducto <= 0 ? '' : "\n        WHERE tipoProducto = " + mysql_1.default.instance.cnn.escape(tipoProducto) + "\n    ";
    var sqlLimite = limite <= 0 ? '' : "LIMIT " + limite;
    var sql = "\n        SELECT id, modelo, marca, descripcion\n        FROM PRODUCTO " + sqlTipo + " " + sqlLimite + "\n    ";
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
router.get('/productos/:id', function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.cnn.escape(id);
    var sql = "\n        SELECT id, modelo, marca, descripcion\n        FROM PRODUCTO\n        WHERE id=" + escapedId + "\n    ";
    mysql_1.default.ejecutarQuery(sql, function (err, productosDB) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            producto: productosDB[0]
        });
    });
});
exports.default = router;
