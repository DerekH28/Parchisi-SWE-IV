const app = require('express')();
const PORT = 8080;

app.listen(
    PORT, 
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

// rec => receive
// res => respond
app.get('/', (rec, res) => {
    res.send('Parcheesi - Server');
});

module.exports = app; 