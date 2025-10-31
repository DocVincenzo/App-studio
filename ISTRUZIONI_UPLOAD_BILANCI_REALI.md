# 📄 Istruzioni Upload Bilanci Reali M.D.L. Srl

## ✅ Database Pulito e Pronto

Il database è stato resettato e ora contiene:
- ✅ Società M.D.L. Srl con **capitale sociale corretto: €92.000**
- ✅ **Zero bilanci** (pronti per upload PDF reali)
- ✅ Schema tabelle corretto per upload documenti

---

## 🎯 Come Procedere

### 1. Accedi all'Applicazione
```
URL: https://3000-ijmoru63an292mdgdg340-0e616f0a.sandbox.novita.ai
```

### 2. Avvia Nuova Valutazione
- Click su **"Nuova Valutazione"**
- Seleziona **"M.D.L. Srl"** (unica società presente)
- Click **"Avanti"**

### 3. Upload Bilanci PDF (Step 2)

**IMPORTANTE**: Carica i bilanci in ordine cronologico!

#### A) BILANCIO 2022
File: `BILANCIO 2022 MDL.pdf` (51 KB)
- Trascina il PDF nella zona blu
- Attendi elaborazione AI (5-10 sec)
- **Verifica dati estratti**:
  - Anno: 2022
  - Capitale sociale: €92.000 (NON €10.000!)
  - Data riferimento: 31/12/2022
- Se confidence < 70% o dati errati → Click **"Modifica Dati"**
- Correggi eventuali errori manualmente
- Click **"Conferma e Salva"**

#### B) BILANCIO 2023
File: `BILANCIO 2023 MDL.pdf` (71 KB)
- Ripeti procedura come sopra
- Anno: 2023
- Data: 31/12/2023

#### C) BILANCIO 2024
File: `BILANCIO 2024 MDL.pdf` (63 KB)
- Ripeti procedura come sopra
- Anno: 2024
- Data: 31/12/2024

---

## ⚠️ Problemi Comuni e Soluzioni

### Problema 1: "Parsing con bassa confidenza"
**Causa**: I PDF XBRL hanno struttura complessa, l'AI potrebbe non estrarre perfettamente tutti i valori.

**Soluzione**:
1. Non preoccuparti se vedi warning
2. Click **"Modifica Dati"** nella preview
3. Il form sarà pre-compilato con valori estratti
4. **Verifica e correggi** i campi principali:
   - ✅ Patrimonio Netto
   - ✅ Capitale Sociale (deve essere €92.000!)
   - ✅ Ricavi
   - ✅ Utile/Perdita esercizio
5. Lascia vuoti i campi che non trovi (verranno impostati a 0)
6. Salva

### Problema 2: "File già caricato ma non vedo dati"
**Causa**: Upload riuscito ma parsing non completato.

**Soluzione**:
- Refresh pagina
- Riprova upload
- Se persiste, usa inserimento manuale (button in basso)

### Problema 3: Valori estratti errati
**Causa**: OCR non perfetto su alcuni numeri.

**Soluzione**:
- **Usa sempre "Modifica Dati"** per verificare
- Confronta con PDF cartaceo
- Correggi manualmente i valori sbagliati

---

## 📋 Campi Obbligatori per Ogni Bilancio

Per completare la valutazione servono **almeno** questi dati:

### Dati Minimi Richiesti:
- ✅ **Anno** (2022, 2023, 2024)
- ✅ **Tipo** (annuale)
- ✅ **Data riferimento** (31/12/YYYY)
- ✅ **Patrimonio Netto**
- ✅ **Ricavi Vendite**
- ✅ **Utile/Perdita Esercizio**

### Dati Consigliati (se disponibili):
- Immobilizzazioni materiali
- Crediti
- Liquidità
- Capitale sociale (€92.000)
- Debiti finanziari
- Debiti fornitori
- Costi servizi
- Ammortamenti
- Imposte

---

## 🔍 Dove Trovare i Dati nei PDF

I bilanci XBRL M.D.L. hanno questa struttura:

### Pagina 1: Dati anagrafici
- Capitale sociale: **€92.000** ✅
- Codice ATECO: 682001
- Sede: Via Adriatica, 5 - Roseto degli Abruzzi (TE)

### Pagina 2-3: Stato Patrimoniale
Cerca le voci con codici:
- **B.II** = Immobilizzazioni materiali
- **C.II** = Crediti
- **C.IV** = Disponibilità liquide
- **A.I** = Capitale sociale
- **A** (totale) = Patrimonio netto
- **A.IX** = Utile dell'esercizio
- **D.4** = Debiti verso banche
- **D.7** = Debiti verso fornitori

### Pagina 4-5: Conto Economico
Cerca le voci:
- **A.1** = Ricavi delle vendite
- **B.7** = Costi per servizi
- **B.8** = Costi godimento beni terzi
- **B.10** = Ammortamenti
- **C.17** = Interessi passivi
- **20** = Imposte sul reddito

---

## 🎓 Suggerimenti per Inserimento Manuale

Se l'AI parsing non funziona bene, usa il form manuale:

1. **Apri il PDF** in un'altra finestra
2. **Compila solo i campi disponibili** nel PDF
3. **Lascia a 0** i campi mancanti
4. **Usa il punto per migliaia** es: 92.000 (non virgola)
5. **Non usare simbolo €** (solo numeri)

### Esempio Compilazione:
```
Anno: 2022
Tipo: annuale
Data: 2022-12-31
Patrimonio Netto: 150000
Capitale Sociale: 92000
Ricavi: 250000
Utile Esercizio: 15000
```

---

## ✅ Verifica Finale

Dopo aver caricato i 3 bilanci:
1. Dovresti vedere **"Bilanci Inseriti: 3"** nello Step 2
2. Tutti e 3 dovrebbero avere:
   - Anno corretto (2022, 2023, 2024)
   - Patrimonio Netto > 0
   - Ricavi > 0
3. Se OK → Click **"Avanti"** per procedere allo Step 3

---

## 🆘 In Caso di Problemi

### Reset e Riprova:
```bash
# Se necessario, pulisci solo i bilanci
cd /home/user/webapp
npx wrangler d1 execute webapp-production --local \
  --command="DELETE FROM financial_statements WHERE company_id = 2"
```

### Check Stato Database:
```bash
# Verifica bilanci inseriti
npx wrangler d1 execute webapp-production --local \
  --command="SELECT anno, patrimonio_netto, ricavi_vendite FROM financial_statements ORDER BY anno"
```

---

## 📊 Dati Attesi (Esempio)

Questi sono valori **indicativi** per riferimento:

| Anno | Patrimonio Netto | Ricavi | Utile |
|------|-----------------|--------|-------|
| 2022 | €150.000-200.000 | €200k-300k | €10k-20k |
| 2023 | €160.000-220.000 | €220k-320k | €10k-25k |
| 2024 | €170.000-240.000 | €240k-350k | €15k-30k |

**NOTA**: Usa i valori REALI dai PDF, questi sono solo esempi!

---

## 🎯 Obiettivo Finale

Completare l'inserimento dei 3 bilanci reali per:
1. ✅ Avere storico 3 anni completo
2. ✅ Calcolare valutazione accurata con dati reali
3. ✅ Generare perizia professionale conforme

---

**Buon lavoro! 🚀**

Se hai problemi, verifica:
1. Server PM2 attivo: `pm2 list`
2. Logs server: `pm2 logs webapp --nostream`
3. Database pulito: query sopra
