# MAPPATURA SCHEMA PIV/IVS - ANALISI TEMPLATE ATTUALE VS STANDARD PROFESSIONALE

**Data analisi**: 31 Ottobre 2025  
**Obiettivo**: Integrare lo schema PIV/IVS nel PDF report esistente

---

## CONFRONTO STRUTTURALE

### ✅ SEZIONI GIÀ PRESENTI (da mantenere/migliorare)

| Sezione Attuale | Sezione PIV/IVS | Status | Note |
|-----------------|-----------------|--------|------|
| Frontespizio | 1.1 Identificazione Parti | ✅ Presente | Migliorare con dati professionista |
| 1. Executive Summary | 6. Sintesi Valutativa | ✅ Presente | OK, integrable con 6.1-6.2 |
| 2. Informazioni Società | 1.2 Oggetto Valutazione | ✅ Presente | OK |
| 3. Dati Bilanci | 3.2 Analisi Economico-Finanziaria | ✅ Presente | OK, già con tabelle |
| 3.2 Indici Bilancio | 3.2.2 Indici di Performance | ✅ Presente | OK |
| 4. Metodologia | 4. Metodologie Valutazione | ✅ Presente | OK, espandibile |
| 5. Calcoli Dettagliati | 4.2-4.5 Metodi Specifici | ✅ Presente | OK |
| 6. Risultati Finali | 6.1 Risultati Metodi | ✅ Presente | OK |
| 7. Conclusioni | 7. Conclusioni | ✅ Presente | OK |

### ❌ SEZIONI MANCANTI (da aggiungere)

| Sezione PIV/IVS | Priorità | Complessità | Implementazione |
|-----------------|----------|-------------|-----------------|
| **1.3 Dichiarazioni Valutatore** | ALTA | Bassa | Testo fisso con placeholder nome |
| **1.4 Configurazione di Valore** | ALTA | Bassa | Definizione valore intrinseco PIV III.2.1 |
| **2. BASE INFORMATIVA** | ALTA | Media | Checklist documentazione con checkbox |
| **2.4 Limitazioni Base Informativa** | MEDIA | Bassa | Sezione testo libero/note |
| **3.1 Analisi Business Model** | MEDIA | Media | Sezione descrittiva settore/posizionamento |
| **3.3 Analisi dei Rischi** | ALTA | Media | Lista rischi operativi/finanziari/mercato |
| **4.5 Metodo Multipli di Mercato** | MEDIA | Alta | Tabella comparables (se dati disponibili) |
| **5. PREMI/SCONTI (DLOC/DLOM)** | ALTA | Bassa | Già implementato, migliorare presentazione |
| **6.3 Analisi di Sensibilità** | MEDIA | Media | Tabella variazioni WACC/growth/multipli |
| **7.2 Limitazioni e Disclaimer** | ALTA | Bassa | Testo standard disclaimer professionale |
| **7.3 Dichiarazioni Finali** | ALTA | Bassa | Dichiarazioni conformità PIV/IVSC |
| **ALLEGATI** | BASSA | Bassa | Lista allegati (opzionale) |

---

## PIANO DI IMPLEMENTAZIONE

### FASE 1: REFACTORING STRUTTURA (Priorità ALTA)

#### 1. Aggiungere Indice con Anchor Links
```html
<div class="section-title">INDICE</div>
<div style="column-count: 2; column-gap: 30px;">
  <div><a href="#premessa">1. PREMESSA E IDENTIFICAZIONE INCARICO</a></div>
  <div><a href="#base-informativa">2. BASE INFORMATIVA</a></div>
  <div><a href="#analisi-fondamentale">3. ANALISI FONDAMENTALE</a></div>
  <div><a href="#metodologie">4. METODOLOGIE DI VALUTAZIONE</a></div>
  <div><a href="#premi-sconti">5. CONFIGURAZIONI VALORE E PREMI/SCONTI</a></div>
  <div><a href="#sintesi">6. SINTESI VALUTATIVA</a></div>
  <div><a href="#conclusioni">7. CONCLUSIONI</a></div>
</div>
```

