const db = require('@root/db')
const { validationResult } = require('express-validator')

const revokePublicHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { id } = req.body

    const revokePublicSql = `UPDATE postal_options SET is_open = 'false'  WHERE id = ${id} and is_active = 'true' and is_open= 'true' `

    db.getConnection((err, conn) => {
        if (err) return res.status(402).send({ msg: "从连接池获取连接失败" })

        conn.query(revokePublicSql, (err, result) => {
            if (err) return res.status(402).send({ msg: err.message || err.sqlMessage })

            if (result.affectedRows !== 1) return res.status(402).send({ msg: "取消公开信操作失败" })
            return res.send({ msg: "取消公开信成功" })
        })

        db.releaseConnection(conn)
    })
}

module.exports = {
    revokePublicHandler,
}