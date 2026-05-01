export const dynamic = "force-dynamic";
import HeroSection from "../components/home/HeroSection";
import FeaturedCollections from "../components/home/FeaturedCollections";
import ProductCarousel from "../components/home/ProductCarousel";
import AutoSwiper from "../components/home/AutoSwiper"; // new swiper
import ValuePropsStrip from "../components/home/ValuePropsStrip";
import NewsletterSection from "../components/home/NewsletterSection";
import { fetchFeaturedProducts, fetchNewArrivals, fetchCategories } from "../lib/api";

export const metadata = {
  title: "Jannah | Modern Modesty & Premium Textiles",
  description: "Experience the art of elegance with Jannah. Discover our curated collection of premium Sarees, Frocks, and Unstitched textiles designed for the modern wardrobe.",
  openGraph: {
    title: "Jannah | Premium Modest Fashion",
    description: "Architectural silhouettes and timeless textures. Explore the latest collections from Jannah.",
    images: [{ url: "/og-image.jpg" }], // assumed path for brand asset
  },
};


export default async function HomePage() {
  let featured = [];
  let newArrivals = [];
  let categories = [];

  try {
    const [featuredRes, newArrivalsRes, categoriesRes] = await Promise.all([
      fetchFeaturedProducts(),
      fetchNewArrivals(),
      fetchCategories(),
    ]);

    featured = featuredRes?.data?.items || [];
    newArrivals = newArrivalsRes?.data?.items || [];
    categories = categoriesRes?.data?.items || [];
  } catch (e) {
    console.error("❌ Failed to load products for home page:", e.message);
  }

  return (
    <>
      <HeroSection />
      <div className="py-10">
        <ValuePropsStrip />
      </div>
      <AutoSwiper />
      <FeaturedCollections categories={categories} />
      <ProductCarousel title="Featured Products" products={featured} />
      <ProductCarousel title="New arrivals" products={newArrivals} />
      <NewsletterSection />
    </>
  );
}
