const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProductById,
  updateProductById,
  filterProducts,
  borrowCart,
  addBorrowFieldsToAll,
  returnBook
} = require("../controllers/product");

// protect all product endpoints (site requires login)
router.use(auth);

router.put("/return/:pid", returnBook);
router.put("/init-borrow-fields", addBorrowFieldsToAll);
router.get("/filter", filterProducts);
router.post("/borrow-cart", borrowCart);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", addProduct);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

module.exports = router;