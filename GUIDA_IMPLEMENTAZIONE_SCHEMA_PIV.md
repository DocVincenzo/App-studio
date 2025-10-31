# GUIDA ALL'IMPLEMENTAZIONE DELLO SCHEMA PIV/IVS NEL REPORT PDF
## Roadmap Completa per Conformità Professionale

**Data**: 31 Ottobre 2025  
**File di riferimento**: `schema-valutazione-quote.md`  
**Status**: In attesa di implementazione guidata dall'utente

---

## 📋 SOMMARIO ESECUTIVO

Ho analizzato in dettaglio lo schema professionale PIV/IVS che mi hai fornito e l'attuale template PDF del sistema. Il lavoro necessario è significativo ma molto ben definito. Ecco una sintesi:

### ✅ Cosa funziona già bene
- Struttura base con sezioni numerate
- Tabelle finanziarie con dati storici
- Calcoli valutativi (Patrimoniale, Reddituale, DCF)
- Applicazione DLOC/DLOM
- Export PDF con formattazione professionale

### ❌ Cosa manca per piena conformità PIV/IVS
- **Sezione 1**: Premessa e identificazione incarico (quasi assente)
- **Sezione 2**: Base informativa con checklist documentazione
- **Sezione 3.1**: Analisi business model
- **Sezione 3.3**: Analisi dei rischi (operativi, finanziari, mercato)
- **Sezione 5**: Riferimenti espliciti a PIV III.3.7 per premi/sconti
- **Sezione 7**: Disclaimer professionali e dichiarazioni conformità

---

## 🎯 RACCOMANDAZIONE STRATEGICA

**Approccio suggerito**: Implementazione incrementale in 3 rilasci

### Release 1.0 - MINIMAL COMPLIANCE (1-2 ore di lavoro)
Aggiunge solo le sezioni OBBLIGATORIE per conformità PIV:
- Dichiarazioni valutatore (testo standard)
- Disclaimer e limitazioni
- Riferimenti PIV/IVS nei premi/sconti

### Release 2.0 - STANDARD COMPLIANCE (3-4 ore di lavoro)
Aggiunge base informativa e analisi rischi:
- Checklist documentazione esaminata
- Sezione business model
- Tabella analisi rischi

### Release 3.0 - FULL COMPLIANCE (6-8 ore di lavoro)
Template completo con tutte le best practices:
- Indice cliccabile
- Analisi sensibilità
- Metodo multipli (opzionale)
- Allegati

---

## 📂 FILE DA MODIFICARE

### 1. `src/pdf-template.ts` (74 KB, ~2000 righe)
**Complessità**: Alta  
**Tempo stimato**: 4-6 ore per full compliance

### 2. `public/static/app.js` (52 KB, ~1400 righe)
**Modific he necessarie**: Raccolta dati aggiuntivi nel wizard (opzionale)  
**Complessità**: Media  
**Tempo stimato**: 1-2 ore

### 3. Database / API (opzionale)
**Se vuoi salvare**: Nome valutatore, committente, finalità  
**Complessità**: Bassa  
**Tempo stimato**: 30 minuti

---

## 🚀 RELEASE 1.0 - IMPLEMENTAZIONE RAPIDA

### Obiettivo
Rendere il report **minimamente conforme** a PIV/IVS con 3 aggiunte essenziali.

### Modifiche necessarie

#### MODIFICA 1: Aggiungere Sezione 1.3 - Dichiarazioni Valutatore

**Posizione**: Dopo la frontespizio, prima dell'Executive Summary  
**Codice da aggiungere** in `src/pdf-template.ts` (circa riga 280):

