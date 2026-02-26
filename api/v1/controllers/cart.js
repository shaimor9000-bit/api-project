const User = require("../models/user");

exports.getCart = async (req, res) => {
  const user = await User.findById(req.user.uid).lean();
  return res.json({ cart: user?.cart ?? [] });
};

exports.addToCart = async (req, res) => {
  const pid = Number(req.body.pid);
  if (!pid) return res.status(400).json({ message: "pid required" });

  await User.updateOne(
    { _id: req.user.uid },
    { $addToSet: { cart: pid } } // no duplicates
  );

  return res.json({ ok: true });
};

exports.removeFromCart = async (req, res) => {
  const pid = Number(req.params.pid);
  await User.updateOne(
    { _id: req.user.uid },
    { $pull: { cart: pid } }
  );
  return res.json({ ok: true });
};

exports.clearCart = async (req, res) => {
  await User.updateOne({ _id: req.user.uid }, { $set: { cart: [] } });
  return res.json({ ok: true });
};