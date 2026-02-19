const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware (Must be ABOVE the routes)
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

const dbURI = 'mongodb+srv://nandineenargesh14_db_user:nandinee123@cluster0.qdh9c7k.mongodb.net/brewBeanDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB Atlas Connected Successfully! 🎉'))
    .catch((err) => console.log('Database Connection Error:', err));

const reservationSchema = new mongoose.Schema({
    rname: String,
    rdate: String,
    rtime: String,
    rpeople: Number,
    rnotes: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// Backend API Route
app.post('/book-table', async (req, res) => {
    try {
        const newBooking = new Reservation(req.body);
        await newBooking.save();
        res.status(201).send({ message: 'Table Reserved Successfully!' });
    } catch (error) {
        res.status(400).send({ message: 'Error in booking', error });
    }
});

const orderSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPhone: String,
    items: Array,        // Isme product name, price aur qty hogi
    totalAmount: Number,
    orderType: String,   // Dine-In ya Takeaway
    location: String,    // Table Number ya Address
    status: { type: String, default: 'Pending' }, // Owner ise baad mein 'Preparing' kar sakta hai
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order Placed!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
app.get('/api/user/my-orders', async (req, res) => {
    const { email } = req.query;
    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
});

// Server.js mein add karein
app.get('/api/admin/all-orders', async (req, res) => {
    try {
        const allOrders = await Order.find().sort({ date: -1 });
        res.status(200).json(allOrders);
    } catch (err) {
        res.status(500).json({ message: "Admin Fetch Error" });
    }
});

// Reservations dikhane ke liye
app.get('/api/admin/all-bookings', async (req, res) => {
    try {
        const allBookings = await Reservation.find().sort({ rdate: -1 });
        res.status(200).json(allBookings);
    } catch (err) {
        res.status(500).json({ message: "Admin Booking Error" });
    }
});
// CART
let cart = [];

app.post("/add-to-cart", (req, res) => {
    const item = req.body;

    const existing = cart.find(i => i.name === item.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }

    res.json({ success: true, cart });
});

app.get("/cart", (req, res) => {
    res.json(cart);
});


app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Secure the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during signup' });
    }
});

//
const bcrypt = require('bcryptjs'); // For password security

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique ensures no double emails
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema); 

// ✅ Professional Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Success (For now, we send back the name)
        res.status(200).json({ 
            message: 'Login successful', 
            userName: user.name 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});