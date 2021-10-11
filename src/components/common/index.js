import { css, cx } from "emotion";
import React from "react";
import ReactDOM from "react-dom";

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));

export const Portal = ({ children }) =>
  ReactDOM.createPortal(children, document.body);