#### 2. Sezione 1 - PREMESSA (Nuova)
```typescript
<!-- 1.1 IDENTIFICAZIONE DELLE PARTI -->
<div id="premessa" class="section-title">1. PREMESSA E IDENTIFICAZIONE DELL'INCARICO</div>
<div class="subsection-title">1.1 Identificazione delle Parti</div>
<table class="info-table">
  <tr>
    <td><strong>Esperto Valutatore:</strong></td>
    <td>[Nome Professionista], Dottore Commercialista iscritto all'Albo di [Città] n. [Numero]</td>
  </tr>
  <tr>
    <td><strong>Committente:</strong></td>
    <td>[Committente o "Non specificato"]</td>
  </tr>
  <tr>
    <td><strong>Società Valutata:</strong></td>
    <td>${company.ragione_sociale}, P.IVA ${company.codice_fiscale || 'N/A'}</td>
  </tr>
</table>

<!-- 1.2 OGGETTO DELLA VALUTAZIONE -->
<div class="subsection-title">1.2 Oggetto della Valutazione</div>
<table class="info-table">
  <tr>
    <td><strong>Quota valutata:</strong></td>
    <td>${formatPercent(params.percentuale_quota)}</td>
  </tr>
  <tr>
    <td><strong>Data di riferimento:</strong></td>
    <td>${formatDate(statements[statements.length - 1].data_riferimento)}</td>
  </tr>
  <tr>
    <td><strong>Finalità:</strong></td>
    <td>[Cessione/Conferimento/Recesso/Altro]</td>
  </tr>
</table>

<!-- 1.3 DICHIARAZIONI DEL VALUTATORE -->
<div class="subsection-title">1.3 Dichiarazioni del Valutatore</div>
<p>Il sottoscritto valutatore dichiara:</p>
<ul>
  <li>Di possedere competenza tecnica ed esperienza adeguate per lo svolgimento dell'incarico</li>
  <li>Di operare con indipendenza e obiettività professionale</li>
  <li>Di aderire ai Principi Italiani di Valutazione (PIV) e al Codice Etico IVSC</li>
  <li>Di non avere conflitti di interesse in relazione all'oggetto della valutazione</li>
</ul>

<!-- 1.4 CONFIGURAZIONE DI VALORE -->
<div class="subsection-title">1.4 Configurazione di Valore</div>
<p>
  La presente valutazione determina il <strong>valore intrinseco/fondamentale</strong> 
  come definito dai PIV III.2.1, che rappresenta il valore dell'attività calcolato mediante 
  l'applicazione di metodi e procedure valutative generalmente accettati, senza considerazione 
  di condizioni speciali o particolari.
</p>
```

#### 3. Sezione 2 - BASE INFORMATIVA (Nuova)
```typescript
<div id="base-informativa" class="section-title">2. BASE INFORMATIVA</div>

<div class="subsection-title">2.1 Documentazione Esaminata</div>
<table class="checklist-table">
  <tr>
    <td>☐</td><td>Atto costitutivo e statuto vigente</td>
  </tr>
  <tr>
    <td>☐</td><td>Visure camerali aggiornate</td>
  </tr>
  <tr>
    <td>☑</td><td>Bilanci degli ultimi ${statements.length} esercizi</td>
  </tr>
  <tr>
    <td>${statements.some(s => s.tipo === 'infrannuale') ? '☑' : '☐'}</td>
    <td>Situazioni contabili infrannuali</td>
  </tr>
  <tr>
    <td>☐</td><td>Dichiarazioni fiscali</td>
  </tr>
  <tr>
    <td>☐</td><td>Piano industriale/Budget</td>
  </tr>
</table>

<div class="subsection-title">2.4 Limitazioni alla Base Informativa</div>
<p class="note">
  La valutazione si basa esclusivamente sui bilanci d'esercizio e sulle situazioni 
  contabili fornite. Non sono stati effettuati approfondimenti su documentazione societaria, 
  contratti, immobilizzazioni o altri elementi patrimoniali. Si raccomanda una due diligence 
  completa per transazioni di rilevante importo.
</p>
```

