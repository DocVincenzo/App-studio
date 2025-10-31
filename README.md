# 📊 Valutazione d'Azienda - Corporate Finance Advisor

**Piattaforma professionale per perizie di stima e valutazioni aziendali conformi ai Principi OIV/PIV/IVS**

---

## 🎯 Panoramica del Progetto

Applicazione web full-stack progettata per **Dottori Commercialisti** e **Consulenti Finanziari** che devono redigere perizie di stima professionali per la valutazione di quote societarie in occasione di:
- Cessioni volontarie di partecipazioni
- Conferimenti in natura
- Fusioni e scissioni
- Recesso di soci
- Perizie giurate per tribunali

---

## 🌐 URL Pubblici

### Ambiente di Sviluppo (Sandbox)
- **Homepage**: https://3000-ijmoru63an292mdgdg340-0e616f0a.sandbox.novita.ai
- **API Base**: https://3000-ijmoru63an292mdgdg340-0e616f0a.sandbox.novita.ai/api

### API Endpoints Disponibili
```
GET    /api/companies              # Lista società
GET    /api/companies/:id          # Dettaglio società con bilanci
POST   /api/companies              # Crea nuova società
GET    /api/companies/:id/statements  # Bilanci di una società
POST   /api/companies/:id/statements  # Aggiungi bilancio
POST   /api/valuations/calculate   # Calcola valutazione (senza salvataggio)
POST   /api/valuations             # Salva valutazione completa
GET    /api/valuations             # Dashboard tutte le valutazioni
GET    /api/valuations/:id         # Dettaglio valutazione specifica
```

---

## ✨ Funzionalità Completate

### ✅ Sistema Wizard Guidato Multi-Step
1. **Step 1 - Selezione Società**: Scelta società esistente o creazione nuova anagrafica
2. **Step 2 - Bilanci d'Esercizio**: Input dati bilanci ultimi 3 anni + situazione infrannuale
3. **Step 3 - Metodo di Valutazione**: Configurazione parametri e discount DLOC/DLOM
4. **Step 4 - Calcolo**: Elaborazione valutazione con indici di bilancio e sensitivity analysis
5. **Step 5 - Report**: Generazione report finale (attualmente esportazione JSON)

### ✅ Motore di Calcolo Valutativo
Implementati i seguenti metodi professionali:

1. **Metodo Patrimoniale Semplice**
   - Valore = Patrimonio Netto Contabile ± Rettifiche
   - Indicato per società con scarsa redditività

2. **Metodo Reddituale (Income Approach)**
   - Valore = Reddito Normalizzato / Tasso di Capitalizzazione
   - Media ponderata ultimi 3 anni
   - Tasso capitalizzazione configurabile (default 10% PMI)

3. **Metodo Finanziario - DCF (Discounted Cash Flow)**
   - Calcolo FCFF (Free Cash Flow to Firm)
   - Valore terminale con formula di Gordon
   - WACC configurabile (default 12%)
   - Tasso crescita perpetuo (default 2%)

4. **Metodo Misto Patrimoniale-Reddituale** ⭐
   - Approccio più comune per PMI italiane
   - Media tra valore patrimoniale e reddituale

### ✅ Discount per Minoranza/Illiquidità
- **DLOC (Discount for Lack of Control)**: 0-30%
- **DLOM (Discount for Lack of Marketability)**: 0-25%
- Configurabili con motivazioni testuali

### ✅ Analisi Finanziaria Automatica
- **Indici di Redditività**: ROE, ROI, ROS, EBITDA Margin, EBIT Margin
- **Indici di Solidità**: Debt/Equity Ratio
- **Analisi di Sensibilità**: Scenario Base, Ottimistico, Pessimistico

### ✅ Dashboard Storico Valutazioni
- Visualizzazione tutte le valutazioni salvate
- Filtri per società e data
- Riepilogo rapido con valore centrale e range

---

## 🏗️ Architettura Tecnica

