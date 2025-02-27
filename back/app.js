const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mqtt = require('mqtt');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

const brokerUrl = 'mqtt://broker.hivemq.com';
const topic = 'equipevueiotia';
const mqttClient = mqtt.connect(brokerUrl);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Responda Verdadeiro caso a pergunta seja Verdadeira se for falsa responda Falso , caso não seja uma pergunta de verdadeiro ou falso responda Nulo",
});

const User = require('./models/Usuario');
const Pergunta = require('./models/Pergunta');
const Resposta = require('./models/Resposta');

const app = express();

mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
});

mqttClient.on('error', (err) => {
    console.error('Erro ao conectar ao broker MQTT:', err);
});

User.hasOne(Pergunta, {
    foreignKey: 'fk_id_user',
    as: 'pergunta',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

Pergunta.hasOne(Resposta, {
    foreignKey: 'fk_id_pergunta',
    as: 'resposta',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

Pergunta.belongsTo(User, {
    foreignKey: 'fk_id_user',
    as: 'user'
});

Resposta.belongsTo(Pergunta, {
    foreignKey: 'fk_id_pergunta',
    as: 'pergunta'
});

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'equipeiot',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 3600000
    }
}));


const authMiddleware = (req, res, next) => {
    //if (!req.session.user) {
    //    res.status(401).json({ code: 0, message: 'Usuário não autenticado.' });
    //} else {
        next();
    //}
};

app.post('/logar', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return res.status(200).json({ status: 0, message: 'Usuário não encontrado.' });
    }

    if (user.senha !== password) {
        return res.status(200).json({ status: 0, message: 'Senha incorreta.' });
    }

    console.log('Sessão antes de salvar: ', req.session);

    req.session.user = {
        id: user.id_user,
        username: user.username,
        email: user.email
    };

    req.session.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao salvar sessão.' });
        }

        console.log('Sessão salva: ', req.session);
        return res.status(200).json({ status: 1, account: req.session.user });
    });
});


app.post('/cadastrouser', async (req, res) => {
    const { user, email, senha } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
        try {
            const newUser = await User.create({ username: user, email, senha });

            req.session.user = {
                id: newUser.id_user,
                username: newUser.username,
                email: newUser.email
            };

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Erro ao salvar sessão.' });
                } else {
                    res.status(200).json({ status: 1, account: req.session.user });
                }
            });
        } catch (error) {
            res.status(503).json({ status: 0, error: error.message });
        }
    } else {

        res.json({ status: 2 });
    }
});


app.post('/sair', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao finalizar a sessão.' });
        }
        return res.status(200).json({ message: 'Logout realizado com sucesso.' });
    });
});

app.get('/listarPerguntas', authMiddleware, async (req, res) => {
    try {
        const perguntas = await Pergunta.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id_user', 'username', 'email'] },
                { model: Resposta, as: 'resposta', attributes: ['resp'] }
            ],
            order: [['id_pergunta', 'desc']]
        });

        const perguntaFormatada = perguntas.map(pergunta => ({
            id_pergunta: pergunta.id_pergunta,
            texto: pergunta.texto,
            user: pergunta.user ? pergunta.user.get({ plain: true }) : null,
            resposta: pergunta.resposta ? pergunta.resposta.get({ plain: true }) : null
        }));

        return res.status(200).json(perguntaFormatada);
    } catch (error) {
        return res.status(503).json({ error: error.message });
    }
});

app.get("/perguntasPerfil/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    const perguntaComResposta = await Pergunta.findAll({
        where: { fk_id_user: id },
        include: { model: Resposta, as: 'resposta' },
        order: [['id_pergunta', 'desc']]
    });

    return res.status(200).json({ perguntaComResposta });
});

app.post("/enviarPergunta/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { pergunta } = req.body;

    try {
        const result = await model.generateContent(pergunta + "?");
        const responseText = result.response.text().trim();

        if (responseText === "Nulo") {
            return res.status(200).json({
                status: 0,
                resposta: "Você não enviou uma pergunta de verdadeiro ou falso. Refaça a pergunta"
            });
        }

        const novaPergunta = await Pergunta.create({
            texto: pergunta,
            fk_id_user: id
        });

        await Resposta.create({
            resp: responseText,
            fk_id_pergunta: novaPergunta.id_pergunta,
        });

        mqttClient.publish(topic, responseText, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao publicar mensagem.' });
            }

            console.log(`Mensagem publicada no tópico ${topic}: ${responseText}`);
            return res.status(200).json({
                status: 1,
                message: "Pergunta enviada e processada com sucesso.",
                resposta: responseText
            });
        });
    } catch (error) {
        return res.status(503).json({ status: 0, error: error.message });
    }
});

app.delete("/deletarPergunta/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await Pergunta.destroy({ where: { id_pergunta: id } });

        return res.status(200).json({ code: 1, message: "Pergunta excluída com sucesso!" });
    } catch (error) {
        console.error("Erro: ", error);
        return res.status(503).json({ code: 0, error: error.message });
    }
});

app.put("/editarPergunta/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { pergunta } = req.body;

    try {
        await Pergunta.update(
            { texto: pergunta },
            { where: { id_pergunta: id } }
        );

        const result = await model.generateContent(pergunta + "?");
        const responseText = result.response.text().trim();

        await Resposta.update(
            { resp: responseText },
            { where: { fk_id_pergunta: id } }
        );

        return res.status(200).json({ code: 1, message: "Pergunta editada com sucesso!" });
    } catch (error) {
        return res.status(503).json({ code: 0, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
