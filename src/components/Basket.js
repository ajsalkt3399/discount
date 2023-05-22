import React, { useState } from 'react';

export default function Basket() {
  const products = [
    { name: 'Product A', price: 20 },
    { name: 'Product B', price: 40 },
    { name: 'Product C', price: 50 },
  ];

  const [quantities, setQuantities] = useState({});
  const [giftWraps, setGiftWraps] = useState({});

  const handleQuantityChange = (productName, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productName]: quantity,
    }));
  };

  const handleGiftWrapChange = (productName, giftWrap) => {
    setGiftWraps((prevGiftWraps) => ({
      ...prevGiftWraps,
      [productName]: giftWrap,
    }));
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    for (const product of products) {
      const quantity = quantities[product.name] || 0;
      subtotal += quantity * product.price;
    }
    return subtotal;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    let discountName = '';
    let discountAmount = 0;

    if (subtotal > 200) {
      discountName = 'flat_10_discount';
      discountAmount = 10;
    }

    for (const product of products) {
      const quantity = quantities[product.name] || 0;
      if (quantity > 10) {
        discountName = 'bulk_5_discount';
        discountAmount = (product.price * quantity * 5) / 100;
        break;
      }
    }

    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalQuantity > 20) {
      discountName = 'bulk_10_discount';
      discountAmount = (calculateSubtotal() * 10) / 100;
    }

    const exceeds30 = totalQuantity > 30;
    const exceeds15 = Object.values(quantities).some((quantity) => quantity > 15);
    if (exceeds30 && exceeds15) {
      discountName = 'tiered_50_discount';
      const quantityAbove15 = Object.values(quantities).map((quantity) =>
        quantity > 15 ? quantity - 15 : 0
      );
      discountAmount = quantityAbove15.reduce((a, b) => a + b, 0) * 0.5;
    }

    return { discountName, discountAmount };
  };

  const calculateShippingFee = () => {
    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
    const packageCount = Math.ceil(totalQuantity / 10);
    const shippingFee = packageCount * 5;
    return shippingFee;
  };

  const calculateGiftWrapFee = () => {
    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
    const giftWrapFee = totalQuantity * 1;
    return giftWrapFee;
  };

  const handleCheckout = () => {
    const subtotal = calculateSubtotal();
    const { discountName, discountAmount } = calculateDiscount();
    const shippingFee = calculateShippingFee();
    const giftWrapFee = calculateGiftWrapFee();
    const total = subtotal - discountAmount + shippingFee + giftWrapFee;

    console.log('Product Quantities:', quantities);
    console.log('Subtotal:', subtotal);
    console.log('Discount:', discountName, discountAmount);
    console.log('Shipping Fee:', shippingFee);
    console.log('Gift Wrap Fee:', giftWrapFee);
    console.log('Total:', total);
  };

  return (
    <aside className="block col-1">
      <h2>Cart Items</h2>
      <div>
        {products.map((product) => (
          <div key={product.name} className="row">
            <div className="col-2">{product.name}</div>
            <div className="col-2">
              <input
                type="number"
                min="0"
                value={quantities[product.name] || ''}
                onChange={(e) => handleQuantityChange(product.name, +e.target.value)}
              />
            </div>
            <div className="col-2">
              <label>
                <input
                  type="checkbox"
                  checked={giftWraps[product.name] || false}
                  onChange={(e) => handleGiftWrapChange(product.name, e.target.checked)}
                />
                Gift Wrap
              </label>
            </div>
          </div>
        ))}

        <hr />
        <div className="row">
          <div className="col-2">Subtotal</div>
          <div className="col-1 text-right">${calculateSubtotal().toFixed(2)}</div>
        </div>
        <div className="row">
          <div className="col-2">Discount</div>
          <div className="col-1 text-right">
            {calculateDiscount().discountName} - ${calculateDiscount().discountAmount.toFixed(2)}
          </div>
        </div>
        <div className="row">
          <div className="col-2">Shipping Fee</div>
          <div className="col-1 text-right">${calculateShippingFee().toFixed(2)}</div>
        </div>
        <div className="row">
          <div className="col-2">Gift Wrap Fee</div>
          <div className="col-1 text-right">${calculateGiftWrapFee().toFixed(2)}</div>
        </div>
        <hr />
        <div className="row">
          <div className="col-2">
            <strong>Total</strong>
          </div>
          <div className="col-1 text-right">
            <strong>${(calculateSubtotal() - calculateDiscount().discountAmount + calculateShippingFee() + calculateGiftWrapFee()).toFixed(2)}</strong>
          </div>
        </div>
        <hr />
        <div className="row">
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </aside>
  );
}