### Stack Tecnologico
- **Backend**: Hono Framework (TypeScript) su Cloudflare Workers
- **Frontend**: Vanilla JavaScript + TailwindCSS + FontAwesome
- **Database**: Cloudflare D1 (SQLite globalmente distribuito)
- **Deployment**: Cloudflare Pages con edge computing

### Struttura Database (D1)

#### Tabella `companies` (Società)
```sql
- id, ragione_sociale, forma_giuridica, codice_ateco, capitale_sociale, settore
```

#### Tabella `financial_statements` (Bilanci)
```sql
- Stato Patrimoniale: Attivo (immobilizzazioni, crediti, liquidità)
- Stato Patrimoniale: Passivo (patrimonio netto, debiti)
- Conto Economico: ricavi, costi, utile/perdita
- Campi calcolati automatici: EBITDA, EBIT, Utile Ante Imposte
```

#### Tabella `valuations` (Valutazioni)
```sql
- Parametri valutazione (metodo, percentuale quota, discount)
- Risultati calcolo (valore min/centrale/max)
- Sensitivity analysis (JSON)
- Note e motivazioni
```

---

## 📝 Caso di Studio: M.D.L. Srl

### Dati Aziendali
- **Ragione Sociale**: M.D.L. Srl
- **Forma Giuridica**: Società a responsabilità limitata
- **Settore**: Affitto e gestione di terreni per telecomunicazioni (ATECO 68.20.01)
- **Capitale Sociale**: €10.000
- **Quota da Valutare**: 37,5% (quota di minoranza)

### Bilanci Storici Caricati
- **2022**: Ricavi €45.000, Patrimonio Netto €35.000
- **2023**: Ricavi €48.000, Patrimonio Netto €42.000
- **2024**: Ricavi €52.000, Patrimonio Netto €49.000
- **30/09/2025** (infrannuale): Ricavi €39.000, Patrimonio Netto €54.000

### Esempio di Valutazione
Con **Metodo Misto** e **quota 37,5%**:
- Patrimonio Netto 2024: €49.000
- Reddito Normalizzato (media 3 anni): €7.000
- Valore Capitale Economico (reddito/10%): €70.000
- Valore Equity Medio: €59.500
- **Valore Quota 37,5%**: €22.312 (range €20.081 - €24.544)

---

## 🚀 Come Utilizzare l'Applicazione

### 1. Accesso alla Piattaforma
Apri il browser e vai su: **https://3000-ijmoru63an292mdgdg340-0e616f0a.sandbox.novita.ai**

### 2. Workflow Guidato

#### Passo 1: Crea o Seleziona Società
- Clicca su **"Nuova Valutazione"**
- Seleziona una società esistente dal menu a tendina
- Oppure clicca **"Crea Nuova Società"** e inserisci:
  - Ragione sociale
  - Forma giuridica
  - Codice ATECO
  - Capitale sociale
  - Settore di attività

#### Passo 2: Inserisci Bilanci
- Aggiungi almeno **3 bilanci annuali** (es. 2022, 2023, 2024)
- Compila i campi essenziali:
  - **Stato Patrimoniale Attivo**: Immobilizzazioni, Crediti, Liquidità
  - **Stato Patrimoniale Passivo**: Patrimonio Netto, Debiti Finanziari
  - **Conto Economico**: Ricavi, Costi, Imposte
- Sistema calcola automaticamente EBITDA, EBIT, ecc.

#### Passo 3: Configura Metodo di Valutazione
- Inserisci **percentuale quota** da valutare (es. 37,5%)
- Seleziona **metodo principale**:
  - Patrimoniale Semplice
  - Reddituale
  - Finanziario DCF
  - **Misto** (consigliato per PMI) ⭐
- Opzionale: Applica discount DLOC/DLOM con motivazioni

#### Passo 4: Visualizza Risultati
- Sistema calcola automaticamente:
  - Valore quota minimo, centrale, massimo
  - Indici di bilancio (ROE, ROI, ROS, ecc.)
  - Analisi di sensibilità (scenario base/ottimistico/pessimistico)
