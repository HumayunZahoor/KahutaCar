import React from 'react';

export default function Header({ title, subtitle }) {
    return (
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-950">STOCKIFY</h1>
            <h1 className="text-xl font-semibold text-orange-600 mt-2">{title}</h1>
            <p className="text-gray-600 text-xs">{subtitle}</p>
        </header>
    );
}
