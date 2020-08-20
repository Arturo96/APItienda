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

router.post('/productos', (req: Request, res: Response) => {

    const {body} = req;

    let producto = {
        tipo: Number(body.tipo),
        modelo: body.modelo,
        marca: body.marca,
        descripcion: body.descripcion || '',
        precio: Number(body.precio),
        cantidad: Number(body.cantidad),
        meses: Number(body.meses)
    }

    // const escapedId = MySQL.instance.cnn.escape(id);

    const sql = `
        INSERT INTO PRODUCTO(tipoProducto, modelo, marca, descripcion,precio, cantidadInv, mesesGarantia)        
        VALUES(${producto.tipo},"${producto.modelo}","${producto.marca}","${producto.descripcion}",${producto.precio},${producto.cantidad},${producto.meses})
    `

    MySQL.ejecutarQuery(sql, (err: any, producto: any) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })
    })

})

export default router;