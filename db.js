const mongoose = require('mongoose');
const dbConfig = require('./config/dbConfig');
// mongoose.connect('mongodb://admin:admin@host:port/database?options...');
const db = mongoose.connection;

let collectDB = dbConfig.shopDB;

function connection(){
	// mongoose.connect('mongodb://localhost/admin',{ useNewUrlParser: true } );
	// mongoose.connect('mongodb://')
	// mongoose.connect("mongodb://admin:admin@localhost/admin",{ useNewUrlParser: true });
	mongoose.connect(`mongodb://${collectDB.user}:${collectDB.password}@localhost/${collectDB.db}`,{ useNewUrlParser: true });
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log('db connect success!');
		// we're connected!
	});
}

exports.connection = connection;



const adminLoginUserSchema = new mongoose.Schema({
	username:String,
	password:String,
	name:String
});

const shopSchema = new mongoose.Schema({
	id:Number,
	logo:String,
	name:String,
	phone:String,
	star:Number,
	logo:String,
	contacts:String,
	address: String,
	favourite: Number
});

const dishSchema = new mongoose.Schema({
	name:String,
	comments:Array,
	favourites:Number,
	pics:Array,
	description:String,
	type:Number,
	tags:Array,
	shopid:Number,
});

const clientUser = new mongoose.Schema({
	nickName:String,
	avatarUrl:String,
	gender: String,
	city:String,
	province: String,
	country: String,
	language: String,
	openid: String,
});


const shopModel = mongoose.model('shop', shopSchema);
const adminLoginUserModel = mongoose.model('adminLoginUser', adminLoginUserSchema);
const dishModel = mongoose.model('dish', dishSchema);
const clientUserModel = mongoose.model('clientUser', clientUser);



exports.shopModel = shopModel;
exports.adminLoginUserModel = adminLoginUserModel;
exports.dishModel = dishModel;
exports.clientUserModel = clientUserModel;




