-- =======================================================================
-- INSERT REAL BILANCI - FIXED SCHEMA
-- M.D.L. Srl - Financial Statements 2022, 2023, 2024
-- =======================================================================

-- BILANCIO 2022
INSERT INTO financial_statements (
  company_id,
  anno,
  tipo,
  data_riferimento,
  
  -- ATTIVO
  immobilizzazioni_immateriali,
  immobilizzazioni_materiali,
  immobilizzazioni_finanziarie,
  attivo_circolante_rimanenze,
  attivo_circolante_crediti,
  attivo_circolante_liquidita,
  ratei_risconti_attivi,
  
  -- PASSIVO
  capitale_sociale,
  riserve,
  utile_perdita_esercizio,
  patrimonio_netto,
  fondi_rischi_oneri,
  tfr,
  debiti_finanziari,
  debiti_fornitori,
  debiti_tributari,
  altri_debiti,
  ratei_risconti_passivi,
  
  -- CONTO ECONOMICO
  ricavi_vendite,
  altri_ricavi,
  costi_materie_prime,
  costi_servizi,
  costi_godimento_beni_terzi,
  costi_personale,
  ammortamenti_svalutazioni,
  accantonamenti,
  oneri_diversi_gestione,
  proventi_finanziari,
  oneri_finanziari,
  rettifiche_valore_attivita_finanziarie,
  proventi_oneri_straordinari,
  imposte_esercizio
) VALUES (
  2,  -- company_id
  2022,  -- anno
  'annuale',  -- tipo ✅ FIXED
  '2022-12-31',  -- data_riferimento
  
  -- ATTIVO
  0,  -- immobilizzazioni_immateriali
  0,  -- immobilizzazioni_materiali
  437421,  -- immobilizzazioni_finanziarie ✅
  0,  -- attivo_circolante_rimanenze
  257,  -- attivo_circolante_crediti ✅
  9999,  -- attivo_circolante_liquidita ✅
  1,  -- ratei_risconti_attivi ✅
  
  -- PASSIVO
  92000,  -- capitale_sociale ✅ CORRETTO
  347092,  -- riserve (21745 + 325347) ✅
  -8428,  -- utile_perdita_esercizio ✅ PERDITA
  430664,  -- patrimonio_netto ✅
  0,  -- fondi_rischi_oneri
  0,  -- tfr
  0,  -- debiti_finanziari
  0,  -- debiti_fornitori
  0,  -- debiti_tributari
  13473,  -- altri_debiti ✅
  3541,  -- ratei_risconti_passivi ✅
  
  -- CONTO ECONOMICO
  0,  -- ricavi_vendite
  15,  -- altri_ricavi ✅
  0,  -- costi_materie_prime
  3019,  -- costi_servizi ✅
  0,  -- costi_godimento_beni_terzi
  0,  -- costi_personale (no dipendenti)
  0,  -- ammortamenti_svalutazioni
  0,  -- accantonamenti
  2100,  -- oneri_diversi_gestione ✅
  1119,  -- proventi_finanziari ✅ (da partecipazioni)
  4443,  -- oneri_finanziari ✅
  0,  -- rettifiche_valore_attivita_finanziarie
  0,  -- proventi_oneri_straordinari
  0   -- imposte_esercizio
);

-- BILANCIO 2023
INSERT INTO financial_statements (
  company_id,
  anno,
  tipo,
  data_riferimento,
  
  immobilizzazioni_immateriali,
  immobilizzazioni_materiali,
  immobilizzazioni_finanziarie,
  attivo_circolante_rimanenze,
  attivo_circolante_crediti,
  attivo_circolante_liquidita,
  ratei_risconti_attivi,
  
  capitale_sociale,
  riserve,
  utile_perdita_esercizio,
  patrimonio_netto,
  fondi_rischi_oneri,
  tfr,
  debiti_finanziari,
  debiti_fornitori,
  debiti_tributari,
  altri_debiti,
  ratei_risconti_passivi,
  
  ricavi_vendite,
  altri_ricavi,
  costi_materie_prime,
  costi_servizi,
  costi_godimento_beni_terzi,
  costi_personale,
  ammortamenti_svalutazioni,
  accantonamenti,
  oneri_diversi_gestione,
  proventi_finanziari,
  oneri_finanziari,
  rettifiche_valore_attivita_finanziarie,
  proventi_oneri_straordinari,
  imposte_esercizio
) VALUES (
  2,
  2023,
  'annuale',
  '2023-12-31',
  
  0,
  0,
  437421,  -- stesse partecipazioni
  0,
  0,  -- no crediti commerciali
  7490,  -- liquidità (stimata)
  0,
  
  92000,  -- capitale sociale
  338663,  -- riserve (patrimonio prec - perdita)
  -281,  -- utile_perdita_esercizio ✅ PICCOLA PERDITA
  430382,  -- patrimonio_netto ✅
  0,
  0,
  0,
  0,
  0,
  14529,  -- altri_debiti
  0,
  
  0,  -- ricavi_vendite
  1,  -- altri_ricavi ✅
  0,
  200,  -- costi_servizi (stimato)
  0,
  0,
  0,
  0,
  82,  -- oneri_diversi (stimato)
  0,  -- proventi_finanziari
  0,  -- oneri_finanziari
  0,
  0,
  0
);

-- BILANCIO 2024
INSERT INTO financial_statements (
  company_id,
  anno,
  tipo,
  data_riferimento,
  
  immobilizzazioni_immateriali,
  immobilizzazioni_materiali,
  immobilizzazioni_finanziarie,
  attivo_circolante_rimanenze,
  attivo_circolante_crediti,
  attivo_circolante_liquidita,
  ratei_risconti_attivi,
  
  capitale_sociale,
  riserve,
  utile_perdita_esercizio,
  patrimonio_netto,
  fondi_rischi_oneri,
  tfr,
  debiti_finanziari,
  debiti_fornitori,
  debiti_tributari,
  altri_debiti,
  ratei_risconti_passivi,
  
  ricavi_vendite,
  altri_ricavi,
  costi_materie_prime,
  costi_servizi,
  costi_godimento_beni_terzi,
  costi_personale,
  ammortamenti_svalutazioni,
  accantonamenti,
  oneri_diversi_gestione,
  proventi_finanziari,
  oneri_finanziari,
  rettifiche_valore_attivita_finanziarie,
  proventi_oneri_straordinari,
  imposte_esercizio
) VALUES (
  2,
  2024,
  'annuale',
  '2024-12-31',
  
  0,
  0,
  437421,
  0,
  0,
  6538,  -- liquidità (stimata)
  0,
  
  92000,  -- capitale sociale ✅ CORRETTO
  338383,  -- riserve (coperto perdita -281)
  13576,  -- utile_perdita_esercizio ✅ UTILE!
  443959,  -- patrimonio_netto ✅ (92000 + 338383 + 13576)
  0,
  0,
  0,
  0,
  0,
  86118,  -- altri_debiti ✅ AUMENTO SIGNIFICATIVO
  0,
  
  0,  -- ricavi_vendite
  0,  -- altri_ricavi
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  14016,  -- proventi_finanziari (stimato)
  440,  -- oneri_finanziari (stimato)
  0,
  0,
  0
);

-- VERIFY
SELECT 
  id,
  anno,
  capitale_sociale as capitale,
  patrimonio_netto as PN,
  utile_perdita_esercizio as risultato,
  ricavi_vendite,
  altri_ricavi,
  attivo_circolante_liquidita as liquidita,
  altri_debiti as debiti
FROM financial_statements
WHERE company_id = 2
ORDER BY anno;
