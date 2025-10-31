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
  
  // Get method label with fallback
  const getMetodoLabel = (metodo: string | null | undefined): string => {
    if (!metodo) return 'Metodo non specificato';
    return metodiLabels[metodo] || metodo.charAt(0).toUpperCase() + metodo.slice(1);
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
            <strong>Metodo di valutazione:</strong> ${getMetodoLabel(params.metodo_principale)}<br>
            <strong>Data:</strong> ${formatDate(new Date().toISOString())}
        </p>
    </div>

    <!-- SEZIONE 1: PREMESSA E IDENTIFICAZIONE DELL'INCARICO -->
    <div class="section">
        <div class="section-title">1. PREMESSA E IDENTIFICAZIONE DELL'INCARICO</div>
        
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
    </div>

    <!-- EXECUTIVE SUMMARY -->
    <div class="section">
        <div class="section-title">2. Executive Summary</div>
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
        
        <div class="highlight-box" style="margin: 20px 0; background-color: #f0f9ff; border-left-color: #1e40af;">
            <strong style="font-size: 13pt; color: #1e40af;">Criterio di Valutazione Adottato</strong><br><br>
            <strong>${getMetodoLabel(params.metodo_principale)}</strong><br><br>
            La valutazione è stata condotta in conformità ai Principi Italiani di Valutazione (PIV) 
            emanati dall'Organismo Italiano di Valutazione (OIV) e agli International Valuation Standards (IVS).
        </div>
    </div>

    <div class="page-break"></div>

    <!-- INFORMAZIONI SULLA SOCIETÀ -->
    <div class="section">
        <div class="section-title">3. Informazioni sulla Società</div>
        
        <div class="subsection-title">3.1 Dati Anagrafici</div>
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
        
        <div class="subsection-title">3.2 Oggetto della Valutazione</div>
        <p>
            La presente valutazione ha per oggetto la determinazione del fair value di una partecipazione
            pari al ${params.percentuale_quota}% del capitale sociale della società. Trattandosi di una
            ${params.percentuale_quota < 50 ? 'quota di minoranza' : 'quota di maggioranza'}, sono stati
            applicati i discount appropriati secondo le best practices internazionali.
        </p>
    </div>

    <!-- ANALISI ECONOMICO-FINANZIARIA -->
    <div class="section">
        <div class="section-title">4. Analisi Economico-Finanziaria</div>
        
        <div class="subsection-title">4.1 Bilanci Storici e Situazioni Contabili</div>
        <p>L'analisi si è basata sui seguenti bilanci d'esercizio e situazioni contabili:</p>
        
        <table class="financial-table">
            <thead>
                <tr>
                    <th>Voce</th>
                    ${statements.map((s: any) => `
                        <th>
                            ${s.anno}${s.tipo === 'infrannuale' ? `<br/><span style="font-size: 10px; color: #2563eb; font-weight: normal;">(Infrannuale ${s.periodo_riferimento || ''})</span>` : ''}
                        </th>
                    `).join('')}
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
        
        <div class="subsection-title">4.2 Indici di Bilancio</div>
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
        <div class="section-title">5. Metodologia di Valutazione</div>
        
        <div class="subsection-title">5.1 Parametri di Valutazione</div>
        <table class="info-table">
            <tr>
                <td>Metodo di Valutazione:</td>
                <td><strong>${getMetodoLabel(params.metodo_principale)}</strong></td>
            </tr>
            <tr>
                <td>Quota Valutata:</td>
                <td><strong>${formatPercent(params.percentuale_quota)}</strong></td>
            </tr>
            ${params.tasso_capitalizzazione ? `
            <tr>
                <td>Tasso di Capitalizzazione:</td>
                <td>${formatPercent(params.tasso_capitalizzazione)}</td>
            </tr>
            ` : ''}
            ${params.wacc ? `
            <tr>
                <td>WACC (Costo Medio Capitale):</td>
                <td>${formatPercent(params.wacc)}</td>
            </tr>
            ` : ''}
            ${params.tasso_crescita ? `
            <tr>
                <td>Tasso di Crescita Perpetuo:</td>
                <td>${formatPercent(params.tasso_crescita)}</td>
            </tr>
            ` : ''}
            ${params.dloc_percentuale > 0 ? `
            <tr>
                <td>DLOC (Discount Lack of Control):</td>
                <td><strong style="color: #dc2626;">${formatPercent(params.dloc_percentuale)}</strong></td>
            </tr>
            ` : ''}
            ${params.dlom_percentuale > 0 ? `
            <tr>
                <td>DLOM (Discount Lack of Marketability):</td>
                <td><strong style="color: #dc2626;">${formatPercent(params.dlom_percentuale)}</strong></td>
            </tr>
            ` : ''}
        </table>
        
        <div class="subsection-title">5.2 Metodologia Applicata</div>
        ${renderMethodologyExplanation(params.metodo_principale, result)}
        
        ${params.dloc_percentuale > 0 || params.dlom_percentuale > 0 ? `
        <div class="subsection-title">5.3 Applicazione Premi e Sconti (DLOC/DLOM)</div>
        
        <p style="margin-bottom: 20px; line-height: 1.8;">
            In conformità ai <strong>PIV III.3.7</strong> (Livelli di valore) e <strong>PIV III.3.8</strong> (Sconto per illiquidità),
            si applicano i seguenti premi/sconti per riflettere la natura della quota valutata:
        </p>
        
        ${params.dloc_percentuale > 0 ? `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">Sconto per Mancanza di Controllo (DLOC)</h4>
            <table class="info-table">
                <tr>
                    <td style="width: 30%;"><strong>Percentuale applicata:</strong></td>
                    <td>${formatPercent(params.dloc_percentuale)}</td>
                </tr>
                <tr>
                    <td><strong>Motivazione:</strong></td>
                    <td>${params.dloc_motivazione || 'Quota di minoranza senza diritti di controllo sulla gestione sociale e impossibilità di influenzare le decisioni strategiche'}</td>
                </tr>
                <tr>
                    <td><strong>Riferimenti normativi:</strong></td>
                    <td><strong>PIV III.3.7</strong> - Livelli di valore, studi empirici Mergerstat/Stout Restricted Stock/Control Premium</td>
                </tr>
            </table>
        </div>
        ` : ''}
        
        ${params.dlom_percentuale > 0 ? `
        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #991b1b;">Sconto per Illiquidità (DLOM)</h4>
            <table class="info-table">
                <tr>
                    <td style="width: 30%;"><strong>Percentuale applicata:</strong></td>
                    <td>${formatPercent(params.dlom_percentuale)}</td>
                </tr>
                <tr>
                    <td><strong>Motivazione:</strong></td>
                    <td>${params.dlom_motivazione || 'Società non quotata, assenza di mercato organizzato, difficoltà di realizzo e tempi di smobilizzo elevati'}</td>
                </tr>
                <tr>
                    <td><strong>Riferimenti normativi:</strong></td>
                    <td><strong>PIV III.3.8</strong> - Sconto per illiquidità, studi FMV Opinions/Pluris Valuation/Emory Pre-IPO</td>
                </tr>
            </table>
        </div>
        ` : ''}
        ` : ''}
    </div>

    <!-- RISULTATI DELLA VALUTAZIONE -->
    <div class="section">
        <div class="section-title">6. Risultati della Valutazione</div>
        
        <div class="subsection-title">6.1 Sintesi dei Risultati</div>
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
        
        <div class="subsection-title">6.2 Analisi di Sensibilità</div>
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
        <div class="section-title">7. Conclusioni</div>
        <p>
            Sulla base dell'analisi condotta e dell'applicazione del metodo <strong>${getMetodoLabel(params.metodo_principale)}</strong>,
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
        
        <p style="margin-top: 30px; line-height: 1.8;">
            La presente stima è stata redatta in conformità ai <strong>Principi Italiani di Valutazione (PIV)</strong> 
            emessi dall'Organismo Italiano di Valutazione (OIV) e agli <strong>International Valuation Standards (IVS)</strong> 
            dell'International Valuation Standards Council (IVSC), riflettendo le condizioni di mercato e i dati 
            economico-finanziari disponibili alla data di valutazione.
        </p>
        
        <div class="subsection-title" style="margin-top: 40px;">7.1 Valore Stimato della Quota</div>
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">
                Il valore della quota pari al <strong>${formatPercent(params.percentuale_quota)}</strong> 
                del capitale sociale della società <strong>${company.ragione_sociale}</strong> 
                alla data del <strong>${formatDate(statements[statements.length - 1].data_riferimento)}</strong> 
                è stimato in:
            </p>
            <h2 style="font-size: 36px; font-weight: bold; margin: 20px 0; color: #fbbf24;">
                ${formatCurrency(result.result.valore_quota_centrale)}
            </h2>
            <p style="margin: 0; color: #cbd5e1; font-size: 14px;">
                (corrispondente a un range di ${formatCurrency(result.result.valore_quota_min)} - 
                ${formatCurrency(result.result.valore_quota_max)})
            </p>
        </div>
        
        <div class="subsection-title" style="margin-top: 40px;">7.2 Limitazioni e Disclaimer</div>
        <ol style="line-height: 2;">
            <li><strong>Limitazioni temporali:</strong> La valutazione è riferita alla specifica data di riferimento 
                ${formatDate(statements[statements.length - 1].data_riferimento)} e può non riflettere condizioni future o variazioni 
                significative successive.</li>
            <li><strong>Base informativa:</strong> I risultati dipendono dalla completezza e accuratezza 
                delle informazioni contabili fornite. Non è stata effettuata due diligence indipendente 
                su asset, passività o contingenze.</li>
            <li><strong>Assunzioni prospettiche:</strong> Le proiezioni future contenute nel metodo DCF sono soggette 
                a incertezza intrinseca e possono differire significativamente dai risultati effettivi.</li>
            <li><strong>Finalità specifica:</strong> La validità della valutazione è limitata agli scopi dichiarati 
                e non può essere utilizzata per finalità diverse senza preventiva autorizzazione scritta.</li>
            <li><strong>Standard seguiti:</strong> La valutazione è conforme ai <strong>Principi Italiani di Valutazione (PIV)</strong> 
                e agli <strong>International Valuation Standards (IVS)</strong> nella versione vigente alla data della valutazione.</li>
            <li><strong>Non è una raccomandazione:</strong> La valutazione non costituisce una sollecitazione 
                all'acquisto o alla vendita della partecipazione. Il valore effettivo di transazione può differire.</li>
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
    </div>

    <!-- FOOTER CONFORMITÀ -->
    <div style="margin-top: 60px; padding: 20px; background-color: #f8fafc; border: 1px solid #cbd5e1; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.6;">
            <em>Documento conforme ai <strong>Principi Italiani di Valutazione (PIV)</strong> emessi dall'Organismo Italiano di Valutazione (OIV),<br/>
            agli <strong>International Valuation Standards (IVS)</strong> dell'International Valuation Standards Council (IVSC)<br/>
            e alle best practices internazionali in materia di valutazione d'azienda.</em>
        </p>
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
