const Hotel = require('../models/hotel')


//exports.homePage = (req,res) => {
//    res.render('index', { title: 'Lets travel' }); //renderiza um template com a resposta do servidor
//}

exports.listAllHotels = async (req,res, next) => {
    try{
        const allHotels = await Hotel.find({ available: { $eq: true }}); //traz todos os hoteis do banco de dados
        res.render('all_hotels', {title: 'All Hotels', allHotels});
        //res.json(allHotels)
    } catch(errors){
        next(next);
    }
}

exports.homePageFilters = async (req, res, next) => {
    try {
        const hotels = await Hotel.aggregate([
            { $match: {available: true}},
            { $sample: { size: 9}}
        ]);
        const countries = await Hotel.aggregate([
            { $group: { _id: '$country'}},
            { $sample: { size: 9}}
        ]);
        res.render('index', { countries, hotels});
        
    } catch(error){
        next(error)
    }
}

exports.listAllCountries = async (req, res, next) => {
    try {
        const allCountries = await Hotel.distinct('country');
        res.render('all_countries', { title: 'Browse by country', allCountries});
    }catch(error) {
        next(error)
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

exports.editRemoveGet = (req, res) => {
    res.render('edit_remove', { title: 'Search for hotel to edit or remove'});
}

exports.editRemovePost = async (req, res, next) => {
    try{
        const hotelId = req.body.hotel_id || null;
        const hotelName = req.body.hotel_name || null;

        const hotelData = await Hotel.find({ $or: [
            { _id: hotelId },
            { hotel_name: hotelName }
        ]}).collation({
            locale: 'en', //procura resultados em inglês
            strength : 2 // o label não vai ser case sensitive
        });

        if(hotelData.length > 0) {
            res.render('hotel_detail', { title: 'Add / Remove Hotel', hotelData});
            return
        } else {
            res.redirect('/admin/edit-remove')
        }
    } catch(errors){
        next(errors)
    }
}

exports.updateHotelGet = async (req, res, next) => {
    try {
        const hotel = await Hotel.findOne({ _id: req.params.hotelId });
        res.render('add_hotel', { title: 'Update hotel', hotel });
    } catch(error) {
        next(error)
    }
}

exports.updateHotelPost = async (req, res, next) => {
    try {    
        const hotelID = req.params.hotelId;
        const hotel = await Hotel.findByIdAndUpdate(hotelID, req.body, {new:true});
        console.log(req.body);
        console.log(hotelID);
        res.status(200).send("string");
    } catch(error) {
        next(error)
    }
} 






//serve pra armazenar a lógica das rotas 