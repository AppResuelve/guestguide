'use client';

import { useRef, useState } from 'react';

export default function GuiaSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(600);

  // Sin esto, el iframe queda con altura fija y scrollea "adentro" de sí
  // mismo. Al medir el alto real del contenido y aplicarlo al iframe, el
  // scroll pasa a ser el de la página del admin, como pidió Tomás.
  function handleLoad() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (doc) {
        setHeight(doc.documentElement.scrollHeight);
      }
    } catch {
      // Si por algún motivo no se puede leer (cross-origin), se queda con
      // la altura por defecto en vez de romper.
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Guía</h1>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm"
        >
          Ver guía completa
        </a>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Así se ve la guía pública en este momento.
      </p>
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          src="/"
          onLoad={handleLoad}
          title="Preview de la guía"
          style={{ width: '100%', height, border: 'none', display: 'block' }}
        />
      </div>
    </div>
  );
}
