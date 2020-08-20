"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var router = express_1.Router();
var _ = require("underscore");
router.get("/productos", function (req, res) {
    var tipoProducto = Number(req.query.tipo) || 0;
    var limite = Number(req.query.limite) || 0;
    var sqlTipo = tipoProducto <= 0
        ? ""
        : "\n        WHERE tipoProducto = " + mysql_1.default.instance.cnn.escape(tipoProducto) + "\n    ";
    var sqlLimite = limite <= 0 ? "" : "LIMIT " + limite;
    var sql = "\n        SELECT id, modelo, marca, descripcion, fechaPublicacion\n        FROM PRODUCTO " + sqlTipo + " " + sqlLimite + "\n    ";
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
router.get("/productos/:id", function (req, res) {
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
router.get('/precioAcumulado', function (req, res) {
    var sql = 'SELECT SUM(precio) AS precioAcumulado FROM PRODUCTO';
    mysql_1.default.ejecutarQuery(sql, function (err, precioAcumulado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        var suma = precioAcumulado[0].precioAcumulado;
        res.json({
            ok: true,
            suma: suma
        });
    });
});
router.post("/productos", function (req, res) {
    var body = req.body;
    var producto = {
        tipo: mysql_1.default.instance.cnn.escape(Number(body.tipo)),
        modelo: mysql_1.default.instance.cnn.escape(body.modelo),
        marca: mysql_1.default.instance.cnn.escape(body.marca),
        descripcion: mysql_1.default.instance.cnn.escape(body.descripcion) || "",
        precio: mysql_1.default.instance.cnn.escape(Number(body.precio)),
        cantidad: mysql_1.default.instance.cnn.escape(Number(body.cantidad)),
        meses: mysql_1.default.instance.cnn.escape(Number(body.meses))
    };
    var sql = "\n        INSERT INTO PRODUCTO(tipoProducto, modelo, marca, descripcion,precio, cantidadInv, mesesGarantia)        \n        VALUES(" + producto.tipo + "," + producto.modelo + "," + producto.marca + "," + producto.descripcion + "," + producto.precio + "," + producto.cantidad + "," + producto.meses + ")\n    ";
    console.log(sql);
    mysql_1.default.ejecutarQuery(sql, function (err, producto) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            producto: producto
        });
    });
});
router.put("/productos/:id", function (req, res) {
    var id = Number(req.params.id) || 0;
    var escapedId = mysql_1.default.instance.cnn.escape(id);
    var body = _.pick(req.body, [
        "tipoProducto",
        "modelo",
        "marca",
        "descripcion",
        "precio",
        "cantidadInv"
    ]);
    var sql = "UPDATE PRODUCTO SET ";
    var producto = Object.entries(body);
    producto.forEach(function (reg, i) {
        var aux = i == producto.length - 1 ? "" : ",";
        var attr = reg[0], value = reg[1];
        sql += attr + " = " + mysql_1.default.instance.cnn.escape(value) + aux + " ";
    });
    sql += "WHERE id = " + escapedId;
    console.log(sql);
    mysql_1.default.ejecutarQuery(sql, function (err, producto) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!producto.affectedRows) {
            return res.status(400).json({
                ok: false,
                err: 'Registro no encontrado'
            });
        }
        res.json({
            ok: true,
            producto: producto
        });
    });
});
router.delete("/productos/:id", function (req, res) {
    var id = Number(req.params.id) || 0;
    var escapedId = mysql_1.default.instance.cnn.escape(id);
    var sql = "DELETE FROM PRODUCTO WHERE id = " + escapedId;
    mysql_1.default.ejecutarQuery(sql, function (err, producto) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!producto.affectedRows) {
            return res.status(400).json({
                ok: false,
                err: 'Registro no encontrado'
            });
        }
        res.json({
            ok: true,
            producto: producto
        });
    });
});
exports.default = router;
