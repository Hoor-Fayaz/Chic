const Page = require('../models/Page');

const DEFAULT_PAGES = [
  {
    slug: 'about',
    title: 'Our Story',
    metaDescription: 'Discover the heritage and philosophy of Jannah Chic.',
    content: `Our Heritage

Crafting Elegance, One Stitch at a Time.

Founded from a passion for preserving the timeless beauty of South Asian craftsmanship while infusing it with contemporary sophistication, Jannah Chic was born.

We believe that fashion is more than just clothing — it's a narrative of heritage, art, and identity. Each Saree, Frock, and Unstitched piece in our collection is a testament to the skill of our local artisans and the quality of premium fabrics.

Our Philosophy

"To empower the modern woman with attire that celebrates her roots and echoes her ambition. Fashion that is as bold as it is graceful."`,
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    metaDescription: 'Read the terms and conditions for shopping at Jannah Chic.',
    content: `Terms & Conditions

Last updated: 2024

By placing an order with Jannah Chic, you agree to the following terms:

1. All orders are subject to availability.
2. Prices are listed in PKR and are subject to change without notice.
3. Once an order is confirmed via WhatsApp, it cannot be cancelled after 24 hours.
4. Jannah Chic reserves the right to refuse service to anyone.

Payment

All payments must be made in full before dispatch. We accept bank transfers and cash on delivery (COD) where available.

Intellectual Property

All content, images, and designs on this site are the property of Jannah Chic. Unauthorized reproduction is strictly prohibited.`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Charter',
    metaDescription: 'Learn how Jannah Chic protects your personal information.',
    content: `Privacy Charter

Your privacy matters to us.

Information We Collect

We collect your name, contact number, and delivery address solely for the purpose of processing your order. This information is never sold to third parties.

WhatsApp Communication

When you place an order via WhatsApp, your contact number is used strictly for order coordination and delivery updates.

Cookies

Our website uses cookies to improve your browsing experience. You may disable cookies in your browser settings, though this may affect some features.

Data Security

We take reasonable steps to protect your personal information from unauthorized access.

Contact

For any privacy concerns, please reach out to us via WhatsApp or Instagram.`,
  },
  {
    slug: 'shipping',
    title: 'Shipping Information',
    metaDescription: 'Learn about shipping timelines and delivery options at Jannah Chic.',
    content: `Shipping Information

Delivery Timelines

Standard delivery across Pakistan takes 3–5 working days. Express delivery (1–2 days) is available in major cities.

Shipping Charges

Shipping charges are calculated at checkout and depend on your location. Free shipping is available on orders above a minimum value.

Order Tracking

Once your order is dispatched, you will receive tracking information via WhatsApp.

International Orders

We currently ship within Pakistan only. International shipping may be arranged on request — please contact us on WhatsApp.`,
  },
  {
    slug: 'returns',
    title: 'Refund Policy',
    metaDescription: 'Understand the return and refund policy at Jannah Chic.',
    content: `Refund Policy

We want you to love your purchase.

Eligible Returns

Items may be returned within 7 days of delivery if they are unused, unwashed, and in original packaging with all tags intact.

Non-Returnable Items

Sale items, custom orders, and stitched garments are non-returnable.

How to Initiate a Return

Contact us via WhatsApp with your order details and reason for return. Our team will guide you through the process.

Refunds

Once your returned item is received and inspected, refunds will be processed within 5–7 business days to your original payment method.`,
  },
  {
    slug: 'faqs',
    title: 'Frequently Asked Questions',
    metaDescription: 'Find answers to common questions about shopping at Jannah Chic.',
    content: `Frequently Asked Questions

How do I place an order?

Browse our catalog, add items to your cart, and proceed to checkout. Your order summary will be sent to us via WhatsApp, and our team will confirm your order shortly.

What sizes are available?

Most of our pieces are available in XS, S, M, L, XL, and XXL. Please refer to the size chart on each product page for measurements.

Can I customise a design?

Yes! We offer customisation on select pieces. Please reach out to us via WhatsApp for bespoke enquiries.

How long does delivery take?

Standard delivery takes 3–5 working days. Express delivery is available in major cities.

Is Cash on Delivery available?

Yes, COD is available in select cities. Please confirm availability when placing your order.

Can I exchange my order?

Exchanges are accepted within 7 days of delivery, subject to stock availability. Items must be unused and in original packaging.`,
  },
  {
    slug: 'contact',
    title: 'Atelier Support',
    metaDescription: 'Get in touch with the Jannah Chic team.',
    content: `Atelier Support

We'd love to hear from you.

WhatsApp

The fastest way to reach us. Send us a message and our team will respond promptly.

Instagram

Follow us and send a DM on Instagram: @jannah_chic

Business Hours

Monday – Saturday: 10:00 AM – 8:00 PM (PST)
Sunday: Closed

Response Time

We aim to respond to all enquiries within 24 hours during business hours.`,
  },
  {
    slug: 'careers',
    title: 'Join the Atelier',
    metaDescription: 'Explore career opportunities at Jannah Chic.',
    content: `Join the Atelier

Build something beautiful with us.

We are always looking for passionate individuals who share our love for fashion, craftsmanship, and customer service.

Open Positions

We currently have no publicly listed vacancies, but we welcome speculative applications from talented individuals in the following areas:

- Fashion Design & Merchandising
- Customer Experience
- Social Media & Content Creation
- Logistics & Operations

How to Apply

Send your CV and a brief introduction via WhatsApp or Instagram DM. We review all applications personally.`,
  },
];

const router = require('express').Router();
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public: get a page by slug (auto-seeds if not found)
router.get('/:slug', async (req, res) => {
  try {
    let page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      // Auto-seed from defaults if it exists there
      const defaultPage = DEFAULT_PAGES.find(p => p.slug === req.params.slug);
      if (defaultPage) {
        page = await Page.create(defaultPage);
      } else {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }
    }

    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: list all pages
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    // Seed any missing default pages
    for (const def of DEFAULT_PAGES) {
      const exists = await Page.findOne({ slug: def.slug });
      if (!exists) await Page.create(def);
    }
    const pages = await Page.find().select('slug title updatedAt').sort('slug');
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: update a page
router.put('/:slug', protect, requireAdmin, async (req, res) => {
  try {
    const { title, content, metaDescription } = req.body;
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug },
      { title, content, metaDescription },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
