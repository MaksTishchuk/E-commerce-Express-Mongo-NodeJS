const Category = require('../../models/categoryModel')
const Page = require('../../models/pageModel')


const createPage = async (req, res) => {
    try {
        const {banners, products} = req.files
        if (banners && banners.length > 0) {
            req.body.banners = banners.map((banner, index) => ({
                img: `${req.protocol}://${req.get('host')}/uploads/${banner.filename}`,
                navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
            }))
        }
        if (products && products.length > 0) {
            req.body.products = products.map((product, index) => ({
                img: `${req.protocol}://${req.get('host')}/uploads/${product.filename}`,
                navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
            }))
        }
        req.body.createdBy = req.user._id

        const page = Page.findOne({category: req.body.category})
        if (page) {
            Page.findOneAndUpdate({category: req.body.category}, req.body, {new: true}).exec(
                (error, updatedPage) => {
                    if (error) return res.status(400).json({
                        message: "Can`t update page!",
                        error: error.message
                    })
                    if (updatedPage) {
                        return res.status(201).json({page: updatedPage})
                    }
                }
            )
        } else {
            const page = new Page(req.body)
            await page.save((error, page) => {
                if (error) return res.status(400).json({
                    message: "Can`t save Page!",
                    error: error.message
                })
                if (page) {
                    return res.status(201).json({
                        message: 'Page has been created!',
                        page: page
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

const getPage = async (req, res) => {
    try {
        const category = req.params.category
        Page.findOne({category: category}).exec((error, page) => {
            if (error) return res.status(400).json({error});
            if (page) return res.status(200).json({page});
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

module.exports = {
    createPage, getPage
}
