import { Router, Request, Response } from "express";
import MySQL from "../mysql/mysql";

const router = Router();
const _ = require("underscore");

router.get("/productos", (req: Request, res: Response) => {
	const tipoProducto = Number(req.query.tipo) || 0;
	const limite = Number(req.query.limite) || 0;

	const sqlTipo =
		tipoProducto <= 0
			? ""
			: `
        WHERE tipoProducto = ${MySQL.instance.cnn.escape(tipoProducto)}
    `;

	const sqlLimite = limite <= 0 ? "" : `LIMIT ${limite}`;

	const sql = `
        SELECT id, modelo, marca, descripcion, fechaPublicacion
        FROM PRODUCTO ${sqlTipo} ${sqlLimite}
    `;

	MySQL.ejecutarQuery(sql, (err: any, productosDB: Object[]) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			productosDB
		});
	});
});

router.get("/productos/:id", (req: Request, res: Response) => {
	const id = req.params.id;

	const escapedId = MySQL.instance.cnn.escape(id);

	const sql = `
        SELECT id, modelo, marca, descripcion
        FROM PRODUCTO
        WHERE id=${escapedId}
    `;

	MySQL.ejecutarQuery(sql, (err: any, productosDB: Object[]) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			producto: productosDB[0]
		});
	});
});

router.get('/precioAcumulado', (req: Request, res: Response) => {
    const sql = 'SELECT SUM(precio) AS precioAcumulado FROM PRODUCTO';

    MySQL.ejecutarQuery(sql, (err: any, precioAcumulado: any) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        const {precioAcumulado:suma} = precioAcumulado[0] 

        res.json({
            ok: true,
            suma
        })
    })
})

router.post("/productos", (req: Request, res: Response) => {
	const { body } = req;

	let producto = {
		tipo: MySQL.instance.cnn.escape(Number(body.tipo)),
		modelo: MySQL.instance.cnn.escape(body.modelo),
		marca: MySQL.instance.cnn.escape(body.marca),
		descripcion: MySQL.instance.cnn.escape(body.descripcion) || "",
		precio: MySQL.instance.cnn.escape(Number(body.precio)),
		cantidad: MySQL.instance.cnn.escape(Number(body.cantidad)),
		meses: MySQL.instance.cnn.escape(Number(body.meses))
	};

	const sql = `
        INSERT INTO PRODUCTO(tipoProducto, modelo, marca, descripcion,precio, cantidadInv, mesesGarantia)        
        VALUES(${producto.tipo},${producto.modelo},${producto.marca},${producto.descripcion},${producto.precio},${producto.cantidad},${producto.meses})
    `;

    console.log(sql)

	MySQL.ejecutarQuery(sql, (err: any, producto: any) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			producto
		});
	});
});

router.put("/productos/:id", (req: Request, res: Response) => {
	const id = Number(req.params.id) || 0;
	const escapedId = MySQL.instance.cnn.escape(id);

	const body = _.pick(req.body, [
		"tipoProducto",
		"modelo",
		"marca",
		"descripcion",
		"precio",
		"cantidadInv"
	]);

	let sql = "UPDATE PRODUCTO SET ";

	const producto = Object.entries(body);
	producto.forEach((reg, i) => {
		let aux = i == producto.length - 1 ? "" : ",";
		const [attr, value] = reg;
		sql += `${attr} = ${MySQL.instance.cnn.escape(value)}${aux} `;
	});

	sql += `WHERE id = ${escapedId}`;

	console.log(sql);

	MySQL.ejecutarQuery(sql, (err: any, producto: any) => {
	    if(err) {
	        return res.status(500).json({
	            ok: false,
	            err
	        })
	    }

	    if(!producto.affectedRows) {
	        return res.status(400).json({
	            ok: false,
	            err: 'Registro no encontrado'
	        })
	    }

	    res.json({
	        ok: true,
	        producto
	    })
	})

});

router.delete("/productos/:id", (req: Request, res: Response) => {
	const id = Number(req.params.id) || 0;
	const escapedId = MySQL.instance.cnn.escape(id);

	let sql = "DELETE FROM PRODUCTO WHERE id = " + escapedId;

	MySQL.ejecutarQuery(sql, (err: any, producto: any) => {
	    if(err) {
	        return res.status(500).json({
	            ok: false,
	            err
	        })
	    }

	    if(!producto.affectedRows) {
	        return res.status(400).json({
	            ok: false,
	            err: 'Registro no encontrado'
	        })
	    }

	    res.json({
	        ok: true,
	        producto
	    })
	})

});

export default router;
