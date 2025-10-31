# 🔧 Troubleshooting Guide - Corporate Finance Valuation App

## 🐛 Problemi Comuni e Soluzioni

---

## 1. Upload PDF - Errori Database

### Errore: "NOT NULL constraint failed: documents.valuation_id"

**Causa**: Schema database non aggiornato. La tabella `documents` richiedeva `valuation_id` obbligatorio, ma i PDF bilanci sono collegati alle società.

**Soluzione**:
```bash
# Applicare migrazione 0002
cd /home/user/webapp
npx wrangler d1 migrations apply webapp-production --local

# Se già applicata, verificare schema
npx wrangler d1 execute webapp-production --local --command="SELECT sql FROM sqlite_master WHERE name='documents'"
```

**Schema corretto** (dopo migrazione 0002):
```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,          -- Può essere NULL
  valuation_id INTEGER,        -- Può essere NULL
  statement_id INTEGER,        -- Può essere NULL
  tipo TEXT NOT NULL,
  nome_file TEXT NOT NULL,
  dimensione INTEGER,
  mime_type TEXT,
  url_storage TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  CHECK (company_id IS NOT NULL OR valuation_id IS NOT NULL OR statement_id IS NOT NULL),
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (valuation_id) REFERENCES valuations(id) ON DELETE CASCADE,
  FOREIGN KEY (statement_id) REFERENCES financial_statements(id) ON DELETE CASCADE
);
```

---

## 2. Upload PDF - Errori di Validazione

### Errore: "File PDF richiesto"

**Causa**: File non è un PDF valido o campo form vuoto.

**Soluzione**:
- Assicurati che il file abbia estensione `.pdf`
- Content-Type deve essere `application/pdf`
- Non usare file rinominati da altri formati

### Errore: "File troppo grande (max 10MB)"

**Causa**: PDF supera il limite di 10MB.

**Soluzione**:
```bash
# Comprimi PDF con Ghostscript
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=bilancio_compressed.pdf bilancio_original.pdf

# O usa strumenti online
# https://www.ilovepdf.com/compress_pdf
```

---

## 3. AI Parsing - Bassa Confidenza

### Warning: "Parsing con bassa confidenza - verificare manualmente"

**Causa**: PDF difficile da leggere (scansione, layout non standard).

**Confidence Score Guide**:
- **90-100%**: Ottimo, conferma diretta
- **70-89%**: Buono, verifica rapida consigliata
- **50-69%**: Mediocre, verifica accurata necessaria
- **<50%**: Scarso, inserimento manuale consigliato

**Soluzione**:
1. Clicca **"Modifica Dati"** nella preview
2. Verifica i campi principali:
   - Anno bilancio
   - Patrimonio Netto
   - Ricavi
   - Utile/Perdita esercizio
3. Correggi manualmente valori errati
4. Salva

**Migliorare qualità PDF**:
- Usa PDF nativi (non scansioni) quando possibile
- Se scansione necessaria: 300 DPI, B&W, alta qualità
- Evita PDF con watermark o sovrapposizioni

---

## 4. Database Locale - Reset Completo

### Quando necessario:
- Schema corrotto
- Dati di test inconsistenti
- Migrazioni fallite

**Procedura Reset**:
```bash
cd /home/user/webapp

# Elimina database locale
rm -rf .wrangler/state/v3/d1

# Riapplica tutte le migrazioni
npm run db:migrate:local

# Reinserisci dati di test
npm run db:seed

# Verifica
npx wrangler d1 execute webapp-production --local --command="SELECT COUNT(*) as total FROM companies"
```

---

## 5. Server Non Risponde

### Sintomi:
- `curl http://localhost:3000` timeout
- PM2 status "errored" o "stopped"

**Diagnosi**:
```bash
# Check PM2 status
pm2 list

# Check logs
pm2 logs webapp --nostream --lines 50

# Check porta
fuser 3000/tcp
```

**Soluzioni**:

**A) Port già in uso**:
```bash
# Killa processo sulla porta 3000
fuser -k 3000/tcp

# Riavvia
pm2 restart webapp
```

**B) Build mancante**:
```bash
# Rebuild
npm run build

# Restart
pm2 restart webapp
```

**C) Errori di sintassi**:
```bash
# Check logs per errori TypeScript
pm2 logs webapp --nostream | grep -i error

# Se presente, correggi codice e rebuild
```

---

## 6. Cloudflare Bindings Mancanti

### Errore: "Cannot read property 'DB' of undefined" (o STORAGE, AI)

**Causa**: Configurazione `wrangler.jsonc` non corretta o bindings non inizializzati.

