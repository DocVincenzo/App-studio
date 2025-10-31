/**
 * Motore di calcolo per valutazioni aziendali
 * Implementa metodologie: Patrimoniale, Reddituale, DCF, Multipli
 */

export interface FinancialData {
  anno: number;
  ricavi_vendite: number;
  ebitda: number;
  ebit: number;
  utile_ante_imposte: number;
  utile_perdita_esercizio: number;
  patrimonio_netto: number;
  debiti_finanziari: number;
  attivo_circolante_liquidita: number;
  totale_attivo: number;
  ammortamenti_svalutazioni: number;
  imposte_esercizio: number;
}

export interface ValuationParams {
  percentuale_quota: number;
  metodo_principale: string;
  
  // Parametri metodo patrimoniale
  rettifiche_patrimoniali?: number;
  
  // Parametri metodo reddituale
  tasso_capitalizzazione?: number;
  peso_anni_recenti?: boolean;
  
  // Parametri DCF
  wacc?: number;
  tasso_crescita_perpetuo?: number;
  anni_proiezione?: number;
  
  // Discount
  dloc_applicato?: boolean;
  dloc_percentuale?: number;
  dloc_motivazione?: string;
  dlom_applicato?: boolean;
  dlom_percentuale?: number;
  dlom_motivazione?: string;
}

export interface ValuationResult {
  metodo: string;
  
  // Risultati generali
  patrimonio_netto_contabile?: number;
  patrimonio_netto_rettificato?: number;
  
  // Reddituale
  reddito_normalizzato?: number;
  valore_capitale_economico?: number;
  
  // DCF
  fcff_medio?: number;
  valore_terminale?: number;
  enterprise_value?: number;
  posizione_finanziaria_netta?: number;
  equity_value?: number;
  
  // Risultati finali
  valore_azienda_pre_discount: number;
  valore_equity_pre_discount: number;
  valore_equity_post_discount: number;
  valore_quota_min: number;
  valore_quota_centrale: number;
  valore_quota_max: number;
  
  // Indici
  indici?: {
    roe: number;
    roi: number;
    ros: number;
    ebitda_margin: number;
    ebit_margin: number;
    debt_to_equity: number;
  };
}

/**
 * Calcola indici di bilancio
 */
export function calculateIndices(data: FinancialData[]): any {
  const latest = data[data.length - 1];
  
  const roe = (latest.utile_perdita_esercizio / latest.patrimonio_netto) * 100;
  const roi = (latest.ebit / latest.totale_attivo) * 100;
  const ros = (latest.ebit / latest.ricavi_vendite) * 100;
  const ebitda_margin = (latest.ebitda / latest.ricavi_vendite) * 100;
  const ebit_margin = (latest.ebit / latest.ricavi_vendite) * 100;
  const debt_to_equity = (latest.debiti_finanziari / latest.patrimonio_netto) * 100;
  
  return {
    roe: parseFloat(roe.toFixed(2)),
    roi: parseFloat(roi.toFixed(2)),
    ros: parseFloat(ros.toFixed(2)),
    ebitda_margin: parseFloat(ebitda_margin.toFixed(2)),
    ebit_margin: parseFloat(ebit_margin.toFixed(2)),
    debt_to_equity: parseFloat(debt_to_equity.toFixed(2))
  };
}

/**
 * METODO PATRIMONIALE SEMPLICE
 * Valore = Patrimonio Netto Contabile ± Rettifiche
 */
export function patrimonialeSemplice(
  data: FinancialData[],
  params: ValuationParams
): ValuationResult {
  const latest = data[data.length - 1];
  const patrimonio_netto_contabile = latest.patrimonio_netto;
  const rettifiche = params.rettifiche_patrimoniali || 0;
  const patrimonio_netto_rettificato = patrimonio_netto_contabile + rettifiche;
  
  // Posizione finanziaria netta (cassa - debiti finanziari)
  const pfn = latest.attivo_circolante_liquidita - latest.debiti_finanziari;
  
  const valore_equity_pre = patrimonio_netto_rettificato;
  const valore_equity_post = applyDiscounts(valore_equity_pre, params);
  
  const valore_quota = valore_equity_post * (params.percentuale_quota / 100);
  
  return {
    metodo: 'patrimoniale_semplice',
    patrimonio_netto_contabile,
    patrimonio_netto_rettificato,
    posizione_finanziaria_netta: pfn,
    valore_azienda_pre_discount: patrimonio_netto_rettificato,
    valore_equity_pre_discount: valore_equity_pre,
    valore_equity_post_discount: valore_equity_post,
    valore_quota_min: valore_quota * 0.9, // -10% margine prudenziale
    valore_quota_centrale: valore_quota,
    valore_quota_max: valore_quota * 1.1, // +10% margine
    indici: calculateIndices(data)
  };
}

