import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-12">
      <Link to="/">
        <img src="/logo.svg" alt="Tripora" className="h-10 w-auto mb-16" />
      </Link>
      <h2 className="text-heading font-light text-graphite mb-2">{title}</h2>
      {subtitle && <p className="text-body text-stone">{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;
