export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateProduct = (product: {
  name: string;
  sku: string;
  price: string | number;
  cost: string | number;
  stock: string | number;
  threshold: string | number;
  category: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!product.name.trim()) {
    errors.push('Product name is required');
  }

  if (!product.sku.trim()) {
    errors.push('SKU is required');
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  if (isNaN(price) || price <= 0) {
    errors.push('Valid price is required');
  }

  const cost = typeof product.cost === 'string' ? parseFloat(product.cost) : product.cost;
  if (isNaN(cost) || cost < 0) {
    errors.push('Valid cost is required');
  }

  const stock = typeof product.stock === 'string' ? parseInt(product.stock) : product.stock;
  if (isNaN(stock) || stock < 0) {
    errors.push('Valid stock quantity is required');
  }

  const threshold = typeof product.threshold === 'string' ? parseInt(product.threshold) : product.threshold;
  if (isNaN(threshold) || threshold < 0) {
    errors.push('Valid reorder threshold is required');
  }

  if (!product.category) {
    errors.push('Category is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateSupplier = (supplier: {
  name: string;
  email: string;
  phone: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!supplier.name.trim()) {
    errors.push('Supplier name is required');
  }

  if (!validateEmail(supplier.email)) {
    errors.push('Valid email is required');
  }

  if (!validatePhone(supplier.phone)) {
    errors.push('Valid phone number is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