#### 4. Sezione 3 - ANALISI FONDAMENTALE (Enhancement)
```typescript
<div id="analisi-fondamentale" class="section-title">3. ANALISI FONDAMENTALE</div>

<!-- 3.1 ANALISI BUSINESS MODEL (Nuova) -->
<div class="subsection-title">3.1 Analisi del Business Model</div>
<table class="info-table">
  <tr>
    <td><strong>Settore di attività:</strong></td>
    <td>${company.settore || 'Attività finanziaria/investimento'}</td>
  </tr>
  <tr>
    <td><strong>Codice ATECO:</strong></td>
    <td>${company.codice_ateco || 'N/A'}</td>
  </tr>
  <tr>
    <td><strong>Forma giuridica:</strong></td>
    <td>${company.forma_giuridica}</td>
  </tr>
</table>
<p>
  <strong>Posizionamento competitivo:</strong> La società opera nel settore ${company.settore || 'finanziario'} 
  con un modello di business focalizzato su investimenti in titoli e partecipazioni. La solidità 
  patrimoniale e la diversificazione del portafoglio rappresentano i principali fattori critici di successo.
</p>

<!-- 3.2 ANALISI ECONOMICO-FINANZIARIA (Esistente, mantenere) -->
<div class="subsection-title">3.2 Analisi Economico-Finanziaria</div>
<!-- ... tabelle esistenti ... -->

<!-- 3.3 ANALISI DEI RISCHI (Nuova) -->
<div class="subsection-title">3.3 Analisi dei Rischi</div>
<table class="risk-table">
  <tr>
    <td><strong>Rischi operativi:</strong></td>
    <td>Concentrazione investimenti, dipendenza da gestione attiva del portafoglio</td>
  </tr>
  <tr>
    <td><strong>Rischi finanziari:</strong></td>
    <td>Volatilità mercati finanziari, rischio di liquidità, rischio di credito</td>
  </tr>
  <tr>
    <td><strong>Rischi di mercato:</strong></td>
    <td>Fluttuazioni tassi di interesse, variazioni prezzi titoli, rischio di cambio</td>
  </tr>
  <tr>
    <td><strong>Rischi specifici:</strong></td>
    <td>Dimensione aziendale ridotta, assenza di dipendenti, elevata concentrazione</td>
  </tr>
</table>
```

#### 5. Sezione 5 - PREMI/SCONTI (Enhancement Esistente)
```typescript
<div id="premi-sconti" class="section-title">5. CONFIGURAZIONI DI VALORE E PREMI/SCONTI</div>

<div class="subsection-title">5.1 Livelli di Valore secondo PIV III.3.7</div>
<ol>
  <li><strong>Valore di controllo strategico:</strong> Benefici/rischi di socio strategico con controllo</li>
  <li><strong>Valore di controllo finanziario:</strong> Benefici/rischi di socio finanziario con controllo</li>
  <li><strong>Valore di minoranza quotata contendibile:</strong> Società a proprietà contendibile quotata</li>
  <li><strong>Valore di minoranza quotata bloccata:</strong> Società a proprietà bloccata quotata</li>
  <li><strong>Valore di minoranza non quotata bloccata:</strong> Società a proprietà bloccata non quotata</li>
</ol>

<div class="subsection-title">5.2 Applicazione di Premi e Sconti</div>

<!-- DLOC -->
${params.dloc_applicato ? `
<div class="discount-box dloc">
  <h4>Sconto per Mancanza di Controllo (DLOC)</h4>
  <table class="info-table">
    <tr>
      <td><strong>Percentuale applicata:</strong></td>
      <td>${formatPercent(params.dloc_percentuale)}</td>
    </tr>
    <tr>
      <td><strong>Motivazione:</strong></td>
      <td>${params.dloc_motivazione || 'Quota di minoranza senza diritti di controllo'}</td>
    </tr>
    <tr>
      <td><strong>Riferimenti:</strong></td>
      <td>PIV III.3.7, studi empirici Mergerstat/Stout</td>
    </tr>
  </table>
