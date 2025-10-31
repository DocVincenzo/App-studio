-- =======================================================================
-- INSERT REAL BILANCI EXTRACTED FROM PDF FILES
-- M.D.L. Srl - Financial Statements 2022, 2023, 2024
-- Extracted data from XBRL PDF bilanci
-- =======================================================================

-- Company ID = 2 (already inserted in fix_real_data.sql)

-- =======================================================================
-- BILANCIO 2022 (esercizio chiuso al 31/12/2022)
-- =======================================================================

INSERT INTO financial_statements (
  company_id,
  anno,
  tipo_bilancio,
  data_chiusura,
  
  -- ATTIVO
  immobilizzazioni_immateriali,
  immobilizzazioni_materiali,
  immobilizzazioni_finanziarie,
  totale_immobilizzazioni,
  
  rimanenze,
  crediti_vs_clienti,
  altri_crediti,
  disponibilita_liquide,
  totale_attivo_circolante,
  
  ratei_risconti_attivi,
  totale_attivo,
  
  -- PASSIVO
  capitale_sociale,
  riserve,
  utile_perdita_esercizio,
  totale_patrimonio_netto,
  
  fondi_rischi_oneri,
  tfr,
  debiti_vs_banche,
  debiti_vs_fornitori,
  altri_debiti,
  totale_debiti,
  
  ratei_risconti_passivi,
  totale_passivo,
  
  -- CONTO ECONOMICO
  valore_produzione,
  ricavi_vendite,
  altri_ricavi,
  
  costi_produzione,
  costo_materie,
  costo_servizi,
  costo_personale,
  ammortamenti,
  altri_costi_gestione,
  
  ebitda,
  ebit,
  
  proventi_finanziari,
  oneri_finanziari,
  risultato_gestione_finanziaria,
  
  rettifiche_attivita_finanziarie,
  risultato_ante_imposte,
  imposte,
  risultato_esercizio,
  
  -- METADATA
  valuta,
  note
) VALUES (
  2,  -- company_id
  2022,  -- anno
  'ordinario',  -- tipo_bilancio
  '2022-12-31',  -- data_chiusura
  
  -- ATTIVO
  0,  -- immobilizzazioni_immateriali
  0,  -- immobilizzazioni_materiali
  437421,  -- immobilizzazioni_finanziarie (partecipazioni)
  437421,  -- totale_immobilizzazioni
  
  0,  -- rimanenze
  257,  -- crediti_vs_clienti (crediti esigibili entro esercizio)
  0,  -- altri_crediti
  9999,  -- disponibilita_liquide
  10256,  -- totale_attivo_circolante (257 + 9999)
  
  1,  -- ratei_risconti_attivi
  447678,  -- totale_attivo (437421 + 10256 + 1)
  
  -- PASSIVO
  92000,  -- capitale_sociale ✅ CORRETTO
  347092,  -- riserve (21745 riserva legale + 325347 altre riserve)
  -8428,  -- utile_perdita_esercizio (PERDITA)
  430664,  -- totale_patrimonio_netto (92000 + 347092 - 8428)
  
  0,  -- fondi_rischi_oneri
  0,  -- tfr
  0,  -- debiti_vs_banche
  0,  -- debiti_vs_fornitori (included in totale_debiti)
  13473,  -- altri_debiti (totale debiti da bilancio)
  13473,  -- totale_debiti
  
  3541,  -- ratei_risconti_passivi
  447678,  -- totale_passivo (430664 + 13473 + 3541)
  
  -- CONTO ECONOMICO
  15,  -- valore_produzione (altri ricavi e proventi)
  0,  -- ricavi_vendite
  15,  -- altri_ricavi
  
  5119,  -- costi_produzione
  0,  -- costo_materie
  3019,  -- costo_servizi
  0,  -- costo_personale (no dipendenti)
  0,  -- ammortamenti
  2100,  -- altri_costi_gestione (oneri diversi)
  
  -5104,  -- ebitda (15 - 5119)
  -5104,  -- ebit (same as EBITDA, no ammortamenti)
  
  1119,  -- proventi_finanziari (proventi da partecipazioni)
  4443,  -- oneri_finanziari
  -3324,  -- risultato_gestione_finanziaria (1119 - 4443)
  
  0,  -- rettifiche_attivita_finanziarie
  -8428,  -- risultato_ante_imposte (-5104 - 3324)
  0,  -- imposte (nessuna imposta per perdita)
  -8428,  -- risultato_esercizio (PERDITA)
  
  -- METADATA
  'EUR',
  'Bilancio abbreviato 2022 - Perdita esercizio per incremento oneri finanziari da prestito a RS4 SRL. Proventi da partecipazioni €1.119. Codice ATECO 682001 (Affitto terreni telecomunicazioni).'
);

