import express from 'express'
import {PrismaClient} from '@prisma/client'

const app = express()
app.use(express.json())

const prisma = new PrismaClient()

/*HTTP methods / API RESTfull / 

HTTP Codes
(retorno de tratamento de erros no corpo da resposta ERRO:(200,300,404,500))*/

/*
Query: localhost:3333/ads?page=2
Route: localhost:3333/ads/5 localhost:3333/post/como-criar-uma-api-em-node
Body: {}
*/

app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    res.status(200).json(games)
})
app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id
    const body = req.body

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
	        yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: body.hourStart,
            hourEnd: body.hourEnd,
            useVoiceChannel:  body.useVoiceChannel,
        }
    })
    
    res.status(201).json(body)
})
app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id

    const ads = await prisma.ad.findMany({
        select : {
            id: true,
            name: true,
            useVoiceChannel: true,
            weekDays: true,
            hourStart: true,
            hourEnd: true,
            yearsPlaying: true,
        },
        where:{
            gameId,
        },
        orderBy: {
            createAt: 'desc'
        }
    })

    res.status(200).json(ads.map(ad => {
        return{
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
})
app.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    return res.status(200).json({
        discord: ad.discord
    })
})


app.listen(3000)