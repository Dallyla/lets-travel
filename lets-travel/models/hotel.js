const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    hotel_name: {
        type: String,
        required: 'Hotel name is required', //se o campo do nome do hotel estiver vazio essa mensagem aparecerá
        max: 32,   //max de caracteres
        trim: true // remove qualuer espaço em branco nos campos deixando só os caracteres
    },
    hotel_description: {
        type: String,
        required: 'Hotel description is required',
        trim: true
    },
    image: String,
    star_rating: {
        type: Number,
        required: 'Hotel star rating is required',
        max: 5
    },
    country: {
        type: String,
        required: 'Country is required',
        trim: true
    },
    cost_per_night: {
        type: Number,
        required: 'Cost per night is required'
    },
    available: {
        type: Boolean,
        required: 'Availability is required'
    }
});

hotelSchema.index({
    hotel_name: 'text',
    country: 'text'
})

//esse Schema vai mapear ou combinar com os dados dentro do banco de dados, logo vai definir como os dados do banco de dados serão construídos


//export model
module.exports = mongoose.model('Hotel', hotelSchema);
