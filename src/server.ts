import express from 'express'

const app = express()

interface usuario{
    nome: string,
    idade: number,
    df: boolean
}

function usuario (usuario: usuario){
    return ({
        nome: usuario.nome,
        idade: usuario.idade,
        df: usuario.df,
    })
}

app.get('/home', (req, res) => {
    res.send(usuario({nome: 'Rodrigo', idade: 256
    , df: false}))
})


app.listen(3000)