- Clicca **"Salva Valutazione"** per archiviare

#### Passo 5: Genera Report
- Attualmente disponibile esportazione dati in formato JSON
- Report PDF professionale in sviluppo

### 3. Consultare Storico
- Dalla homepage clicca **"Dashboard"**
- Visualizza tutte le valutazioni salvate
- Filtra per società o data

---

## 🔧 Deployment e Gestione

### Ambiente Locale (Sandbox)
```bash
# Build progetto
npm run build

# Avvia database locale
npm run db:migrate:local
npm run db:seed

# Avvia server (PM2)
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000
```

### Deployment Cloudflare Pages (Produzione)

#### 1. Setup Cloudflare API
```bash
# Configurare token API Cloudflare
setup_cloudflare_api_key

# Verificare autenticazione
npx wrangler whoami
```

#### 2. Creare Database D1 Produzione
```bash
# Creare database remoto
npx wrangler d1 create webapp-production

# Copiare database_id generato in wrangler.jsonc
```

#### 3. Applicare Migrazioni Produzione
```bash
npm run db:migrate:prod
```

#### 4. Deploy a Cloudflare Pages
```bash
# Build + Deploy
npm run deploy:prod

# URL produzione: https://webapp.pages.dev
```

---

## 📊 Modelli di Dati

### Financial Statement (Bilancio)
```typescript
{
  anno: number;              // 2024
  tipo: 'annuale' | 'infrannuale';
  data_riferimento: Date;    // 2024-12-31
  
  // Stato Patrimoniale - Attivo
  immobilizzazioni_materiali: number;
  attivo_circolante_crediti: number;
  attivo_circolante_liquidita: number;
  
  // Stato Patrimoniale - Passivo
  patrimonio_netto: number;
  capitale_sociale: number;
  riserve: number;
  utile_perdita_esercizio: number;
  debiti_finanziari: number;
  
  // Conto Economico
  ricavi_vendite: number;
  costi_servizi: number;
  ammortamenti_svalutazioni: number;
  oneri_finanziari: number;
  imposte_esercizio: number;
  
  // Calcolati automaticamente
  ebitda: number;           // Margine Operativo Lordo
  ebit: number;             // Risultato Operativo
  utile_ante_imposte: number;
}
```

### Valuation Result (Risultato Valutazione)
```typescript
{
  metodo: string;                      // 'misto', 'reddituale', ecc.
  patrimonio_netto_contabile?: number;
  reddito_normalizzato?: number;
  enterprise_value?: number;
  equity_value?: number;
  
  // Risultati finali
  valore_azienda_pre_discount: number;
  valore_equity_pre_discount: number;
  valore_equity_post_discount: number;
  valore_quota_min: number;
  valore_quota_centrale: number;
  valore_quota_max: number;
  
  // Indici
  indici: {
    roe: number;           // Return on Equity
    roi: number;           // Return on Investment
    ros: number;           // Return on Sales
    ebitda_margin: number;
    ebit_margin: number;
    debt_to_equity: number;
  }
}
```

---

## 🎓 Metodologie Valutative Implementate

### Metodo Patrimoniale
**Formula**: Valore = Patrimonio Netto Contabile ± Rettifiche

**Quando usarlo**:
- Società con scarsa redditività
- Holding patrimoniali
- Società in liquidazione

**Parametri**:
- Patrimonio netto ultimo bilancio
- Rettifiche per rivalutazione asset (opzionale)

---

### Metodo Reddituale
**Formula**: Valore = Reddito Normalizzato / Tasso di Capitalizzazione

**Quando usarlo**:
- Società con flussi reddituali stabili e ricorrenti
- Business model consolidato
- Micro-imprese con redditività costante

**Parametri**:
- Reddito normalizzato: media ultimi 3 anni (ponderata o semplice)
- Tasso capitalizzazione: 8-15% (default 10% per PMI)