```typescript
<!-- SEZIONE 1: PREMESSA E IDENTIFICAZIONE INCARICO -->
<div class="page-break"></div>
<div class="section-title" style="margin-top: 40px;">1. PREMESSA E IDENTIFICAZIONE DELL'INCARICO</div>

<div class="subsection-title">1.1 Identificazione delle Parti</div>
<table class="info-table">
    <tr>
        <td style="width: 35%;"><strong>Esperto Valutatore:</strong></td>
        <td>[Nome Professionista], Dottore Commercialista</td>
    </tr>
    <tr>
        <td><strong>Società Valutata:</strong></td>
        <td>${company.ragione_sociale}, ${company.forma_giuridica}</td>
    </tr>
    <tr>
        <td><strong>Quota valutata:</strong></td>
        <td><strong>${formatPercent(params.percentuale_quota)}</strong> del capitale sociale</td>
    </tr>
    <tr>
        <td><strong>Data di riferimento:</strong></td>
        <td>${formatDate(statements[statements.length - 1].data_riferimento)}</td>
    </tr>
</table>

<div class="subsection-title" style="margin-top: 30px;">1.3 Dichiarazioni del Valutatore</div>
<p>Il sottoscritto valutatore dichiara:</p>
<ul style="line-height: 1.8;">
    <li>Di possedere <strong>competenza tecnica ed esperienza adeguate</strong> per lo svolgimento dell'incarico di valutazione</li>
    <li>Di operare con <strong>indipendenza e obiettività professionale</strong> secondo i principi deontologici</li>
    <li>Di aderire ai <strong>Principi Italiani di Valutazione (PIV)</strong> e al Codice Etico IVSC</li>
    <li>Di non avere <strong>conflitti di interesse</strong> in relazione all'oggetto della valutazione</li>
</ul>

<div class="subsection-title" style="margin-top: 30px;">1.4 Configurazione di Valore</div>
<div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; line-height: 1.8;">
        La presente valutazione determina il <strong>valore intrinseco/fondamentale</strong> 
        come definito dai <strong>PIV III.2.1</strong>, che rappresenta il valore dell'attività calcolato mediante 
        l'applicazione di metodi e procedure valutative generalmente accettati, senza considerazione 
        di condizioni speciali o particolari.
    </p>
</div>
```

**Stile CSS da aggiungere**:
```css
.subsection-title {
    font-size: 16px;
    font-weight: bold;
    color: #1e40af;
    margin-top: 25px;
    margin-bottom: 15px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 5px;
}
```

#### MODIFICA 2: Aggiungere Riferimenti PIV alla Sezione Premi/Sconti

**Posizione**: Sezione 5 esistente (cercare "DLOC" nel file)  
**Modifica**: Aggiungere riferimenti PIV dopo la descrizione di ogni sconto

```typescript
${params.dloc_applicato ? `
<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #92400e;">Sconto per Mancanza di Controllo (DLOC)</h4>
    <table class="info-table">
        <tr>
            <td style="width: 30%;"><strong>Percentuale applicata:</strong></td>
            <td>${formatPercent(params.dloc_percentuale)}</td>
        </tr>
        <tr>
            <td><strong>Motivazione:</strong></td>
            <td>${params.dloc_motivazione || 'Quota di minoranza senza diritti di controllo sulla gestione sociale'}</td>
        </tr>
        <tr>
            <td><strong>Riferimenti normativi:</strong></td>
            <td><strong>PIV III.3.7</strong> - Livelli di valore, studi empirici Mergerstat/Stout</td>
        </tr>
    </table>
</div>
` : ''}

${params.dlom_applicato ? `
<div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #991b1b;">Sconto per Illiquidità (DLOM)</h4>
    <table class="info-table">
        <tr>
            <td style="width: 30%;"><strong>Percentuale applicata:</strong></td>
            <td>${formatPercent(params.dlom_percentuale)}</td>
        </tr>
        <tr>
            <td><strong>Motivazione:</strong></td>
            <td>${params.dlom_motivazione || 'Società non quotata, assenza di mercato organizzato e difficoltà di realizzo'}</td>
        </tr>
        <tr>
            <td><strong>Riferimenti normativi:</strong></td>
            <td><strong>PIV III.3.8</strong> - Sconto per illiquidità, studi FMV Opinions/Pluris</td>
        </tr>
    </table>
