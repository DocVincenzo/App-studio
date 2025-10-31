import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { calculateValuation, calculateIndices, sensitivityAnalysis, type FinancialData, type ValuationParams } from './valuation-engine'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ======================
// API ROUTES - COMPANIES
// ======================

// Get all companies
app.get('/api/companies', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM companies ORDER BY created_at DESC'
  ).all()
  return c.json(results)
})

// Get company by ID with financial statements
app.get('/api/companies/:id', async (c) => {
  const id = c.req.param('id')
  
  const company = await c.env.DB.prepare(
    'SELECT * FROM companies WHERE id = ?'
  ).bind(id).first()
  
  if (!company) {
    return c.json({ error: 'Company not found' }, 404)
  }
  
  const { results: statements } = await c.env.DB.prepare(
    'SELECT * FROM financial_statements WHERE company_id = ? ORDER BY anno, tipo'
  ).bind(id).all()
  
  return c.json({ company, statements })
})

// Create new company
app.post('/api/companies', async (c) => {
  const body = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO companies (ragione_sociale, forma_giuridica, codice_ateco, capitale_sociale, settore)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    body.ragione_sociale,
    body.forma_giuridica,
    body.codice_ateco || null,
    body.capitale_sociale || null,
    body.settore || null
  ).run()
  
  return c.json({ id: result.meta.last_row_id, ...body })
})

// ================================
// API ROUTES - FINANCIAL STATEMENTS
// ================================

// Get financial statements for company
app.get('/api/companies/:id/statements', async (c) => {
  const id = c.req.param('id')
  
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM financial_statements WHERE company_id = ? ORDER BY anno DESC, tipo'
  ).bind(id).all()
  
  return c.json(results)
})

// Add financial statement
app.post('/api/companies/:id/statements', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO financial_statements (
      company_id, anno, tipo, data_riferimento,
      immobilizzazioni_immateriali, immobilizzazioni_materiali, immobilizzazioni_finanziarie,
      attivo_circolante_rimanenze, attivo_circolante_crediti, attivo_circolante_liquidita,
      ratei_risconti_attivi,
      patrimonio_netto, capitale_sociale, riserve, utile_perdita_esercizio,
      fondi_rischi_oneri, tfr, debiti_finanziari, debiti_fornitori, debiti_tributari,
      altri_debiti, ratei_risconti_passivi,
      ricavi_vendite, altri_ricavi, costi_materie_prime, costi_servizi,
      costi_godimento_beni_terzi, costi_personale, ammortamenti_svalutazioni,
      accantonamenti, oneri_diversi_gestione, proventi_finanziari, oneri_finanziari,
      rettifiche_valore_attivita_finanziarie, proventi_oneri_straordinari, imposte_esercizio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    body.anno,
    body.tipo,
    body.data_riferimento,
    body.immobilizzazioni_immateriali || 0,
    body.immobilizzazioni_materiali || 0,
    body.immobilizzazioni_finanziarie || 0,
    body.attivo_circolante_rimanenze || 0,
    body.attivo_circolante_crediti || 0,
    body.attivo_circolante_liquidita || 0,
    body.ratei_risconti_attivi || 0,
    body.patrimonio_netto || 0,
    body.capitale_sociale || 0,
    body.riserve || 0,
    body.utile_perdita_esercizio || 0,
    body.fondi_rischi_oneri || 0,
    body.tfr || 0,
    body.debiti_finanziari || 0,
    body.debiti_fornitori || 0,
    body.debiti_tributari || 0,
    body.altri_debiti || 0,
    body.ratei_risconti_passivi || 0,
    body.ricavi_vendite || 0,
    body.altri_ricavi || 0,
    body.costi_materie_prime || 0,
    body.costi_servizi || 0,
    body.costi_godimento_beni_terzi || 0,
    body.costi_personale || 0,
    body.ammortamenti_svalutazioni || 0,
    body.accantonamenti || 0,
    body.oneri_diversi_gestione || 0,
    body.proventi_finanziari || 0,
    body.oneri_finanziari || 0,
    body.rettifiche_valore_attivita_finanziarie || 0,
    body.proventi_oneri_straordinari || 0,
    body.imposte_esercizio || 0
  ).run()
  
  return c.json({ id: result.meta.last_row_id, ...body })
})

