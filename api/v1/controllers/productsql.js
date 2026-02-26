const mysql2 = require('mysql2');
//const mysqldb=require('../modules/mysql');
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'shai',
    password: '1234',
    database: 'ecommdb'
});

connection.connect(err => {
    if (!err) console.log('good my sql connection');
    else console.log(err);
});

const productController = {

    getAllProducts: (req, res) => {
        let sql = "SELECT * FROM t_product";
        mysqldb.promise().query(sql).then((results) => {
              return res.status(200).json(results[0]);
            })
           
    },

    getProductById: (req, res) => {
        const id = req.params.id;
        let sql = `SELECT * FROM t_product WHERE pid = ${id}`;
        connection.promise().query(sql).then((results) => {
                res.status(200).json(results[0]);
            })
           
    },

    addProduct: (req, res) => {
       const id=req.params.id;
       const prod=req.body;
       let sql=`insert into t_product (pname,price,pdesct,picname)values(`;
       sql+=`'${prod.pname}',${prod.price},${prod.pdesc},${prod.picnmae}`;
       
       let newsql=`insert into t_product (pname,price,pdesct,picname)values('${prod.pname}',${prod.price},${prod.pdesc},${prod.picnmae})`;
       connection.promise().query(sql).then((results)=>{
        return res.status(200).json(results[0]);
       })
        },

    updateProductById: (req, res) => {
        const pid =req.params.id;
        const prod=req.body;
        let sql= `update t_product set pname='${prod.pname}',price=${prod.price}where pid${id}`;
        connection.promise().query(sql).then((results)=>{
            return res.status(200).json(results[0]);
        })
    },

    deleteProductById: (req, res) => {
        let sql=`delete from t_product where pid = ${id}`;
       connection.promise().query(sql).then((results) => {
                res.status(200).json(results[0]);
            })
        }}


module.exports = productController;
