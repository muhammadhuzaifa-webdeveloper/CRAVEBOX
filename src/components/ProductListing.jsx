import ProductCard from "./ProductCard";

function ProductListing({ products, onSelectProduct }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
}

export default ProductListing;