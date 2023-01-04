const Category = require("../models/categoryModel")
const slugify = require('slugify')


function formattedCategories(categories, parentId = null) {
    const categoryList = []
    let category
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for (let cat of category) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            createdBy: cat.createdBy,
            parentId: cat.parentId,
            children: formattedCategories(categories, cat._id),
        });
    }
    return categoryList;
}

const createCategory = async (req, res) => {
    try {
        const categoryObj = {
            name: req.body.name,
            slug: slugify(req.body.name),
            createdBy: req.user._id,
        }

        if (req.file) {
            categoryObj.categoryImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        }

        if (req.body.parentId) {
            categoryObj.parentId = req.body.parentId
        }

        const category = new Category(categoryObj)
        await category.save((error, category) => {
            if (error) return res.status(400).json({message: "Can`t save Category!", error: error.message})
            if (category) {
                return res.status(201).json({
                    message: 'Category has been created!',
                    category: category
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort('name').populate(
            {path: 'createdBy', select: '_id email username firstName lastName'}
        )
        if (!categories) {
            return res.json({
                success: false,
                message: 'Categories were not found!',
                categories: categories
            })
        }
        const categoryList = formattedCategories(categories)
        res.status(200).json({categoryList})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getCategory = async (req, res) => {
    try {
        const slug = req.params.slug
        const category = await Category.findOne({slug: slug}).populate(
            {path: 'createdBy', select: '_id email username firstName lastName'}
        )
        if (!category) {
            return res.status(500).json({success: false, message: 'Category was not found!'})
        }
        res.status(200).json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateCategory = async (req, res) => {
    try {
        const slug = req.params.slug
        const categoryObj = {
            name: req.body.name,
            slug: slugify(req.body.name),
            createdBy: req.user._id,
        }
        if (req.file) {
            categoryObj.categoryImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        }
        if (req.body.parentId) {
            categoryObj.parentId = req.body.parentId
        }
        const category = await Category.findOneAndUpdate(
            {slug: slug},
            categoryObj,
            {new: true}
        )
        if (!category) {
            return res.status(500).json({success: false, message: 'Category was not found!'})
        }
        res.status(200).json({success: true, message: 'Category has been updated!', category})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteCategory = async (req, res) => {
    try {
        const slug = req.params.slug
        Category.findOneAndDelete({slug: slug}, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'Category was not found!'})
            }
            res.json({success: true,  message: 'Category was deleted!', doc: doc })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    createCategory, getCategories, getCategory, updateCategory, deleteCategory
}