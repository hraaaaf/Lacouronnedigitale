import React from 'react';

const APropos = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
        À Propos de La Couronne Digitale
      </h1>
      <div className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
        <p className="mb-4">
          <strong>La Couronne Digitale</strong> est la première marketplace B2B dédiée exclusivement 
          aux professionnels de la santé dentaire au Maroc.
        </p>
        <p className="mb-4">
          Notre mission est de digitaliser l'approvisionnement des cabinets dentaires en 
          connectant directement les praticiens avec les meilleurs fournisseurs de matériel.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-3">Pourquoi nous ?</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Large catalogue d'instruments et consommables.</li>
            <li>Transparence totale sur les prix.</li>
            <li>Livraison sécurisée dans tout le royaume.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APropos;