const articleModel = require("../models/article");
const articleFxn = {
    getAllArticles: (req, res) => {
        articleModel.find({})
            .then(article => {
                res.status(200).json(
                    {
                        status: true,
                        data: article
                    }
                );
            }).catch(error => {
                const err = "error loading data"
                res.status(500).json(
                    {
                        status: false,
                        data: err
                    }
                );
            })
    },
    getArticlesById: (req, res) => {
        const articleId = req.params.id;

        articleModel.findById(articleId)
            .then(foundArticle => {
                if (!foundArticle) {
                    return res.status(401).json({
                        Article: "Article not found"
                    })
                }
                res.json({
                    Article: foundArticle.title
                })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Error occured while retrieving article with id " + id
                })
            })
    },

    deleteAllArticles: (req, res) => {
        articleModel.deleteMany({})
            .then(sample => {
                return res.sendStatus(sample.deletedCount)
            }).catch(err => {
                res.status(500).json({
                    message: err.message || "Error occured while retrieving article with id " + id
                })
            })
    },
    deleteArticleById: (req, res) => {
        const id = req.params.id
        articleModel.findByIdAndDelete(id)
            .then(sample => {
                return res.status(200).json({ message: `${sample.title} deleted with success` })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Error occured while retrieving article with id " + id
                })
            })
    },
    updateArticle: async (req, res) => {
        let { title, description, tags, status, likes, shares, comments } = req.body;
        try {
            if (!req.body) return res.json({ message: "invald payload" });
            const updatedArticle = await articleModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        "title": title,
                        "description": description,
                        "tags": tags,
                        "status": status,
                        "likes": likes,
                        "shares": shares,
                        "comments": comments
                    }
                },
                { returnDocument: true }
            );
            res.json({
                message: "updated successfull",
                data: updatedArticle
            })
        } catch (error) {
            console.log(error.message);
        }
    },
    createArticle: async (req, res) => {
        let { title, description, author, tags,} = req.body;
        try {
            if (!title || !description) return res.json({ message: "invald payload" });
            const createdArticle = await articleModel.create(
                {
                    "title": title,
                    "description": description,
                    "tags": tags,
                    "author":author
                }
            );
            res.json({
                message: "created successfully",
                data: createdArticle
            })
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = articleFxn;