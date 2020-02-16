const Hotel = require('../models/hotel')

exports.homePage = (req,res) => {
    res.render('index', { title: 'Lets travel' }); //renderiza um template com a resposta do servidor
}

exports.listAllHotels = async (req,res, next) => {
    try{
        const allHotels = await Hotel.find({ available: { $eq: true }}); //traz todos os hoteis do banco de dados
        res.render('all_hotels', {title: 'All Hotels', allHotels});
        //res.json(allHotels)
    } catch(errors){
        next(next);
    }
}

exports.adminPage = (req,res) => {
    res.render('admin', { title: 'Admin'});
}

exports.createHotelGet = (req,res) => {
    res.render('add_hotel', { title: 'Add new hotel'});
}

exports.createHotelPost = async (req, res, next) => { //async pausa uma função até que uma linha de código termine de rodar 
    try {
        const hotel = new Hotel(req.body);
        await hotel.save(); //await garante que o código pause e espere terminar antes de ir para apróxima linha
        res.redirect(`/all/${hotel._id}`); //redirecionar para a página do hotel depois que ele for salvo
    } catch(error){
        next(error); //passa o error além do middleware até chegar a um error handler que possa lidar com ele
    }
    
}
//serve pra armazenar a lógica das rotas 