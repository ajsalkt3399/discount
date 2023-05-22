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
    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
    let discountName = '';
    let discountAmount = 0;

    if (totalQuantity > 30) {
      const discountedProductsQuantity = Math.max(...Object.values(quantities));
      const discountedPrice = products
        .filter((product) => quantities[product.name] > 15)
        .map((product) => product.price)
        .reduce((a, b) => a + b, 0);
      discountName = 'tiered_50_discount';
      discountAmount = (discountedProductsQuantity - 15) * discountedPrice * 0.5;
    } else if (totalQuantity > 20) {
      discountName = 'bulk_10_discount';
      discountAmount = calculateSubtotal() * 0.1;
    } else if (totalQuantity > 10) {
      for (const product of products) {
        if (quantities[product.name] > 10) {
          discountName = 'bulk_5_discount';
          discountAmount = product.price * quantities[product.name] * 0.05;
          break;
        }
      }
    } else if (calculateSubtotal() > 200) {
      discountName = 'flat_10_discount';
      discountAmount = 10;
    }

    return { discountName, discountAmount };
  };

  const calculateGiftWrapFee = () => {
    let giftWrapFee = 0;

  for (const product of products) {
    const quantity = quantities[product.name] || 0;
    const giftWrapSelected = giftWraps[product.name] || false;

    if (giftWrapSelected) {
      giftWrapFee += quantity * 1; // $1 per unit
    }
  }

  return giftWrapFee;
  };

  const calculateShippingFee = () => {
    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
    const packageCount = Math.ceil(totalQuantity / 10);
    const shippingFee = packageCount * 5;
    return shippingFee;
  };

  const handleCheckout = () => {
    const subtotal = calculateSubtotal();
  const { discountName, discountAmount } = calculateDiscount();
  const giftWrapFee = calculateGiftWrapFee();
  const shippingFee = calculateShippingFee();
  const total = subtotal - discountAmount + giftWrapFee + shippingFee;

  console.log('Product Quantities:', quantities);
  console.log('Subtotal:', subtotal);
  console.log('Discount:', discountName, discountAmount);
  console.log('Gift Wrap Fee:', giftWrapFee);
  console.log('Shipping Fee:', shippingFee);
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
                onChange={(e) =>
                  handleQuantityChange(product.name, parseInt(e.target.value))
                }
              />
            </div>
            <div className="col-2">
              <label>
                <input
                  type="checkbox"
                  checked={giftWraps[product.name] || false}
                  onChange={(e) =>
                    handleGiftWrapChange(product.name, e.target.checked)
                  }
                />
                Gift Wrap
              </label>
            </div>
          </div>
        ))}
        <hr />
        <div className="row">
          <div className="col-2">Subtotal</div>
          <div className="col-1 text-right">
            ${calculateSubtotal().toFixed(2)}
          </div>
        </div>
        <div className="row">
          <div className="col-2">Discount</div>
          <div className="col-1 text-right">
            {calculateDiscount().discountName} - $
            {calculateDiscount().discountAmount.toFixed(2)}
          </div>
        </div>
        <div className="row">
          <div className="col-2">Gift Wrap Fee</div>
          <div className="col-1 text-right">
            ${calculateGiftWrapFee().toFixed(2)}
          </div>
        </div>
        <div className="row">
          <div className="col-2">Shipping Fee</div>
          <div className="col-1 text-right">
            ${calculateShippingFee().toFixed(2)}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-2">
            <strong>Total</strong>
          </div>
          <div className="col-1 text-right">
            <strong>
              ${(
                calculateSubtotal() -
                calculateDiscount().discountAmount +
                calculateGiftWrapFee() +
                calculateShippingFee()
              ).toFixed(2)}
            </strong>
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
