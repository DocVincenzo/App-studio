// PDF Report Template for Corporate Valuation

export function generateReportHTML(data: any): string {
  const { company, params, result, statements } = data;
  
  // Ensure result.result.indici exists with defaults
  if (!result || !result.result) {
    throw new Error('Invalid result data structure');
  }
  
  if (!result.result.indici) {
    result.result.indici = {
      roe: 0,
      roi: 0,
      ros: 0,
      ebitda_margin: 0,
      ebit_margin: 0,
      debt_to_equity: 0
    };
  }
  
  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) {
      return '€0';
    }
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };
  
  const formatPercent = (val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) {
      return '0.00%';
    }
    return `${val.toFixed(2)}%`;
  };
  
  const formatDate = (date: string | null | undefined) => {
    if (!date) {
      return new Date().toLocaleDateString('it-IT');
    }
    return new Date(date).toLocaleDateString('it-IT');
  };
  
  const safeValue = (val: any, defaultVal: number = 0) => {
    return val !== null && val !== undefined && !isNaN(val) ? val : defaultVal;
  };

  const metodiLabels: Record<string, string> = {
    'patrimoniale': 'Patrimoniale Semplice',
    'reddituale': 'Reddituale (Income Approach)',
    'dcf': 'Finanziario - DCF (Discounted Cash Flow)',
    'misto': 'Misto Patrimoniale-Reddituale'
  };

  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Relazione di Valutazione - ${company.ragione_sociale}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #1e40af;
            font-size: 24pt;
            margin: 0 0 10px 0;
        }
        
        .header h2 {
            color: #64748b;
            font-size: 14pt;
            font-weight: normal;
            margin: 0;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            color: #1e40af;
            font-size: 16pt;
            font-weight: bold;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .subsection-title {
            color: #475569;
            font-size: 13pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        .info-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .info-table td:first-child {
            font-weight: bold;
            width: 40%;
            color: #475569;
        }
        
        .financial-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10pt;
        }
        
        .financial-table th {
            background-color: #1e40af;
            color: white;
            padding: 10px;
            text-align: right;
            font-weight: bold;
        }
        
        .financial-table th:first-child {
            text-align: left;
        }
        
        .financial-table td {
            padding: 8px;
            text-align: right;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .financial-table td:first-child {
            text-align: left;
            font-weight: bold;
        }
        
        .financial-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        
        .highlight-box {
            background-color: #dbeafe;
            border-left: 4px solid #1e40af;
            padding: 15px;
            margin: 20px 0;
        }
        
        .result-box {
            background-color: #dcfce7;
            border: 2px solid #16a34a;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        
        .result-box h3 {
            color: #16a34a;
            font-size: 18pt;
            margin: 0 0 15px 0;
        }
        
        .result-value {
            font-size: 28pt;
            font-weight: bold;
            color: #16a34a;
            margin: 10px 0;
        }
        
        .result-range {
            font-size: 12pt;
            color: #475569;
            margin-top: 10px;
        }
        
        .disclaimer {
            font-size: 9pt;
            color: #64748b;
            border-top: 1px solid #cbd5e1;
            padding-top: 15px;
            margin-top: 40px;
            line-height: 1.4;
        }
        
        .footer {
            text-align: center;
            font-size: 9pt;
            color: #94a3b8;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 30px;
        }
        
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <!-- COPERTINA -->
    <div class="header">
        <h1>RELAZIONE DI VALUTAZIONE</h1>
        <h2>${company.ragione_sociale}</h2>
        <p style="margin-top: 20px; font-size: 12pt;">
            <strong>Quota oggetto di valutazione:</strong> ${params.percentuale_quota}%<br>
            <strong>Data:</strong> ${formatDate(new Date().toISOString())}
        </p>
    </div>

    <!-- EXECUTIVE SUMMARY -->
    <div class="section">
        <div class="section-title">1. Executive Summary</div>
        <p>
            La presente relazione di valutazione ha per oggetto la determinazione del valore economico
            di una quota pari al <strong>${params.percentuale_quota}%</strong> del capitale sociale di
            <strong>${company.ragione_sociale}</strong>, società operante nel settore
            <strong>${company.settore || 'N/A'}</strong>.
        </p>
        
        <div class="result-box">
            <h3>Valore Stimato della Quota</h3>
            <div class="result-value">${formatCurrency(result.result.valore_quota_centrale)}</div>
            <div class="result-range">
                Range di valutazione: ${formatCurrency(result.result.valore_quota_min)} - ${formatCurrency(result.result.valore_quota_max)}
            </div>
        </div>
        
        <p>
            La valutazione è stata condotta applicando il metodo <strong>${metodiLabels[params.metodo_principale]}</strong>,
            in conformità ai Principi Italiani di Valutazione (PIV) emanati dall'Organismo Italiano di Valutazione (OIV)
            e agli International Valuation Standards (IVS).
        </p>
    </div>

    <div class="page-break"></div>

    <!-- INFORMAZIONI SULLA SOCIETÀ -->
    <div class="section">
        <div class="section-title">2. Informazioni sulla Società</div>
        
        <div class="subsection-title">2.1 Dati Anagrafici</div>
        <table class="info-table">
            <tr>
                <td>Ragione Sociale:</td>
                <td>${company.ragione_sociale}</td>
            </tr>
            <tr>
                <td>Forma Giuridica:</td>
                <td>${company.forma_giuridica || 'N/A'}</td>
            </tr>
            <tr>
                <td>Codice ATECO:</td>
                <td>${company.codice_ateco || 'N/A'}</td>
            </tr>
            <tr>
                <td>Capitale Sociale:</td>
                <td>${formatCurrency(company.capitale_sociale)}</td>
            </tr>
            <tr>
                <td>Settore:</td>
                <td>${company.settore || 'N/A'}</td>
            </tr>
        </table>
        
        <div class="subsection-title">2.2 Oggetto della Valutazione</div>
        <p>
            La presente valutazione ha per oggetto la determinazione del fair value di una partecipazione
            pari al ${params.percentuale_quota}% del capitale sociale della società. Trattandosi di una
            ${params.percentuale_quota < 50 ? 'quota di minoranza' : 'quota di maggioranza'}, sono stati
            applicati i discount appropriati secondo le best practices internazionali.
        </p>
    </div>

    <!-- ANALISI ECONOMICO-FINANZIARIA -->
    <div class="section">
        <div class="section-title">3. Analisi Economico-Finanziaria</div>
        
        <div class="subsection-title">3.1 Bilanci Storici</div>
        <p>L'analisi si è basata sui seguenti bilanci d'esercizio:</p>
        
        <table class="financial-table">
            <thead>
                <tr>
                    <th>Voce</th>
                    ${statements.map((s: any) => `<th>${s.anno}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Patrimonio Netto</td>
                    ${statements.map((s: any) => `<td>${formatCurrency(s.patrimonio_netto)}</td>`).join('')}
                </tr>
                <tr>
                    <td>Ricavi Vendite</td>
                    ${statements.map((s: any) => `<td>${formatCurrency(s.ricavi_vendite)}</td>`).join('')}
                </tr>
                <tr>
                    <td>EBITDA</td>
                    ${statements.map((s: any) => `<td>${formatCurrency(s.ricavi_vendite + s.altri_ricavi - s.costi_servizi - s.costi_personale - s.oneri_diversi_gestione)}</td>`).join('')}
                </tr>
                <tr>
                    <td>EBIT</td>
                    ${statements.map((s: any) => `<td>${formatCurrency(s.ricavi_vendite + s.altri_ricavi - s.costi_servizi - s.costi_personale - s.oneri_diversi_gestione - s.ammortamenti_svalutazioni)}</td>`).join('')}
                </tr>
                <tr>
                    <td>Utile/Perdita Esercizio</td>
                    ${statements.map((s: any) => `<td style="color: ${s.utile_perdita_esercizio >= 0 ? '#16a34a' : '#dc2626'}; font-weight: bold;">${formatCurrency(s.utile_perdita_esercizio)}</td>`).join('')}
                </tr>
                <tr>
                    <td>Debiti Finanziari</td>
                    ${statements.map((s: any) => `<td>${formatCurrency(s.debiti_finanziari)}</td>`).join('')}
                </tr>
            </tbody>
        </table>
        
        <div class="subsection-title">3.2 Indici di Bilancio</div>
        <table class="info-table">
            <tr>
                <td>ROE (Return on Equity):</td>
                <td>${formatPercent(result.result.indici.roe)}</td>
            </tr>
            <tr>
                <td>ROI (Return on Investment):</td>
                <td>${formatPercent(result.result.indici.roi)}</td>
            </tr>
            <tr>
                <td>ROS (Return on Sales):</td>
                <td>${formatPercent(result.result.indici.ros)}</td>
            </tr>
            <tr>
                <td>EBITDA Margin:</td>
                <td>${formatPercent(result.result.indici.ebitda_margin)}</td>
            </tr>
            <tr>
                <td>EBIT Margin:</td>
                <td>${formatPercent(result.result.indici.ebit_margin)}</td>
            </tr>
            <tr>
                <td>Debt/Equity Ratio:</td>
                <td>${safeValue(result.result.indici.debt_to_equity, 0).toFixed(2)}</td>
            </tr>
        </table>
    </div>

    <div class="page-break"></div>

    <!-- METODOLOGIA DI VALUTAZIONE -->
    <div class="section">
        <div class="section-title">4. Metodologia di Valutazione</div>
        
        <div class="subsection-title">4.1 Metodo Applicato: ${metodiLabels[params.metodo_principale]}</div>
        ${renderMethodologyExplanation(params.metodo_principale, result)}
        
        ${params.dloc_percentuale > 0 || params.dlom_percentuale > 0 ? `
        <div class="subsection-title">4.2 Discount Applicati</div>
        ${params.dloc_percentuale > 0 ? `
        <div class="highlight-box">
            <strong>DLOC (Discount for Lack of Control): ${formatPercent(params.dloc_percentuale)}</strong><br>
            <em>Motivazione:</em> ${params.dloc_motivazione || 'Quota di minoranza senza potere di controllo effettivo.'}
        </div>
        ` : ''}
        
        ${params.dlom_percentuale > 0 ? `
        <div class="highlight-box">
            <strong>DLOM (Discount for Lack of Marketability): ${formatPercent(params.dlom_percentuale)}</strong><br>
            <em>Motivazione:</em> ${params.dlom_motivazione || 'Assenza di mercato attivo per la partecipazione.'}
        </div>
        ` : ''}
        ` : ''}
    </div>

    <!-- RISULTATI DELLA VALUTAZIONE -->
    <div class="section">
        <div class="section-title">5. Risultati della Valutazione</div>
        
        <div class="subsection-title">5.1 Sintesi dei Risultati</div>
        <table class="info-table">
            <tr>
                <td>Valore Equity (100%):</td>
                <td>${formatCurrency(result.result.valore_equity_post_discount)}</td>
            </tr>
            <tr>
                <td>Percentuale Quota:</td>
                <td>${formatPercent(params.percentuale_quota)}</td>
            </tr>
            <tr>
                <td>Valore Quota (Minimo):</td>
                <td>${formatCurrency(result.result.valore_quota_min)}</td>
            </tr>
            <tr style="background-color: #dcfce7;">
                <td><strong>Valore Quota (Centrale):</strong></td>
                <td><strong style="color: #16a34a; font-size: 14pt;">${formatCurrency(result.result.valore_quota_centrale)}</strong></td>
            </tr>
            <tr>
                <td>Valore Quota (Massimo):</td>
                <td>${formatCurrency(result.result.valore_quota_max)}</td>
            </tr>
        </table>
        
        <div class="subsection-title">5.2 Analisi di Sensibilità</div>
        <p>
            L'analisi di sensibilità fornisce un range di valori al variare delle principali assunzioni:
        </p>
        <ul>
            <li><strong>Scenario Ottimistico:</strong> ${formatCurrency(result.result.valore_quota_max)} 
                (crescita ricavi +15%, tasso capitalizzazione -1%)</li>
            <li><strong>Scenario Base:</strong> ${formatCurrency(result.result.valore_quota_centrale)} 
                (parametri standard)</li>
            <li><strong>Scenario Pessimistico:</strong> ${formatCurrency(result.result.valore_quota_min)} 
                (riduzione ricavi -15%, tasso capitalizzazione +1%)</li>
        </ul>
    </div>

    <div class="page-break"></div>

    <!-- CONCLUSIONI -->
    <div class="section">
        <div class="section-title">6. Conclusioni</div>
        <p>
            Sulla base dell'analisi condotta e dell'applicazione del metodo ${metodiLabels[params.metodo_principale]},
            il valore economico della quota pari al ${formatPercent(params.percentuale_quota)} del capitale sociale
            di ${company.ragione_sociale} può essere stimato in:
        </p>
        
        <div class="result-box">
            <h3>Valore Finale</h3>
            <div class="result-value">${formatCurrency(result.result.valore_quota_centrale)}</div>
            <div class="result-range">
                Range di ragionevolezza: ${formatCurrency(result.result.valore_quota_min)} - ${formatCurrency(result.result.valore_quota_max)}
            </div>
        </div>
        
        <p>
            La presente stima è stata redatta in conformità ai principi di valutazione generalmente accettati
            (OIV/PIV/IVS) e riflette le condizioni di mercato e i dati economico-finanziari disponibili
            alla data di valutazione.
        </p>
    </div>

    <!-- DISCLAIMER -->
    <div class="disclaimer">
        <strong>DISCLAIMER E LIMITAZIONI</strong><br><br>
        La presente relazione è stata redatta esclusivamente per lo scopo indicato e non può essere utilizzata
        per altri fini senza il consenso scritto del valutatore. La valutazione riflette le condizioni di mercato
        e le informazioni disponibili alla data di redazione. Il valutatore non si assume responsabilità per eventi
        o circostanze che possano verificarsi successivamente alla data di valutazione. I dati utilizzati sono stati
        forniti dal cliente e si assume che siano accurati e completi. La valutazione non costituisce una raccomandazione
        all'acquisto o alla vendita della partecipazione. Il valore effettivo della transazione può differire dalla
        stima in funzione delle condizioni di mercato, delle modalità di negoziazione e di altri fattori specifici.
    </div>

    <!-- FOOTER -->
    <div class="footer">
        Relazione di Valutazione - ${company.ragione_sociale}<br>
        Generata il ${formatDate(new Date().toISOString())}<br>
        Pagina 1 di 1
    </div>
</body>
</html>
  `;
}

function renderMethodologyExplanation(method: string, result: any): string {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  switch(method) {
    case 'patrimoniale':
      return `
        <p>
          Il <strong>Metodo Patrimoniale Semplice</strong> si basa sulla determinazione del valore del patrimonio netto
          contabile della società, eventualmente rettificato per tenere conto di plusvalenze o minusvalenze latenti.
        </p>
        <div class="highlight-box">
          <strong>Formula:</strong> Valore = Patrimonio Netto Contabile ± Rettifiche<br><br>
          <strong>Patrimonio Netto:</strong> ${formatCurrency(result.result.patrimonio_netto_contabile || 0)}<br>
          <strong>Valore Azienda:</strong> ${formatCurrency(result.result.valore_azienda_pre_discount)}
        </div>
      `;
    
    case 'reddituale':
      return `
        <p>
          Il <strong>Metodo Reddituale</strong> si basa sulla capacità dell'impresa di generare redditi futuri.
          Il valore è determinato capitalizzando il reddito normalizzato ad un tasso appropriato.
        </p>
        <div class="highlight-box">
          <strong>Formula:</strong> Valore = Reddito Normalizzato / Tasso di Capitalizzazione<br><br>
          <strong>Reddito Normalizzato:</strong> ${formatCurrency(result.result.reddito_normalizzato || 0)}<br>
          <strong>Tasso Capitalizzazione:</strong> ${result.params?.tasso_capitalizzazione || 10}%<br>
          <strong>Valore Capitale Economico:</strong> ${formatCurrency(result.result.valore_azienda_pre_discount)}
        </div>
        <p>
          Il reddito normalizzato è stato calcolato come media ponderata dei risultati degli ultimi tre esercizi,
          eliminando componenti straordinarie e non ricorrenti.
        </p>
      `;
    
    case 'dcf':
      return `
        <p>
          Il <strong>Metodo Finanziario DCF</strong> (Discounted Cash Flow) si basa sull'attualizzazione dei flussi
          di cassa futuri che l'impresa è in grado di generare.
        </p>
        <div class="highlight-box">
          <strong>Formula:</strong> EV = Σ FCFF<sub>t</sub> / (1+WACC)<sup>t</sup> + Terminal Value<br><br>
          <strong>WACC:</strong> ${result.params?.wacc || 12}%<br>
          <strong>Tasso Crescita:</strong> ${result.params?.tasso_crescita || 2}%<br>
          <strong>Enterprise Value:</strong> ${formatCurrency(result.result.enterprise_value || 0)}<br>
          <strong>Equity Value:</strong> ${formatCurrency(result.result.valore_azienda_pre_discount)}
        </div>
        <p>
          La valutazione include un periodo esplicito di previsione e un valore terminale calcolato
          con la formula di Gordon (perpetuità in crescita).
        </p>
      `;
    
    case 'misto':
      return `
        <p>
          Il <strong>Metodo Misto Patrimoniale-Reddituale</strong> combina la consistenza patrimoniale
          con la capacità reddituale, risultando particolarmente adatto per PMI italiane.
        </p>
        <div class="highlight-box">
          <strong>Formula:</strong> Valore = (Valore Patrimoniale + Valore Reddituale) / 2<br><br>
          <strong>Valore Patrimoniale:</strong> ${formatCurrency(result.result.patrimonio_netto_contabile || 0)}<br>
          <strong>Valore Reddituale:</strong> ${formatCurrency((result.result.reddito_normalizzato || 0) * 10)}<br>
          <strong>Valore Medio:</strong> ${formatCurrency(result.result.valore_azienda_pre_discount)}
        </div>
        <p>
          Questo approccio bilancia il valore patrimoniale (asset-based) con il valore reddituale
          (income-based), fornendo una stima equilibrata per società con redditività stabile.
        </p>
      `;
    
    default:
      return '';
  }
}
