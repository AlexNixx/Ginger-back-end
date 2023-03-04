require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");
const checkRoleMiddleware = require("./middlewares/checkRole-middleware");

const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: `${process.env.CLIENT_URL}` }));

app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));

app.use("/api", router);

//Middleware is always at the bottom
app.use(errorMiddleware);

const start = async () => {
	try {
		mongoose.set("strictQuery", false);
		mongoose.connect(
			process.env.DB_URL,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			() => console.log("MongoDB is working")
		);
		app.listen(process.env.PORT || 5000, () =>
			console.log(`Server work on port: ${process.env.PORT}`)
		);
	} catch (error) {
		console.log(error);
	}
};

//adminAlex
//eg8AxtwLLcnw0Jnk

start();
