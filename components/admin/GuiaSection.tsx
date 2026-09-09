'use client';

export default function GuiaSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Guía</h1>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="bg-[#173330] text-white rounded px-4 py-2 text-sm"
        >
          Ver guía completa
        </a>
      </div>
      <p className="text-sm text-[#6b6858] mb-4">
        Así se ve la guía pública en este momento.
      </p>
      <div className="border border-[#dcd2ba] rounded-lg overflow-hidden bg-white">
        <iframe src="/" className="w-full h-[70vh]" title="Preview de la guía" />
      </div>
    </div>
  );
}
