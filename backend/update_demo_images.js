require('dotenv').config();
const { connectDB } = require('./src/config/db');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const Settings = require('./src/models/Settings');
const IMG = require('./src/constants/demoImages');

async function run() {
  await connectDB();

  const catMap = {
    sarees: { image: IMG.sareeBanner, products: [IMG.saree, IMG.sareeBanner] },
    frocks: { image: IMG.frockBanner, products: [IMG.frock, IMG.frockBanner] },
    unstitched: { image: IMG.unstitched, products: [IMG.unstitched, IMG.unstitchedBanner] },
  };

  for (const [slug, assets] of Object.entries(catMap)) {
    await Category.updateMany({ slug }, { $set: { image: assets.image } });

    const cat = await Category.findOne({ slug });
    if (!cat) continue;

    const products = await Product.find({ category: cat._id });
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const url = assets.products[i % assets.products.length];
      await Product.updateOne(
        { _id: p._id },
        { $set: { images: [{ url, alt: p.name, isPrimary: true }] } }
      );
    }
  }

  const cats = await Category.find().lean();
  const sareeCat = cats.find((c) => c.slug === 'sarees');
  const frockCat = cats.find((c) => c.slug === 'frocks');
  const unstitchedCat = cats.find((c) => c.slug === 'unstitched');

  await Settings.findOneAndUpdate(
    { key: 'homepage_cms' },
    {
      $set: {
        section1: {
          subtitle: "New Season • SS'26",
          title: 'The Art of Elegance.',
          description:
            'Premium Pakistani sarees, frocks & unstitched — modeled for the modern wardrobe.',
          link: '/shop',
          slides: [
            { imageUrl: IMG.saree, link: '/category/sarees' },
            { imageUrl: IMG.frock, link: '/category/frocks' },
          ],
        },
        section2: {
          slides: [
            { imageUrl: IMG.sareeBanner, title: 'Silk Saree Collection', link: '/category/sarees' },
            { imageUrl: IMG.frockBanner, title: 'Festive Frocks', link: '/category/frocks' },
          ],
        },
        section3: {
          title: 'Shop by Category',
          items: [
            { categoryId: sareeCat?._id, imageUrl: IMG.saree, label: 'Sarees' },
            { categoryId: frockCat?._id, imageUrl: IMG.frock, label: 'Frocks' },
            { categoryId: unstitchedCat?._id, imageUrl: IMG.unstitched, label: 'Unstitched' },
          ],
        },
        heroSlides: [{ imageUrl: IMG.saree, title: 'Jannah Chic', subtitle: "SS'26", link: '/shop' }],
      },
    },
    { upsert: true }
  );

  console.log('✅ Pakistani model images applied (saree / frock / unstitched)');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
