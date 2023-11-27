import React from 'react';

const NotFound = () => {
    return (
        <div style={{ marginBottom: "150px" }}>
            <img className="mt-5" src="data:image/png;base64,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" alt="" />
            <h1 className="text-success my-5">Page Broken</h1>
        </div>
    );
};

export default NotFound;