**Verifica configurazione**:
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "local-dev-db"
    }
  ],
  "r2_buckets": [
    {
      "binding": "STORAGE",
      "bucket_name": "webapp-documents"
    }
  ],
  "ai": {
    "binding": "AI"
  }
}
```

**In ambiente locale**:
- D1: Automatico con `--local`
- R2: Mock automatico in dev
- AI: Disponibile solo in produzione Cloudflare (in locale simulato)

---

## 7. TypeScript Compilation Errors

### Errore: "Property 'STORAGE' does not exist on type 'Bindings'"

**Causa**: Type definitions non aggiornate.

**Soluzione**:
```typescript
// src/index.tsx - Aggiorna type Bindings
type Bindings = {
  DB: D1Database;
  STORAGE: R2Bucket;
  AI: any;
}
```

### Errore: "Cannot find module './pdf-parser'"

**Causa**: File non trovato o path errato.

**Soluzione**:
```bash
# Verifica esistenza file
ls -la src/pdf-parser.ts

# Se manca, ricrea o pull da git
git checkout src/pdf-parser.ts

# Rebuild
npm run build
```

---

## 8. Frontend JavaScript Errors

### Errore Console: "axios is not defined"

**Causa**: CDN Axios non caricato.

**Soluzione**:
Verifica che l'HTML includa:
```html
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
```

### Errore: "handlePDFUpload is not defined"

**Causa**: `app.js` non caricato o funzione mancante.

**Soluzione**:
```bash
# Verifica file esiste
ls -la public/static/app.js

# Check dimensione (dovrebbe essere ~42KB)
wc -l public/static/app.js  # ~1250 righe

# Se mancante, pull da git
git checkout public/static/app.js
```

---

## 9. Performance Issues

### Upload PDF lento (>30 secondi)

**Possibili cause**:
1. **Network lento**: Test con file piccolo
2. **AI parsing timeout**: Check logs backend
3. **Database slow query**: Check indici

**Diagnosi**:
```bash
# Test upload senza AI
curl -X POST http://localhost:3000/api/pdf/preview \
  -F "pdf=@bilancio.pdf" | jq

# Se preview veloce ma upload completo lento → problema AI parsing
```

**Ottimizzazioni**:
- Comprimi PDF prima dell'upload
- Usa PDF testuali (non scansioni)
- Aumenta timeout AI se necessario

---

## 10. Git & Deployment Issues

### Errore: "Permission denied" durante git push

**Soluzione**:
```bash
# Setup GitHub authentication
setup_github_environment

# Se fallisce, vai su #github tab e autorizza
# Poi riprova push
```

### Errore: "Cloudflare API token invalid"

**Soluzione**:
```bash
# Setup Cloudflare API key
setup_cloudflare_api_key

# Se fallisce, vai su Deploy tab e configura API key
# Poi riprova
```

---

## 🆘 Comandi di Emergenza

### Reset Completo Ambiente
```bash
cd /home/user/webapp

# Stop everything
pm2 delete all
fuser -k 3000/tcp

# Clean build
rm -rf dist/ node_modules/.vite

# Reset database
rm -rf .wrangler/state/v3/d1

# Reinstall & rebuild
npm install
npm run build
npm run db:migrate:local
npm run db:seed

# Restart
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000/api/companies
```

### Backup Before Reset
```bash
# Database backup
npx wrangler d1 export webapp-production --local --output=backup.sql

# Code backup
tar -czf webapp-backup-$(date +%Y%m%d).tar.gz /home/user/webapp

# Or use ProjectBackup tool
```

---

## 📞 Support Checklist

Quando riporti un problema, includi:

1. **Descrizione errore**: Messaggio completo
2. **Steps to reproduce**: Come riprodurre
3. **Environment**: 
   - OS: `uname -a`
   - Node: `node --version`
   - NPM: `npm --version`
4. **Logs**:
   ```bash
   pm2 logs webapp --nostream --lines 100
   ```
5. **Database state**:
   ```bash
   npx wrangler d1 execute webapp-production --local \
     --command="SELECT name FROM sqlite_master WHERE type='table'"
   ```
6. **Config**:
   ```bash
   cat wrangler.jsonc | grep -v "//"
   ```

---

## 📚 Risorse Utili

- **Cloudflare D1 Docs**: https://developers.cloudflare.com/d1/
- **Cloudflare R2 Docs**: https://developers.cloudflare.com/r2/
- **Cloudflare AI Docs**: https://developers.cloudflare.com/workers-ai/
- **Hono Framework**: https://hono.dev/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/usage/quick-start/

---

**Versione**: 1.0
**Ultima Modifica**: 31 Ottobre 2025
