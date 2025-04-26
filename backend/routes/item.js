// Add this route
router.post('/item/:id/loser', async (req, res) => {
  const { id } = req.params;
  const { phone, email } = req.body;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    item.loserPhone = phone;
    item.loserEmail = email;
    await item.save();
    res.json({ success: true, message: "Loser info added" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}); 