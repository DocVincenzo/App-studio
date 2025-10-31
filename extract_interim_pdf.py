import re
import sys

def extract_text_from_pdf(filename):
    """Extract text from PDF binary"""
    try:
        with open(filename, 'rb') as f:
            pdf_bytes = f.read()
        
        # Convert to string looking for ASCII text patterns
        text = ''
        for byte in pdf_bytes:
            if (32 <= byte <= 126) or byte in (10, 13):
                text += chr(byte)
        
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}", file=sys.stderr)
        return ""

def parse_financial_data(text):
    """Parse financial statement data from extracted text"""
    data = {
        'company': '',
        'date': '30/09/2025',
        'tipo': 'infrannuale',
        'periodo': '9 mesi',
        'attivo': {},
        'passivo': {},
        'conto_economico': {}
    }
    
    # Extract company info
    company_match = re.search(r'M\.D\.L\.\s*srl', text, re.IGNORECASE)
    if company_match:
        data['company'] = 'M.D.L. Srl'
    
    # Extract financial values (looking for patterns like "123.456,78" or "123.456")
    def find_value(pattern):
        match = re.search(pattern, text)
        if match:
            value_str = match.group(1).replace('.', '').replace(',', '.')
            try:
                return float(value_str)
            except:
                return None
        return None
    
    # ATTIVO - Balance Sheet Assets
    data['attivo']['immobilizzazioni_finanziarie'] = find_value(r'IMMOBILIZZAZIONI\s+FINANZIARIE[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['finanziamenti_attivi'] = find_value(r'FINANZIAM[.\s]+ATTIVI[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['titoli_investimento'] = find_value(r'TITOLI\s+D.INVESTIMENTO[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['quote_fondi_comuni'] = find_value(r'Quote\s+(?:di\s+)?fondi\s+comuni[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['altri_titoli'] = find_value(r'Altri\s+titoli[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['deposito_intesa'] = find_value(r'Deposito[^:]*INTESA[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['titoli_bper'] = find_value(r'Titoli\s+BPER[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['titoli_widiba'] = find_value(r'Titoli\s+(?:Banca\s+)?Widiba[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    
    # Look for more accounts
    data['attivo']['attivo_circolante'] = find_value(r'ATTIVO\s+CIRCOLANTE[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['disponibilita_liquide'] = find_value(r'DISPONIBILITA.?\s+LIQUIDE[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['crediti'] = find_value(r'CREDITI[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['attivo']['totale_attivo'] = find_value(r'TOTALE\s+ATTIV[OA][:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    
    # PASSIVO - Balance Sheet Liabilities
    data['passivo']['patrimonio_netto'] = find_value(r'PATRIMONIO\s+NETTO[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['passivo']['capitale_sociale'] = find_value(r'CAPITALE\s+SOCIALE[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['passivo']['riserve'] = find_value(r'RISERVE[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['passivo']['utile_perdita'] = find_value(r'UTILE\s+(?:\(PERDITA\))?[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['passivo']['debiti'] = find_value(r'DEBITI[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['passivo']['totale_passivo'] = find_value(r'TOTALE\s+PASSIV[OA][:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    
    # CONTO ECONOMICO - Income Statement
    data['conto_economico']['ricavi'] = find_value(r'RICAVI[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['conto_economico']['costi_produzione'] = find_value(r'COSTI\s+(?:DELLA\s+)?PRODUZIONE[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['conto_economico']['proventi_finanziari'] = find_value(r'PROVENTI\s+FINANZIARI[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    data['conto_economico']['oneri_finanziari'] = find_value(r'ONERI\s+FINANZIARI[:\s]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)')
    
    return data

def format_report(data):
    """Format extracted data as readable report"""
    report = []
    report.append("=" * 80)
    report.append(f"ANALISI BILANCIO PROVVISORIO - {data['company']}")
    report.append(f"Data: {data['date']} ({data['periodo']})")
    report.append(f"Tipo: {data['tipo'].upper()}")
    report.append("=" * 80)
    report.append("")
    
    report.append("STATO PATRIMONIALE - ATTIVO")
    report.append("-" * 80)
    for key, value in data['attivo'].items():
        if value is not None:
            label = key.replace('_', ' ').title()
            report.append(f"{label:.<50} EUR {value:>15,.2f}")
    report.append("")
    
    report.append("STATO PATRIMONIALE - PASSIVO")
    report.append("-" * 80)
    for key, value in data['passivo'].items():
        if value is not None:
            label = key.replace('_', ' ').title()
            report.append(f"{label:.<50} EUR {value:>15,.2f}")
    report.append("")
    
    if any(v is not None for v in data['conto_economico'].values()):
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
    
    print("Estrazione testo dal PDF...", file=sys.stderr)
    text = extract_text_from_pdf(filename)
    
    if len(text) < 100:
        print("ERRORE: Testo estratto insufficiente", file=sys.stderr)
        sys.exit(1)
    
    print(f"Testo estratto: {len(text)} caratteri", file=sys.stderr)
    
    print("\nParsing dati finanziari...", file=sys.stderr)
    data = parse_financial_data(text)
    
    print("\n" + format_report(data))
    
    # Also save raw extracted text for debugging
    with open('interim_extracted_text.txt', 'w') as f:
        f.write(text)
    print("\nTesto completo salvato in: interim_extracted_text.txt", file=sys.stderr)
