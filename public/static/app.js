// =========================
// STATE MANAGEMENT
// =========================
let currentStep = 1;
let valuationData = {
  company: {},
  statements: [],
  params: {},
  result: null
};

// =========================
// NAVIGATION FUNCTIONS
// =========================

function startNewValuation() {
  document.getElementById('app').innerHTML = renderWizard();
  loadCompaniesForSelection();
}

function manageCompanies() {
  document.getElementById('app').innerHTML = renderCompanyList();
  loadCompanies();
}

function showDashboard() {
  document.getElementById('app').innerHTML = renderDashboard();
  loadDashboard();
}

function nextStep() {
  if (validateStep(currentStep)) {
    currentStep++;
    updateWizardUI();
  }
}

function prevStep() {
  currentStep--;
  updateWizardUI();
}

function validateStep(step) {
  // Validation logic per step
  switch(step) {
    case 1: // Company selection
      if (!valuationData.company.id) {
        alert('Seleziona una società o creane una nuova');
        return false;
      }
      return true;
    case 2: // Financial statements
      const annuali = valuationData.statements.filter(s => s.tipo === 'annuale').length;
      if (annuali < 3) {
        alert('Sono necessari almeno 3 bilanci annuali per la valutazione. Puoi aggiungere situazioni infrannuali opzionali.');
        return false;
      }
      return true;
    case 3: // Valuation method
      if (!valuationData.params.metodo_principale) {
        alert('Seleziona il metodo di valutazione principale');
        return false;
      }
      if (!valuationData.params.percentuale_quota || valuationData.params.percentuale_quota <= 0) {
        alert('Inserisci la percentuale di quota da valutare');
        return false;
      }
      return true;
    default:
      return true;
  }
}

// =========================
// WIZARD UI
// =========================

function renderWizard() {
  return `
    <div class="bg-white rounded-lg shadow-xl p-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          ${renderStepIndicator(1, 'Società', 'fa-building')}
          ${renderStepIndicator(2, 'Bilanci', 'fa-file-invoice')}
          ${renderStepIndicator(3, 'Metodo', 'fa-calculator')}
          ${renderStepIndicator(4, 'Calcolo', 'fa-chart-line')}
          ${renderStepIndicator(5, 'Report', 'fa-file-pdf')}
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-primary h-2 rounded-full transition-all" style="width: ${(currentStep/5)*100}%"></div>
        </div>
      </div>

      <!-- Step Content -->
      <div id="wizard-content">
        ${renderStepContent()}
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-8">
        <button onclick="prevStep()" class="btn-secondary ${currentStep === 1 ? 'invisible' : ''}">
          <i class="fas fa-arrow-left mr-2"></i>Indietro
        </button>
        <button onclick="nextStep()" class="btn-primary ${currentStep === 5 ? 'hidden' : ''}">
          Avanti<i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  `;
}

function renderStepIndicator(step, label, icon) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;
  return `
    <div class="flex flex-col items-center flex-1">
      <div class="${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'} 
                  w-12 h-12 rounded-full flex items-center justify-center mb-2">
        <i class="fas ${icon}"></i>
      </div>
      <span class="text-xs font-semibold ${isActive ? 'text-primary' : 'text-gray-500'}">${label}</span>
    </div>
  `;
}

function updateWizardUI() {
  document.getElementById('app').innerHTML = renderWizard();
  // Re-populate data based on current step
  if (currentStep === 1) loadCompaniesForSelection();
  if (currentStep === 2) loadFinancialStatements();
  if (currentStep === 4) performCalculation();
}

function renderStepContent() {
  switch(currentStep) {
    case 1: return renderStep1_Company();
    case 2: return renderStep2_Statements();
    case 3: return renderStep3_Method();
    case 4: return renderStep4_Calculation();
    case 5: return renderStep5_Report();
    default: return '';
  }
}

// =========================
// STEP 1: COMPANY SELECTION
// =========================

function renderStep1_Company() {
  return `
    <h2 class="text-2xl font-bold mb-6">Seleziona Società</h2>
    
    <div class="mb-6">
      <label class="block font-semibold mb-2">Società Esistente</label>
      <select id="company-select" class="w-full border rounded px-4 py-2" onchange="selectCompany(this.value)">
        <option value="">-- Seleziona società --</option>
      </select>
    </div>

    <div class="text-center my-6">
      <span class="text-gray-500">oppure</span>
    </div>

    <button onclick="showNewCompanyForm()" class="btn-secondary w-full">
      <i class="fas fa-plus mr-2"></i>Crea Nuova Società
    </button>

    <div id="new-company-form" class="hidden mt-6 p-6 bg-gray-50 rounded-lg">
      <h3 class="font-bold text-lg mb-4">Nuova Società</h3>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block font-semibold mb-2">Ragione Sociale *</label>
          <input type="text" id="ragione-sociale" class="w-full border rounded px-4 py-2" placeholder="M.D.L. Srl">
        </div>
        <div>
          <label class="block font-semibold mb-2">Forma Giuridica *</label>
          <select id="forma-giuridica" class="w-full border rounded px-4 py-2">
            <option>Società a responsabilità limitata</option>
            <option>Società per azioni</option>
            <option>Società in accomandita semplice</option>
            <option>Società in nome collettivo</option>
          </select>
        </div>
        <div>
          <label class="block font-semibold mb-2">Codice ATECO</label>
          <input type="text" id="codice-ateco" class="w-full border rounded px-4 py-2" placeholder="68.20.01">
        </div>
        <div>
          <label class="block font-semibold mb-2">Capitale Sociale (€)</label>
          <input type="number" id="capitale-sociale" class="w-full border rounded px-4 py-2" placeholder="10000">
        </div>
        <div class="md:col-span-2">
          <label class="block font-semibold mb-2">Settore</label>
          <input type="text" id="settore" class="w-full border rounded px-4 py-2" 
                 placeholder="Affitto e gestione di terreni per telecomunicazioni">
        </div>
      </div>
      <button onclick="createCompany()" class="btn-primary mt-4 w-full">
        <i class="fas fa-save mr-2"></i>Salva Società
      </button>
    </div>

    ${valuationData.company.id ? `
      <div class="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
        <p class="font-semibold text-green-800">
          <i class="fas fa-check-circle mr-2"></i>Società Selezionata: 
          <span class="font-bold">${valuationData.company.ragione_sociale}</span>
        </p>
        <p class="text-sm text-green-700 mt-1">
          ${valuationData.company.forma_giuridica} - ${valuationData.company.settore || 'N/A'}
        </p>
      </div>
    ` : ''}
  `;
}

