import { Link } from "react-router-dom";

export function ConditionalLink({ to, children, ...props }) {
  if (to)
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  return <div {...props}>{children}</div>;
}
