const Category = require('../../models/categoryModel')
const Product = require('../../models/productModel')


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
            categoryType: cat.categoryType,
            children: formattedCategories(categories, cat._id),
        });
    }
    return categoryList;
}

const initialData = async (req, res) => {
    try {
        const categories = await Category.find().populate(
            {path: 'createdBy', select: '_id email username firstName lastName'}
        )
        const products = await Product.find().populate([
            {path: 'category', select: '_id name'},
            {path: 'createdBy', select: '_id email username firstName lastName'}
        ])
        res.status(200).json({categories: formattedCategories(categories), products})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

module.exports = {
    initialData
}
