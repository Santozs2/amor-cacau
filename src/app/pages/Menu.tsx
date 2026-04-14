import React from 'react';
import { ProductList } from '../components/ProductList';

export function Menu() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full">
        <ProductList />
      </div>
    </main>
  );
}
