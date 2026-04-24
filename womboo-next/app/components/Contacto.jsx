'use client';

import { useState } from 'react';
import styles from './Contacto.module.css';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section className={styles.contact} id="contact">
      <h2 className={styles.contactTitle}>Contacto</h2>
      <form className={styles.contactForm} onSubmit={handleSubmit} aria-label="Formulario de contacto">
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className={styles.formButton}>
          Enviar
        </button>
        {submitted && (
          <div className={styles.formMessage}>
            ¡Gracias {formData.name}! Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.
          </div>
        )}
      </form>
    </section>
  );
}
