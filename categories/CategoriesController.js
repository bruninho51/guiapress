const express = require("express");
const router = express.Router();
const Category = require("./Category");
const Article = require("../articles/Article");
const slugify = require("slugify");

router.get("/admin/categories", (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/categories/index", {categories});
	});
});

router.get("/admin/categories/new", (req, res) => {
	res.render("admin/categories/new", { category: {} });
});

router.post("/categories/save", (req, res) => {
	let title = req.body.title;
	let slug = slugify(title);
	let id = req.body.id;
	if(title != undefined) {

		if(!id) {
			Category.create({
				title: title,
				slug: slug
			}).then(() => {
				res.redirect("/admin/categories");
			});
		}else {
			Category.update({ title, slug }, {
				where: {
					id: id
				}
			}).then(() => {
				res.redirect("/admin/categories");
			});
		}

	}else {
		res.redirect("/admin/categories/new", { category: {} });
	}
});

router.post("/categories/delete", (req, res) => {
	let id = req.body.id;
	if(id != undefined) {
		if(!isNaN(id)) {

			Category.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect("/admin/categories");
			});

		}else {
			res.redirect("/admin/categories");
		}
	}else {
		res.redirect("/admin/categories");
	}
});

router.get("/admin/categories/edit/:id", (req, res) => {
	let id = req.params.id;
	if(!isNaN(id)) {
		Category.findByPk(id).then(category => {
			if(category != undefined) {
				res.render("admin/categories/new", { category });
			}else {
				res.redirect("/admin/categories");
			}
		}).catch(() => {
			res.redirect("/admin/categories");
		});
	}
});

router.get("/category/:slug", (req, res) => {
	let slug = req.params.slug;
	Category.findOne({
		where: {
			slug: slug
		},
		include: {
			model: Article
		}
	}).then((category) => {
		if(category != undefined) {

			Category.findAll().then(categories => {
				res.render("index", { 
					articles: category.articles,
					categories: categories
				});
			});

		}else {
			res.redirect("/");
		}
	}).catch(err => {
		res.redirect("/");
	});
});

module.exports = router;