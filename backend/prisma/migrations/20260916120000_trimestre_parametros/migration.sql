-- La medicion de parametros pasa de mensual a trimestral (recomendacion EPA).
-- Renombra el periodo actual, sembrado con formato mensual ("2026-09"),
-- al formato trimestral ("2026-III") sin perder los valores ya registrados.
UPDATE "ParametroMes" SET mes = '2026-III' WHERE mes = '2026-09';
