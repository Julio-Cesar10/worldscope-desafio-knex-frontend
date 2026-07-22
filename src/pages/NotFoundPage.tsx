import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="state-container">
      <span className="state-icon" aria-hidden="true">
        🧭
      </span>
      <h2>404</h2>
      <p>Page not found.</p>
      <Link to="/" className="btn btn--primary">
        Back home
      </Link>
    </div>
  );
}
