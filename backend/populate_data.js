const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');

async function populate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const products = await Product.find({ status: 'active' }).limit(10);
        console.log(`Found ${products.length} products to update.`);

        const sampleSizes = ['XS', 'S', 'M', 'L', 'XL'];
        const sampleFabrics = ['Khaddar', 'Lawn', 'Silk', 'Cotton'];
        const sampleFits = ['Smart Fit', 'Regular Fit', 'Slim Fit'];
        
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const updates = {
                sku: `CHIC-2024-${1000 + i}`,
                sizes: sampleSizes,
                fabric: sampleFabrics[i % sampleFabrics.length],
                fit: sampleFits[i % sampleFits.length],
                composition: '100% Pure High-Quality Fabric',
            };
            
            await Product.findByIdAndUpdate(p._id, updates);
            console.log(`Updated product: ${p.name} with SKU ${updates.sku}`);
        }

        console.log('Data population complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error during population:', err);
        process.exit(1);
    }
}

populate();
