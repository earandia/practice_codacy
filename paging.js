const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('¡Hola, mundo con Express!');
});

app.get('/test_code',(req,res)=>{
    res.send('<h4>Esto es un codigo de prueba</h4>');
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
