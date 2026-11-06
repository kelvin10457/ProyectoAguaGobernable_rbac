import { useJaap } from '../state/JaapContext';

/** Ancho del espacio para el número; cualquier cantidad de dígitos se ajusta a él. */
const ANCHO_NUMERO = 495;

/**
 * Logo de la junta con la cantidad real de familias.
 * El número va debajo de la imagen: logo-base.png es transparente en esa zona, y así «gotas» queda delante.
 */
export default function Logo({ className }: { className?: string }) {
  const { informacionGeneral } = useJaap();
  const familias = informacionGeneral ? String(informacionGeneral.familias) : '';

  return (
    <svg
      viewBox="0 0 976 1082"
      role="img"
      aria-label={`Logo JAAP El Limón–Havoline: ${familias} gotas de esperanza`}
      className={className}
    >
      <text
        x="432"
        y="750"
        textAnchor="middle"
        fill="#0c548e"
        fontFamily="Montserrat, 'Arial Black', sans-serif"
        fontSize="238"
        fontWeight="900"
        textLength={ANCHO_NUMERO}
        lengthAdjust="spacingAndGlyphs"
      >
        {familias}
      </text>
      <image href="/logo-base.png" width="976" height="1082" />
    </svg>
  );
}