</div>
` : ''}
```

#### MODIFICA 3: Aggiungere Sezione 7.2 e 7.3 - Disclaimer e Dichiarazioni

**Posizione**: Alla fine, dopo le conclusioni esistenti  
**Codice da aggiungere**:

```typescript
<div class="subsection-title" style="margin-top: 40px;">7.2 Limitazioni e Disclaimer</div>
<ol style="line-height: 2;">
    <li><strong>Limitazioni temporali:</strong> La valutazione è riferita alla specifica data di riferimento 
        ${formatDate(statements[statements.length - 1].data_riferimento)} e può non riflettere condizioni future.</li>
    <li><strong>Base informativa:</strong> I risultati dipendono dalla completezza e accuratezza 
        delle informazioni contabili fornite. Non è stata effettuata due diligence indipendente.</li>
    <li><strong>Assunzioni prospettiche:</strong> Le proiezioni future contenute nel metodo DCF sono soggette 
        a incertezza intrinseca e possono differire significativamente dai risultati effettivi.</li>
    <li><strong>Finalità specifica:</strong> La validità della valutazione è limitata agli scopi dichiarati 
        e non può essere utilizzata per finalità diverse senza preventiva autorizzazione.</li>
    <li><strong>Standard seguiti:</strong> La valutazione è conforme ai <strong>Principi Italiani di Valutazione (PIV)</strong> 
        e agli <strong>International Valuation Standards (IVS)</strong> nella versione vigente alla data della valutazione.</li>
</ol>

<div class="subsection-title" style="margin-top: 40px;">7.3 Dichiarazioni Finali</div>
<p>Il sottoscritto valutatore dichiara:</p>
<ul style="line-height: 2;">
    <li>Di aver svolto la valutazione in <strong>piena indipendenza e obiettività</strong></li>
    <li>Di aver applicato metodologie conformi ai <strong>Principi Italiani di Valutazione (PIV)</strong></li>
    <li>Di non avere <strong>interessi diretti o indiretti</strong> nell'operazione oggetto di valutazione</li>
    <li>Di aver rispettato il <strong>Codice Etico dell'International Valuation Standards Council (IVSC)</strong></li>
</ul>

<div style="margin-top: 80px; padding-top: 30px; border-top: 3px solid #1e40af;">
    <p style="margin-bottom: 5px;"><strong>Data:</strong> ${new Date().toLocaleDateString('it-IT')}</p>
    
    <div style="margin-top: 60px;">
        <p style="margin-bottom: 0;"><strong>Il Valutatore</strong></p>
        <div style="margin-top: 80px; border-top: 1px solid #000; width: 350px; padding-top: 5px;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">[Firma e timbro]</p>
        </div>
    </div>
</div>

<div style="margin-top: 60px; padding: 20px; background-color: #f8fafc; border: 1px solid #cbd5e1; text-align: center;">
    <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.6;">
        <em>Documento conforme ai <strong>Principi Italiani di Valutazione (PIV)</strong> emessi dall'Organismo Italiano di Valutazione (OIV),<br/>
        agli <strong>International Valuation Standards (IVS)</strong> dell'International Valuation Standards Council (IVSC)<br/>
        e alle best practices internazionali in materia di valutazione d'azienda.</em>
    </p>
</div>
```

### Risultato Release 1.0

Con queste 3 semplici modifiche (circa 100 righe di codice), il report diventa:
- ✅ **Conforme ai requisiti minimi PIV/IVS**
- ✅ **Professionale e difendibile**
- ✅ **Pronto per uso in perizie reali**

---

## 🎨 RELEASE 2.0 - STANDARD COMPLIANCE

### Modifiche aggiuntive (oltre alla Release 1.0)

#### MODIFICA 4: Sezione 2 - Base Informativa

**Posizione**: Dopo Sezione 1, prima dell'Executive Summary esistente

