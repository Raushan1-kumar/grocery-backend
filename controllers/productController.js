const Product = require('../models/product');
const { uploadImage } = require('../config/imagekit');
const sharp = require('sharp');

// Helper to normalize category
function normalizeCategory(category) {
  return category?.toLowerCase().replace(/\s+/g, "-") ?? "";
}

// Allowed categories
const allowedCategories = [
  'rice-daal', 'oil-ghee', 'sweets', 'spices', 'cakes',
  'kurkure-chips','biscuits', 'munch','personal-care',
  'household-cleaning','beverages', 'dry-fruits'
];

// ------------------ Add Product ------------------
exports.addProduct = async (req, res) => {
  try {
    let { category, productName, attributes, sizes } = req.body;
    let imageUrl;

    // Handle image upload
    if (req.file) {
      try {
        const compressedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800 })
          .jpeg({ quality: 20 })
          .toBuffer();

        imageUrl = await uploadImage(compressedBuffer, req.file.originalname);
      } catch (error) {
        return res.status(500).json({
          message: 'Failed to upload image to ImageKit',
          error: error.message
        });
      }
    }

    // Convert attributes/sizes if provided as string
    attributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    category = normalizeCategory(category);

    // Validate category
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Unsupported category' });
    }

    const product = new Product({
      category,
      productName,
      attributes: attributes || {},
      sizes: sizes || [],
      imageUrl
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// ------------------ Get Products by Category ------------------
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const normalized = category.toLowerCase().replace(/\s+/g, "-");

    const products = await Product.find({ category: normalized })
      .select('productName category attributes sizes imageUrl createdAt');

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found for category: ${category}` });
    }

    res.status(200).json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// ------------------ Edit Product ------------------
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;  // productId from URL
    let { category, productName, attributes, sizes } = req.body;
    let imageUrl;

    // Handle new image upload
    if (req.file) {
      try {
        const compressedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800 })
          .jpeg({ quality: 20 })
          .toBuffer();

        imageUrl = await uploadImage(compressedBuffer, req.file.originalname);
      } catch (error) {
        return res.status(500).json({
          message: 'Failed to upload image to ImageKit',
          error: error.message
        });
      }
    }

    // Convert attributes/sizes if provided as JSON string
    attributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    // Validate category if provided
    if (category) {
      category = normalizeCategory(category);
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: 'Unsupported category' });
      }
    }

    // Build update object
    const updateData = {};
    if (category) updateData.category = category;
    if (productName) updateData.productName = productName;
    if (attributes) updateData.attributes = attributes;
    if (sizes) updateData.sizes = sizes;
    if (imageUrl) updateData.imageUrl = imageUrl;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // return updated doc
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message
    });
  }
};
