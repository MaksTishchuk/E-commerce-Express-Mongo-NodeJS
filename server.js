const express = require('express')
const env = require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./routes/index')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.options('*', cors)
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/api', router)


async function start() {
    try {
        mongoose.set("strictQuery", false)
        await mongoose.connect(process.env.mongoURI)
            .then(() => {
                console.log('Database has been connected!')
            })
            .catch((err) => {
                console.log(err)
            })
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}!`)
        })
    } catch (error) {
        console.log('Server Error:', error.message)
        process.exit(1)
    }
}

start()
