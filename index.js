const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

app.use(bodyParser.json());
app.use(express.static('static'));

mongoose.connect("mongodb+srv://Viki713:TVK@cluster0.hmd9m.mongodb.net/E-commerce"
)
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('Connection error:', err);
});

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) return res.status(404).send({ error: 'Menu item not found' });
    res.send(updatedItem);
  } catch (error) {
    res.status(500).send({ error: 'Error updating menu item' });
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).send({ error: 'Menu item not found' });
    res.send({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error deleting menu item' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});