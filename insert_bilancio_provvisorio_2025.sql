-- INSERT Bilancio Provvisorio M.D.L. Srl al 30/09/2025 (9 mesi)
-- Dati estratti da: MDL BILANCIO PROVVISORIO AL 30_09_25.pdf

INSERT INTO financial_statements (
  company_id, 
  anno, 
  tipo,
  periodo_riferimento,
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
  2, -- company_id per M.D.L. Srl (ID=2)
  2025,
  'infrannuale',
  '9M', -- 9 mesi (gennaio-settembre)
  '2025-09-30',
  -- ATTIVO
  0, -- immobilizzazioni_immateriali
  0, -- immobilizzazioni_materiali
  499894.60, -- immobilizzazioni_finanziarie
  0, -- rimanenze
  0, -- crediti
  74256.83, -- disponibilità liquide
  0, -- ratei e risconti attivi
  -- PASSIVO
  92000.00, -- capitale sociale
  351958.57, -- riserve (22423.43 + 319593.34 + 9941.80)
  5213.95, -- utile del periodo (9 mesi)
  443958.57, -- patrimonio netto (capitale + riserve, SENZA utile periodo per evitare doppio conteggio)
  0, -- fondi rischi e oneri
  0, -- TFR
  11037.14, -- debiti finanziari (finanziamento socio infruttifero)
  0, -- debiti fornitori
  247.51, -- debiti tributari (erario c/IVA)
  0, -- altri debiti
  0, -- ratei e risconti passivi
  -- CONTO ECONOMICO
  0, -- ricavi vendite (società finanziaria, no vendite)
  519.43, -- altri ricavi (517.25 proventi diversi + 2.18 abbuoni)
  0, -- costi materie prime
  10.63, -- costi servizi (servizi telematici)
  0, -- costi godimento beni terzi
  733.18, -- costi personale (lavoro autonomo: consulenze 495.04 + spese 238.14)
  0, -- ammortamenti
  0, -- accantonamenti
  988.15, -- oneri diversi gestione (oneri tributari)
  7563.19, -- proventi finanziari (proventi da titoli)
  921.31, -- oneri finanziari (commissioni bancarie + bolli)
  0, -- rettifiche valore attività finanziarie
  -215.40, -- proventi/oneri straordinari (sopravvenienze passive)
  0 -- imposte (non indicate nel CE provvisorio)
);

-- Verifica inserimento
SELECT 
  id,
  anno,
  tipo,
  periodo_riferimento,
  data_riferimento,
  immobilizzazioni_finanziarie,
  patrimonio_netto,
  totale_attivo,
  totale_passivo,
  valore_produzione,
  ebitda,
  ebit,
  utile_ante_imposte,
  proventi_finanziari,
  oneri_finanziari
FROM financial_statements
WHERE anno = 2025 AND tipo = 'infrannuale'
ORDER BY data_riferimento DESC;
