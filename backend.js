// --- Backend (Node.js with Native Modules and MongoDB) ---
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const mongodbUri = 'mongodb://localhost:27017/lostandfound'; // Replace if your MongoDB URI is different

// MongoDB Connection
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Schema and Model
const ItemSchema = new mongoose.Schema({
  type: String, // 'lost' or 'found'
  name: String,
  description: String,
  location: String,
  date: { type: Date, default: Date.now },
  contact: String,
  image: String, // Optional: Path to image
});

const Item = mongoose.model('Item', ItemSchema);

const requestHandler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname === '/api/lost' && method === 'GET') {
    try {
      const lostItems = await Item.find({ type: 'lost' }).sort({ date: -1 });
      res.writeHead(200);
      res.end(JSON.stringify(lostItems));
    } catch (error) {
      console.error('Error fetching lost items:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Failed to fetch lost items' }));
    }
  } else if (pathname === '/api/found' && method === 'GET') {
    try {
      const foundItems = await Item.find({ type: 'found' }).sort({ date: -1 });
      res.writeHead(200);
      res.end(JSON.stringify(foundItems));
    } catch (error) {
      console.error('Error fetching found items:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Failed to fetch found items' }));
    }
  } else if ((pathname === '/api/lost' || pathname === '/api/found') && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const itemData = JSON.parse(body);
        const type = pathname === '/api/lost' ? 'lost' : 'found';
        const newItem = new Item({ ...itemData, type });
        const savedItem = await newItem.save();
        res.writeHead(201);
        res.end(JSON.stringify(savedItem));
      } catch (error) {
        console.error(`Error adding ${pathname.slice(5)} item:`, error);
        res.writeHead(400); // Use 400 for bad request
        res.end(JSON.stringify({ message: `Failed to add ${pathname.slice(5)} item`, error: error.message }));
      }
    });
  } else if (pathname.startsWith('/api/items/') && method === 'GET') {
    const id = pathname.split('/')[3];
    try {
      const item = await Item.findById(id);
      if (!item) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Item not found' }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify(item));
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Failed to fetch item' }));
    }
  } else if (pathname.startsWith('/api/items/') && method === 'DELETE') {
    const id = pathname.split('/')[3];
    try {
      const deletedItem = await Item.findByIdAndDelete(id);
      if (!deletedItem) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Item not found' }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Item deleted successfully' }));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Failed to delete item' }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});