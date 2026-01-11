import { describe, it, expect } from 'vitest';
import {
  getFamilyPrintingConfig,
  getMinQtyForMethod,
  isMethodActiveInUI,
  getAllowedMethodsForFamily,
  getActiveMethodsInUI
} from '../family-printing-config';
import { PricingFamilyId } from '../../../types/printing';

describe('family-printing-config', () => {
  describe('getFamilyPrintingConfig', () => {
    it('debe retornar configuración para familia ropa', () => {
      const config = getFamilyPrintingConfig(PricingFamilyId.ROPA);
      expect(config).toBeDefined();
      expect(config.methods).toContain('DTF');
      expect(config.methods).toContain('SERIGRAFIA_1_COLOR');
      expect(config.methods).toContain('BORDADO');
      expect(config.activeInUI).toEqual(['DTF']);
    });

    it('debe retornar configuración para familia accesorios', () => {
      const config = getFamilyPrintingConfig(PricingFamilyId.ACCESORIOS);
      expect(config).toBeDefined();
      expect(config.methods).toContain('DTF');
      expect(config.methods).toContain('SERIGRAFIA_1_COLOR');
      expect(config.methods).toContain('BORDADO');
      expect(config.activeInUI).toEqual(['DTF']);
    });

    it('debe retornar configuración para familia hogar', () => {
      const config = getFamilyPrintingConfig(PricingFamilyId.HOGAR);
      expect(config).toBeDefined();
      expect(config.methods).toContain('DTF_UV');
      expect(config.methods).toContain('TAMPO_1_COLOR');
      expect(config.activeInUI).toEqual([]);
    });

    it('debe retornar configuración para familia papeleria', () => {
      const config = getFamilyPrintingConfig(PricingFamilyId.PAPELERIA);
      expect(config).toBeDefined();
      expect(config.methods).toContain('DTF_UV');
      expect(config.methods).toContain('TAMPO_1_COLOR');
      expect(config.activeInUI).toEqual([]);
    });

    it('debe retornar configuración para familia otros', () => {
      const config = getFamilyPrintingConfig(PricingFamilyId.OTROS);
      expect(config).toBeDefined();
      expect(config.methods).toEqual(['DTF']);
      expect(config.activeInUI).toEqual(['DTF']);
    });
  });

  describe('getMinQtyForMethod', () => {
    it('debe retornar cantidad mínima correcta para DTF en ropa', () => {
      const minQty = getMinQtyForMethod(PricingFamilyId.ROPA, 'DTF');
      expect(minQty).toBe(25);
    });

    it('debe retornar cantidad mínima correcta para Serigrafía en ropa', () => {
      const minQty = getMinQtyForMethod(PricingFamilyId.ROPA, 'SERIGRAFIA_1_COLOR');
      expect(minQty).toBe(50);
    });

    it('debe retornar cantidad mínima correcta para DTF en accesorios', () => {
      const minQty = getMinQtyForMethod(PricingFamilyId.ACCESORIOS, 'DTF');
      expect(minQty).toBe(50);
    });

    it('debe retornar cantidad mínima correcta para DTF_UV en hogar', () => {
      const minQty = getMinQtyForMethod(PricingFamilyId.HOGAR, 'DTF_UV');
      expect(minQty).toBe(20);
    });

    it('debe retornar cantidad mínima correcta para Tampografía en papelería', () => {
      const minQty = getMinQtyForMethod(PricingFamilyId.PAPELERIA, 'TAMPO_1_COLOR');
      expect(minQty).toBe(250);
    });

    it('debe retornar 1 como fallback para método no definido', () => {
      const minQty = getMinQtyForMethod(PricingFamilyId.ROPA, 'METODO_INEXISTENTE');
      expect(minQty).toBe(1);
    });
  });

  describe('isMethodActiveInUI', () => {
    it('debe retornar true para DTF en ropa (activo)', () => {
      const isActive = isMethodActiveInUI(PricingFamilyId.ROPA, 'DTF');
      expect(isActive).toBe(true);
    });

    it('debe retornar false para Serigrafía en ropa (inactivo)', () => {
      const isActive = isMethodActiveInUI(PricingFamilyId.ROPA, 'SERIGRAFIA_1_COLOR');
      expect(isActive).toBe(false);
    });

    it('debe retornar false para DTF_UV en hogar (inactivo)', () => {
      const isActive = isMethodActiveInUI(PricingFamilyId.HOGAR, 'DTF_UV');
      expect(isActive).toBe(false);
    });

    it('debe retornar false para método inexistente', () => {
      const isActive = isMethodActiveInUI(PricingFamilyId.ROPA, 'METODO_INEXISTENTE');
      expect(isActive).toBe(false);
    });
  });

  describe('getAllowedMethodsForFamily', () => {
    it('debe retornar métodos permitidos para ropa', () => {
      const methods = getAllowedMethodsForFamily(PricingFamilyId.ROPA);
      expect(methods).toEqual(['DTF', 'SERIGRAFIA_1_COLOR', 'BORDADO']);
    });

    it('debe retornar métodos permitidos para hogar', () => {
      const methods = getAllowedMethodsForFamily(PricingFamilyId.HOGAR);
      expect(methods).toEqual(['DTF_UV', 'TAMPO_1_COLOR']);
    });

    it('debe retornar métodos permitidos para otros', () => {
      const methods = getAllowedMethodsForFamily(PricingFamilyId.OTROS);
      expect(methods).toEqual(['DTF']);
    });
  });

  describe('getActiveMethodsInUI', () => {
    it('debe retornar métodos activos en UI para ropa', () => {
      const methods = getActiveMethodsInUI(PricingFamilyId.ROPA);
      expect(methods).toEqual(['DTF']);
    });

    it('debe retornar array vacío para hogar (sin métodos activos)', () => {
      const methods = getActiveMethodsInUI(PricingFamilyId.HOGAR);
      expect(methods).toEqual([]);
    });

    it('debe retornar métodos activos en UI para otros', () => {
      const methods = getActiveMethodsInUI(PricingFamilyId.OTROS);
      expect(methods).toEqual(['DTF']);
    });
  });

  describe('Validaciones de negocio', () => {
    it('DTF debe tener mínimo menor en ropa que en accesorios', () => {
      const ropaMin = getMinQtyForMethod(PricingFamilyId.ROPA, 'DTF');
      const accesoriosMin = getMinQtyForMethod(PricingFamilyId.ACCESORIOS, 'DTF');
      expect(ropaMin).toBeLessThan(accesoriosMin);
    });

    it('Serigrafía debe tener mínimo mayor que DTF en ropa', () => {
      const dtfMin = getMinQtyForMethod(PricingFamilyId.ROPA, 'DTF');
      const seriMin = getMinQtyForMethod(PricingFamilyId.ROPA, 'SERIGRAFIA_1_COLOR');
      expect(seriMin).toBeGreaterThan(dtfMin);
    });

    it('Tampografía debe tener mínimo mayor en papelería que en hogar', () => {
      const hogarMin = getMinQtyForMethod(PricingFamilyId.HOGAR, 'TAMPO_1_COLOR');
      const papelMin = getMinQtyForMethod(PricingFamilyId.PAPELERIA, 'TAMPO_1_COLOR');
      expect(papelMin).toBeGreaterThan(hogarMin);
    });

    it('Solo DTF debe estar activo en UI para textil (Fase 1.2)', () => {
      const ropaActive = getActiveMethodsInUI(PricingFamilyId.ROPA);
      const accesoriosActive = getActiveMethodsInUI(PricingFamilyId.ACCESORIOS);
      expect(ropaActive).toEqual(['DTF']);
      expect(accesoriosActive).toEqual(['DTF']);
    });

    it('Ningún método debe estar activo en UI para rígidos (Fase 1.2)', () => {
      const hogarActive = getActiveMethodsInUI(PricingFamilyId.HOGAR);
      const papelActive = getActiveMethodsInUI(PricingFamilyId.PAPELERIA);
      expect(hogarActive).toEqual([]);
      expect(papelActive).toEqual([]);
    });
  });
});
