import express from 'express';
import {PrismaClient} from '@prisma/client';
import convertHourStringToMinutes from './utils/convertHourStringToMinutes';
import convertMinutesToString from './convertMinutesToString';
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

//Permitindo json no servidor express
app.use(express.json());

//Config cors da aplicação (camada de proteção contra acessos ao backend)
app.use(cors())

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

    return res.status(200).json(games)
})
app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const body = req.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
	        yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel:  body.useVoiceChannel,
        }
    })
    
    return res.status(201).json(ad);
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
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToString(ad.hourStart),
            hourEnd: convertMinutesToString(ad.hourEnd),
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