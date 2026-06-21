import type { Category, Product } from "./types";

// Curated catalog. Images come from Unsplash (allowlisted in next.config.ts).
export const products: Product[] = [
  // ———————————————————————————— WOMEN ————————————————————————————
  {
    id: "w-01",
    slug: "silk-slip-dress",
    name: "Silk Slip Dress",
    price: 290,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&q=90",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1600&q=90",
    ],
    categories: ["women", "new-in"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Onyx", "Ivory"],
    description:
      "Bias-cut silk slip with a clean neckline. Fluid drape, built for quiet evenings and louder entrances.",
    details: [
      "100% mulberry silk",
      "Dry clean only",
      "Made in Italy",
      "Model wears size S",
    ],
    isNew: true,
    featured: true,
  },
  {
    id: "w-02",
    slug: "draped-jersey-top",
    name: "Draped Jersey Top",
    price: 120,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85",
    categories: ["women"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Ash"],
    description:
      "Sculptural drape meets everyday weight. Asymmetric hem, soft hand.",
    details: ["92% modal, 8% elastane", "Cold wash", "Made in Portugal"],
  },
  {
    id: "w-03",
    slug: "tailored-wide-trousers",
    name: "Tailored Wide Trousers",
    price: 180,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
    categories: ["women", "men"],
    sizes: ["26", "27", "28", "29", "30", "31", "32"],
    colors: ["Jet", "Stone"],
    description:
      "High-rise, wide-leg trousers cut from a heavyweight wool blend.",
    details: ["82% wool, 18% mohair", "Hidden hook-and-bar closure"],
  },
  {
    id: "w-04",
    slug: "structured-wool-overcoat",
    name: "Structured Wool Overcoat",
    price: 450,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=1200&q=85",
    categories: ["women", "new-in"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Charcoal"],
    description:
      "Double-faced wool, sharp shoulders, clean lines. The overcoat, reimagined.",
    details: ["100% virgin wool", "Fully lined", "Horn buttons"],
    isNew: true,
    featured: true,
  },
  {
    id: "w-05",
    slug: "cashmere-knit-sweater",
    name: "Cashmere Knit Sweater",
    price: 240,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=85",
    categories: ["women"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Graphite"],
    description:
      "A weightless cashmere crewneck knitted in Inner Mongolia. Your new everyday.",
    details: ["100% grade-A cashmere", "Ribbed cuffs and hem"],
    featured: true,
  },
  {
    id: "w-06",
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    price: 210,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=85",
    categories: ["women"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    description: "Machine-pleated tech fabric with fluid movement.",
  },

  // ———————————————————————————— MEN ————————————————————————————
  {
    id: "m-01",
    slug: "oversized-leather-jacket",
    name: "Oversized Leather Jacket",
    price: 320,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&q=90",
    ],
    categories: ["men", "new-in"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    description:
      "Boxy leather biker with dropped shoulders. Raw-edge details and YKK hardware.",
    details: ["100% lamb leather", "Viscose lining", "Made in Spain"],
    isNew: true,
    featured: true,
  },
  {
    id: "m-02",
    slug: "deconstructed-blazer",
    name: "Deconstructed Blazer",
    price: 410,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1200&q=85",
    categories: ["men", "women"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ink"],
    description:
      "Unstructured single-breasted blazer. Soft shoulders, patch pockets.",
    featured: true,
  },
  {
    id: "m-03",
    slug: "ribbed-merino-turtleneck",
    name: "Ribbed Merino Turtleneck",
    price: 195,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=1200&q=85",
    categories: ["men"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Jet", "Dune"],
    description: "Fine-gauge merino in a close rib. Wear alone or layered.",
  },
  {
    id: "m-04",
    slug: "raw-denim-trouser",
    name: "Raw Denim Trouser",
    price: 220,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=85",
    categories: ["men"],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Indigo"],
    description: "13.5oz Japanese selvedge, mid-rise, straight leg.",
  },
  {
    id: "m-05",
    slug: "technical-field-parka",
    name: "Technical Field Parka",
    price: 520,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=85",
    categories: ["men", "new-in"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Obsidian"],
    description: "Water-resistant shell with bonded seams and drawcord waist.",
    isNew: true,
  },

  // ———————————————————————————— ACCESSORIES ————————————————————————————
  {
    id: "a-01",
    slug: "minimal-combat-boots",
    name: "Minimal Combat Boots",
    price: 380,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&q=85",
    categories: ["accessories", "women", "men"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
    colors: ["Black"],
    description:
      "Full-grain leather boot on a lugged Vibram sole. Uncompromising.",
    featured: true,
  },
  {
    id: "a-02",
    slug: "structured-leather-tote",
    name: "Structured Leather Tote",
    price: 540,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=85",
    categories: ["accessories", "women"],
    colors: ["Black", "Cognac"],
    description: "Vegetable-tanned Italian leather. Hand-finished edges.",
  },
  {
    id: "a-03",
    slug: "oval-metal-sunglasses",
    name: "Oval Metal Sunglasses",
    price: 160,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=85",
    categories: ["accessories", "new-in"],
    colors: ["Gunmetal"],
    description: "Slim oval frame, Zeiss polarized lenses, titanium temples.",
    isNew: true,
  },
  {
    id: "a-04",
    slug: "woven-leather-belt",
    name: "Woven Leather Belt",
    price: 140,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1200&q=85",
    categories: ["accessories", "men", "women"],
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    description: "Hand-woven Italian leather with brushed-steel buckle.",
  },
  {
    id: "a-05",
    slug: "cashmere-knit-beanie",
    name: "Cashmere Knit Beanie",
    price: 95,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1200&q=85",
    categories: ["accessories"],
    colors: ["Ivory", "Charcoal"],
    description: "Pure cashmere in a relaxed ribbed knit.",
  },

  // ———————————————————————————— UNDERWEARS ————————————————————————————
  {
    id: "u-01",
    slug: "silk-triangle-bralette",
    name: "Silk Triangle Bralette",
    price: 110,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=85",
    categories: ["underwears", "women", "new-in"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Onyx", "Pearl"],
    description:
      "Delicate triangle bralette cut in stretch silk with barely-there structure and a clean finish.",
    details: ["86% silk, 14% elastane", "Adjustable straps", "Made in Italy"],
    isNew: true,
  },
  {
    id: "u-02",
    slug: "micro-rib-high-brief",
    name: "Micro Rib High Brief",
    price: 78,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=85",
    categories: ["underwears", "women"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Bone", "Black"],
    description:
      "High-rise brief in a soft micro-rib knit. Smooth under tailoring and dresses.",
    details: ["92% modal, 8% elastane", "Cold wash", "Seamless waistband"],
  },
  {
    id: "u-03",
    slug: "modal-boxer-brief",
    name: "Modal Boxer Brief",
    price: 82,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=1200&q=85",
    categories: ["underwears", "men", "new-in"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Jet", "Slate"],
    description:
      "Breathable modal boxer brief with sculpted pouch and no-roll waistband for all-day comfort.",
    details: ["95% modal, 5% elastane", "Flatlock seams", "Made in Portugal"],
    isNew: true,
  },
  {
    id: "u-04",
    slug: "second-skin-tank",
    name: "Second Skin Tank",
    price: 96,
    currency: "TND",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85",
    categories: ["underwears", "women", "men"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Chalk", "Black"],
    description:
      "Close-fit base tank in stretch cotton jersey. Built to layer or wear solo.",
    details: ["93% cotton, 7% elastane", "Bound edges", "Made in Portugal"],
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.categories.includes(category));
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export const categoryMeta: Record<
  Category,
  { title: string; eyebrow: string; heading: string; description: string }
> = {
  women: {
    title: "Women",
    eyebrow: "WOMEN / FW26",
    heading: "WOMEN",
    description:
      "Soft tailoring, sculptural knits and considered essentials for a wardrobe built to last.",
  },
  men: {
    title: "Men",
    eyebrow: "MEN / FW26",
    heading: "MEN",
    description:
      "Relaxed silhouettes, refined materials. Everyday pieces built with intention.",
  },
  accessories: {
    title: "Accessories",
    eyebrow: "ACCESSORIES",
    heading: "ACCESSORIES",
    description:
      "Bags, belts, footwear and objects of use — the small things that finish the picture.",
  },
  "new-in": {
    title: "New In",
    eyebrow: "JUST DROPPED",
    heading: "NEW IN",
    description:
      "The latest additions to the collection. Fresh arrivals from our ateliers.",
  },
  underwears: {
    title: "Underwears",
    eyebrow: "BASE LAYERS",
    heading: "UNDERWEARS",
    description:
      "Second-skin essentials in silk, modal and stretch cotton. Minimal lines, premium comfort.",
  },
  editorial: {
    title: "Editorial",
    eyebrow: "STORIES",
    heading: "EDITORIAL",
    description:
      "Notes from the studio. Campaigns, collaborations, and conversations.",
  },
};
