const http=require('http');
const app=require('./app');// ייבוא של האפליקציה שלנו
const port=5050;
const srv=http.createServer(app);

srv.listen(port,()=>{
    console.log('Server Up');
});