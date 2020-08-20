import {Router, Request, Response} from 'express';
import MySQL from '../mysql/mysql';

const router = Router();

router.get('/productos', (req: Request, res: Response) => {

    const tipoProducto = Number(req.query.tipo) || 0;
    const limite = Number(req.query.limite) || 0;

    const sqlTipo = tipoProducto <= 0 ? '' : `
        WHERE tipoProducto = ${MySQL.instance.cnn.escape(tipoProducto)}
    `;

    const sqlLimite = limite <= 0 ? '' : `LIMIT ${limite}`;

    const sql = `
        SELECT id, modelo, marca, descripcion
        FROM PRODUCTO ${sqlTipo} ${sqlLimite}
    `

    MySQL.ejecutarQuery(sql, (err: any, productosDB: Object[]) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productosDB
        })
    })
})

router.get('/productos/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    const escapedId = MySQL.instance.cnn.escape(id);

    const sql = `
        SELECT id, modelo, marca, descripcion
        FROM PRODUCTO
        WHERE id=${escapedId}
    `

    MySQL.ejecutarQuery(sql, (err: any, productosDB: Object[]) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productosDB[0]
        })
    })
})

export default router;