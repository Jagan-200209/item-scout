const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;
const mongodbUri = process.env.MONGO_URI || "mongodb+srv://jagan_2002:Mongodb2002@cluster0.j9txgxa.mongodb.net/creativity?retryWrites=true&w=majority&appName=Cluster0"; // Replace with actual URI

// MongoDB Connection
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(error => console.error('❌ MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(cors());

// Define Schema
const ItemSchema = new mongoose.Schema({
  type: String, // 'lost' or 'found'
  name: String,
  description: String,
  location: String,
  date: { type: Date, default: Date.now },
  contact: String,
  image: String, // Optional: Image path
});

const Item = mongoose.model('Item', ItemSchema);

// Routes
app.get('/api/:type', async (req, res) => {
  try {
    const items = await Item.find({ type: req.params.type }).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error(`Error fetching ${req.params.type} items:`, error);
    res.status(500).json({ message: `Failed to fetch ${req.params.type} items` });
  }
});

app.post('/api/:type', async (req, res) => {
  try {
    const newItem = new Item({ ...req.body, type: req.params.type });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(`Error adding ${req.params.type} item:`, error);
    res.status(400).json({ message: `Failed to add ${req.params.type} item`, error: error.message });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    item ? res.status(200).json(item) : res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    deletedItem ? res.status(200).json({ message: 'Item deleted successfully' }) 
                : res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

// Start Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
