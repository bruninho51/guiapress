const express = require("express");
const router = express.Router();
const Category = require('../categories/Category');
const slugify = require('slugify');
const Article = require('./Article');

router.get("/admin/article", (req, res) => {
	Article.findAll({
		include: [{model: Category}],
	}).then((articles) => {
		res.render("admin/articles/index", { articles });
	});
});

router.get("/admin/article/new", (req, res) => {
	Category.findAll().then(categories => {
		let article = {};
		console.log(categories);
		res.render("admin/articles/new", { article, categories });
	});
});

router.get("/admin/article/edit/:id", (req, res) => {
	let id = req.params.id;
	Article.findByPk(id).then(article => {
		if (article != undefined) {

			Category.findAll().then(categories => {
				res.render("admin/articles/new", { article, categories });
			});

		} else {
			res.redirect("/");
		}
	}).catch(err => {
		res.redirect("/");
	});
});

router.post("/admin/article/save", (req, res) => {
	let id = req.body.id;
	let title = req.body.title;
	let body = req.body.body;
	let categoryId = req.body.category;
	let slug = slugify(title);

	if (id) {
		Article.findByPk(id).then(article => {
			if (article != undefined) {
				Article.update({
					title, slug, body, categoryId
				}, { 
					where: { id } 
				}).then(() => {
					res.redirect("/admin/article");
				});
			}
		}).catch(err => res.send(500, { err }));
	} else {
		Article.create({
			title,
			slug,
			body,
			categoryId
		}).then(() => {
			res.redirect("/admin/article");
		}).catch(err => res.send(200, { err }));
	}
});

router.post("/article/delete", (req, res) => {
	let id = req.body.id;
	if(id != undefined && !isNaN(id)) {

		Article.destroy({
			where: {
				id: id
			}
		}).then(() => {
			res.redirect("/admin/article");
		});
		
	}else {
		res.redirect("/admin/article");
	}
});

router.get("/articles/page/:num", (req, res) => {
	
	var page = parseInt(req.params.num);

	if (page == 1) {
		res.redirect('/');
	} else {
		var offset = 0;
		var limit = 3;
	
		if (!isNaN(page) && page > 1) {
			offset = (page -1) * limit;
		}
	
		Article.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [
				["id", "DESC"]
			]
		}).then(articles => {
	
			var next = true;
			if (offset + limit >= articles.count) {
				next = false;
			}
	
			var result = {
				next: next,
				articles: articles
			}
	
			Category.findAll().then(categories => {
				res.render("admin/articles/page", {
					result, categories, page
				});
			});
		});
	}
});

module.exports = router;