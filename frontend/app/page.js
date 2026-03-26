
import HeroSection from "../components/home/HeroSection";
import FeaturedCollections from "../components/home/FeaturedCollections";
import ProductCarousel from "../components/home/ProductCarousel";
import AutoSwiper from "../components/home/AutoSwiper"; // new swiper
import { fetchFeaturedProducts, fetchNewArrivals, fetchCategories } from "../lib/api";

export const dynamic = "force-dynamic";

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

    featured = featuredRes.data?.items || [];
    newArrivals = newArrivalsRes.data?.items || [];
    categories = categoriesRes.data?.items || [];
  } catch (e) {
    console.error("Failed to load products for home page", e);
  }

  return (
    <>
      <HeroSection />
      <AutoSwiper /> {/* <-- automatic khadi-style swiper */}
      <FeaturedCollections categories={categories} />
      <ProductCarousel title="Featured collections" products={featured} />
      <ProductCarousel title="New arrivals" products={newArrivals} />
    </>
  );
}