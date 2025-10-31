-- 1. ELIMINA TUTTI I DATI FITTIZI
DELETE FROM documents;
DELETE FROM valuations;
DELETE FROM financial_statements;
DELETE FROM companies;

-- 2. INSERISCI SOCIETÀ CON DATI REALI
INSERT INTO companies (
  ragione_sociale, 
  forma_giuridica, 
  codice_ateco, 
  capitale_sociale, 
  settore
) VALUES (
  'M.D.L. Srl',
  'Società a responsabilità limitata',
  '682001',
  92000.00,
  'Affitto e gestione di terreni per telecomunicazioni'
);

-- Nota: I bilanci verranno inseriti tramite upload PDF per usare il parsing AI
-- Questi sono valori placeholder che verranno sostituiti