/**
 * METODO REDDITUALE
 * Valore = Reddito Normalizzato / Tasso di Capitalizzazione
 */
export function metodoReddituale(
  data: FinancialData[],
  params: ValuationParams
): ValuationResult {
  // Calcolo reddito medio normalizzato (media ultimi 3 anni)
  let reddito_normalizzato: number;
  
  if (params.peso_anni_recenti) {
    // Media ponderata: anno più recente ha peso maggiore
    const pesi = [1, 2, 3]; // 2022=1, 2023=2, 2024=3
    const somma_pesi = pesi.reduce((a, b) => a + b, 0);
    reddito_normalizzato = data.reduce((sum, d, i) => 
      sum + (d.utile_perdita_esercizio * pesi[i]), 0
    ) / somma_pesi;
  } else {
    // Media semplice
    reddito_normalizzato = data.reduce((sum, d) => 
      sum + d.utile_perdita_esercizio, 0
    ) / data.length;
  }
  
  // Tasso di capitalizzazione (default 10% per micro-imprese)
  const tasso = params.tasso_capitalizzazione || 10;
  
  // Valore capitale economico = Reddito / Tasso
  const valore_capitale_economico = (reddito_normalizzato / tasso) * 100;
  
  const valore_equity_pre = valore_capitale_economico;
  const valore_equity_post = applyDiscounts(valore_equity_pre, params);
  
  const valore_quota = valore_equity_post * (params.percentuale_quota / 100);
  
  return {
    metodo: 'reddituale',
    reddito_normalizzato,
    valore_capitale_economico,
    valore_azienda_pre_discount: valore_capitale_economico,
    valore_equity_pre_discount: valore_equity_pre,
    valore_equity_post_discount: valore_equity_post,
    valore_quota_min: valore_quota * 0.85, // -15% per conservatività
    valore_quota_centrale: valore_quota,
    valore_quota_max: valore_quota * 1.15, // +15%
    indici: calculateIndices(data)
  };
}

/**
 * METODO FINANZIARIO - DCF (Discounted Cash Flow)
 * Valore = Σ FCFF scontati + Valore Terminale scontato
 */
export function metodoDCF(
  data: FinancialData[],
  params: ValuationParams
): ValuationResult {
  const latest = data[data.length - 1];
  
  // Stima FCFF (Free Cash Flow to Firm)
  // FCFF = EBIT × (1 - tax rate) + Ammortamenti - Capex - ΔWorking Capital
  // Semplificazione per micro-imprese: FCFF ≈ EBITDA - Imposte - Investimenti
  
  const tax_rate = latest.imposte_esercizio / latest.utile_ante_imposte;
  const fcff_medio = data.reduce((sum, d) => {
    const fcff = d.ebit * (1 - tax_rate) + d.ammortamenti_svalutazioni;
    return sum + fcff;
  }, 0) / data.length;
  
  // WACC (Weighted Average Cost of Capital)
  const wacc = params.wacc || 12; // Default 12% per PMI non quotate
  
  // Tasso crescita perpetuo (g)
  const g = params.tasso_crescita_perpetuo || 2; // Default 2% (inflazione)
  
  // Valore terminale con formula di Gordon: TV = FCFF × (1+g) / (WACC - g)
  const valore_terminale = (fcff_medio * (1 + g/100)) / ((wacc - g) / 100);
  
  // Enterprise Value = Valore terminale attualizzato (semplificazione)
  const enterprise_value = valore_terminale / (1 + wacc/100);
  
  // Posizione Finanziaria Netta
  const pfn = latest.attivo_circolante_liquidita - latest.debiti_finanziari;
  
  // Equity Value = Enterprise Value - PFN (o + se cassa netta)
  const equity_value = enterprise_value + pfn;
  
  const valore_equity_post = applyDiscounts(equity_value, params);
  const valore_quota = valore_equity_post * (params.percentuale_quota / 100);
  
  return {
    metodo: 'finanziario_dcf',
    fcff_medio,
    valore_terminale,
    enterprise_value,
    posizione_finanziaria_netta: pfn,
    equity_value,
    valore_azienda_pre_discount: enterprise_value,
    valore_equity_pre_discount: equity_value,
    valore_equity_post_discount: valore_equity_post,
    valore_quota_min: valore_quota * 0.8, // -20% per incertezza proiezioni
    valore_quota_centrale: valore_quota,
    valore_quota_max: valore_quota * 1.2, // +20%
    indici: calculateIndices(data)
  };
}