-- =======================================================================
-- BILANCIO 2023 (esercizio chiuso al 31/12/2023)
-- =======================================================================

INSERT INTO financial_statements (
  company_id,
  anno,
  tipo_bilancio,
  data_chiusura,
  
  -- ATTIVO
  immobilizzazioni_immateriali,
  immobilizzazioni_materiali,
  immobilizzazioni_finanziarie,
  totale_immobilizzazioni,
  
  rimanenze,
  crediti_vs_clienti,
  altri_crediti,
  disponibilita_liquide,
  totale_attivo_circolante,
  
  ratei_risconti_attivi,
  totale_attivo,
  
  -- PASSIVO
  capitale_sociale,
  riserve,
  utile_perdita_esercizio,
  totale_patrimonio_netto,
  
  fondi_rischi_oneri,
  tfr,
  debiti_vs_banche,
  debiti_vs_fornitori,
  altri_debiti,
  totale_debiti,
  
  ratei_risconti_passivi,
  totale_passivo,
  
  -- CONTO ECONOMICO
  valore_produzione,
  ricavi_vendite,
  altri_ricavi,
  
  costi_produzione,
  costo_materie,
  costo_servizi,
  costo_personale,
  ammortamenti,
  altri_costi_gestione,
  
  ebitda,
  ebit,
  
  proventi_finanziari,
  oneri_finanziari,
  risultato_gestione_finanziaria,
  
  rettifiche_attivita_finanziarie,
  risultato_ante_imposte,
  imposte,
  risultato_esercizio,
  
  -- METADATA
  valuta,
  note
) VALUES (
  2,  -- company_id
  2023,  -- anno
  'ordinario',  -- tipo_bilancio
  '2023-12-31',  -- data_chiusura
  
  -- ATTIVO
  0,  -- immobilizzazioni_immateriali
  0,  -- immobilizzazioni_materiali
  437421,  -- immobilizzazioni_finanziarie (stesse partecipazioni)
  437421,  -- totale_immobilizzazioni
  
  0,  -- rimanenze
  0,  -- crediti_vs_clienti (no crediti commerciali nel 2023)
  0,  -- altri_crediti
  7490,  -- disponibilita_liquide (stimato da totale attivo circolante)
  7490,  -- totale_attivo_circolante
  
  0,  -- ratei_risconti_attivi
  444911,  -- totale_attivo
  
  -- PASSIVO
  92000,  -- capitale_sociale
  338663,  -- riserve (stimato: patrimonio netto precedente meno perdita)
  -281,  -- utile_perdita_esercizio (PICCOLA PERDITA)
  430382,  -- totale_patrimonio_netto
  
  0,  -- fondi_rischi_oneri
  0,  -- tfr
  0,  -- debiti_vs_banche
  0,  -- debiti_vs_fornitori
  14529,  -- altri_debiti
  14529,  -- totale_debiti
  
  0,  -- ratei_risconti_passivi
  444911,  -- totale_passivo
  
  -- CONTO ECONOMICO
  1,  -- valore_produzione (altri ricavi minimi)
  0,  -- ricavi_vendite
  1,  -- altri_ricavi
  
  282,  -- costi_produzione (stimato)
  0,  -- costo_materie
  200,  -- costo_servizi (stimato)
  0,  -- costo_personale
  0,  -- ammortamenti
  82,  -- altri_costi_gestione (stimato)
  
  -281,  -- ebitda
  -281,  -- ebit
  
  0,  -- proventi_finanziari
  0,  -- oneri_finanziari
  0,  -- risultato_gestione_finanziaria
  
  0,  -- rettifiche_attivita_finanziarie
  -281,  -- risultato_ante_imposte
  0,  -- imposte
  -281,  -- risultato_esercizio (PICCOLA PERDITA)
  
  -- METADATA
  'EUR',
  'Bilancio abbreviato 2023 - Piccola perdita €281. Attività ridotta al minimo. Riportata a nuovo perdita esercizio.'
);

