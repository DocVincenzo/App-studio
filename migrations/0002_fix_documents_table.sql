-- Fix documents table to support both company-level and valuation-level documents
-- Drop old table and recreate with proper structure

DROP TABLE IF EXISTS documents;

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  valuation_id INTEGER,
  statement_id INTEGER,
  tipo TEXT NOT NULL CHECK(tipo IN ('bilancio', 'situazione_contabile', 'valutazione_precedente', 'report_pdf', 'altro')),
  nome_file TEXT NOT NULL,
  dimensione INTEGER,
  mime_type TEXT,
  url_storage TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- At least one foreign key must be set
  CHECK (company_id IS NOT NULL OR valuation_id IS NOT NULL OR statement_id IS NOT NULL),
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (valuation_id) REFERENCES valuations(id) ON DELETE CASCADE,
  FOREIGN KEY (statement_id) REFERENCES financial_statements(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_valuation ON documents(valuation_id);
CREATE INDEX IF NOT EXISTS idx_documents_statement ON documents(statement_id);
