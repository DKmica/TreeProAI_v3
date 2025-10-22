"use client";

import * as React from "react";

const Button = React.forwardRef(function Button(
  { className, ...props },
  ref,
) {
  return (
    <button className={className} ref={ref} {...props} />
  );
});

Button.displayName = "Button";

export { Button };
