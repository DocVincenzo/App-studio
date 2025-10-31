-- Tabella società
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ragione_sociale TEXT NOT NULL,
  forma_giuridica TEXT NOT NULL,
  codice_ateco TEXT,
  capitale_sociale REAL,
  settore TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella bilanci
CREATE TABLE IF NOT EXISTS financial_statements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  anno INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('annuale', 'infrannuale')),
  data_riferimento DATE NOT NULL,
  
  -- Stato Patrimoniale - Attivo
  immobilizzazioni_immateriali REAL DEFAULT 0,
  immobilizzazioni_materiali REAL DEFAULT 0,
  immobilizzazioni_finanziarie REAL DEFAULT 0,
  attivo_circolante_rimanenze REAL DEFAULT 0,
  attivo_circolante_crediti REAL DEFAULT 0,
  attivo_circolante_liquidita REAL DEFAULT 0,
  ratei_risconti_attivi REAL DEFAULT 0,
  
  -- Stato Patrimoniale - Passivo
  patrimonio_netto REAL DEFAULT 0,
  capitale_sociale REAL DEFAULT 0,
  riserve REAL DEFAULT 0,
  utile_perdita_esercizio REAL DEFAULT 0,
  fondi_rischi_oneri REAL DEFAULT 0,
  tfr REAL DEFAULT 0,
  debiti_finanziari REAL DEFAULT 0,
  debiti_fornitori REAL DEFAULT 0,
  debiti_tributari REAL DEFAULT 0,
  altri_debiti REAL DEFAULT 0,
  ratei_risconti_passivi REAL DEFAULT 0,
  
  -- Conto Economico
  ricavi_vendite REAL DEFAULT 0,
  altri_ricavi REAL DEFAULT 0,
  costi_materie_prime REAL DEFAULT 0,
  costi_servizi REAL DEFAULT 0,
  costi_godimento_beni_terzi REAL DEFAULT 0,
  costi_personale REAL DEFAULT 0,
  ammortamenti_svalutazioni REAL DEFAULT 0,
  accantonamenti REAL DEFAULT 0,
  oneri_diversi_gestione REAL DEFAULT 0,
  proventi_finanziari REAL DEFAULT 0,
  oneri_finanziari REAL DEFAULT 0,
  rettifiche_valore_attivita_finanziarie REAL DEFAULT 0,
  proventi_oneri_straordinari REAL DEFAULT 0,
  imposte_esercizio REAL DEFAULT 0,
  
  -- Campi calcolati (popolati automaticamente)
  totale_attivo REAL GENERATED ALWAYS AS (
    immobilizzazioni_immateriali + immobilizzazioni_materiali + 
    immobilizzazioni_finanziarie + attivo_circolante_rimanenze + 
    attivo_circolante_crediti + attivo_circolante_liquidita + ratei_risconti_attivi
  ) STORED,
  
  totale_passivo REAL GENERATED ALWAYS AS (
    patrimonio_netto + fondi_rischi_oneri + tfr + debiti_finanziari + 
    debiti_fornitori + debiti_tributari + altri_debiti + ratei_risconti_passivi
  ) STORED,
  
  valore_produzione REAL GENERATED ALWAYS AS (
    ricavi_vendite + altri_ricavi
  ) STORED,
  
  ebitda REAL GENERATED ALWAYS AS (
    ricavi_vendite + altri_ricavi - costi_materie_prime - costi_servizi - 
    costi_godimento_beni_terzi - costi_personale - oneri_diversi_gestione
  ) STORED,
  
  ebit REAL GENERATED ALWAYS AS (
    ricavi_vendite + altri_ricavi - costi_materie_prime - costi_servizi - 
    costi_godimento_beni_terzi - costi_personale - ammortamenti_svalutazioni - 
    accantonamenti - oneri_diversi_gestione
  ) STORED,
  
  utile_ante_imposte REAL GENERATED ALWAYS AS (
    ricavi_vendite + altri_ricavi - costi_materie_prime - costi_servizi - 
    costi_godimento_beni_terzi - costi_personale - ammortamenti_svalutazioni - 
    accantonamenti - oneri_diversi_gestione + proventi_finanziari - 
    oneri_finanziari + rettifiche_valore_attivita_finanziarie + proventi_oneri_straordinari
  ) STORED,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(company_id, anno, tipo)
);

-- Tabella valutazioni
CREATE TABLE IF NOT EXISTS valuations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  
  -- Dati generali valutazione
  data_valutazione DATE NOT NULL,
  percentuale_quota REAL NOT NULL CHECK(percentuale_quota > 0 AND percentuale_quota <= 100),
  finalita TEXT NOT NULL,
  valutatore_nome TEXT,
  
  -- Metodologie applicate
  metodo_principale TEXT NOT NULL CHECK(metodo_principale IN ('patrimoniale_semplice', 'patrimoniale_complesso', 'reddituale', 'finanziario_dcf', 'multipli', 'misto')),
  metodo_controllo TEXT CHECK(metodo_controllo IN ('patrimoniale_semplice', 'patrimoniale_complesso', 'reddituale', 'finanziario_dcf', 'multipli', 'misto')),
  
  -- Risultati metodo patrimoniale
  patrimonio_netto_contabile REAL,
  rettifiche_patrimoniali REAL DEFAULT 0,
  patrimonio_netto_rettificato REAL,
  
  -- Risultati metodo reddituale
  reddito_normalizzato REAL,
  tasso_capitalizzazione REAL,
  valore_capitale_economico REAL,
  
  -- Risultati metodo finanziario (DCF)
  fcff_medio REAL,
  wacc REAL,
  tasso_crescita_perpetuo REAL,
  valore_terminale REAL,
  enterprise_value REAL,
  posizione_finanziaria_netta REAL,
  equity_value REAL,
  
  -- Discount applicati
  dloc_applicato BOOLEAN DEFAULT 0,
  dloc_percentuale REAL DEFAULT 0,
  dloc_motivazione TEXT,
  dlom_applicato BOOLEAN DEFAULT 0,
  dlom_percentuale REAL DEFAULT 0,
  dlom_motivazione TEXT,
  
  -- Risultati finali
  valore_azienda_pre_discount REAL NOT NULL,
  valore_equity_pre_discount REAL NOT NULL,
  valore_equity_post_discount REAL NOT NULL,
  valore_quota_min REAL NOT NULL,
  valore_quota_centrale REAL NOT NULL,
  valore_quota_max REAL NOT NULL,
  
  -- Analisi sensibilità (JSON)
  sensitivity_analysis TEXT,
  
  -- Note e commenti
  note_assunzioni TEXT,
  note_limitazioni TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Tabella documenti allegati
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  valuation_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('bilancio', 'situazione_contabile', 'valutazione_precedente', 'report_pdf', 'altro')),
  nome_file TEXT NOT NULL,
  dimensione INTEGER,
  mime_type TEXT,
  url_storage TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (valuation_id) REFERENCES valuations(id) ON DELETE CASCADE
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_companies_ragione_sociale ON companies(ragione_sociale);
CREATE INDEX IF NOT EXISTS idx_financial_statements_company ON financial_statements(company_id, anno);
CREATE INDEX IF NOT EXISTS idx_valuations_company ON valuations(company_id, data_valutazione);
CREATE INDEX IF NOT EXISTS idx_documents_valuation ON documents(valuation_id);
