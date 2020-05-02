const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require("express-session");

// Controllers
const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController')

// Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// Session
app.use(session({
	secret: "QPCcmmkkrg.grggo",
	cookie: { maxAge: 30000 }
}));

// View engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));
// Body parser
app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!');
    }).catch((err) => {
        console.log(err);
});

app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UsersController);

app.get("/", (req, res) => {
	var limit = 3;

	Article.findAndCountAll({
		limit: limit,
		offset: 0,
		order: [
			["id", "DESC"]
		]
	}).then(articles => {
		Category.findAll().then(categories => {
			res.render("index", {
				articles: articles.rows,
				categories: categories
			})
		});
	});
});

app.get("/:slug", (req, res) => {
	let slug = req.params.slug;
	Article.findOne({
		where: {
			slug: slug
		}
	}).then((article) => {
		if(article != undefined) {
			Category.findAll().then((categories) => {
				res.render("article", { article, categories  });
    		});
		}else {
			res.redirect("/");
		}
	}).catch(() => {
		res.redirect("/");
	});
});

app.listen(3000, () => {
    console.log('O servidor está rodando na porta 7000!');
});