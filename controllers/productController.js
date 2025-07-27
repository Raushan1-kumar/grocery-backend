const Product = require('../models/product');
const { uploadImage } = require('../config/cloudinary');
const sharp = require('sharp');


function normalizeCategory(category) {
  return category?.toLowerCase().replace(/\s+/g, "-") ?? "";
}


const allowedCategories = [
  'rice-daal', 'oil-ghee', 'sweets', 'spices', 'cakes',
  'kurkure-chips','biscuits', 'munch','personal-care',
  'household-cleaning','beverages', 'dry-fruits'
];


exports.addProduct = async (req, res) => {
  try {
    let { category, productName, attributes, sizes } = req.body;
    let imageUrl;

    if (req.file) {
      try {
        // Compress and resize image buffer with sharp before uploading
        const compressedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800 })       // Resize width to max 800px (optional)
          .jpeg({ quality: 30 })        // Compress JPEG quality 70 (adjust as needed)
          .toBuffer();

        imageUrl = await uploadImage(compressedBuffer);
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: error.message });
      }
    }

    attributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    category = normalizeCategory(category);

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