// ========================
// API ROUTES - VALUATIONS
// ========================

// Calculate valuation (without saving)
app.post('/api/valuations/calculate', async (c) => {
  const body = await c.req.json<{
    company_id: number;
    statements: FinancialData[];
    params: ValuationParams;
  }>()
  
  try {
    // Calculate main method
    const result = calculateValuation(body.statements, body.params)
    
    // Calculate indices
    const indici = calculateIndices(body.statements)
    
    // Sensitivity analysis
    const sensitivity = sensitivityAnalysis(body.statements, body.params, body.params.metodo_principale)
    
    return c.json({
      result,
      indici,
      sensitivity
    })
  } catch (error) {
    return c.json({ error: 'Calculation error: ' + (error as Error).message }, 500)
  }
})

// Save valuation
app.post('/api/valuations', async (c) => {
  const body = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO valuations (
      company_id, data_valutazione, percentuale_quota, finalita, valutatore_nome,
      metodo_principale, metodo_controllo,
      patrimonio_netto_contabile, rettifiche_patrimoniali, patrimonio_netto_rettificato,
      reddito_normalizzato, tasso_capitalizzazione, valore_capitale_economico,
      fcff_medio, wacc, tasso_crescita_perpetuo, valore_terminale,
      enterprise_value, posizione_finanziaria_netta, equity_value,
      dloc_applicato, dloc_percentuale, dloc_motivazione,
      dlom_applicato, dlom_percentuale, dlom_motivazione,
      valore_azienda_pre_discount, valore_equity_pre_discount, valore_equity_post_discount,
      valore_quota_min, valore_quota_centrale, valore_quota_max,
      sensitivity_analysis, note_assunzioni, note_limitazioni
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.company_id,
    body.data_valutazione,
    body.percentuale_quota,
    body.finalita || 'Cessione volontaria quota societaria',
    body.valutatore_nome || null,
    body.metodo_principale,
    body.metodo_controllo || null,
    body.patrimonio_netto_contabile || null,
    body.rettifiche_patrimoniali || 0,
    body.patrimonio_netto_rettificato || null,
    body.reddito_normalizzato || null,
    body.tasso_capitalizzazione || null,
    body.valore_capitale_economico || null,
    body.fcff_medio || null,
    body.wacc || null,
    body.tasso_crescita_perpetuo || null,
    body.valore_terminale || null,
    body.enterprise_value || null,
    body.posizione_finanziaria_netta || null,
    body.equity_value || null,
    body.dloc_applicato || false,
    body.dloc_percentuale || 0,
    body.dloc_motivazione || null,
    body.dlom_applicato || false,
    body.dlom_percentuale || 0,
    body.dlom_motivazione || null,
    body.valore_azienda_pre_discount,
    body.valore_equity_pre_discount,
    body.valore_equity_post_discount,
    body.valore_quota_min,
    body.valore_quota_centrale,
    body.valore_quota_max,
    JSON.stringify(body.sensitivity_analysis || {}),
    body.note_assunzioni || null,
    body.note_limitazioni || null
  ).run()
  
  return c.json({ id: result.meta.last_row_id, ...body })
})

// Get all valuations for company
app.get('/api/companies/:id/valuations', async (c) => {
  const id = c.req.param('id')
  
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM valuations WHERE company_id = ? ORDER BY data_valutazione DESC'
  ).bind(id).all()
  
  return c.json(results)
})

// Get valuation by ID
app.get('/api/valuations/:id', async (c) => {
  const id = c.req.param('id')
  
  const valuation = await c.env.DB.prepare(
    'SELECT * FROM valuations WHERE id = ?'
  ).bind(id).first()
  
  if (!valuation) {
    return c.json({ error: 'Valuation not found' }, 404)
  }
  
  // Get company info
  const company = await c.env.DB.prepare(
    'SELECT * FROM companies WHERE id = ?'
  ).bind(valuation.company_id).first()
  
  return c.json({ valuation, company })
})

