/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../frontend/templates/**/*.{html,js}",
    "../frontend/static/js/**/*.js",
    "../frontend/static/css/**/*.css"
  ],
  safelist: [
    'icon-base','icon-hover','icon-link','flex','flex-col','flex-shrink-0','justify-center','justify-end','items-center','items-start','items-end','text-right','text-center','font-bold','uppercase','tracking-wide','transition','cursor-pointer','self-center','leading-none','overflow-hidden','bg-neutral-100','bg-transparent','text-gray-600','text-gray-700','text-gray-800','text-gray-900','hover:text-accent','hover:underline','font-alumni','h-screen','w-full','max-w-7xl','grid','grid-cols-2','place-items-center','mb-4','py-2','px-6','pl-6','pr-6','space-x-4','space-y-0','text-9xl','sm:text-[10rem]','sm:text-2xl','lg:text-[12rem]','lg:text-3xl','text-xl','grid-cols-[2fr_3fr]','-mt-2','-mt-6','leading-none','hover:mt-0','transition-all','duration-300','hover:scale-105','duration-500','hover-effect','scale-105','group','opacity-80','translate-x-1','translate-y-1','header-icons',
    // semantic tokens
    'text-giant','sm:text-giant-sm','lg:text-giant-lg','leading-070','-mt-overlap-lg','-mt-overlap-md','mt-gap-md','mt-gap-lg','hover:text-accent','right-buttons'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'alumni': ['Alumni Sans', 'sans-serif'],
      },
      colors: {
        'bg-dark': '#282a36',
        'accent': '#bd93f9',
        'text-light': '#f8f8f2',
        'neutral-100': '#fdfaf6',
      },
      fontSize: {
        'giant': '10rem',
        'giant-sm': '12rem',
        'giant-lg': '14rem',
      },
      spacing: {
        'overlap-md': '0.75rem',
        'overlap-lg': '1.5rem',
        'gap-md': '1rem',
        'gap-lg': '1.5rem',
      },
      lineHeight: {
        '070': '0.7',
      },
      colors: {
        'accent': '#7c3aed',
      },
    },
  },
  plugins: [],
}