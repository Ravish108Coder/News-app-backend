import {app} from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './data/database.js'

dotenv.config()


connectDB()

app.listen(process.env.PORT || 3333, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})