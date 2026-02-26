const Product = require('../models/product');

let obj = {
  // Render all products (page)
  getAllProducts: async (req, res) => {
    try {
      const data = await Product.find().lean();
      return res.status(200).render('products', { layout: 'main', products: data });
    } catch (error) {
      console.error("getAllProducts ERROR:", error);
      return res.status(500).json({ message: "Error fetching products", error: error.message });
    }
  },

  // Render single product by pid (page)
  getProductById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const prod = await Product.findOne({ pid: id }).lean();
      if (!prod) return res.status(404).json({ message: "Product not found" });

      return res.status(200).render('product', { layout: 'main', prod });
    } catch (error) {
      console.error("getProductById ERROR:", error);
      return res.status(500).json({ message: "Error retrieving product", error: error.message });
    }
  },

  // Update by pid
  updateProductById: async (req, res) => {
    try {
      const pid = Number(req.params.id);
      const updatedProd = await Product.updateOne({ pid }, req.body);
      return res.status(200).json(updatedProd);
    } catch (error) {
      console.error("updateProductById ERROR:", error);
      return res.status(500).json({ message: "Update failed", error: error.message });
    }
  },

  // Delete by pid
  deleteProductById: async (req, res) => {
    try {
      const pid = Number(req.params.id);
      const result = await Product.deleteOne({ pid });
      return res.status(200).json(result);
    } catch (error) {
      console.error("deleteProductById ERROR:", error);
      return res.status(500).json({ message: "Deletion failed", error: error.message });
    }
  },

  // Add a new product (AUTO PID)
  addProduct: async (req, res) => {
    console.log("✅ ADD PRODUCT HIT - AUTO PID VERSION");
    try {
      const { price, bname, bauthor, bcategory, pages } = req.body;

      // ✅ safer validation (allows 0 values)
      if (
        price === undefined || pages === undefined ||
        !bname || !bauthor || !bcategory
      ) {
        return res.status(400).json({ message: "price, bname, bauthor, bcategory, pages are required" });
      }

      // Find highest existing pid
      const lastBook = await Product.findOne().sort({ pid: -1 }).lean();
      const newPid = lastBook ? Number(lastBook.pid) + 1 : 1;

      const newProduct = await Product.create({
        pid: newPid,
        price: Number(price),
        bname: String(bname),
        bauthor: String(bauthor),
        bcategory: String(bcategory),
        pages: Number(pages),
        isBorrowed: false,
        borrowedAt: null
      });

      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("addProduct ERROR:", error);
      return res.status(500).json({ message: "Error adding product", error: error.message });
    }
  },

  // Filter books
  filterProducts: async (req, res) => {
    try {
      const category = req.query.category;
      const min = Number(req.query.min ?? 0);
      const max = Number(req.query.max ?? 100000);
      const showBorrowed = String(req.query.showBorrowed) === "true";

      if (!category) {
        return res.status(400).json({ message: "category is required" });
      }

      const query = {
        bcategory: category,
        pages: { $gte: min, $lte: max }
      };

      if (showBorrowed) {
        query.isBorrowed = true;
      } else {
        query.$or = [
          { isBorrowed: false },
          { isBorrowed: { $exists: false } }
        ];
      }

      const books = await Product.find(query).lean();
      return res.status(200).json(books);
    } catch (error) {
      console.error("filterProducts ERROR:", error);
      return res.status(500).json({ message: "Filter failed", error: error.message });
    }
  },

  // One-time init: add borrow fields
  addBorrowFieldsToAll: async (req, res) => {
    try {
      const result = await Product.updateMany(
        { isBorrowed: { $exists: false } },
        { $set: { isBorrowed: false, borrowedAt: null } }
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("addBorrowFieldsToAll ERROR:", error);
      return res.status(500).json({ message: "Bulk update failed", error: error.message });
    }
  },

  // Borrow multiple books by pid
  borrowCart: async (req, res) => {
    try {
      const pids = req.body.pids;

      if (!Array.isArray(pids) || pids.length === 0) {
        return res.status(400).json({ error: "pids must be a non-empty array" });
      }

      const pidNums = pids.map(n => Number(n));

      const result = await Product.updateMany(
        {
          pid: { $in: pidNums },
          $or: [
            { isBorrowed: false },
            { isBorrowed: { $exists: false } }
          ]
        },
        { $set: { isBorrowed: true, borrowedAt: new Date() } }
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("borrowCart ERROR:", error);
      return res.status(500).json({ message: "Borrow cart failed", error: error.message });
    }
  },

  // Return a book by pid
  returnBook: async (req, res) => {
    try {
      const pid = Number(req.params.pid);

      const result = await Product.updateOne(
        { pid },
        { $set: { isBorrowed: false, borrowedAt: null } }
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("returnBook ERROR:", error);
      return res.status(500).json({ message: "Return failed", error: error.message });
    }
  },
};

module.exports = obj;