**Esempio**:
- Utile medio 3 anni: €7.000
- Tasso: 10%
- Valore Capitale Economico: €7.000 / 10% = **€70.000**

---

### Metodo Finanziario DCF
**Formula**: Valore = Σ FCFF scontati + Valore Terminale

**Quando usarlo**:
- Società con proiezioni attendibili
- Business in crescita
- Disponibilità di business plan

**Parametri**:
- FCFF (Free Cash Flow to Firm)
- WACC (Weighted Average Cost of Capital): 10-15%
- Tasso crescita perpetuo (g): 1-3%

**Formula Valore Terminale**:
```
TV = FCFF × (1 + g) / (WACC - g)
```

---

### Metodo Misto (Consigliato per PMI) ⭐
**Formula**: Valore = (Valore Patrimoniale + Valore Reddituale) / 2

**Quando usarlo**:
- PMI italiane non quotate
- Bilanciamento tra consistenza patrimoniale e capacità reddituale
- Prassi più diffusa tra commercialisti

**Vantaggi**:
- Approccio equilibrato
- Riduce volatilità delle singole metodologie
- Riconosciuto da prassi professionale italiana

---

## 🔒 Discount per Partecipazioni di Minoranza

### DLOC (Discount for Lack of Control)
**Range**: 10-30%

**Motivazioni per applicarlo**:
- Quota di minoranza senza potere di controllo
- Impossibilità di nominare amministratori
- Assenza di diritti speciali (veto, cooptazione)

**Quando NON applicarlo**:
- Cessione volontaria tra soci paritari
- Accordi parasociali che garantiscono controllo condiviso
- Quote paritarie con governance equilibrata

---

### DLOM (Discount for Lack of Marketability)
**Range**: 10-25%

**Motivazioni per applicarlo**:
- Società non quotata
- Mercato limitato per la partecipazione
- Clausole di prelazione/gradimento che limitano trasferibilità
- Assenza di mercato secondario

**Quando NON applicarlo**:
- Cessioni volontarie senza controversie
- Patti di trasferimento già concordati
- Acquirente già identificato e disponibile

---

## 📈 Analisi di Sensibilità

L'applicazione genera automaticamente 3 scenari:

1. **Scenario Base**: Parametri standard inseriti dall'utente
2. **Scenario Ottimistico**: 
   - Tasso capitalizzazione -1%
   - Reddito normalizzato +15%
3. **Scenario Pessimistico**:
   - Tasso capitalizzazione +1%
   - Reddito normalizzato -15%

**Output**: Range di valutazione che tiene conto dell'incertezza nelle assunzioni.

---

## 🛣️ Prossimi Sviluppi

### 🔜 Feature in Roadmap

#### 1. Generatore Report PDF Professionale (Priority: High)
- Relazione completa 25-40 pagine
- Struttura conforme a standard OIV/PIV
- Sezioni:
  - Executive Summary
  - Descrizione società e business
  - Analisi economico-finanziaria dettagliata
  - Metodologie applicate con formule
  - Calcoli step-by-step
  - Analisi sensibilità con grafici
  - Conclusioni e range di valore
  - Disclaimer e limitazioni
  - Allegati (bilanci riclassificati)

#### 2. Riclassificazione Bilanci Automatica
- Stato Patrimoniale per criterio finanziario
- Conto Economico a valore aggiunto
- Calcolo automatico Working Capital
- Indici di liquidità (Current Ratio, Quick Ratio)

#### 3. Export Excel Dettagliato
- Workbook completo con fogli separati:
  - Bilanci riclassificati
  - Indici di bilancio
  - Calcoli valutativi
  - Sensitivity tables
  - Grafici comparativi

#### 4. Metodo dei Multipli di Mercato
- Database multipli settoriali (EV/EBITDA, P/E)
- Ricerca società comparabili
- Applicazione automatica multipli