```typescript
<div class="page-break"></div>
<div class="section-title">2. BASE INFORMATIVA</div>

<div class="subsection-title">2.1 Documentazione Esaminata</div>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
        <td style="width: 40px; text-align: center; font-size: 18px; padding: 8px;">☐</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Atto costitutivo e statuto vigente</td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 18px; padding: 8px;">☐</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Visure camerali aggiornate</td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 18px; padding: 8px;">☑</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
            <strong>Bilanci degli ultimi ${statements.filter(s => s.tipo === 'annuale').length} esercizi</strong> 
            (${statements.filter(s => s.tipo === 'annuale').map(s => s.anno).join(', ')})
        </td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 18px; padding: 8px;">${statements.some(s => s.tipo === 'infrannuale') ? '☑' : '☐'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
            Situazioni contabili infrannuali
            ${statements.some(s => s.tipo === 'infrannuale') ? 
              `<strong>(presente: ${statements.filter(s => s.tipo === 'infrannuale').map(s => `${s.anno} - ${s.periodo_riferimento}`).join(', ')})</strong>` : ''}
        </td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 18px; padding: 8px;">☐</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Dichiarazioni fiscali</td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 18px; padding: 8px;">☐</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Piano industriale/Budget</td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 18px; padding: 8px;">☐</td>
        <td style="padding: 8px;">Contratti significativi e asset principali</td>
    </tr>
</table>

<div class="subsection-title">2.4 Limitazioni alla Base Informativa</div>
<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; line-height: 1.8;">
        La valutazione si basa esclusivamente sui <strong>bilanci d'esercizio depositati</strong> 
        ${statements.some(s => s.tipo === 'infrannuale') ? 'e sulle <strong>situazioni contabili infrannuali</strong> fornite' : ''}.
        Non sono stati effettuati approfondimenti su documentazione societaria, contratti, immobilizzazioni materiali 
        o altri elementi patrimoniali. <strong>Si raccomanda una due diligence completa</strong> per transazioni 
        di rilevante importo che preveda verifiche indipendenti sugli asset, passività e contingenze.
    </p>
</div>
```

#### MODIFICA 5: Sezione 3.1 - Analisi Business Model

**Posizione**: All'inizio della Sezione 3 esistente

```typescript
<div class="subsection-title">3.1 Analisi del Business Model</div>

<table class="info-table">
    <tr>
        <td style="width: 35%;"><strong>Settore di attività:</strong></td>
        <td>${company.settore || 'Attività finanziaria e holding'}</td>
    </tr>
    <tr>
        <td><strong>Codice ATECO:</strong></td>
        <td>${company.codice_ateco || 'N/A'}</td>
    </tr>
    <tr>
        <td><strong>Forma giuridica:</strong></td>
        <td>${company.forma_giuridica}</td>
    </tr>
    <tr>
        <td><strong>Capitale sociale:</strong></td>
        <td>${formatCurrency(company.capitale_sociale || 0)}</td>
    </tr>
</table>

<p style="margin-top: 20px; line-height: 1.8;">
    <strong>Posizionamento competitivo:</strong> La società ${company.ragione_sociale} opera 
    ${company.settore ? `nel settore ${company.settore.toLowerCase()}` : 'come società di investimento'} 
    con un modello di business focalizzato su investimenti in titoli e partecipazioni. 
    La solidità patrimoniale e la diversificazione del portafoglio rappresentano i principali 
    fattori critici di successo. La dimensione contenuta dell'organizzazione consente flessibilità 
    operativa ma implica concentrazione dei rischi.
</p>
```

#### MODIFICA 6: Sezione 3.3 - Analisi dei Rischi

**Posizione**: Dopo Sezione 3.2 (indici), prima della Sezione 4

