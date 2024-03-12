import {app} from './app.js'
import {config} from 'dotenv'
import { connectDB } from './data/database.js'

config({
    path: "./.env.local"
})

connectDB()

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})