async function loadCompaniesForSelection() {
  try {
    const response = await axios.get('/api/companies');
    const select = document.getElementById('company-select');
    if (select) {
      response.data.forEach(company => {
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = `${company.ragione_sociale} (${company.forma_giuridica})`;
        if (valuationData.company.id === company.id) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading companies:', error);
  }
}

async function selectCompany(id) {
  if (!id) return;
  try {
    const response = await axios.get(`/api/companies/${id}`);
    valuationData.company = response.data.company;
    valuationData.statements = response.data.statements;
    updateWizardUI();
  } catch (error) {
    console.error('Error selecting company:', error);
  }
}

function showNewCompanyForm() {
  document.getElementById('new-company-form').classList.toggle('hidden');
}

async function createCompany() {
  const data = {
    ragione_sociale: document.getElementById('ragione-sociale').value,
    forma_giuridica: document.getElementById('forma-giuridica').value,
    codice_ateco: document.getElementById('codice-ateco').value,
    capitale_sociale: parseFloat(document.getElementById('capitale-sociale').value) || null,
    settore: document.getElementById('settore').value
  };

  if (!data.ragione_sociale) {
    alert('Ragione sociale obbligatoria');
    return;
  }

  try {
    const response = await axios.post('/api/companies', data);
    valuationData.company = response.data;
    alert('Società creata con successo!');
    updateWizardUI();
  } catch (error) {
    console.error('Error creating company:', error);
    alert('Errore nella creazione della società');
  }
}

// =========================
// STEP 2: FINANCIAL STATEMENTS
// =========================

function renderStep2_Statements() {
  return `
    <h2 class="text-2xl font-bold mb-6">Bilanci d'Esercizio e Situazioni Contabili</h2>
    <p class="text-gray-600 mb-6">
      Inserisci i dati dei bilanci annuali degli ultimi 3 anni (2022, 2023, 2024) 
      e, opzionalmente, le situazioni contabili infrannuali/parziali più recenti.
      Le situazioni infrannuali saranno considerate nel calcolo della valutazione finale.
    </p>

    <div class="mb-6">
      <h3 class="font-bold text-lg mb-4">Bilanci Inseriti: ${valuationData.statements.length}</h3>
      ${valuationData.statements.length > 0 ? valuationData.statements.map(s => `
        <div class="p-3 ${s.tipo === 'infrannuale' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'} rounded mb-2 flex justify-between items-center">
          <span>
            <strong>${s.anno}</strong> - 
            <span class="${s.tipo === 'infrannuale' ? 'text-blue-700 font-semibold' : ''}">${s.tipo === 'infrannuale' ? 'Infrannuale' : 'Annuale'}</span>
            ${s.periodo_riferimento && s.periodo_riferimento !== 'Annuale' ? `<span class="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded ml-1">${s.periodo_riferimento}</span>` : ''}
            (${s.data_riferimento})
          </span>
          <span class="text-sm">Patrimonio Netto: €${formatNumber(s.patrimonio_netto)}</span>
        </div>
      `).join('') : '<p class="text-gray-500 italic">Nessun bilancio inserito</p>'}
    </div>

    <!-- Upload PDF Section -->
    <div class="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
      <div class="flex items-start mb-4">
        <i class="fas fa-magic text-3xl text-blue-600 mr-4 mt-1"></i>
        <div class="flex-1">
          <h3 class="font-bold text-xl mb-2 text-blue-900">
            <i class="fas fa-sparkles mr-2"></i>Acquisizione Automatica da PDF
          </h3>
          <p class="text-gray-700 mb-4">
            Carica il PDF del bilancio e il sistema estrarrà automaticamente tutti i dati 
            usando intelligenza artificiale. Riduci i tempi di inserimento del 90%!
          </p>
        </div>
      </div>

      <!-- Drag & Drop Zone -->
      <div id="pdf-drop-zone" 
           class="border-3 border-dashed border-blue-300 rounded-lg p-8 text-center bg-white hover:bg-blue-50 transition-all cursor-pointer"
           onclick="document.getElementById('pdf-file-input').click()">
        <i class="fas fa-cloud-upload-alt text-6xl text-blue-400 mb-4"></i>
        <p class="text-lg font-semibold text-gray-700 mb-2">
          Trascina qui il PDF del bilancio
        </p>
        <p class="text-sm text-gray-500 mb-4">oppure clicca per selezionare</p>
        <p class="text-xs text-gray-400">Formato: PDF | Dimensione max: 10MB</p>
        <input type="file" 
               id="pdf-file-input" 
               accept="application/pdf" 
               class="hidden" 
               onchange="handlePDFUpload(event)">
      </div>

      <!-- Upload Progress -->
      <div id="upload-progress" class="hidden mt-4">
        <div class="bg-blue-100 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-blue-800">
              <i class="fas fa-spinner fa-spin mr-2"></i>Elaborazione in corso...
            </span>
            <span id="upload-status" class="text-sm text-blue-600">0%</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div id="upload-bar" class="bg-blue-600 h-2 rounded-full transition-all" style="width: 0%"></div>
          </div>
          <p class="text-xs text-blue-600 mt-2">
            Estrazione dati con AI - attendere...
          </p>
        </div>
      </div>

      <!-- Parsed Data Preview -->
      <div id="parsed-data-preview" class="hidden mt-4"></div>
    </div>

    <div class="text-center mb-6">
      <span class="text-gray-500">oppure</span>
    </div>

    <button onclick="showAddStatementForm()" class="btn-secondary mb-6 w-full">
      <i class="fas fa-keyboard mr-2"></i>Inserisci Manualmente i Dati
    </button>

    <div id="add-statement-form" class="hidden p-6 bg-gray-50 rounded-lg">
      ${renderStatementForm()}
    </div>
  `;
}

function renderStatementForm() {
  return `
    <h3 class="font-bold text-lg mb-4">Nuovo Bilancio</h3>
    <div class="grid md:grid-cols-4 gap-4 mb-4">
      <div>
        <label class="block font-semibold mb-2">Anno *</label>
        <input type="number" id="stmt-anno" class="w-full border rounded px-4 py-2" placeholder="2024">
      </div>
      <div>
        <label class="block font-semibold mb-2">Tipo *</label>
        <select id="stmt-tipo" class="w-full border rounded px-4 py-2" onchange="togglePeriodoRiferimento()">
          <option value="annuale">Annuale</option>
          <option value="infrannuale">Infrannuale / Situazione Contabile Parziale</option>
        </select>
      </div>
      <div id="periodo-riferimento-container" class="hidden">
        <label class="block font-semibold mb-2">Periodo *</label>
        <select id="stmt-periodo" class="w-full border rounded px-4 py-2">
          <option value="Q1">Q1 (trimestre)</option>
          <option value="Q2">Q2 (semestre)</option>
          <option value="Q3">Q3 (9 mesi)</option>
          <option value="9M" selected>9M (9 mesi)</option>
          <option value="6M">6M (semestre)</option>
          <option value="Altro">Altro</option>
        </select>
      </div>
      <div>
        <label class="block font-semibold mb-2">Data Riferimento *</label>
        <input type="date" id="stmt-data" class="w-full border rounded px-4 py-2">
      </div>
    </div>
    <div id="infra-notice" class="hidden mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm">
      <i class="fas fa-info-circle mr-2"></i>
      <strong>Bilancio infrannuale:</strong> I dati reddituali saranno annualizzati automaticamente per il calcolo della valutazione.
    </div>

    <h4 class="font-bold mt-6 mb-3">Stato Patrimoniale - Attivo (€)</h4>
    <div class="grid md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm mb-1">Immobilizzazioni Materiali</label>
        <input type="number" id="immob-materiali" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Crediti</label>
        <input type="number" id="crediti" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Liquidità</label>
        <input type="number" id="liquidita" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
    </div>

    <h4 class="font-bold mt-6 mb-3">Stato Patrimoniale - Passivo (€)</h4>
    <div class="grid md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm mb-1">Patrimonio Netto *</label>
        <input type="number" id="patrimonio-netto" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Capitale Sociale</label>
        <input type="number" id="capitale-sociale-stmt" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Riserve</label>
        <input type="number" id="riserve" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Utile/Perdita Esercizio *</label>
        <input type="number" id="utile-esercizio" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
    </div>
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      <div>
        <label class="block text-sm mb-1">Debiti Finanziari</label>
        <input type="number" id="debiti-finanziari" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Debiti Fornitori</label>
        <input type="number" id="debiti-fornitori" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Debiti Tributari</label>
        <input type="number" id="debiti-tributari" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
    </div>

    <h4 class="font-bold mt-6 mb-3">Conto Economico (€)</h4>
    <div class="grid md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm mb-1">Ricavi Vendite *</label>
        <input type="number" id="ricavi" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Costi Servizi</label>
        <input type="number" id="costi-servizi" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Costi Godimento Beni di Terzi</label>
        <input type="number" id="costi-godimento" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Ammortamenti</label>
        <input type="number" id="ammortamenti" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Oneri Finanziari</label>
        <input type="number" id="oneri-finanziari" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
      <div>
        <label class="block text-sm mb-1">Imposte *</label>
        <input type="number" id="imposte" class="w-full border rounded px-3 py-2" placeholder="0">
      </div>
    </div>

    <button onclick="addStatement()" class="btn-primary mt-6 w-full">
      <i class="fas fa-save mr-2"></i>Salva Bilancio
    </button>
  `;
}

function showAddStatementForm() {
  document.getElementById('add-statement-form').classList.toggle('hidden');
}

function togglePeriodoRiferimento() {
  const tipo = document.getElementById('stmt-tipo').value;
  const periodoContainer = document.getElementById('periodo-riferimento-container');
  const infraNotice = document.getElementById('infra-notice');
  
  if (tipo === 'infrannuale') {
    periodoContainer?.classList.remove('hidden');
    infraNotice?.classList.remove('hidden');
  } else {
    periodoContainer?.classList.add('hidden');
    infraNotice?.classList.add('hidden');
  }
}

async function addStatement() {
  const tipo = document.getElementById('stmt-tipo').value;
  const data = {
    anno: parseInt(document.getElementById('stmt-anno').value),
    tipo: tipo,
    periodo_riferimento: tipo === 'infrannuale' ? 
      (document.getElementById('stmt-periodo')?.value || '9M') : 
      'Annuale',
    data_riferimento: document.getElementById('stmt-data').value,
    immobilizzazioni_materiali: parseFloat(document.getElementById('immob-materiali').value) || 0,
    attivo_circolante_crediti: parseFloat(document.getElementById('crediti').value) || 0,
    attivo_circolante_liquidita: parseFloat(document.getElementById('liquidita').value) || 0,
    patrimonio_netto: parseFloat(document.getElementById('patrimonio-netto').value),
    capitale_sociale: parseFloat(document.getElementById('capitale-sociale-stmt').value) || 0,
    riserve: parseFloat(document.getElementById('riserve').value) || 0,
    utile_perdita_esercizio: parseFloat(document.getElementById('utile-esercizio').value),
    debiti_finanziari: parseFloat(document.getElementById('debiti-finanziari').value) || 0,
    debiti_fornitori: parseFloat(document.getElementById('debiti-fornitori').value) || 0,
    debiti_tributari: parseFloat(document.getElementById('debiti-tributari').value) || 0,
    ricavi_vendite: parseFloat(document.getElementById('ricavi').value),
    costi_servizi: parseFloat(document.getElementById('costi-servizi').value) || 0,
    costi_godimento_beni_terzi: parseFloat(document.getElementById('costi-godimento').value) || 0,
    ammortamenti_svalutazioni: parseFloat(document.getElementById('ammortamenti').value) || 0,
    oneri_finanziari: parseFloat(document.getElementById('oneri-finanziari').value) || 0,
    imposte_esercizio: parseFloat(document.getElementById('imposte').value) || 0
  };

  if (!data.anno || !data.data_riferimento || !data.patrimonio_netto || !data.ricavi_vendite) {
    alert('Campi obbligatori mancanti (anno, data, patrimonio netto, ricavi)');
    return;
  }

  try {
    const response = await axios.post(`/api/companies/${valuationData.company.id}/statements`, data);
    valuationData.statements.push(response.data);
    alert('Bilancio salvato!');
    updateWizardUI();
  } catch (error) {
    console.error('Error adding statement:', error);
    alert('Errore nel salvataggio del bilancio');
  }
}

async function loadFinancialStatements() {
  if (!valuationData.company.id) return;
  try {
    const response = await axios.get(`/api/companies/${valuationData.company.id}/statements`);
    valuationData.statements = response.data;
  } catch (error) {
    console.error('Error loading statements:', error);
  }
}

// =========================
// STEP 3: VALUATION METHOD
// =========================

function renderStep3_Method() {
  return `
    <h2 class="text-2xl font-bold mb-6">Metodo di Valutazione</h2>

    <div class="mb-6">
      <label class="block font-semibold mb-2">Percentuale Quota da Valutare (%)*</label>
      <input type="number" id="percentuale-quota" step="0.01" min="0" max="100" 
             class="w-full border rounded px-4 py-2" placeholder="37.5"
             value="${valuationData.params.percentuale_quota || ''}">
      <p class="text-sm text-gray-500 mt-1">Esempio: 37,5% per quota di minoranza</p>
    </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2">Metodo Principale *</label>
      <select id="metodo-principale" class="w-full border rounded px-4 py-2">
        <option value="">-- Seleziona metodo --</option>
        <option value="patrimoniale_semplice">Patrimoniale Semplice</option>
        <option value="reddituale">Reddituale (Income Approach)</option>
        <option value="finanziario_dcf">Finanziario - DCF</option>
        <option value="misto">Misto Patrimoniale-Reddituale ⭐ Consigliato per PMI</option>
      </select>
    </div>

    <div id="method-params" class="mb-6 p-6 bg-blue-50 rounded-lg hidden">
      <!-- Parameters will be shown based on selected method -->
    </div>

    <h3 class="font-bold text-lg mb-4 mt-8">Discount per Minoranza / Illiquidità</h3>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="p-4 border rounded">
        <label class="flex items-center mb-3">
          <input type="checkbox" id="dloc-check" class="mr-2" onchange="toggleDLOC()">
          <span class="font-semibold">Applica DLOC (Discount Lack of Control)</span>
        </label>
        <div id="dloc-fields" class="hidden">
          <label class="block text-sm mb-2">Percentuale DLOC (%)</label>
          <input type="number" id="dloc-perc" step="0.1" class="w-full border rounded px-3 py-2 mb-2" placeholder="15">
          <label class="block text-sm mb-2">Motivazione</label>
          <textarea id="dloc-motiv" class="w-full border rounded px-3 py-2" rows="2"
                    placeholder="Quota di minoranza senza controllo gestionale"></textarea>
        </div>
      </div>

      <div class="p-4 border rounded">
        <label class="flex items-center mb-3">
          <input type="checkbox" id="dlom-check" class="mr-2" onchange="toggleDLOM()">
          <span class="font-semibold">Applica DLOM (Discount Lack of Marketability)</span>
        </label>
        <div id="dlom-fields" class="hidden">
          <label class="block text-sm mb-2">Percentuale DLOM (%)</label>
          <input type="number" id="dlom-perc" step="0.1" class="w-full border rounded px-3 py-2 mb-2" placeholder="20">
          <label class="block text-sm mb-2">Motivazione</label>
          <textarea id="dlom-motiv" class="w-full border rounded px-3 py-2" rows="2"
                    placeholder="Società non quotata con limitata liquidità della partecipazione"></textarea>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <button onclick="saveMethodParams()" class="btn-primary w-full">
        <i class="fas fa-check mr-2"></i>Conferma Parametri
      </button>
    </div>
  `;
}

function toggleDLOC() {
  document.getElementById('dloc-fields').classList.toggle('hidden');
}

function toggleDLOM() {
  document.getElementById('dlom-fields').classList.toggle('hidden');
}

function saveMethodParams() {
  valuationData.params = {
    percentuale_quota: parseFloat(document.getElementById('percentuale-quota').value),
    metodo_principale: document.getElementById('metodo-principale').value,
    tasso_capitalizzazione: 10, // Default
    wacc: 12, // Default
    tasso_crescita_perpetuo: 2, // Default
    dloc_applicato: document.getElementById('dloc-check').checked,
    dloc_percentuale: parseFloat(document.getElementById('dloc-perc')?.value) || 0,
    dloc_motivazione: document.getElementById('dloc-motiv')?.value || '',
    dlom_applicato: document.getElementById('dlom-check').checked,
    dlom_percentuale: parseFloat(document.getElementById('dlom-perc')?.value) || 0,
    dlom_motivazione: document.getElementById('dlom-motiv')?.value || ''
  };
  
  alert('Parametri salvati! Procedi al calcolo.');
}

// =========================
// STEP 4: CALCULATION
// =========================

function renderStep4_Calculation() {
  if (!valuationData.result) {
    return `
      <div class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-6xl text-primary mb-4"></i>
        <h2 class="text-2xl font-bold mb-4">Calcolo in corso...</h2>
        <p class="text-gray-600">Elaborazione valutazione con metodo ${valuationData.params.metodo_principale}</p>
      </div>
    `;
  }

  const result = valuationData.result.result;
  const indici = valuationData.result.indici;

  return `
    <h2 class="text-2xl font-bold mb-6">Risultati Valutazione</h2>

    <!-- Risultati Principali -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-green-50 border-l-4 border-green-500">
        <p class="text-sm text-gray-600 mb-1">Valore Quota - Minimo</p>
        <p class="text-3xl font-bold text-green-700">€${formatNumber(result.valore_quota_min)}</p>
      </div>
      <div class="card bg-blue-50 border-l-4 border-blue-500">
        <p class="text-sm text-gray-600 mb-1">Valore Quota - Centrale</p>
        <p class="text-3xl font-bold text-blue-700">€${formatNumber(result.valore_quota_centrale)}</p>
      </div>
      <div class="card bg-purple-50 border-l-4 border-purple-500">
        <p class="text-sm text-gray-600 mb-1">Valore Quota - Massimo</p>
        <p class="text-3xl font-bold text-purple-700">€${formatNumber(result.valore_quota_max)}</p>
      </div>
    </div>

    <!-- Dettagli Calcolo -->
    <div class="card mb-6">
      <h3 class="font-bold text-lg mb-4">Dettagli Calcolo - Metodo: ${result.metodo}</h3>
      <div class="grid md:grid-cols-2 gap-4">
        ${result.patrimonio_netto_contabile ? `
          <div>
            <span class="text-gray-600">Patrimonio Netto Contabile:</span>
            <span class="font-bold float-right">€${formatNumber(result.patrimonio_netto_contabile)}</span>
          </div>
        ` : ''}
        ${result.reddito_normalizzato ? `
          <div>
            <span class="text-gray-600">Reddito Normalizzato:</span>
            <span class="font-bold float-right">€${formatNumber(result.reddito_normalizzato)}</span>
          </div>
        ` : ''}
        ${result.enterprise_value ? `
          <div>
            <span class="text-gray-600">Enterprise Value:</span>
            <span class="font-bold float-right">€${formatNumber(result.enterprise_value)}</span>
          </div>
        ` : ''}
        ${result.posizione_finanziaria_netta !== undefined ? `
          <div>
            <span class="text-gray-600">Posizione Finanziaria Netta:</span>
            <span class="font-bold float-right">€${formatNumber(result.posizione_finanziaria_netta)}</span>
          </div>
        ` : ''}
        <div>
          <span class="text-gray-600">Equity Value (pre-discount):</span>
          <span class="font-bold float-right">€${formatNumber(result.valore_equity_pre_discount)}</span>
        </div>
        <div>
          <span class="text-gray-600">Equity Value (post-discount):</span>
          <span class="font-bold float-right">€${formatNumber(result.valore_equity_post_discount)}</span>
        </div>
      </div>
    </div>

    <!-- Indici di Bilancio -->
    <div class="card mb-6">
      <h3 class="font-bold text-lg mb-4">Indici di Bilancio</h3>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <span class="text-gray-600">ROE (Return on Equity):</span>
          <span class="font-bold float-right">${indici.roe}%</span>
        </div>
        <div>
          <span class="text-gray-600">ROI (Return on Investment):</span>
          <span class="font-bold float-right">${indici.roi}%</span>
        </div>
        <div>
          <span class="text-gray-600">ROS (Return on Sales):</span>
          <span class="font-bold float-right">${indici.ros}%</span>
        </div>
        <div>
          <span class="text-gray-600">EBITDA Margin:</span>
          <span class="font-bold float-right">${indici.ebitda_margin}%</span>
        </div>
        <div>
          <span class="text-gray-600">EBIT Margin:</span>
          <span class="font-bold float-right">${indici.ebit_margin}%</span>
        </div>
        <div>
          <span class="text-gray-600">Debt/Equity:</span>
          <span class="font-bold float-right">${indici.debt_to_equity}%</span>
        </div>
      </div>
    </div>

    <!-- Sensitivity Analysis -->
    ${renderSensitivityAnalysis()}

    <div class="flex gap-4">
      <button onclick="saveValuation()" class="btn-primary flex-1">
        <i class="fas fa-save mr-2"></i>Salva Valutazione
      </button>
      <button onclick="nextStep()" class="btn-secondary flex-1">
        Genera Report<i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  `;
}

function renderSensitivityAnalysis() {
  if (!valuationData.result.sensitivity || valuationData.result.sensitivity.length === 0) {
    return '';
  }

  return `
    <div class="card mb-6">
      <h3 class="font-bold text-lg mb-4">Analisi di Sensibilità</h3>
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left p-3">Scenario</th>
            <th class="text-right p-3">Valore Quota Min</th>
            <th class="text-right p-3">Valore Quota Centrale</th>
            <th class="text-right p-3">Valore Quota Max</th>
          </tr>
        </thead>
        <tbody>
          ${valuationData.result.sensitivity.map(s => `
            <tr class="border-b">
              <td class="p-3 font-semibold">${s.scenario}</td>
              <td class="p-3 text-right">€${formatNumber(s.valore_quota_min)}</td>
              <td class="p-3 text-right">€${formatNumber(s.valore_quota_centrale)}</td>
              <td class="p-3 text-right">€${formatNumber(s.valore_quota_max)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function performCalculation() {
  try {
    // Get 3 most recent annual statements + any interim statements
    const annuali = valuationData.statements
      .filter(s => s.tipo === 'annuale')
      .sort((a, b) => b.anno - a.anno)
      .slice(0, 3);
    
    const infrannuali = valuationData.statements
      .filter(s => s.tipo === 'infrannuale')
      .sort((a, b) => new Date(b.data_riferimento) - new Date(a.data_riferimento));
    
    // Combine: annual statements + most recent interim statement
    const statementsToUse = [...annuali, ...infrannuali.slice(0, 1)];
    
    const response = await axios.post('/api/valuations/calculate', {
      company_id: valuationData.company.id,
      statements: statementsToUse,
      params: valuationData.params
    });
    
    valuationData.result = response.data;
    updateWizardUI();
  } catch (error) {
    console.error('Calculation error:', error);
    alert('Errore nel calcolo della valutazione: ' + (error.response?.data?.error || error.message));
  }
}

async function saveValuation() {
  const result = valuationData.result.result;
  
  const data = {
    company_id: valuationData.company.id,
    data_valutazione: new Date().toISOString().split('T')[0],
    percentuale_quota: valuationData.params.percentuale_quota,
    finalita: 'Cessione volontaria quota societaria',
    metodo_principale: valuationData.params.metodo_principale,
    ...result,
    sensitivity_analysis: valuationData.result.sensitivity,
    dloc_applicato: valuationData.params.dloc_applicato,
    dloc_percentuale: valuationData.params.dloc_percentuale,
    dloc_motivazione: valuationData.params.dloc_motivazione,
    dlom_applicato: valuationData.params.dlom_applicato,
    dlom_percentuale: valuationData.params.dlom_percentuale,
    dlom_motivazione: valuationData.params.dlom_motivazione
  };

  try {
    const response = await axios.post('/api/valuations', data);
    alert('Valutazione salvata con successo!');
    valuationData.valuation_id = response.data.id;
  } catch (error) {
    console.error('Error saving valuation:', error);
    alert('Errore nel salvataggio');
  }
}

// =========================
// STEP 5: REPORT
// =========================

function renderStep5_Report() {
  return `
    <h2 class="text-2xl font-bold mb-6">Report Finale</h2>
    
    <div class="card mb-6 text-center">
      <i class="fas fa-file-pdf text-6xl text-red-600 mb-4"></i>
      <h3 class="text-xl font-bold mb-4">Relazione di Valutazione Completa</h3>
      <p class="text-gray-600 mb-6">
        La relazione professionale include: Executive Summary, Analisi Finanziaria, 
        Metodologie Applicate, Calcoli Dettagliati, Range di Valore e Disclaimer.
      </p>
      <button onclick="generatePDF()" class="btn-primary">
        <i class="fas fa-download mr-2"></i>Genera e Scarica Report PDF
      </button>
    </div>

    <div class="card">
      <h3 class="font-bold text-lg mb-4">Riepilogo Valutazione</h3>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Società:</span>
          <span class="font-bold">${valuationData.company.ragione_sociale}</span>
        </div>
        <div class="flex justify-between">
          <span>Quota valutata:</span>
          <span class="font-bold">${valuationData.params.percentuale_quota}%</span>
        </div>
        <div class="flex justify-between">
          <span>Metodo principale:</span>
          <span class="font-bold">${valuationData.params.metodo_principale}</span>
        </div>
        <div class="flex justify-between border-t pt-2 mt-2">
          <span>Valore quota (range):</span>
          <span class="font-bold text-primary">
            €${formatNumber(valuationData.result.result.valore_quota_min)} - 
            €${formatNumber(valuationData.result.result.valore_quota_max)}
          </span>
        </div>
        <div class="flex justify-between">
          <span>Valore centrale:</span>
          <span class="font-bold text-2xl text-green-600">
            €${formatNumber(valuationData.result.result.valore_quota_centrale)}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center">
      <button onclick="location.reload()" class="btn-secondary">
        <i class="fas fa-home mr-2"></i>Torna alla Home
      </button>
    </div>
  `;
}

async function generatePDF() {
  try {
    // Show loading message
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generazione in corso...';
    btn.disabled = true;
    
    // Prepare report data
    const reportData = {
      company: valuationData.company,
      params: valuationData.params,
      result: valuationData.result,
      statements: valuationData.statements
    };
    
    // Call API to generate HTML report
    const response = await axios.post('/api/generate-report', reportData, {
      responseType: 'text'
    });
    
    // Open HTML in new window for printing to PDF
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    printWindow.document.write(response.data);
    printWindow.document.close();
    
    // Wait a bit for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
    
    // Restore button
    btn.innerHTML = originalText;
    btn.disabled = false;
    
    // Show success message
    showNotification('Report generato! Usa il dialog di stampa per salvare come PDF.', 'success');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    showNotification('Errore nella generazione del report: ' + error.message, 'error');
    
    // Restore button
    const btn = event.target;
    btn.innerHTML = '<i class="fas fa-download mr-2"></i>Genera e Scarica Report PDF';
    btn.disabled = false;
  }
}

function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-xl"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// =========================
// COMPANY LIST
// =========================

function renderCompanyList() {
  return `
    <h2 class="text-3xl font-bold mb-6">Gestione Società</h2>
    <div id="company-list-container">
      <p class="text-center text-gray-500">Caricamento...</p>
    </div>
  `;
}

async function loadCompanies() {
  try {
    const response = await axios.get('/api/companies');
    document.getElementById('company-list-container').innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        ${response.data.map(company => `
          <div class="card">
            <h3 class="font-bold text-xl mb-2">${company.ragione_sociale}</h3>
            <p class="text-sm text-gray-600 mb-4">${company.forma_giuridica}</p>
            <p class="text-sm mb-4">${company.settore || 'N/A'}</p>
            <div class="flex gap-2">
              <button onclick="selectCompany(${company.id}); startNewValuation();" 
                      class="btn-primary flex-1">
                <i class="fas fa-calculator mr-2"></i>Valuta
              </button>
              <button onclick="viewCompanyDetails(${company.id})" 
                      class="btn-secondary flex-1">
                <i class="fas fa-eye mr-2"></i>Dettagli
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading companies:', error);
  }
}

async function viewCompanyDetails(id) {
  // TODO: implement company details view
  alert('Vista dettagli in sviluppo');
}

// =========================
// DASHBOARD
// =========================

function renderDashboard() {
  return `
    <h2 class="text-3xl font-bold mb-6">Dashboard Valutazioni</h2>
    <div id="dashboard-container">
      <p class="text-center text-gray-500">Caricamento...</p>
    </div>
  `;
}

async function loadDashboard() {
  try {
    const response = await axios.get('/api/valuations');
    if (response.data.length === 0) {
      document.getElementById('dashboard-container').innerHTML = `
        <div class="card text-center py-12">
          <i class="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
          <p class="text-xl text-gray-600 mb-4">Nessuna valutazione presente</p>
          <button onclick="startNewValuation()" class="btn-primary">
            Crea la prima valutazione
          </button>
        </div>
      `;
      return;
    }

    document.getElementById('dashboard-container').innerHTML = `
      <div class="space-y-4">
        ${response.data.map(v => `
          <div class="card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-bold text-xl mb-2">${v.ragione_sociale}</h3>
                <p class="text-sm text-gray-600 mb-2">
                  ${v.forma_giuridica} - Quota: ${v.percentuale_quota}%
                </p>
                <p class="text-sm mb-2">
                  <strong>Metodo:</strong> ${v.metodo_principale}
                </p>
                <p class="text-sm text-gray-500">
                  Data valutazione: ${v.data_valutazione}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600 mb-1">Valore Quota Centrale</p>
                <p class="text-2xl font-bold text-primary">
                  €${formatNumber(v.valore_quota_centrale)}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Range: €${formatNumber(v.valore_quota_min)} - €${formatNumber(v.valore_quota_max)}
                </p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// =========================
// UTILITY FUNCTIONS
// =========================

function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Math.round(num).toLocaleString('it-IT');
}

// =========================
// PDF UPLOAD & PARSING
// =========================

async function handlePDFUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validazione
  if (file.type !== 'application/pdf') {
    alert('Seleziona un file PDF valido');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    alert('File troppo grande. Dimensione massima: 10MB');
    return;
  }
  
  // Mostra progress bar
  document.getElementById('upload-progress').classList.remove('hidden');
  document.getElementById('parsed-data-preview').classList.add('hidden');
  
  const progressBar = document.getElementById('upload-bar');
  const progressStatus = document.getElementById('upload-status');
  
  // Animazione progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    progressBar.style.width = `${progress}%`;
    progressStatus.textContent = `${Math.round(progress)}%`;
  }, 500);
  
  try {
    // Upload e parsing
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await axios.post(
      `/api/companies/${valuationData.company.id}/statements/upload-pdf`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    clearInterval(progressInterval);
    progressBar.style.width = '100%';
    progressStatus.textContent = '100%';
    
    setTimeout(() => {
      document.getElementById('upload-progress').classList.add('hidden');
      
      // Mostra preview dati parsati
      showParsedDataPreview(response.data);
    }, 500);
    
  } catch (error) {
    clearInterval(progressInterval);
    document.getElementById('upload-progress').classList.add('hidden');
    
    console.error('Upload error:', error);
    alert('Errore nell\'elaborazione del PDF: ' + (error.response?.data?.error || error.message));
  }
}

function showParsedDataPreview(data) {
  const preview = document.getElementById('parsed-data-preview');
  const parsed = data.parsed_data;
  const validation = data.validation;
  
  let html = `
    <div class="bg-white rounded-lg p-6 border-2 ${validation.valid ? 'border-green-500' : 'border-yellow-500'}">
      <div class="flex items-center mb-4">
        <i class="fas ${validation.valid ? 'fa-check-circle text-green-600' : 'fa-exclamation-triangle text-yellow-600'} text-3xl mr-3"></i>
        <div>
          <h3 class="font-bold text-lg">
            ${validation.valid ? 'Dati Estratti con Successo!' : 'Dati Estratti - Verifica Necessaria'}
          </h3>
          <p class="text-sm text-gray-600">
            Confidenza: ${Math.round((parsed.parsing_confidence || 0.8) * 100)}%
          </p>
        </div>
      </div>
  `;
  
  // Warnings
  if (validation.warnings && validation.warnings.length > 0) {
    html += `
      <div class="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p class="font-semibold text-yellow-800 mb-2">
          <i class="fas fa-exclamation-circle mr-2"></i>Attenzione
        </p>
        <ul class="text-sm text-yellow-700 list-disc list-inside">
          ${validation.warnings.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Errors
  if (validation.errors && validation.errors.length > 0) {
    html += `
      <div class="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded">
        <p class="font-semibold text-red-800 mb-2">
          <i class="fas fa-times-circle mr-2"></i>Errori
        </p>
        <ul class="text-sm text-red-700 list-disc list-inside">
          ${validation.errors.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Dati estratti
  html += `
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="p-3 bg-gray-50 rounded">
        <p class="text-xs text-gray-500 mb-1">Anno</p>
        <p class="font-bold">${parsed.anno || 'N/A'}</p>
      </div>
      <div class="p-3 bg-gray-50 rounded">
        <p class="text-xs text-gray-500 mb-1">Patrimonio Netto</p>
        <p class="font-bold">€${formatNumber(parsed.patrimonio_netto || 0)}</p>
      </div>
      <div class="p-3 bg-gray-50 rounded">
        <p class="text-xs text-gray-500 mb-1">Ricavi Vendite</p>
        <p class="font-bold">€${formatNumber(parsed.ricavi_vendite || 0)}</p>
      </div>
      <div class="p-3 bg-gray-50 rounded">
        <p class="text-xs text-gray-500 mb-1">Utile/Perdita Esercizio</p>
        <p class="font-bold">€${formatNumber(parsed.utile_perdita_esercizio || 0)}</p>
      </div>
    </div>
    
    <details class="mb-4">
      <summary class="cursor-pointer font-semibold text-blue-600 hover:text-blue-800">
        <i class="fas fa-eye mr-2"></i>Visualizza tutti i dati estratti
      </summary>
      <div class="mt-3 p-4 bg-gray-50 rounded text-xs font-mono max-h-64 overflow-y-auto">
        <pre>${JSON.stringify(parsed, null, 2)}</pre>
      </div>
    </details>
    
    <div class="flex gap-3">
      <button onclick="confirmParsedData(${JSON.stringify(data).replace(/"/g, '&quot;')})" 
              class="btn-primary flex-1">
        <i class="fas fa-check mr-2"></i>Conferma e Salva Bilancio
      </button>
      <button onclick="editParsedData(${JSON.stringify(parsed).replace(/"/g, '&quot;')})" 
              class="btn-secondary flex-1">
        <i class="fas fa-edit mr-2"></i>Modifica Dati
      </button>
    </div>
  </div>
  `;
  
  preview.innerHTML = html;
  preview.classList.remove('hidden');
}

async function confirmParsedData(data) {
  const parsed = data.parsed_data;
  
  // Prepara dati per salvataggio
  const statementData = {
    anno: parsed.anno,
    tipo: parsed.tipo || 'annuale',
    data_riferimento: parsed.data_riferimento || `${parsed.anno}-12-31`,
    immobilizzazioni_immateriali: parsed.immobilizzazioni_immateriali || 0,
    immobilizzazioni_materiali: parsed.immobilizzazioni_materiali || 0,
    immobilizzazioni_finanziarie: parsed.immobilizzazioni_finanziarie || 0,
    attivo_circolante_rimanenze: parsed.attivo_circolante_rimanenze || 0,
    attivo_circolante_crediti: parsed.attivo_circolante_crediti || 0,
    attivo_circolante_liquidita: parsed.attivo_circolante_liquidita || 0,
    ratei_risconti_attivi: parsed.ratei_risconti_attivi || 0,
    patrimonio_netto: parsed.patrimonio_netto || 0,
    capitale_sociale: parsed.capitale_sociale || 0,
    riserve: parsed.riserve || 0,
    utile_perdita_esercizio: parsed.utile_perdita_esercizio || 0,
    fondi_rischi_oneri: parsed.fondi_rischi_oneri || 0,
    tfr: parsed.tfr || 0,
    debiti_finanziari: parsed.debiti_finanziari || 0,
    debiti_fornitori: parsed.debiti_fornitori || 0,
    debiti_tributari: parsed.debiti_tributari || 0,
    altri_debiti: parsed.altri_debiti || 0,
    ratei_risconti_passivi: parsed.ratei_risconti_passivi || 0,
    ricavi_vendite: parsed.ricavi_vendite || 0,
    altri_ricavi: parsed.altri_ricavi || 0,
    costi_materie_prime: parsed.costi_materie_prime || 0,
    costi_servizi: parsed.costi_servizi || 0,
    costi_godimento_beni_terzi: parsed.costi_godimento_beni_terzi || 0,
    costi_personale: parsed.costi_personale || 0,
    ammortamenti_svalutazioni: parsed.ammortamenti_svalutazioni || 0,
    accantonamenti: parsed.accantonamenti || 0,
    oneri_diversi_gestione: parsed.oneri_diversi_gestione || 0,
    proventi_finanziari: parsed.proventi_finanziari || 0,
    oneri_finanziari: parsed.oneri_finanziari || 0,
    rettifiche_valore_attivita_finanziarie: parsed.rettifiche_valore_attivita_finanziarie || 0,
    proventi_oneri_straordinari: parsed.proventi_oneri_straordinari || 0,
    imposte_esercizio: parsed.imposte_esercizio || 0
  };
  
  try {
    const response = await axios.post(
      `/api/companies/${valuationData.company.id}/statements`,
      statementData
    );
    
    valuationData.statements.push(response.data);
    
    alert('✅ Bilancio salvato con successo!');
    updateWizardUI();
  } catch (error) {
    console.error('Error saving statement:', error);
    alert('Errore nel salvataggio del bilancio: ' + (error.response?.data?.error || error.message));
  }
}

function editParsedData(parsed) {
  // Mostra form manuale pre-compilato con dati parsati
  document.getElementById('add-statement-form').classList.remove('hidden');
  
  // Pre-compila i campi
  if (parsed.anno) document.getElementById('stmt-anno').value = parsed.anno;
  if (parsed.tipo) document.getElementById('stmt-tipo').value = parsed.tipo;
  if (parsed.data_riferimento) document.getElementById('stmt-data').value = parsed.data_riferimento;
  if (parsed.immobilizzazioni_materiali) document.getElementById('immob-materiali').value = parsed.immobilizzazioni_materiali;
  if (parsed.attivo_circolante_crediti) document.getElementById('crediti').value = parsed.attivo_circolante_crediti;
  if (parsed.attivo_circolante_liquidita) document.getElementById('liquidita').value = parsed.attivo_circolante_liquidita;
  if (parsed.patrimonio_netto) document.getElementById('patrimonio-netto').value = parsed.patrimonio_netto;
  if (parsed.capitale_sociale) document.getElementById('capitale-sociale-stmt').value = parsed.capitale_sociale;
  if (parsed.riserve) document.getElementById('riserve').value = parsed.riserve;
  if (parsed.utile_perdita_esercizio) document.getElementById('utile-esercizio').value = parsed.utile_perdita_esercizio;
  if (parsed.debiti_finanziari) document.getElementById('debiti-finanziari').value = parsed.debiti_finanziari;
  if (parsed.debiti_fornitori) document.getElementById('debiti-fornitori').value = parsed.debiti_fornitori;
  if (parsed.debiti_tributari) document.getElementById('debiti-tributari').value = parsed.debiti_tributari;
  if (parsed.ricavi_vendite) document.getElementById('ricavi').value = parsed.ricavi_vendite;
  if (parsed.costi_servizi) document.getElementById('costi-servizi').value = parsed.costi_servizi;
  if (parsed.costi_godimento_beni_terzi) document.getElementById('costi-godimento').value = parsed.costi_godimento_beni_terzi;
  if (parsed.ammortamenti_svalutazioni) document.getElementById('ammortamenti').value = parsed.ammortamenti_svalutazioni;
  if (parsed.oneri_finanziari) document.getElementById('oneri-finanziari').value = parsed.oneri_finanziari;
  if (parsed.imposte_esercizio) document.getElementById('imposte').value = parsed.imposte_esercizio;
  
  // Scroll to form
  document.getElementById('add-statement-form').scrollIntoView({ behavior: 'smooth' });
  
  // Nascondi preview
  document.getElementById('parsed-data-preview').classList.add('hidden');
}

// Drag & Drop handlers
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('pdf-drop-zone');
  
  if (dropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('border-blue-500', 'bg-blue-100');
      }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('border-blue-500', 'bg-blue-100');
      }, false);
    });
    
    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const input = document.getElementById('pdf-file-input');
        input.files = files;
        handlePDFUpload({ target: input });
      }
    }, false);
  }
});
