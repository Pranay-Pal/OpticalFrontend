import ProductCreateForm from "./_components/ProductCreateForm";

const ProductCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Add a new product to inventory</p>
      </div>
      <ProductCreateForm />
    </div>
  );
};

export default ProductCreate;
