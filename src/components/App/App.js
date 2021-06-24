import React, { useEffect, useState } from "react";
import "./App.css";
import { Product } from "../Product";

const App = () => {
  const [productsList, setProductsList] = useState([]);
  const [orderSum, setOrderSum] = useState(0);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setProductsList(prepareProductsArray(data)));
  }, []);

  useEffect(() => {
    if (productsList.length) {
      setOrderSum(productsList.reduce((acc, product) => acc + product.sumOfProducts, 0).toFixed(2));
    }
  }, [productsList]);

  const prepareProductsArray = (products) =>
    products.map((product) => ({
      ...product,
      price: parseFloat(product.price),
      numberOfProducts: product.min,
      sumOfProducts: product.min * product.price,
    }));

  const setNumberOfProducts = ({ pid, numberOfProducts }) => {
    setProductsList((prevState) =>
      prevState.map((product) =>
        product.pid === pid
          ? { ...product, numberOfProducts, sumOfProducts: numberOfProducts * product.price }
          : { ...product }
      )
    );
  };

  const formatPrice = (price) => price.toString().replace(".", ",");

  return (
    <div className="container">
      <h3>Lista produktów</h3>
      <ul>
        {productsList.map(({ pid, name, price }) => (
          <li key={pid} className="row">
            {`${name}, cena: ${formatPrice(price)}zł`}
          </li>
        ))}
      </ul>
      <h3>Koszyk</h3>
      <ul>
        {productsList.map(({ name, pid, isBlocked, min, max }) => (
          <li key={pid} className="row">
            <Product
              passNumberOfProducts={setNumberOfProducts}
              name={name}
              isBlocked={!!isBlocked}
              pid={pid}
              min={min}
              max={max}
            />
          </li>
        ))}
      </ul>
      <h2>Sum order: {orderSum}zł</h2>
    </div>
  );
};

export { App };
