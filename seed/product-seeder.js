var Product = require('../models/product');

var mongoose = require('mongoose');
const { db } = require('../models/product');
const product = require('../models/product');



const URI = "mongodb+srv://admin:admin@cluster0.pjw4x.mongodb.net/test?authSource=admin&replicaSet=atlas-6mkrsd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

// connect to database 
 mongoose.connect(URI ,{ useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('connected')) ;

var Products  = [
    new Product({
    imagePath : 'https://www.axess-industries.com/protection-respiratoire/masque-de-protection-ffp2-3m-p-320432-450x450.jpg',
    title: 'mask 1',
    description :'ffp2 mask',
    price: 10
}) ,
new Product({
    imagePath : 'https://media.rehabilitaweb.es/product/mascarilla-ffp2-kn95-800x800_MhIgON3.jpg',
    title: 'mask2',
    description :'ffps masck',
    price: 11
}) ,
new Product({
    imagePath : 'https://www.ld-medical.fr/1401-large_default/masques-de-protection-respiratoire-ffp2.jpg',
    title: 'mask 3',
    description :'ffps3 masck',
    price: 12
}) ,


];




var done=0;
for( var i = 0; i< Products.length; i ++){
    Products[i].save(function(err,result){
        done++;
        console.log('saving?' + Products[i]);
        if(done==Products.length){
            exit();
        }
    });
}

function exit (){
    mongoose.disconnect();    
}
