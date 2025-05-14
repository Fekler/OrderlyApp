import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormArray } from '@angular/forms';

/**
 * Validador para garantir que o produto não seja duplicado no FormArray de itens do pedido.
 * @param getOrderItemsArray Uma função que retorna o FormArray 'orderItems'.
 */
export function createUniqueProductValidator(getOrderItemsArray: () => FormArray): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.parent) { // Nenhum produto selecionado ou controle não está em um grupo
      return null;
    }
    const orderItemsArray = getOrderItemsArray();
    if (!orderItemsArray) return null; // Array de itens não disponível

    const currentFormGroup = control.parent as FormGroup; // O FormGroup do item atual
    const currentProductId = control.value;

    const isDuplicate = orderItemsArray.controls.some(itemGroup => {
      // Verifica se é um FormGroup diferente, mas tem o mesmo productId
      return itemGroup !== currentFormGroup && itemGroup.get('productId')?.value === currentProductId;
    });

    return isDuplicate ? { duplicateProduct: true } : null;
  };
}

/**
 * Validador para garantir que a quantidade não exceda o estoque disponível.
 * @param productsList Uma função que retorna a lista de produtos.
 * @param getProductIdControl Uma função que retorna o FormControl 'productId' do mesmo item.
 */
export function createMaxStockValidator(productsList: () => any[], getProductIdControl: () => AbstractControl | null): ValidatorFn {
  return (quantityControl: AbstractControl): ValidationErrors | null => {
    const productIdControl = getProductIdControl();
    if (!productIdControl || !productIdControl.value || !quantityControl.value) {
      // Informações insuficientes para validar (nenhum produto selecionado ou quantidade não definida)
      return null;
    }

    const productId = productIdControl.value;
    const quantity = Number(quantityControl.value); // Garante que é um número
    const products = productsList();

    const product = products.find(p => p.uuid === productId);
    if (!product) {
      return null; // Produto não encontrado (pode ser um estado intermediário)
    }

    const availableStock = Number(product.quantity); // 'quantity' do payload é o estoque
    if (isNaN(availableStock)) {
      console.warn(`Estoque para o produto ${productId} não é um número:`, product.quantity);
      return null; // Não pode validar se o estoque não for um número
    }

    if (quantity > availableStock) {
      return { maxStockExceeded: { requiredMax: availableStock, actual: quantity } };
    }
    return null;
  };
}