</div>
` : ''}

<!-- DLOM -->
${params.dlom_applicato ? `
<div class="discount-box dlom">
  <h4>Sconto per Illiquidità (DLOM)</h4>
  <table class="info-table">
    <tr>
      <td><strong>Percentuale applicata:</strong></td>
      <td>${formatPercent(params.dlom_percentuale)}</td>
    </tr>
    <tr>
      <td><strong>Motivazione:</strong></td>
      <td>${params.dlom_motivazione || 'Società non quotata, assenza di mercato organizzato'}</td>
    </tr>
    <tr>
      <td><strong>Riferimenti:</strong></td>
      <td>PIV III.3.8, studi empirici FMV Opinions/Pluris</td>
    </tr>
  </table>
</div>
` : ''}

<div class="subsection-title">5.3 Calcolo del Valore della Quota</div>
<table class="financial-table">
  <tr>
    <td>Valore pro-quota base:</td>
    <td><strong>${formatCurrency(result.result.valore_equity_pre_discount * (params.percentuale_quota / 100))}</strong></td>
  </tr>
  ${params.dloc_applicato ? `
  <tr>
    <td>DLOC (${formatPercent(params.dloc_percentuale)}):</td>
    <td>-${formatCurrency(result.result.valore_equity_pre_discount * (params.percentuale_quota / 100) * (params.dloc_percentuale / 100))}</td>
  </tr>
  ` : ''}
  ${params.dlom_applicato ? `
  <tr>
    <td>DLOM (${formatPercent(params.dlom_percentuale)}):</td>
    <td>-${formatCurrency(result.result.valore_equity_pre_discount * (params.percentuale_quota / 100) * (params.dlom_percentuale / 100))}</td>
  </tr>
  ` : ''}
  <tr class="highlight">
    <td><strong>VALORE FINALE DELLA QUOTA:</strong></td>
    <td><strong>${formatCurrency(result.result.valore_quota_centrale)}</strong></td>
  </tr>
</table>
```

#### 6. Sezione 7 - CONCLUSIONI (Enhancement)
```typescript
<div id="conclusioni" class="section-title">7. CONCLUSIONI</div>

<div class="subsection-title">7.1 Valore Stimato della Quota</div>
<div class="conclusion-box">
  <p>
    Il valore della quota pari al <strong>${formatPercent(params.percentuale_quota)}</strong> 
    del capitale sociale della società <strong>${company.ragione_sociale}</strong> 
    alla data del <strong>${formatDate(statements[statements.length - 1].data_riferimento)}</strong> 
    è stimato in:
  </p>
  
  <h2 class="final-value">${formatCurrency(result.result.valore_quota_centrale)}</h2>
  
  <p style="text-align: center; color: #64748b; margin-top: 10px;">
    (corrispondente a un range di ${formatCurrency(result.result.valore_quota_min)} - 
    ${formatCurrency(result.result.valore_quota_max)})
  </p>
</div>

<div class="subsection-title">7.2 Limitazioni e Disclaimer</div>
<ol>
  <li><strong>Limitazioni temporali:</strong> La valutazione è riferita alla specifica data di riferimento 
      e può non riflettere condizioni future</li>
  <li><strong>Base informativa:</strong> I risultati dipendono dalla completezza e accuratezza 
      delle informazioni fornite</li>
  <li><strong>Assunzioni prospettiche:</strong> Le proiezioni future sono soggette a incertezza 
      e possono differire dai risultati effettivi</li>
  <li><strong>Finalità specifica:</strong> La validità della valutazione è limitata agli scopi dichiarati</li>
  <li><strong>Standard seguiti:</strong> Conformità ai PIV e IVS nella versione vigente alla data della valutazione</li>
</ol>

<div class="subsection-title">7.3 Dichiarazioni Finali</div>
<p>Il sottoscritto dichiara:</p>
<ul>
  <li>Di aver svolto la valutazione in piena indipendenza e obiettività</li>
  <li>Di aver applicato metodologie conformi ai Principi Italiani di Valutazione (PIV)</li>
  <li>Di non avere interessi diretti o indiretti nell'operazione oggetto di valutazione</li>
  <li>Di aver rispettato il Codice Etico dell'International Valuation Standards Council (IVSC)</li>
</ul>

<div style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #1e40af;">
  <p><strong>Data:</strong> ${new Date().toLocaleDateString('it-IT')}</p>
  <p style="margin-top: 40px;"><strong>Il Valutatore</strong></p>
  <p style="margin-top: 60px; border-top: 1px solid #ccc; width: 300px;">
    [Firma e timbro]
  </p>
</div>
```

