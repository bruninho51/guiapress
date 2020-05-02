const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define("articles", {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	slug: {
		type: Sequelize.STRING,
		allowNull: false
	},
	body: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

// Relacionamento 1:N
// Uma categoria pertence a muitos artigos(has many)
Category.hasMany(Article);
// Relacionamento 1:1
// Um artigo pertence a(belongsTo) a uma categoria
Article.belongsTo(Category);

Article.sync({ force: false });

module.exports = Article;