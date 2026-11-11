// Gordinho Brindes — regra de preço por faixa de quantidade (compartilhada entre loja e servidor)

/** Produto cadastrado sem preço: a loja mostra "sob consulta" e o valor é passado no WhatsApp. */
export function isPriceOnRequest(product) {
  if (!product) return false;
  return product.priceOnRequest === true || !(parseFloat(product.basePrice) > 0);
}

export function unitPriceForQty(product, qty = 100) {
  if (!product) return 0;
  const nQty = Math.max(1, parseInt(qty, 10) || 1);
  if (Array.isArray(product.tiers) && product.tiers.length > 0) {
    const sorted = [...product.tiers].sort((a, b) => (a.minQty || 1) - (b.minQty || 1));
    let matched = sorted[0];
    for (const tier of sorted) {
      if (nQty >= (tier.minQty || 1)) {
        matched = tier;
      }
    }
    if (matched && matched.price) return parseFloat(matched.price);
  }
  return parseFloat(product.basePrice) || 0;
}
