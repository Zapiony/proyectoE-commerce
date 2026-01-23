'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useEffect, useState } from 'react';
import { getProducts } from '@/service/productoDP';
import { getCategorias } from '@/service/categoriaDP';
import { ICategoria } from "@/service/categoriaDP";
import { IProducto } from "@/service/productoDP";
import { useCart } from '@/context/cart';
import { useAuth } from '@/context/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '@/components/ui/productCard';

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProducto[]>([]);
  const [categories, setCategories] = useState<ICategoria[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProducto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toggleCart, cart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategorias()
        ]);

        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data);
          setFilteredProducts(prodRes.data);
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'Todo') {
      result = result.filter(p => p.CAT_CODIGO === selectedCategory);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.PRD_DESCRIPCION.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, products]);

  if (loading) return <div className="container mt-5 text-center">Cargando productos...</div>;

  return (
    <div className="p-4">
      {/* Search Bar & Cart */}
      <div className="row mb-4 align-items-center">
        <div className="col-10 col-md-11">
          <div className="input-group input-group-lg border rounded-pill overflow-hidden shadow-sm">
            <span className="input-group-text bg-white border-0 ps-4">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Buscas algo especial? ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text bg-white border-0 pe-4">
              <i className="fa-solid fa-filter text-muted"></i>
            </span>
          </div>
        </div>
        {user && (
          <div className="col-2 col-md-1 d-flex justify-content-center">
            <button
              className="btn btn-dark rounded-circle position-relative d-flex align-items-center justify-content-center"
              style={{ width: '55px', height: '55px' }}
              onClick={toggleCart}
            >
              <FontAwesomeIcon icon={faCartShopping} className="fs-5 text-white" />
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded-4 p-3">
            <h4 className="fw-bold mb-3">Categorías</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <button
                  className={`btn w-100 text-start rounded-3 fw-bold ${selectedCategory === 'Todo' ? 'btn-dark text-white' : 'btn-outline-dark border-0 text-secondary'}`}
                  onClick={() => setSelectedCategory('Todo')}
                >
                  Todo
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.CAT_CODIGO} className="mb-2">
                  <button
                    className={`btn w-100 text-start rounded-3 ${selectedCategory === cat.CAT_CODIGO ? 'btn-dark text-white' : 'btn-outline-dark border-0 text-secondary'}`}
                    onClick={() => setSelectedCategory(cat.CAT_CODIGO || '')}
                  >
                    {cat.CAT_NOMBRE}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-md-9">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {filteredProducts.map((product) => (
              <div key={product.PRD_CODIGO} className="col">
                <ProductCard product={product} />
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-12 text-center py-5">
                <h5 className="text-muted">No se encontraron productos.</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
