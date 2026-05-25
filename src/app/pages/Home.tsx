import React from 'react';
import { Hero } from '../components/Hero';
import { ProductList } from '../components/ProductList';

export function Home() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 md:space-y-24">
      <Hero />
      <ProductList />
    </main>
  );
}
