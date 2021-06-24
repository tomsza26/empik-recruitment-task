import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

export const ProductComponent = (props) => {
  const { name, isBlocked, min, max, pid, passNumberOfProducts } = props;

  const [numberOfProducts, setNumberOfProducts] = useState(min);

  useEffect(() => {
    if (numberOfProducts !== min) {
      checkNumber(numberOfProducts);
    }

    passNumberOfProducts({ pid, numberOfProducts });
  }, [numberOfProducts]);

  const checkNumber = useCallback(
    debounce((numberOfProducts) => {
      fetch("/api/product/check", {
        method: "POST",
        body: JSON.stringify({
          pid,
          quantity: numberOfProducts,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.errorType === "INCORRECT_QUANTITY") {
            setNumberOfProducts(min);
          }
        });
    }, 200),
    []
  );

  const addProduct = () => {
    setNumberOfProducts((prevState) => (prevState === max ? prevState : prevState + 1));
  };

  const removeProduct = () => {
    setNumberOfProducts((prevState) => (prevState === min ? prevState : prevState - 1));
  };

  return (
    <div>
      {name} | {`Obecnie masz ${numberOfProducts} sztuk produktu`}
      <button disabled={isBlocked} onClick={addProduct}>
        +
      </button>
      <button disabled={isBlocked} onClick={removeProduct}>
        -
      </button>
    </div>
  );
};
