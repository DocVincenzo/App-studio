-- Aggiunge campo periodo_riferimento per bilanci infrannuali
-- Valori: 'Q1', 'Q2', 'Q3', '6M', '9M', 'Annuale', etc.

ALTER TABLE financial_statements 
ADD COLUMN periodo_riferimento TEXT DEFAULT 'Annuale' 
CHECK(periodo_riferimento IN ('Q1', 'Q2', 'Q3', '6M', '9M', 'Annuale', 'Altro'));
