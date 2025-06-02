const express = require('express')
const app = express()
const userRoute = require('./routes/user.route')

const User = require('./models/user.model.js')
const Device = require('./models/device.model.js')

const cors = require('cors');
app.use(cors());

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}));




app.listen(3000, () => {
    console.log('Server is running on port 3000')
});
app.get('/', (req, res) => {
    res.send('Hello World, backend')
});

//route
app.use("/api/user", require("./routes/user.route.js"));


app.use("/api/auth", require("./routes/auth.route.js"));

app.use("/api/device", require("./routes/device.route.js"));

app.use("/api/stat", require("./routes/stat.route.js"));

app.use("/api/issue", require("./routes/issue.route.js"));

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nguyenquocminhthu:Cacao2772002.@cluster0.v8ncnba.mongodb.net/SmartClass?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));


