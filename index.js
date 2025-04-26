import express, { request } from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import { Item } from "./models/itemmodel.js";
import { User } from "./models/usermodel.js";
import cors from "cors";
import { createRequire } from "module";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const require = createRequire(import.meta.url);//to require require for multer


const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/files',express.static("files"))

// JWT Secret Key
const JWT_SECRET = "your-secret-key"; // Change this to a secure secret key

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

//================================================== multer ==============================================

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null,uniqueSuffix+file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});


// ============================== get =================================

app.get("/item", async (req, res) => {
  try {
    const items = await Item.find({});
    return res.status(200).json({
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ===============================post===================================

app.post("/item", upload.single("file"), async (req, res) => {
  try {
    const { name, email, phoneno, title, description, location, itemType } = req.body;
    
    // Check required fields
    if (!name || !email || !phoneno || !title || !description || !location) {
      return res.status(400).json({ 
        message: "All fields are required",
        missing: {
          name: !name,
          email: !email,
          phoneno: !phoneno,
          title: !title,
          description: !description,
          location: !location
        }
      });
    }

    // Validate email format
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number (basic format check)
    if (!/^\d{10}$/.test(phoneno)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newItem = {
      name,
      email,
      phoneno,
      title,
      description,
      location,
      itemType: itemType || 'found', // Use the provided type or default to 'found'
      image: req.file.filename,
    };

    const item = await Item.create(newItem);
    return res.status(201).json(item); // Using 201 for resource creation

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error creating item",
      error: error.message 
    });
  }
});


// =================================-get id ==================================

app.get("/item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    return res.status(200).json(item);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// =================================== delete ============================

app.delete("/item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Item.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: "Item not found" });
    }
    return res.status(200).send({ message: "Item deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// ====================== Authentication Routes ======================

// Register
app.post("/api/auth/register", upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, city, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Required fields missing",
        fields: {
          name: !name ? "Name is required" : null,
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    // Clean and validate email
    const cleanEmail = email.toLowerCase().trim();
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(cleanEmail)) {
      return res.status(400).json({ 
        message: "Invalid email format",
        field: "email"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email already registered",
        field: "email"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phoneNumber: phoneNumber || '',
      address: address || '',
      city: city || '',
      bio: bio || '',
      profileImage: req.file ? req.file.filename : ''
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      city: user.city,
      bio: user.bio,
      profileImage: user.profileImage
    };

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed",
      error: error.message
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protect routes that require authentication
app.use("/item", authenticateToken);

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(error);
  });