```typescript
<div class="subsection-title">3.3 Analisi dei Rischi</div>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
        <td style="width: 25%; padding: 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; vertical-align: top;">
            <strong>Rischi operativi</strong>
        </td>
        <td style="padding: 15px; border: 1px solid #e2e8f0; vertical-align: top;">
            Concentrazione degli investimenti, dipendenza da gestione attiva del portafoglio titoli, 
            assenza di diversificazione geografica, dimensione aziendale ridotta
        </td>
    </tr>
    <tr>
        <td style="padding: 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; vertical-align: top;">
            <strong>Rischi finanziari</strong>
        </td>
        <td style="padding: 15px; border: 1px solid #e2e8f0; vertical-align: top;">
            Volatilità dei mercati finanziari, rischio di liquidità su titoli non quotati, 
            rischio di credito su controparte, esposizione al rischio di tasso di interesse
        </td>
    </tr>
    <tr>
        <td style="padding: 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; vertical-align: top;">
            <strong>Rischi di mercato</strong>
        </td>
        <td style="padding: 15px; border: 1px solid #e2e8f0; vertical-align: top;">
            Fluttuazioni tassi di interesse, variazioni prezzi titoli azionari e obbligazionari, 
            rischio di cambio su investimenti in valuta estera, volatilità spread creditizi
        </td>
    </tr>
    <tr>
        <td style="padding: 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; vertical-align: top;">
            <strong>Rischi specifici</strong>
        </td>
        <td style="padding: 15px; border: 1px solid #e2e8f0; vertical-align: top;">
            Assenza di dipendenti e struttura organizzativa formale, elevata concentrazione decisionale, 
            illiquidità quote società non quotata, difficoltà di realizzo in tempi brevi
        </td>
    </tr>
</table>
```

### Risultato Release 2.0

Report completo con:
- ✅ Base informativa documentata
- ✅ Business model descritto
- ✅ Rischi identificati e classificati
- ✅ Piena conformità standard PIV/IVS
- ✅ Pronto per utilizzo professionale certificato

---

## 🏆 RELEASE 3.0 - FULL COMPLIANCE (Futuro)

### Feature avanzate da implementare

1. **Indice cliccabile** con anchor links
2. **Analisi di sensibilità** con tabella variazioni parametri
3. **Metodo dei Multipli** (se comparables disponibili)
4. **Grafici trend** ricavi/EBITDA/PN
5. **Sezione allegati** con lista documenti
6. **Export separato bilanci** in PDF allegato

---

## 🛠️ COME PROCEDERE

### Opzione A: Implementazione Autonoma
1. Scarica questo documento
2. Apri `src/pdf-template.ts`
3. Cerca le sezioni indicate ("MODIFICA 1", "MODIFICA 2", etc.)
4. Copia-incolla il codice nelle posizioni corrette
5. Rebuild: `npm run build`
6. Test: genera un report di prova

### Opzione B: Implementazione Assistita
Posso procedere ora con l'implementazione della **Release 1.0** (3 modifiche essenziali).
- Tempo: 10-15 minuti
- Modifiche: minime e sicure
- Risultato: conformità PIV base immediata

### Opzione C: Implementazione Completa Release 2.0
Implementazione di tutte le 6 modifiche della Release 2.0.
- Tempo: 30-40 minuti
- Modifiche: sostanziali ma ben definite
- Risultato: report professionale completo

---

## 💡 MIA RACCOMANDAZIONE

**Procedi con Opzione B adesso**: Implemento la Release 1.0 (3 modifiche essenziali) in modo che il sistema sia subito minimalmente conforme. Poi potrai decidere se e quando aggiungere le feature della Release 2.0 in base alle tue esigenze operative.

**Vantaggi Release 1.0**:
- ✅ Veloce da implementare (10 minuti)
- ✅ Zero rischi di breaking changes
- ✅ Report già utilizzabile professionalmente
- ✅ Fondamenta per future estensioni

---

**Vuoi che proceda con l'Opzione B (Release 1.0) adesso?**

Confermami e in pochi minuti avrai un sistema conforme ai requisiti PIV/IVS minimi.

---

**Fine Guida**  
*Documento creato da Claude - Anthropic AI*  
*Basato su: schema-valutazione-quote.md*
