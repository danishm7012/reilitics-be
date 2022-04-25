import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import passport from 'passport'
import bodyParser from 'body-parser'
import multer from 'multer'
import { upload } from './middleware/multer.js'
import multipart from 'connect-multiparty'
import cookieSession from 'cookie-session'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import { Country, State, City } from 'country-state-city'

import packageRoutes from './routes/packageRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import resourceRoutes from './routes/resourceRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import marketStats from './routes/marketStats.js'
// import demographicStats from './routes/demographicStats.js'
import newDemographicStats from './routes/newDemographicRoutes.js'
import economicStats from './routes/economicStats.js'
import articleRoutes from './routes/articleRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import newsLetterRoutes from './routes/newLetterRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
import favouriteRoutes from './routes/favouriteRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import { googlePassport } from './config/googlePassport.js'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()

// Swagger
// const swaggerOptions ={
//   swaggerDefinition:{
//     info:{
//       title: 'Apis',
//       descriptption: 'Api Information',
//       contact:{
//         name: "Ahmad Hassan"
//       },
//       servers: ["http://localhost:5000"]
//     }
//   },
//   apis: ['server.js']
// }

// const swaggerDocs = swaggerJsDoc(swaggerOptions);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// /**
//  * @swagger
//  * /api/packageRoute
//  *  get:
//  *    description: This is my fiest api
//  *    responses:
//  *       '200':
//  *         description: A sccessfull response
//  */

// googlePassport(passport)
dotenv.config()

connectDB()

// saving cookies in session
app.use(
  cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2'],
  })
)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(multipart());

app.use(express.json())
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://reilitics-bizzclan.vercel.app',
      'https://reilitics-admin.vercel.app',
    ],
    credentials: true,
  })
)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/package', packageRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/resource', resourceRoutes)
app.use('/api/note', noteRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/market', marketStats)
//app.use('/api/demographic', demographicStats)
app.use('/api/demographic', newDemographicStats)
app.use('/api/economic', economicStats)
app.use('/api/article', articleRoutes)
app.use('/api/users', userRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/income', accountRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/newsletter', newsLetterRoutes)
app.use('/api/page', pageRoutes)
app.use('/api/favorite', favouriteRoutes)
app.use('/api/notification', notificationRoutes)

app.get('/api/countries', (req, res) => {
  const contry = Country.getAllCountries()
  res.send({ success: true, contry })
})
app.get('/api/states/:countryCode', (req, res) => {
  const state = State.getStatesOfCountry(req.params.countryCode)
  res.send({ success: true, state })
})
app.get('/api/cities/:countryCode', (req, res) => {
  const state = City.getCitiesOfCountry(req.params.countryCode)
  res.send({ success: true, state })
})

app.get('/api/config/paypal', (req, res) =>
  res.json({ success: true, clientID: process.env.PAYPAL_CLIENT_ID })
)

//Facebook auth
app.get('/auth/facebook', passport.authenticate('facebook'))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/api', (req, res) => {
  res.send('API is running....')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