/**
 * METODO MISTO PATRIMONIALE-REDDITUALE
 * Approccio più comune per PMI italiane
 * Valore = (Patrimonio Netto + Valore Capitale Economico) / 2
 */
export function metodoMisto(
  data: FinancialData[],
  params: ValuationParams
): ValuationResult {
  const result_patrimoniale = patrimonialeSemplice(data, params);
  const result_reddituale = metodoReddituale(data, params);
  
  const valore_medio = (
    result_patrimoniale.valore_equity_pre_discount +
    result_reddituale.valore_equity_pre_discount
  ) / 2;
  
  const valore_equity_post = applyDiscounts(valore_medio, params);
  const valore_quota = valore_equity_post * (params.percentuale_quota / 100);
  
  return {
    metodo: 'misto_patrimoniale_reddituale',
    patrimonio_netto_contabile: result_patrimoniale.patrimonio_netto_contabile,
    reddito_normalizzato: result_reddituale.reddito_normalizzato,
    valore_azienda_pre_discount: valore_medio,
    valore_equity_pre_discount: valore_medio,
    valore_equity_post_discount: valore_equity_post,
    valore_quota_min: valore_quota * 0.9,
    valore_quota_centrale: valore_quota,
    valore_quota_max: valore_quota * 1.1,
    indici: calculateIndices(data)
  };
}

/**
 * Applica discount DLOC e DLOM se configurati
 */
function applyDiscounts(valore: number, params: ValuationParams): number {
  let valore_post = valore;
  
  if (params.dloc_applicato && params.dloc_percentuale) {
    valore_post = valore_post * (1 - params.dloc_percentuale / 100);
  }
  
  if (params.dlom_applicato && params.dlom_percentuale) {
    valore_post = valore_post * (1 - params.dlom_percentuale / 100);
  }
  
  return valore_post;
}

/**
 * Genera analisi di sensibilità
 */
export function sensitivityAnalysis(
  data: FinancialData[],
  params: ValuationParams,
  metodo: string
): any {
  const scenarios = [];
  
  // Scenario base
  const base = calculateValuation(data, params, metodo);
  scenarios.push({ scenario: 'Base', ...base });
  
  // Scenario ottimistico (+15% reddito o -1% tasso)
  const optimistic_params = { ...params };
  if (metodo === 'reddituale' || metodo === 'misto') {
    optimistic_params.tasso_capitalizzazione = (params.tasso_capitalizzazione || 10) - 1;
  }
  const optimistic = calculateValuation(data, optimistic_params, metodo);
  scenarios.push({ scenario: 'Ottimistico', ...optimistic });
  
  // Scenario pessimistico (-15% reddito o +1% tasso)
  const pessimistic_params = { ...params };
  if (metodo === 'reddituale' || metodo === 'misto') {
    pessimistic_params.tasso_capitalizzazione = (params.tasso_capitalizzazione || 10) + 1;
  }
  const pessimistic = calculateValuation(data, pessimistic_params, metodo);
  scenarios.push({ scenario: 'Pessimistico', ...pessimistic });
  
  return scenarios;
}

/**
 * Router principale per calcolo valutazione
 */
export function calculateValuation(
  data: FinancialData[],
  params: ValuationParams,
  metodo?: string
): ValuationResult {
  const selectedMethod = metodo || params.metodo_principale;
  
  switch (selectedMethod) {
    case 'patrimoniale_semplice':
    case 'patrimoniale_complesso':
      return patrimonialeSemplice(data, params);
    
    case 'reddituale':
      return metodoReddituale(data, params);
    
    case 'finanziario_dcf':
      return metodoDCF(data, params);
    
    case 'misto':
      return metodoMisto(data, params);
    
    default:
      return metodoMisto(data, params); // Default method
  }
}
