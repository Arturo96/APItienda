"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var MySQL = /** @class */ (function () {
    function MySQL() {
        this.cnn = mysql.createConnection({
            host: 'localhost',
            user: 'arturo',
            password: 'admin',
            database: 'tienda'
        });
        this.conectarDB();
    }
    Object.defineProperty(MySQL, "instance", {
        get: function () {
            return this._instance || (this._instance = new this());
        },
        enumerable: false,
        configurable: true
    });
    MySQL.ejecutarQuery = function (query, callback) {
        this.instance.cnn.query(query, function (err, results, fields) {
            if (err) {
                console.log('Error:', err);
                return callback(err);
            }
            if (results.length === 0) {
                callback('El registro solicitado no existe');
            }
            else {
                callback(null, results);
            }
        });
    };
    MySQL.prototype.conectarDB = function () {
        this.cnn.connect(function (err) {
            if (err) {
                console.log(err.message);
                return;
            }
            console.log('Base de datos online!!');
        });
    };
    return MySQL;
}());
exports.default = MySQL;
