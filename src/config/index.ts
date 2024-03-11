export const PRODUCT_CATEGORIES = [
  {
    label: 'Creatives',
    value: 'ui_kits' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/products?category=ui_kits`,
        imageSrc: '/nav/ui-kits/clockdalle .png',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=ui_kits&sort=desc',
        imageSrc: '/nav/ui-kits/image2.png',
      },
      {
        name: 'Bestsellers',
        href: '/products?category=ui_kits',
        imageSrc: '/nav/ui-kits/image3.png',
      },
    ],
  },
  {
    label: 'Designers',
    value: 'icons' as const,
    featured: [
      {
        name: 'Favorite Picks',
        href: `/products?category=icons`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Bestselling',
        href: '/products?category=icons',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
]
