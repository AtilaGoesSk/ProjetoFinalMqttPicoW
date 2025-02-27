const Sequelize = require('sequelize');
const sequelize = new Sequelize('senai_trabalho','root','123tha123',{
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log("Conectado com sucesso!")
}).catch((erro) => {
    console.log("Falha ao se conectar: "+ erro);
})

module.exports ={
    Sequelize: Sequelize,
    sequelize: sequelize
}