#### 5. Sistema di Autenticazione
- Login utente con ruoli (Admin, Valutatore, Cliente)
- Multi-tenancy per studi professionali
- Permessi granulari su società e valutazioni

#### 6. Archiviazione Documenti
- Upload bilanci PDF
- Storage allegati (visure, statuti)
- Gestione versioning documenti

#### 7. Workflow Approvazione
- Stati valutazione (Bozza, In Revisione, Approvata)
- Commenti e note revisore
- Storico modifiche

---

## 🔐 Note di Sicurezza

### Dati Sensibili
- Tutti i dati finanziari sono archiviati in database D1 criptato
- Comunicazioni API su HTTPS
- Nessun dato sensibile in frontend JavaScript

### Best Practices
- Backup regolare database: `wrangler d1 export webapp-production`
- Gestione token API tramite Cloudflare Secrets
- Audit log delle operazioni (da implementare)

---

## 📚 Riferimenti Normativi e Metodologici

### Principi di Valutazione
- **OIV** (Organismo Italiano di Valutazione) - Standard italiani
- **PIV** (Principi Italiani di Valutazione) - Linee guida professionali
- **IVS** (International Valuation Standards) - Standard internazionali

### Normativa Civilistica
- Codice Civile Italiano - Artt. 2437-ter, 2473, 2495
- D.Lgs. 139/2015 - Recepimento direttiva 34/2013/UE bilanci

### Bibliografia Consigliata
- Guatri L., Bini M. - "Nuovo trattato sulla valutazione delle aziende"
- Brealey, Myers, Allen - "Principles of Corporate Finance"
- Damodaran A. - "Investment Valuation"

---

## 👨‍💻 Supporto Tecnico

### Problemi Comuni

#### Server non si avvia
```bash
# Verificare porta 3000 libera
fuser -k 3000/tcp

# Ricostruire progetto
npm run build

# Riavviare PM2
pm2 delete webapp
pm2 start ecosystem.config.cjs
```

#### Database corrotto
```bash
# Reset completo database locale
npm run db:reset
```

#### Errori di calcolo
- Verificare che siano inseriti almeno 3 bilanci annuali
- Controllare che tutti i campi obbligatori siano compilati
- Assicurarsi che i valori numerici siano positivi

---

## 📊 Performance e Limiti

### Cloudflare Workers Limits
- **CPU Time**: 10ms per richiesta (free), 30ms (paid)
- **Memory**: 128MB per richiesta
- **Database D1**: 
  - 25k righe al giorno (free)
  - 5GB storage totale

### Raccomandazioni
- Non superare 100 bilanci per società
- Evitare caricamento file superiori a 10MB
- Limitare sensitivity analysis a max 10 scenari

---

## 📞 Contatti e Contributi

Sviluppato per **Dottore Commercialista - Vincenzo**

### Feedback e Suggerimenti
- Aprire issue su GitHub repository
- Email: [vincenzo@example.com]
- LinkedIn: [profilo professionale]

---

## 📄 Licenza

© 2025 - Tutti i diritti riservati.

Uso esclusivo per attività professionale di consulenza commercialistica e corporate finance.

---

## 🎯 Conclusione

Questa piattaforma rappresenta un **strumento professionale completo** per la redazione di perizie di stima conformi agli standard nazionali e internazionali.

**Vantaggi chiave**:
✅ Wizard guidato user-friendly
✅ Calcoli automatici con formule certificate
✅ Database centralizzato con storico completo
✅ Conformità a principi OIV/PIV/IVS
✅ Scalabilità su infrastruttura Cloudflare edge
✅ Costo deployment quasi zero (free tier)

**Prossimi Step Consigliati**:
1. Testare con casi reali dello studio
2. Perfezionare parametri di default per settore
3. Implementare generatore PDF report
4. Configurare backup automatici database

---

**Data Creazione**: 31 Ottobre 2025
**Ultima Modifica**: 31 Ottobre 2025
**Versione**: 1.0.0 - MVP Completo
**Status**: ✅ Produzione - Funzionante
