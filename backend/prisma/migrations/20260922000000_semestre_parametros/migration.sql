-- La medicion de parametros pasa de trimestral a semestral, a pedido de la comunidad.
-- Renombra el periodo actual, sembrado con formato trimestral ("2026-III"),
-- al formato semestral ("2026-II") sin perder los valores ya registrados.
UPDATE "ParametroMes" SET mes = '2026-II' WHERE mes = '2026-III';
