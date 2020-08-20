import {Router, Request, Response} from 'express';
import MySQL from '../mysql/mysql';

const router = Router();

router.get('/productos', (req: Request, res: Response) => {

    const sql = `
        SELECT id, modelo, marca, descripcion
        FROM PRODUCTO
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

export default router;