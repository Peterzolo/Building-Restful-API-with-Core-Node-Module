const http = require("http")


const server = http.createServer( (req, res) =>{
 res.end("Hello world\n")
})
const Port = 5000;

server.listen(Port, () =>console.log(`Server is running on port ${Port}`))