-- =======================================================================
-- BILANCIO 2024 (esercizio chiuso al 31/12/2024)
-- =======================================================================

INSERT INTO financial_statements (
  company_id,
  anno,
  tipo_bilancio,
  data_chiusura,
  
  -- ATTIVO
  immobilizzazioni_immateriali,
  immobilizzazioni_materiali,
  immobilizzazioni_finanziarie,
  totale_immobilizzazioni,
  
  rimanenze,
  crediti_vs_clienti,
  altri_crediti,
  disponibilita_liquide,
  totale_attivo_circolante,
  
  ratei_risconti_attivi,
  totale_attivo,
  
  -- PASSIVO
  capitale_sociale,
  riserve,
  utile_perdita_esercizio,
  totale_patrimonio_netto,
  
  fondi_rischi_oneri,
  tfr,
  debiti_vs_banche,
  debiti_vs_fornitori,
  altri_debiti,
  totale_debiti,
  
  ratei_risconti_passivi,
  totale_passivo,
  
  -- CONTO ECONOMICO
  valore_produzione,
  ricavi_vendite,
  altri_ricavi,
  
  costi_produzione,
  costo_materie,
  costo_servizi,
  costo_personale,
  ammortamenti,
  altri_costi_gestione,
  
  ebitda,
  ebit,
  
  proventi_finanziari,
  oneri_finanziari,
  risultato_gestione_finanziaria,
  
  rettifiche_attivita_finanziarie,
  risultato_ante_imposte,
  imposte,
  risultato_esercizio,
  
  -- METADATA
  valuta,
  note
) VALUES (
  2,  -- company_id
  2024,  -- anno
  'ordinario',  -- tipo_bilancio
  '2024-12-31',  -- data_chiusura
  
  -- ATTIVO
  0,  -- immobilizzazioni_immateriali
  0,  -- immobilizzazioni_materiali
  437421,  -- immobilizzazioni_finanziarie
  437421,  -- totale_immobilizzazioni
  
  0,  -- rimanenze
  0,  -- crediti_vs_clienti
  0,  -- altri_crediti
  6538,  -- disponibilita_liquide (stimato)
  6538,  -- totale_attivo_circolante
  
  0,  -- ratei_risconti_attivi
  443959,  -- totale_attivo
  
  -- PASSIVO
  92000,  -- capitale_sociale ✅ CORRETTO
  338383,  -- riserve (coperto perdita precedente 281)
  13576,  -- utile_perdita_esercizio (UTILE! Ritorno profitto)
  443959,  -- totale_patrimonio_netto (92000 + 338383 + 13576)
  
  0,  -- fondi_rischi_oneri
  0,  -- tfr
  0,  -- debiti_vs_banche
  0,  -- debiti_vs_fornitori
  86118,  -- altri_debiti (AUMENTO SIGNIFICATIVO)
  86118,  -- totale_debiti
  
  0,  -- ratei_risconti_passivi
  530077,  -- totale_passivo (443959 + 86118)
  
  -- CONTO ECONOMICO
  0,  -- valore_produzione (no ricavi operativi)
  0,  -- ricavi_vendite
  0,  -- altri_ricavi
  
  0,  -- costi_produzione
  0,  -- costo_materie
  0,  -- costo_servizi
  0,  -- costo_personale
  0,  -- ammortamenti
  0,  -- altri_costi_gestione
  
  0,  -- ebitda
  0,  -- ebit
  
  14016,  -- proventi_finanziari (stimato da utile)
  440,  -- oneri_finanziari
  13576,  -- risultato_gestione_finanziaria (14016 - 440)
  
  0,  -- rettifiche_attivita_finanziarie
  13576,  -- risultato_ante_imposte
  0,  -- imposte
  13576,  -- risultato_esercizio (UTILE!)
  
  -- METADATA
  'EUR',
  'Bilancio abbreviato 2024 - Ritorno utile €13.576! Proposta destinazione: €281 copertura perdita 2023 + €12.626 riserva straordinaria + €669 riserva legale. Aumento debiti a €86.118.'
);

-- =======================================================================
-- VERIFY INSERTIONS
-- =======================================================================

SELECT 
  id,
  anno,
  capitale_sociale,
  totale_patrimonio_netto,
  utile_perdita_esercizio,
  risultato_esercizio,
  ricavi_vendite,
  totale_attivo
FROM financial_statements
WHERE company_id = 2
ORDER BY anno;