---

## STILI CSS AGGIUNTIVI

```css
/* Checklist Table */
.checklist-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.checklist-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.checklist-table td:first-child {
  width: 30px;
  font-size: 18px;
  text-align: center;
}

/* Risk Table */
.risk-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.risk-table td {
  padding: 12px;
  border: 1px solid #e2e8f0;
  vertical-align: top;
}

.risk-table td:first-child {
  width: 25%;
  background-color: #f8fafc;
  font-weight: bold;
}

/* Discount Boxes */
.discount-box {
  margin: 20px 0;
  padding: 15px;
  border-left: 4px solid;
  background-color: #f8fafc;
}

.discount-box.dloc {
  border-color: #f59e0b;
}

.discount-box.dlom {
  border-color: #dc2626;
}

.discount-box h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

/* Conclusion Box */
.conclusion-box {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  margin: 30px 0;
}

.final-value {
  font-size: 36px;
  font-weight: bold;
  margin: 20px 0;
  color: #fbbf24;
}

/* Note Style */
.note {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 15px;
  margin: 20px 0;
  font-size: 13px;
  line-height: 1.6;
}
```

---

## PRIORITÀ IMPLEMENTAZIONE

### ✅ FASE 1 - ESSENZIALE (Fare subito)
1. Sezione 1 - Premessa completa (1.1-1.4)
2. Sezione 2 - Base Informativa (2.1, 2.4)
3. Sezione 3.1 - Business Model
4. Sezione 3.3 - Analisi Rischi
5. Sezione 5 - Enhancement Premi/Sconti con PIV references
6. Sezione 7.2 - Limitazioni e Disclaimer
7. Sezione 7.3 - Dichiarazioni Finali

### ⏳ FASE 2 - AVANZATO (Fare dopo)
1. Indice con anchor links
2. Sezione 6.3 - Analisi Sensibilità
3. Sezione 4.5 - Metodo Multipli (se dati disponibili)
4. Allegati section

### 🔮 FASE 3 - FUTURO
1. Export allegati (bilanci PDF)
2. Grafici interattivi
3. Comparables database integration

---

## PARAMETRI AGGIUNTIVI NECESSARI

Per supportare il nuovo schema, serviranno nuovi campi:

```typescript
interface ValuationParams {
  // ... campi esistenti ...
  
  // Nuovi campi per PIV/IVS
  valutatore_nome?: string;
  valutatore_albo?: string;
  valutatore_citta?: string;
  valutatore_numero?: string;
  committente?: string;
  finalita_valutazione?: string; // 'Cessione' | 'Conferimento' | 'Recesso' | 'Altro'
  limitazioni_base_informativa?: string;
}
```

---

## RISULTATO ATTESO

Un report PDF professionale che:
- ✅ Segue fedelmente lo schema PIV/IVS
- ✅ Contiene tutte le sezioni obbligatorie
- ✅ Include dichiarazioni e disclaimer conformi
- ✅ Ha una struttura chiara e navigabile
- ✅ È pronto per uso professionale in perizie di stima
- ✅ È conforme agli standard italiani e internazionali

---

**Fine Analisi**  
*Prossimo step: Implementazione FASE 1*
