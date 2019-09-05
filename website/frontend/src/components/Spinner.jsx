import React from 'react';

export default function Spinner() {
  return (
    <div className="text-center m-4">
      <div className="spinner-grow text-muted" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
