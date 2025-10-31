-- Dati di test per M.D.L. Srl
INSERT INTO companies (
  ragione_sociale, 
  forma_giuridica, 
  codice_ateco, 
  capitale_sociale, 
  settore
) VALUES (
  'M.D.L. Srl',
  'Società a responsabilità limitata',
  '68.20.01',
  10000.00,
  'Affitto e gestione di terreni per telecomunicazioni'
);

-- Bilancio 2022
INSERT INTO financial_statements (
  company_id, anno, tipo, data_riferimento,
  immobilizzazioni_materiali, attivo_circolante_crediti, attivo_circolante_liquidita,
  patrimonio_netto, capitale_sociale, riserve, utile_perdita_esercizio,
  debiti_finanziari, debiti_fornitori, debiti_tributari,
  ricavi_vendite, costi_servizi, costi_godimento_beni_terzi, 
  ammortamenti_svalutazioni, oneri_finanziari, imposte_esercizio
) VALUES (
  1, 2022, 'annuale', '2022-12-31',
  15000, 8500, 12000,
  35000, 10000, 18000, 7000,
  2000, 1200, 800,
  45000, 8000, 12000, 3000, 500, 2500
);

-- Bilancio 2023
INSERT INTO financial_statements (
  company_id, anno, tipo, data_riferimento,
  immobilizzazioni_materiali, attivo_circolante_crediti, attivo_circolante_liquidita,
  patrimonio_netto, capitale_sociale, riserve, utile_perdita_esercizio,
  debiti_finanziari, debiti_fornitori, debiti_tributari,
  ricavi_vendite, costi_servizi, costi_godimento_beni_terzi,
  ammortamenti_svalutazioni, oneri_finanziari, imposte_esercizio
) VALUES (
  1, 2023, 'annuale', '2023-12-31',
  18000, 9200, 15000,
  42000, 10000, 25000, 7000,
  1500, 1000, 600,
  48000, 8500, 11000, 3200, 400, 2800
);

-- Bilancio 2024
INSERT INTO financial_statements (
  company_id, anno, tipo, data_riferimento,
  immobilizzazioni_materiali, attivo_circolante_crediti, attivo_circolante_liquidita,
  patrimonio_netto, capitale_sociale, riserve, utile_perdita_esercizio,
  debiti_finanziari, debiti_fornitori, debiti_tributari,
  ricavi_vendite, costi_servizi, costi_godimento_beni_terzi,
  ammortamenti_svalutazioni, oneri_finanziari, imposte_esercizio
) VALUES (
  1, 2024, 'annuale', '2024-12-31',
  20000, 10500, 18000,
  49000, 10000, 32000, 7000,
  1000, 800, 500,
  52000, 9000, 10500, 3500, 350, 3000
);

-- Situazione infrannuale 2025
INSERT INTO financial_statements (
  company_id, anno, tipo, data_riferimento,
  immobilizzazioni_materiali, attivo_circolante_crediti, attivo_circolante_liquidita,
  patrimonio_netto, capitale_sociale, riserve, utile_perdita_esercizio,
  debiti_finanziari, debiti_fornitori, debiti_tributari,
  ricavi_vendite, costi_servizi, costi_godimento_beni_terzi,
  ammortamenti_svalutazioni, oneri_finanziari, imposte_esercizio
) VALUES (
  1, 2025, 'infrannuale', '2025-09-30',
  19500, 11000, 20000,
  54000, 10000, 39000, 5000,
  800, 700, 400,
  39000, 6500, 8000, 2600, 250, 2200
);
