import React from "react";
import PropType from "prop-types";
const Button = ({
  children,
  onClick,
  disabled,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${disabled}?${className}:but-class`}
    >
      {children}
    </button>
  );
};
Button.prototype = {
  children: PropType.node.isRequired,
  onClick: PropType.func,
  disable: PropType.bool,
  className: PropType.string,
  type: PropType.string,
};
export default Button;
