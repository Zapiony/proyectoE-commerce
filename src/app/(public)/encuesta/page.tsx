'use strict';
'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ButtonGeneral from "@/components/ui/buttonGeneral";
import AlertModal from '@/components/ui/alert-modal';

export default function SurveyPage() {
  const [showModal, setShowModal] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string().required('El nombre completo es obligatorio'),
    email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
    businessEmail: Yup.string().email('Correo electrónico inválido').required('El correo electrónico empresarial es obligatorio'),
    companyName: Yup.string().required('El nombre de la empresa es obligatorio'),
    companyType: Yup.string().required('El tipo de empresa es obligatorio'),
    comments: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      businessEmail: '',
      companyName: '',
      companyType: '',
      comments: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Simulate form submission
      setShowModal(true);
      resetForm();
    },
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="fw-bold display-5 text-dark">
              CONECTA CON <span className="text-warning">NOSOTROS</span>
            </h1>
            <p className="lead text-muted">
              Completa el formulario a continuación y nos pondremos en contacto contigo en breve.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="form-label fw-bold">
                Nombre completo <span className="text-danger">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`form-control ${formik.touched.fullName && formik.errors.fullName ? 'is-invalid' : ''}`}
                placeholder="Ingrese su nombre completo..."
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="invalid-feedback">{formik.errors.fullName}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-bold">
                Correo electrónico <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="Ingrese su correo electrónico personal..."
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="businessEmail" className="form-label fw-bold">
                Correo electrónico empresarial <span className="text-danger">*</span>
              </label>
              <input
                id="businessEmail"
                name="businessEmail"
                type="email"
                className={`form-control ${formik.touched.businessEmail && formik.errors.businessEmail ? 'is-invalid' : ''}`}
                placeholder="Ingrese su correo electrónico empresarial..."
                value={formik.values.businessEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.businessEmail && formik.errors.businessEmail ? (
                <div className="invalid-feedback">{formik.errors.businessEmail}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="companyName" className="form-label fw-bold">
                Nombre empresa <span className="text-danger">*</span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                className={`form-control ${formik.touched.companyName && formik.errors.companyName ? 'is-invalid' : ''}`}
                placeholder="Ingrese el nombre de su empresa..."
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.companyName && formik.errors.companyName ? (
                <div className="invalid-feedback">{formik.errors.companyName}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="companyType" className="form-label fw-bold">
                Tipo empresa <span className="text-danger">*</span>
              </label>
              <select
                id="companyType"
                name="companyType"
                className={`form-select ${formik.touched.companyType && formik.errors.companyType ? 'is-invalid' : ''}`}
                value={formik.values.companyType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>Seleccione el tipo de empresa que pertenece...</option>
                <option value="Tecnologia">Tecnología</option>
                <option value="Salud">Salud</option>
                <option value="Educacion">Educación</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Retail">Comercio / Retail</option>
                <option value="Finanzas">Servicios Financieros</option>
                <option value="Otro">Otro</option>
              </select>
              {formik.touched.companyType && formik.errors.companyType ? (
                <div className="invalid-feedback">{formik.errors.companyType}</div>
              ) : null}
            </div>

            <div className="mb-5">
              <label htmlFor="comments" className="form-label fw-bold">
                Comentarios
              </label>
              <input
                id="comments"
                name="comments"
                type="text"
                className="form-control"
                placeholder="¿Tienes algún comentario extra?"
                value={formik.values.comments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="text-center">
              <ButtonGeneral
                type="submit"
                texto="Enviar formulario"
                className="btn-dark"
              />
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Formulario Enviado"
        message="Sus respuestas han sido enviadas correctamente. ¡Gracias por su tiempo!"
        type="success"
      />
    </div>
  );
}
