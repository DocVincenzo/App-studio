import PyPDF2
import re
import sys
import json

def extract_text_from_pdf(filename):
    """Extract text from PDF using PyPDF2"""
    try:
        with open(filename, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}", file=sys.stderr)
        return ""

def parse_financial_data(text):
    """Parse financial statement data from extracted text"""
    data = {
        'company': 'M.D.L. Srl',
        'date': '30/09/2025',
        'tipo': 'infrannuale',
        'periodo': '9 mesi (gennaio-settembre 2025)',
        'attivo': {},
        'passivo': {},
        'conto_economico': {},
        'note': []
    }
    
    # Helper to extract currency values
    def extract_value(pattern, source_text=None):
        if source_text is None:
            source_text = text
        
        # Try multiple patterns
        patterns = [
            pattern,
            pattern.replace(':', ''),
            pattern.replace('.', ''),
        ]
        
        for p in patterns:
            matches = re.finditer(p, source_text, re.IGNORECASE)
            for match in matches:
                # Extract the number - could be in groups 1, 2, or 3
                for i in range(1, 4):
                    try:
                        num_str = match.group(i)
                        if num_str:
                            # Clean the number
                            cleaned = num_str.strip().replace('.', '').replace(',', '.')
                            # Remove any non-numeric except dots
                            cleaned = re.sub(r'[^\d.]', '', cleaned)
                            if cleaned:
                                return float(cleaned)
                    except:
                        continue
        return None
    
    # ATTIVO - Balance Sheet Assets
    # Try to extract specific line items mentioned in preview
    data['attivo']['immobilizzazioni_finanziarie'] = extract_value(r'IMMOBILIZZAZIONI\s+FINANZIARIE[:\s]+([0-9.,\s]+)')
    data['attivo']['finanziamenti_attivi'] = extract_value(r'FINANZIAM.*?ATTIVI.*?([0-9.,\s]+)')
    data['attivo']['titoli_investimento'] = extract_value(r'TITOLI.*?INVESTIMENTO.*?([0-9.,\s]+)')
    data['attivo']['quote_fondi_comuni'] = extract_value(r'Quote.*?fondi\s+comuni.*?([0-9.,\s]+)')
    data['attivo']['altri_titoli'] = extract_value(r'Altri\s+titoli.*?([0-9.,\s]+)')
    data['attivo']['deposito_intesa'] = extract_value(r'Deposito.*?INTESA.*?([0-9.,\s]+)')
    data['attivo']['titoli_bper'] = extract_value(r'Titoli\s+BPER.*?([0-9.,\s]+)')
    data['attivo']['titoli_widiba'] = extract_value(r'Titoli.*?Widiba.*?([0-9.,\s]+)')
    
    # Standard balance sheet items
    data['attivo']['immobilizzazioni_immateriali'] = extract_value(r'IMMOBILIZZAZIONI\s+IMMATERIALI.*?([0-9.,\s]+)')
    data['attivo']['immobilizzazioni_materiali'] = extract_value(r'IMMOBILIZZAZIONI\s+MATERIALI.*?([0-9.,\s]+)')
    data['attivo']['attivo_circolante'] = extract_value(r'ATTIVO\s+CIRCOLANTE.*?([0-9.,\s]+)')
    data['attivo']['rimanenze'] = extract_value(r'RIMANENZE.*?([0-9.,\s]+)')
    data['attivo']['crediti'] = extract_value(r'CREDITI(?:\s+VERSO\s+CLIENTI)?.*?([0-9.,\s]+)')
    data['attivo']['disponibilita_liquide'] = extract_value(r'DISPONIBILITA.*?LIQUID.*?([0-9.,\s]+)')
    data['attivo']['ratei_risconti_attivi'] = extract_value(r'RATEI\s+E\s+RISCONTI.*?([0-9.,\s]+)')
    data['attivo']['totale_attivo'] = extract_value(r'TOTALE\s+ATTIV[OIA].*?([0-9.,\s]+)')
    
    # PASSIVO - Balance Sheet Liabilities
    data['passivo']['capitale_sociale'] = extract_value(r'CAPITALE\s+SOCIALE.*?([0-9.,\s]+)')
    data['passivo']['riserve'] = extract_value(r'RISERVE.*?([0-9.,\s]+)')
    data['passivo']['utile_perdita_esercizio'] = extract_value(r'UTILE.*?ESERCIZIO.*?([0-9.,\s]+)')
    data['passivo']['patrimonio_netto'] = extract_value(r'PATRIMONIO\s+NETTO.*?([0-9.,\s]+)')
    data['passivo']['fondi_rischi_oneri'] = extract_value(r'FONDI.*?RISCHI.*?([0-9.,\s]+)')
    data['passivo']['tfr'] = extract_value(r'TFR|TRATTAMENTO.*?FINE.*?RAPPORTO.*?([0-9.,\s]+)')
    data['passivo']['debiti'] = extract_value(r'DEBITI(?:\s+VERSO)?.*?([0-9.,\s]+)')
    data['passivo']['ratei_risconti_passivi'] = extract_value(r'RATEI\s+E\s+RISCONTI.*?PASSIV.*?([0-9.,\s]+)')
    data['passivo']['totale_passivo'] = extract_value(r'TOTALE\s+PASSIV[OIA].*?([0-9.,\s]+)')
    
    # CONTO ECONOMICO - Income Statement
    data['conto_economico']['ricavi_vendite'] = extract_value(r'RICAVI.*?VENDITE.*?([0-9.,\s]+)')
    data['conto_economico']['altri_ricavi'] = extract_value(r'ALTRI\s+RICAVI.*?([0-9.,\s]+)')
    data['conto_economico']['valore_produzione'] = extract_value(r'VALORE.*?PRODUZIONE.*?([0-9.,\s]+)')
    data['conto_economico']['costi_materie'] = extract_value(r'COSTI.*?MATERIE.*?([0-9.,\s]+)')
    data['conto_economico']['costi_servizi'] = extract_value(r'COSTI.*?SERVIZI.*?([0-9.,\s]+)')
    data['conto_economico']['costi_personale'] = extract_value(r'COSTI.*?PERSONALE.*?([0-9.,\s]+)')
    data['conto_economico']['ammortamenti'] = extract_value(r'AMMORTAMENT.*?([0-9.,\s]+)')
    data['conto_economico']['oneri_diversi'] = extract_value(r'ONERI\s+DIVERS.*?([0-9.,\s]+)')
    data['conto_economico']['ebit'] = extract_value(r'EBIT.*?([0-9.,\s]+)')
    data['conto_economico']['proventi_finanziari'] = extract_value(r'PROVENTI\s+FINANZIAR.*?([0-9.,\s]+)')
    data['conto_economico']['oneri_finanziari'] = extract_value(r'ONERI\s+FINANZIAR.*?([0-9.,\s]+)')
    data['conto_economico']['risultato_ante_imposte'] = extract_value(r'RISULTATO.*?ANTE.*?IMPOST.*?([0-9.,\s]+)')
    data['conto_economico']['imposte'] = extract_value(r'IMPOSTE.*?([0-9.,\s]+)')
    data['conto_economico']['utile_netto'] = extract_value(r'UTILE.*?NETTO.*?([0-9.,\s]+)')
    
    return data

