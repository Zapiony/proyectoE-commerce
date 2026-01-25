'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { IProducto } from "@/service/productoDP";
import { useCart } from "@/context/cart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import ButtonGeneral from "./buttonGeneral";

interface ProductCardProps {
    product: IProducto;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const handleCardClick = () => {
        router.push(`/productos/${product.PRD_CODIGO}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <div
            className="card h-100 border rounded-4 overflow-hidden shadow-sm product-card-hover"
            onClick={handleCardClick}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
            <div className="position-relative w-100 bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '250px' }}>
                <div className="text-center p-4">
                    {/* Placeholder image logic matching original */}
                    <Image
                        src="/img/imagenProducto.png"
                        alt={product.PRD_DESCRIPCION}
                        width={200}
                        height={200}
                        className="object-fit-contain hover-zoom"
                        style={{ transition: 'transform 0.3s ease' }}
                    />
                </div>
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-truncate mb-1" title={product.PRD_DESCRIPCION}>
                    {product.PRD_DESCRIPCION}
                </h5>

                <p className="card-text text-muted small text-truncate-2 m-0" style={{ minHeight: '40px' }}>
                    {(product.PRD_DESCRIPCION || '').length > 50
                        ? (product.PRD_DESCRIPCION || '').substring(0, 50) + '...'
                        : (product.PRD_DESCRIPCION || '')}
                </p>

                <div className="mb-3 d-flex align-items-center gap-2">
                    <div className="d-flex text-warning small align-items-center">
                        <FontAwesomeIcon icon={faStar} />
                        <span className="ms-1 fw-bold">4.5</span>
                    </div>
                    <span className="text-muted small">(400 reviews)</span>
                </div>
                <div className="mt-auto d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold m-0 text-dark">
                        ${Number(product.PRD_PRECIO).toFixed(2)}
                    </h5>

                    <ButtonGeneral
                        texto={
                            <span className="d-flex align-items-center justify-content-center gap-2">
                                Añadir <FontAwesomeIcon icon={faCartPlus} className="small" />
                            </span>
                        }
                        onClick={handleAddToCart}
                    />
                </div>
            </div>
        </div>
    );
}
