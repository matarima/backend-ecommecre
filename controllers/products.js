const Product = require("../models/Product");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).send("Error retrieving categories");
  }
};

exports.getTrending = async (req, res) => {
  try {
    const trendingProducts = await Product.find().limit(8);
    res.json(trendingProducts);
  } catch (error) {
    res.status(500).send("Error retrieving trending products");
  }
};

exports.getProductId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const relatedProducts = await Product.find({
      category: product.category,
    }).limit(5);
    res.status(200).json({ product, relatedProducts });
  } catch (error) {
    res.status(500).send("Error retrieving product");
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
};

exports.postProduct = async (req, res) => {
  const { name, category, price, short_desc, long_desc, count } = req.body;
  const files = req.files;

  if (
    !name ||
    !category ||
    !price ||
    !short_desc ||
    !long_desc ||
    files.length < 4 ||
    count === undefined
  ) {
    return res
      .status(400)
      .json({
        message: "Please fill all the fields and upload at least 4 images.",
      });
  }

  const images = files.map((file) => `/images/${file.filename}`);

  try {
    const newProduct = new Product({
      name,
      category,
      price,
      short_desc,
      long_desc,
      img1: images[0],
      img2: images[1],
      img3: images[2],
      img4: images[3],
      img5: images[4] || "",
      count
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    const {name, category, price, short_desc, long_desc, count } = req.body;
    const files = req.files;
    
    const images = files.map(file => `/images/${file.filename}`);

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.short_desc = short_desc || product.short_desc;
        product.long_desc = long_desc || product.long_desc;
        product.img1 = images[0] || product.img1;
        product.img2 = images[1] || product.img2;
        product.img3 = images[2] || product.img3;
        product.img4 = images[3] || product.img4;
        product.img5 = images[4] || product.img5;
        product.count = count !== undefined ? count : product.count;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}