def compare_with_2024(data):
    """Compare with 2024 annual statement"""
    print("\n" + "=" * 80)
    print("CONFRONTO CON BILANCIO 2024")
    print("=" * 80)
    print("\nDati noti da bilancio 2024 (annuale completo):")
    print("- Immobilizzazioni finanziarie: EUR 437.421,00")
    print("- Capitale Sociale: EUR 92.000,00")
    print("\nDati estratti da bilancio provvisorio 30/09/2025 (9 mesi):")
    
    if data['attivo'].get('immobilizzazioni_finanziarie'):
        immob_fin_2025 = data['attivo']['immobilizzazioni_finanziarie']
        print(f"- Immobilizzazioni finanziarie: EUR {immob_fin_2025:,.2f}")
        variazione = immob_fin_2025 - 437421
        perc = (variazione / 437421) * 100
        print(f"  VARIAZIONE: EUR {variazione:+,.2f} ({perc:+.2f}%)")
    else:
        print("- Immobilizzazioni finanziarie: NON ESTRATTO")
    
    if data['passivo'].get('capitale_sociale'):
        cap_soc_2025 = data['passivo']['capitale_sociale']
        print(f"- Capitale Sociale: EUR {cap_soc_2025:,.2f}")
        if cap_soc_2025 == 92000:
            print("  ✓ CONFERMATO (invariato)")
        else:
            print(f"  ATTENZIONE: Differenza rispetto a 2024")
    else:
        print("- Capitale Sociale: NON ESTRATTO")

