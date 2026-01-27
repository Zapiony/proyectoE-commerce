'use client';

import { useEffect, useState } from 'react';
import { getProductByCode, getProducts } from '@/service/productoDP';
import { IProducto } from "@/service/productoDP";
import Image from 'next/image';
import { useCart } from '@/context/cart';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import ButtonGeneral from '@/components/ui/buttonGeneral';

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<IProducto | null>(null);
    const [recommendations, setRecommendations] = useState<IProducto[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            const code = params?.code;
            if (!code) return;

            // Decode the code in case it has special characters
            const decodedCode = decodeURIComponent(Array.isArray(code) ? code[0] : code);

            try {
                const res = await getProductByCode(decodedCode);
                if (res.success && res.data) {
                    setProduct(res.data);
                }

                // Fetch recommendations (random 3)
                const allRes = await getProducts();
                if (allRes.success && allRes.data) {
                    const otherProducts = allRes.data.filter((p: IProducto) => p.PRD_CODIGO !== decodedCode);
                    // Shuffle and take 3
                    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
                    setRecommendations(shuffled.slice(0, 3));
                }

            } catch (error) {
                console.error("Error fetching product details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params?.code]);

    if (loading) return <div className="container py-5 text-center">Cargando detalle...</div>;
    if (!product) return <div className="container py-5 text-center">Producto no encontrado.</div>;

    return (
        <div className="container py-5">
            <div className="row mb-5">
                {/* Image Section */}
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="position-relative bg-light rounded-4 overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                        <Image
                            src="/img/imagenProducto.png"
                            alt={product.PRD_DESCRIPCION || ''}
                            fill
                            className="object-fit-contain"
                        />
                    </div>
                    {/* Thumbnails placeholder */}
                    <div className="d-flex gap-3 mt-3">
                        <div className="rounded-3 bg-light overflow-hidden position-relative" style={{ width: '80px', height: '80px' }}>
                            <Image src="/img/imagenProducto.png" alt="thumb" fill className="object-fit-cover" />
                        </div>
                        <div className="rounded-3 bg-light overflow-hidden position-relative" style={{ width: '80px', height: '80px' }}>
                            <Image src="/img/imagenProducto.png" alt="thumb" fill className="object-fit-cover" />
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="col-md-6">
                    <h1 className="fw-bold mb-2">{product.PRD_DESCRIPCION || ''}</h1>
                    <div className="mb-3 text-warning">
                        <i className="fa-solid fa-star"></i> 4.5 <span className="text-muted ms-2">(400 reviews)</span>
                    </div>

                    <h3 className="fw-bold mb-4">Descripción</h3>
                    <p className="text-muted mb-4">
                        {product.PRD_DESCRIPCION || ''}.
                        Este es un producto de alta calidad diseñado para satisfacer tus necesidades.
                        Cuenta con garantía de fábrica y soporte técnico especializado.
                    </p>

                    <h4 className="fw-bold mb-3">Características</h4>
                    <ul className="mb-4 text-muted">
                        <li>Poseen cancelación de ruido</li>
                        <li>Ergonómicos e intuitivos</li>
                        <li>Conexión rápida</li>
                        <li>Precio: ${Number(product.PRD_PRECIO).toFixed(2)}</li>
                    </ul>

                    <ButtonGeneral
                        texto={
                            <span className="d-flex align-items-center justify-content-center gap-2">
                                Añadir <FontAwesomeIcon icon={faCartPlus} className="small" />
                            </span> 
                        }
                        onClick={() => addToCart(product)}
                    />
                </div>
            </div>

            <hr className="my-5" />

            {/* Recommendations */}
            <h3 className="fw-bold mb-4">Otras recomendaciones</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {recommendations.map((rec) => (
                    <div key={rec.PRD_CODIGO} className="col">
                        <div className="card h-100 border rounded-4 overflow-hidden">
                            <div className="position-relative bg-light w-100" style={{ height: '250px' }}>
                                <Image
                                    src="/img/vectorHero.png"
                                    alt={rec.PRD_DESCRIPCION}
                                    fill
                                    className="object-fit-cover"
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold text-truncate">{rec.PRD_DESCRIPCION}</h5>
                                <p className="card-text text-muted small text-truncate-2">
                                    {rec.PRD_DESCRIPCION}
                                </p>
                                <div className="text-warning small mb-2">
                                    <i className="fa-solid fa-star"></i> 4.5 (400)
                                </div>
                                <h5 className="fw-bold">${Number(rec.PRD_PRECIO).toFixed(2)}</h5>
                                <button
                                    onClick={() => router.push(`/productos/${rec.PRD_CODIGO}`)}
                                    className="btn btn-outline-dark w-100 rounded-pill mt-2"
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