// Get all valuations (dashboard)
app.get('/api/valuations', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      v.*,
      c.ragione_sociale,
      c.forma_giuridica
    FROM valuations v
    JOIN companies c ON v.company_id = c.id
    ORDER BY v.data_valutazione DESC
    LIMIT 50
  `).all()
  
  return c.json(results)
})

// ====================
// FRONTEND ROUTES
// ====================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Valutazione d'Azienda - Corporate Finance Advisor</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#1e40af',
                  secondary: '#64748b'
                }
              }
            }
          }
        </script>
        <style>
          .card { @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow; }
          .btn-primary { @apply bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold; }
          .btn-secondary { @apply bg-secondary text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-semibold; }
        </style>
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-slate-100 min-h-screen">
        <!-- Header -->
        <nav class="bg-white shadow-lg mb-8">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-chart-line text-3xl text-primary"></i>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Valutazione d'Azienda</h1>
                            <p class="text-sm text-gray-600">Corporate Finance Advisor Professional</p>
                        </div>
                    </div>
                    <button onclick="showDashboard()" class="btn-secondary">
                        <i class="fas fa-table-list mr-2"></i>Dashboard
                    </button>
                </div>
            </div>
        </nav>

        <div id="app" class="max-w-7xl mx-auto px-6 pb-12">
            <!-- Hero Section -->
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">
                    Perizie di Stima Professionali
                </h2>
                <p class="text-xl text-gray-600 mb-2">
                    Valutazioni conformi ai Principi OIV/PIV/IVS
                </p>
                <p class="text-gray-500">
                    Per cessioni di quote societarie, conferimenti, fusioni e perizie giurate
                </p>
            </div>

            <!-- Main Actions -->
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="card">
                    <div class="text-center">
                        <i class="fas fa-plus-circle text-6xl text-primary mb-4"></i>
                        <h3 class="text-2xl font-bold mb-4">Nuova Valutazione</h3>
                        <p class="text-gray-600 mb-6">
                            Crea una nuova perizia di stima per una società. 
                            Sistema guidato step-by-step con wizard interattivo.
                        </p>
                        <button onclick="startNewValuation()" class="btn-primary w-full">
                            <i class="fas fa-arrow-right mr-2"></i>Inizia Valutazione
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div class="text-center">
                        <i class="fas fa-building text-6xl text-secondary mb-4"></i>
                        <h3 class="text-2xl font-bold mb-4">Gestisci Società</h3>
                        <p class="text-gray-600 mb-6">
                            Visualizza e gestisci l'anagrafica delle società già censite
                            con relativi bilanci e valutazioni storiche.
                        </p>
                        <button onclick="manageCompanies()" class="btn-secondary w-full">
                            <i class="fas fa-list mr-2"></i>Visualizza Società
                        </button>
                    </div>
                </div>
            </div>

            <!-- Features -->
            <div class="grid md:grid-cols-3 gap-6">
                <div class="card text-center">
                    <i class="fas fa-balance-scale text-4xl text-blue-600 mb-3"></i>
                    <h4 class="font-bold text-lg mb-2">Metodi Professionali</h4>
                    <p class="text-sm text-gray-600">
                        Patrimoniale, Reddituale, DCF, Multipli e Metodo Misto
                    </p>
                </div>
                <div class="card text-center">
                    <i class="fas fa-file-pdf text-4xl text-red-600 mb-3"></i>
                    <h4 class="font-bold text-lg mb-2">Report PDF</h4>
                    <p class="text-sm text-gray-600">
                        Relazioni complete pronte per presentazione al cliente
                    </p>
                </div>
                <div class="card text-center">
                    <i class="fas fa-database text-4xl text-green-600 mb-3"></i>
                    <h4 class="font-bold text-lg mb-2">Storico Completo</h4>
                    <p class="text-sm text-gray-600">
                        Database centralizzato con tutte le valutazioni archiviate
                    </p>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
