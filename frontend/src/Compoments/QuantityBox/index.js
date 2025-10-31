import Button from '@mui/material/Button';
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import React, { useState } from 'react';

const QuantityBox = props => {
  const { quantity = 1, onQuantityChange, max = 999, min = 1 } = props;
  const [inputVal, setInputVal] = useState(quantity);

  // Update local state when prop changes
  React.useEffect(() => {
    setInputVal(quantity);
  }, [quantity]);

  const minus = () => {
    if (inputVal > min) {
      const newVal = inputVal - 1;
      setInputVal(newVal);
      if (onQuantityChange) {
        onQuantityChange(newVal);
      }
    }
  };

  const plus = () => {
    if (inputVal < max) {
      const newVal = inputVal + 1;
      setInputVal(newVal);
      if (onQuantityChange) {
        onQuantityChange(newVal);
      }
    }
  };

  const handleInputChange = e => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    setInputVal(clampedValue);
    if (onQuantityChange) {
      onQuantityChange(clampedValue);
    }
  };

  return (
    <div className="quantityDrop d-flex align-items-center">
      <Button
        className="btn btn-light"
        onClick={minus}
        disabled={inputVal <= min}
      >
        <FaMinus />
      </Button>
      <input
        type="number"
        value={inputVal}
        onChange={handleInputChange}
        min={min}
        max={max}
        style={{ width: '60px', textAlign: 'center' }}
      />
      <Button
        className="btn btn-light"
        onClick={plus}
        disabled={inputVal >= max}
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default QuantityBox;
