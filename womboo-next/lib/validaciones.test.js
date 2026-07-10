import { test } from 'node:test';
import assert from 'node:assert';
import { validarEmail, validarCampoNoVacio } from './validaciones.js';

test('validarEmail acepta un email con formato válido', () => {
  assert.strictEqual(validarEmail('usuario@dominio.com'), true);
});

test('validarEmail rechaza un email sin @', () => {
  assert.strictEqual(validarEmail('usuariodominio.com'), false);
});

test('validarEmail rechaza un email sin dominio', () => {
  assert.strictEqual(validarEmail('usuario@.com'), false);
});

test('validarEmail rechaza un email sin extensión', () => {
  assert.strictEqual(validarEmail('usuario@dominio'), false);
});

test('validarEmail rechaza un email con espacios', () => {
  assert.strictEqual(validarEmail('usuario @dominio.com'), false);
});

test('validarEmail rechaza un string vacío', () => {
  assert.strictEqual(validarEmail(''), false);
});

test('validarCampoNoVacio acepta un texto con contenido', () => {
  assert.strictEqual(validarCampoNoVacio('Hola'), true);
});

test('validarCampoNoVacio rechaza un string vacío', () => {
  assert.ok(!validarCampoNoVacio(''));
});

test('validarCampoNoVacio rechaza un string con solo espacios', () => {
  assert.strictEqual(validarCampoNoVacio('   '), false);
});
