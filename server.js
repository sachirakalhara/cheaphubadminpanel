// create an express app
const express = require("express")
const app = express()
const distFolder = `${process.cwd()}/build`

// use the express-static middleware
// app.use(express.static("/"))
app.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }))

// define the first route
app.get("*", function (req, res) {
    res.sendFile(`${distFolder}/index.html`)
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."))
