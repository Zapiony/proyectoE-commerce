'use client';

import { useState, useEffect } from 'react';
import Input from "@/components/ui/input";
import { useAuth } from '@/context/auth-context';
import { checkout } from '@/service/carritoComprasDP';
import { getClientByCedula } from "@/service/clienteDP";
import { downloadFacturaPdf } from '@/service/facturaDP';
import { useCart } from '@/context/cart';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
    const { user } = useAuth();
    const { clearCart } = useCart();

    // Form States
    const [cedulaFactura, setCedulaFactura] = useState('');
    const [formaPago, setFormaPago] = useState('TARJETA_CREDITO');
    const [invoiceId, setInvoiceId] = useState<number | null>(null);

    // Mock Payment States
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Helpers for formatting
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 2) {
            return `${v.slice(0, 2)}/${v.slice(2)}`;
        }
        return v;
    };

    // Validation Helpers
    const validateCardNumber = (number: string) => {
        const cleanNum = number.replace(/\D/g, '');
        if (cleanNum.length < 13 || cleanNum.length > 19) return false;

        // Luhn Algorithm
        let sum = 0;
        let shouldDouble = false;
        for (let i = cleanNum.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNum.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    };

    const validateExpiry = (expiry: string) => {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        const [month, year] = expiry.split('/').map(num => parseInt(num, 10));

        if (month < 1 || month > 12) return false;

        const currentYear = new Date().getFullYear() % 100; // Last 2 digits
        const currentMonth = new Date().getMonth() + 1;

        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;

        return true;
    };

    const validateCvv = (cvv: string) => {
        return /^\d{3,4}$/.test(cvv);
    };

    // Billing Data Selection
    const [useMyData, setUseMyData] = useState(true);
    const [clientData, setClientData] = useState<any>(null);
    const [otherClientData, setOtherClientData] = useState<any>(null);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        // Enforce using TOKEN only to get fresh data
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : undefined;

        if (token) {
            console.log("CheckoutModal: Fetching fresh client data using token...");
            import('@/service/carritoComprasDP').then(mod => {
                mod.getClientDetails(token).then(data => {
                    console.log("CheckoutModal: Fetch result:", data);
                    if (data) {
                        console.log("La data recogida es:", data);
                        setClientData(data);
                        setCedulaFactura(data.CLI_CEDULA_RUC || '');
                    } else {
                        console.warn("CheckoutModal: Could not resolve client data from token.");
                    }
                }).catch(err => console.error("CheckoutModal: Fetch error", err));
            });
        } else {
            console.warn("CheckoutModal: No token found in localStorage.");
        }
    }, [user]); // Re-run if user context changes (e.g. login/logout) but ignore internal user object properties

    if (!isOpen) return null;

    const getCedula = (u: any) => {
        if (!u) return undefined;
        // Prioritize explicit DB columns if present
        if (u.cedula) return u.cedula;
        if (u.CLI_CEDULA_RUC) return u.CLI_CEDULA_RUC;
        if (u.identification) return u.identification;
        if (u.id) return u.id;
        if (u.user) {
            if (u.user.cedula) return u.user.cedula;
            if (u.user.CLI_CEDULA_RUC) return u.user.CLI_CEDULA_RUC;
            if (u.user.identification) return u.user.identification;
            if (u.user.id) return u.user.id;
        }
        return undefined;
    };

    const cedula = getCedula(user) || (clientData ? clientData.CLI_CEDULA_RUC : undefined);

    console.log("CheckoutModal State:", {
        contextUser: user,
        clientData,
        finalCedula: cedula,
        useMyData
    });

    const handleOptionChange = (useMine: boolean) => {
        setUseMyData(useMine);
        if (useMine && clientData) {
            setCedulaFactura(clientData.CLI_CEDULA_RUC || '');
        } else {
            setCedulaFactura('');
        }
    };

    const handleSearchClient = async () => {
        if (!cedulaFactura) return;
        setSearchLoading(true);
        setOtherClientData(null);
        try {
            const token = localStorage.getItem('token') || undefined;
            const data = await getClientByCedula(cedulaFactura, token);
            if (data) {
                setOtherClientData(data);
            } else {
                setOtherClientData(null); // Or show a temporary "not found" hint
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const resolvedCedulaFactura = () => {
        return useMyData && clientData ? clientData.CLI_CEDULA_RUC : cedulaFactura;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const idToUse = resolvedCedulaFactura();
        // Hardcoded payment method as requested
        const finalPaymentMethod = 'TARJETA_CREDITO';

        console.log("Submitting Checkout:", {
            cedula,
            cedulaFactura: idToUse,
            formaPago: finalPaymentMethod
        });

        // Validation
        if (!idToUse || idToUse.length < 10) {
            setError('La cédula de factura debe tener al menos 10 dígitos.');
            setLoading(false);
            return;
        }

        // Card Validation
        if (finalPaymentMethod === 'TARJETA_CREDITO') {

            if (!validateExpiry(cardExpiry)) {
                setError('La fecha de expiración es inválida o está vencida.');
                setLoading(false);
                return;
            }
            if (!validateCvv(cardCvv)) {
                setError('El código CVV es inválido.');
                setLoading(false);
                return;
            }
        }

        if (!cedula) {
            console.error("Checkout Failed: Missing User ID");
            setError('Error de sesión: No se puede identificar al usuario.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token') || undefined;
            const res = await checkout(cedula, idToUse, finalPaymentMethod, token);
            if (res.success) {
                setSuccess(true);
                if (res.invoiceId) {
                    setInvoiceId(res.invoiceId);
                    handleDownloadInvoice(res.invoiceId);
                }
                clearCart();
                // Removed auto-close to let user see the button if pop-up blocked
            } else {
                setError(res.message || 'Error al procesar el pago.');
            }
        } catch (err) {
            console.error("Checkout Exception:", err);
            setError('Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (id?: number) => {
        const targetId = id || invoiceId;
        if (!targetId) return;
        try {
            const token = localStorage.getItem('token') || undefined;
            const res = await downloadFacturaPdf(targetId, token) as { success: boolean, data?: string };

            if (res.success && res.data) {
                const byteCharacters = atob(res.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `factura-${targetId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error("Error downloading PDF:", res);
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100 }}>
            {/* Overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-75"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-4 p-4 shadow-lg position-relative" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <button
                    onClick={onClose}
                    className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {success ? (
                    <div className="text-center py-5">
                        <div className="mb-3 text-success display-1">
                            <i className="fa-regular fa-circle-check"></i>
                        </div>
                        <h3 className="fw-bold text-success">¡Pago Exitoso!</h3>
                        <p className="text-muted">Gracias por su compra.</p>
                        {invoiceId && (
                            <button
                                onClick={() => handleDownloadInvoice()}
                                className="btn btn-outline-primary mt-3"
                            >
                                <i className="fa-solid fa-file-pdf me-2"></i>
                                Descargar Factura
                            </button>
                        )}
                        <br />
                        <button className="btn btn-link mt-3" onClick={onClose}>Cerrar</button>
                    </div>
                ) : (
                    <>
                        <h3 className="fw-bold mb-4">Finalizar Compra</h3>

                        {/* User Data / Billing Options */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3">Datos de Facturación</h6>

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="billingOption"
                                    id="useMyData"
                                    checked={useMyData}
                                    onChange={() => handleOptionChange(true)}
                                />
                                <label className="form-check-label" htmlFor="useMyData">
                                    Usar mis datos
                                </label>
                            </div>

                            {useMyData && clientData && (
                                <div className="p-3 bg-light rounded-3 mb-3 ms-4 border">
                                    <p className="mb-1 small text-dark"><strong>RUC/C.I.:</strong> {clientData.CLI_CEDULA_RUC}</p>
                                    <p className="mb-1 small text-dark"><strong>Nombre:</strong> {clientData.CLI_NOMBRE}</p>
                                    <p className="mb-0 small text-dark"><strong>Email:</strong> {clientData.CLI_CORREO}</p>
                                </div>
                            )}

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="billingOption"
                                    id="useOtherData"
                                    checked={!useMyData}
                                    onChange={() => handleOptionChange(false)}
                                />
                                <label className="form-check-label" htmlFor="useOtherData">
                                    Usar otros datos
                                </label>
                            </div>
                        </div>

                        {!useMyData && (
                            <div className="mb-4">
                                <div className="d-flex gap-2 align-items-end">
                                    <div className="flex-grow-1">
                                        <Input
                                            label="Cédula / RUC para Factura"
                                            labelClassName="text-dark"
                                            placeholder="Ingrese identificación..."
                                            value={cedulaFactura}
                                            onChange={(e) => {
                                                setCedulaFactura(e.target.value);
                                                if (otherClientData) setOtherClientData(null);
                                            }}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-dark rounded-3 px-3"
                                        style={{ height: '42px' }} // Match approximate input height
                                        onClick={handleSearchClient}
                                        disabled={searchLoading || !cedulaFactura}
                                    >
                                        {searchLoading ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                                    </button>
                                </div>
                                {otherClientData && (
                                    <div className="p-3 bg-light rounded-3 mt-3 border fade-in">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold m-0 small text-primary">Datos Encontrados</h6>
                                            <span className="badge bg-success small">Verificado</span>
                                        </div>
                                        <p className="mb-1 small text-dark"><strong>Nombre:</strong> {otherClientData.CLI_NOMBRE}</p>
                                        <p className="mb-1 small text-dark"><strong>Email:</strong> {otherClientData.CLI_CORREO}</p>
                                        {otherClientData.CLI_TELEFONO && (
                                            <p className="mb-0 small text-dark"><strong>Teléfono:</strong> {otherClientData.CLI_TELEFONO}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <h6 className="fw-bold mb-3 mt-4">Método de Pago</h6>
                            <div className="mb-3">
                                <select
                                    className="form-select"
                                    value={formaPago}
                                    onChange={(e) => setFormaPago(e.target.value)}
                                >
                                    <option value="Tarjeta Credito">Tarjeta de Crédito</option>
                                </select>
                            </div>

                            {formaPago !== 'Efectivo' && (
                                <div className="p-3 border rounded-3 mb-3 bg-light fade-in">
                                    <div className="mb-3">
                                        <Input
                                            label="Número de Tarjeta"
                                            labelClassName="text-dark"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const formatted = formatCardNumber(val);
                                                setCardNumber(formatted);
                                            }}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <Input
                                                label="Expiración (MM/YY)"
                                                labelClassName="text-dark"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <Input
                                                label="CVV"
                                                labelClassName="text-dark"
                                                type="password"
                                                placeholder="123"
                                                maxLength={4}
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <h5 className="fw-bold m-0">Subtotal:</h5>
                                <h4 className="fw-bold text-primary m-0">${(total).toFixed(2)}</h4>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <h5 className="fw-bold m-0">IVA:</h5>
                                <h4 className="fw-bold text-primary m-0">${(total * 0.15).toFixed(2)}</h4>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <h5 className="fw-bold m-0">Total a Pagar:</h5>
                                <h4 className="fw-bold text-primary m-0">${(total * 1.15).toFixed(2)}</h4>
                            </div>

                            {error && <div className="alert alert-danger mt-3 py-2 small text-center">{error}</div>}

                            <button
                                type="submit"
                                className="btn btn-dark w-100 py-3 mt-4 fw-bold rounded-pill"
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