def format_report(data):
    """Format extracted data as readable report"""
    report = []
    report.append("=" * 80)
    report.append(f"ANALISI DETTAGLIATA BILANCIO PROVVISORIO - {data['company']}")
    report.append(f"Data riferimento: {data['date']}")
    report.append(f"Periodo: {data['periodo']}")
    report.append(f"Tipo: {data['tipo'].upper()}")
    report.append("=" * 80)
    report.append("")
    
    # Count extracted values
    attivo_count = sum(1 for v in data['attivo'].values() if v is not None)
    passivo_count = sum(1 for v in data['passivo'].values() if v is not None)
    ce_count = sum(1 for v in data['conto_economico'].values() if v is not None)
    
    report.append(f"Valori estratti: {attivo_count} voci ATTIVO, {passivo_count} voci PASSIVO, {ce_count} voci CONTO ECONOMICO")
    report.append("")
    
    report.append("STATO PATRIMONIALE - ATTIVO")
    report.append("-" * 80)
    for key, value in data['attivo'].items():
        if value is not None:
            label = key.replace('_', ' ').title()
            report.append(f"{label:.<50} EUR {value:>15,.2f}")
    if attivo_count == 0:
        report.append("  (Nessun valore estratto)")
    report.append("")
    
    report.append("STATO PATRIMONIALE - PASSIVO E PATRIMONIO NETTO")
    report.append("-" * 80)
    for key, value in data['passivo'].items():
        if value is not None:
            label = key.replace('_', ' ').title()
            report.append(f"{label:.<50} EUR {value:>15,.2f}")
    if passivo_count == 0:
        report.append("  (Nessun valore estratto)")
    report.append("")
    
    if ce_count > 0:
        report.append("CONTO ECONOMICO")
        report.append("-" * 80)
        for key, value in data['conto_economico'].items():
            if value is not None:
                label = key.replace('_', ' ').title()
                report.append(f"{label:.<50} EUR {value:>15,.2f}")
        report.append("")
    
    report.append("=" * 80)
    return "\n".join(report)

if __name__ == '__main__':
    filename = 'MDL_BILANCIO_PROVVISORIO_30_09_2025.pdf'
    
    print("Estrazione testo dal PDF con PyPDF2...", file=sys.stderr)
    text = extract_text_from_pdf(filename)
    
    if len(text) < 100:
        print("ERRORE: Testo estratto insufficiente", file=sys.stderr)
        print(f"Lunghezza: {len(text)} caratteri", file=sys.stderr)
        sys.exit(1)
    
    print(f"Testo estratto: {len(text)} caratteri", file=sys.stderr)
    
    # Save extracted text for debugging
    with open('interim_extracted_text_pypdf2.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Testo salvato in: interim_extracted_text_pypdf2.txt", file=sys.stderr)
    
    print("\nParsing dati finanziari...", file=sys.stderr)
    data = parse_financial_data(text)
    
    # Print formatted report
    print("\n" + format_report(data))
    
    # Comparison with 2024
    compare_with_2024(data)
    
    # Save as JSON
    with open('interim_data_extracted.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\nDati salvati in: interim_data_extracted.json", file=sys.stderr)
