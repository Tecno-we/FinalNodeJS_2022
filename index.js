var express=require('express'); 
var app = express(),bodyParser = require("body-parser");
const admin = require('firebase-admin');
var nodemailer = require('nodemailer');
var location = require('location-href')
var serviceAccount = require("./key.json");
var cors = require("cors");



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tecnologias-web-uaa-default-rtdb.firebaseio.com/"
});
app.use(bodyParser.json());
app.use(cors({origin:'*'}))
const firedb = admin.database()
/*************************  INSERT PRODUCTOS   ***********************/
app.post('/firebase-db',(req,res)=>{
	const newContact=req.query;
	firedb.ref("productos").push(newContact);
	res.send('recibido')
	});
	
app.get('/firebase-db',(req,res)=>{
	const newContact=req.query;
	firedb.ref("productos").push(newContact);
	res.send('recibido')
	});
/**********************************************/
/*
app.get('/auto',(req,res)=>{
	let i;
	for(i=0;i<preguntas.length;i++)
		firedb.ref("preguntas").push(preguntas[i]);
	res.send({cant:i})
})
*/


app.get('/addCarrito',(req,res)=>{
	const newProd = req.params;
	firedb.ref("carrito").push(newProd);
	res.send(newProd);
});

app.get('/addUsuario/:nombre/:correo/:usuario/:pass',(req,res)=>{
	const newProd = req.params;
	newProd.tipo="2"
	firedb.ref("usuarios").push(newProd);
	res.send(newProd);
});



app.get('/firebase-cat',(req,res)=>{
	let r = req.query;
	const newContact={id:r.id,nombre:r.nombre,cant_prod:r.cant}
	firedb.ref(r.tabla).push(newContact);
	res.send('recibido')
	});
	
app.get('/firebase-get',(req,res)=>{
	firedb.ref(req.query.tabla).on("value",function(x){
		let xStr = JSON.stringify(x)
		res.send(xStr.replaceAll('"',"'").replaceAll("},'","}}-,-{\'").split("-,-"))
		})
});

app.get('/login/:usu/:pass',(req,res)=>{
	firedb.ref("usuarios").on("value",function(x){
		let xStr = JSON.stringify(x)
		res.send(xStr.replaceAll('"',"'").replaceAll("},'","}}-,-{\'").split("-,-"))
	})
});



app.get('/contactar/:correo/:pregunta',(req,res)=>{
	const newContac = req.params;
	newContac.fecha = new Date().toString();
	newContac.admin = "isc.emmanuel.itd@gmail.com"
	console.log(newContac)
	firedb.ref("contacto").push(newContac);
	res.send(enviarMail(newContac));
});

function enviarMail(datos){
    var servEmail='proyecto.final.tecno.web@gmail.com'
    var transporter = nodemailer.createTransport({service: 'gmail',auth: {user: servEmail,pass: 'zqdmonxencfjnwub'}});
	var mailOptions = {from: servEmail,to:datos.admin,subject:"Contacto Barragán - "+datos.correo,text:datos.pregunta};
	transporter.sendMail(mailOptions,(error, info)=>{
		return error ? error:'Correo Enviado: ' + info.response
	});
	
}


app.listen(5555,() => console.log(`Listening on http://localhost:5555`))