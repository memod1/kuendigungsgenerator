/* ========================================
   Kündigungsgenerator - JavaScript
   ======================================== */

let selectedVertrag = null;
let heute = new Date().toISOString().split('T')[0];
document.getElementById('kuendigungsdatum').min = heute;

// Event-Listener für Grund-Auswahl
document.getElementById('grund').addEventListener('change', function() {
    document.getElementById('grundSonstDiv').classList.toggle('hidden', this.value !== 'Sonstiges');
});

// Event-Listener für Sonderkündigung
document.getElementById('sonderkuendigung').addEventListener('change', function() {
    document.getElementById('sonderFristDiv').classList.toggle('hidden', !this.checked);
});

// Vertragsart auswählen
function selectVertrag(type) {
    // Remove active from all
    document.querySelectorAll('.vertrag-btn').forEach(b => b.classList.remove('active'));
    // Add active to selected
    const btn = document.querySelector(`.vertrag-btn[data-type="${type}"]`);
    if (btn) btn.classList.add('active');
    
    selectedVertrag = type;
    document.getElementById('vertragError').style.display = 'none';
    
    // Show steps
    showSteps();
}

// Nächste Schritte anzeigen
function showSteps() {
    if (selectedVertrag) {
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('step3').classList.remove('hidden');
        document.getElementById('step4').classList.remove('hidden');
        document.getElementById('stepAction').classList.remove('hidden');
    }
}

// Vertragsname holen
function getVertragName(type) {
    const names = {
        handy: 'Handyvertrag',
        strom: 'Strom-/Gasvertrag',
        fitness: 'Fitnessstudio-Vertrag',
        internet: 'Internet-/DSL-Vertrag',
        versicherung: 'Versicherungsvertrag',
        abo: 'Abo / Mitgliedschaft',
        miete: 'Mietvertrag',
        sonstige: 'Vertrag'
    };
    return names[type] || 'Vertrag';
}

// Formular-Submit
document.getElementById('kuendigungsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validierung
    if (!selectedVertrag) {
        document.getElementById('vertragError').style.display = 'block';
        return;
    }
    
    const vorname = document.getElementById('vorname').value.trim();
    const nachname = document.getElementById('nachname').value.trim();
    if (!vorname || !nachname) {
        alert('Bitte geben Sie Ihren Vor- und Nachnamen ein.');
        return;
    }
    
    // Brief generieren
    generateLetter();
});

function generateLetter() {
    const vorname = document.getElementById('vorname').value.trim();
    const nachname = document.getElementById('nachname').value.trim();
    const anrede = document.getElementById('anrede').value;
    const strasse = document.getElementById('strasse').value.trim();
    const plz = document.getElementById('plz').value.trim();
    const ort = document.getElementById('ort').value.trim();
    const email = document.getElementById('email').value.trim();
    const empfaenger = document.getElementById('empfaenger').value.trim();
    const empfaenger_str = document.getElementById('empfaenger_strasse').value.trim();
    const empfaenger_plz = document.getElementById('empfaenger_plz').value.trim();
    const empfaenger_ort = document.getElementById('empfaenger_ort').value.trim();
    const vertragsnummer = document.getElementById('vertragsnummer').value.trim();
    const kuendigungsdatum = document.getElementById('kuendigungsdatum').value;
    const vertragsende = document.getElementById('vertragsende').value;
    const grund = document.getElementById('grund').value;
    const grundSonstig = document.getElementById('grundSonstig').value.trim();
    const sonderkuendigung = document.getElementById('sonderkuendigung').checked;
    const sonderFrist = document.getElementById('sonderFrist').value;

    const vertragName = getVertragName(selectedVertrag);
    const today = new Date();
    const ortDate = strasse ? `${ort}, den ${today.toLocaleDateString('de-DE')}` : `Den ${today.toLocaleDateString('de-DE')}`;
    
    // Anrede formatieren
    const anredeFormatiert = anrede ? ['Herrn', 'Frau'].includes(anrede) ? `Sehr geehrte${anrede === 'Herrn' ? 'r' : ''} ${anrede === 'Frau' ? 'Frau' : 'Herr'} ${nachname}` : `Sehr geehrte${anrede ? 'r' : ''} ${anrede ? anrede + ' ' : ''}${nachname}` : `Sehr geehrte${['Herrn', 'Frau'].includes(anrede) ? '' : ''}`;
    
    // Kündigungsgrund
    let grundText = '';
    if (sonderkuendigung) {
        grundText = '\n\nIch mache von meinem Sonderkündigungsrecht Gebrauch.';
        if (grund && grund !== '') {
            grundText += `\nGrund: ${grund === 'Sonstiges' ? grundSonstig : grund}`;
        }
    } else if (grund && grund !== '') {
        grundText = `\n\nKündigungsgrund: ${grund === 'Sonstiges' ? grundSonstig : grund}`;
    }
    
    // Empfänger-Adresse bauen
    let empfaengerAdr = empfaenger;
    if (empfaenger_str) empfaengerAdr += `\n${empfaenger_str}`;
    if (empfaenger_plz && empfaenger_ort) empfaengerAdr += `\n${empfaenger_plz} ${empfaenger_ort}`;

    // Datum formatieren
    const kuendDatumFormatiert = new Date(kuendigungsdatum + 'T12:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let vertragsendeText = '';
    if (vertragsende) {
        vertragsendeText = `\n\n(Mein Vertrag läuft planmäßig am ${new Date(vertragsende + 'T12:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}. Ich bitte um Bestätigung des Beendigungszeitpunkts.)`;
    }

    let sonderFristText = '';
    if (sonderkuendigung && sonderFrist) {
        sonderFristText = `\nIch bitte um Bestätigung, dass die außerordentliche Kündigung zum nächstmöglichen Zeitpunkt, spätestens jedoch zum ${new Date(sonderFrist + 'T12:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })} wirksam wird.`;
    }

    // Brief HTML
    const brief = `
        <div class="brief-container">
            <div class="brief-header">
                <div class="brief-absender">
                    ${vorname} ${nachname}${strasse ? `, ${strasse}` : ''}${plz && ort ? `, ${plz} ${ort}` : ''}
                </div>
                <div class="brief-empfaenger">
                    ${empfaengerAdr.replace(/\n/g, '<br>')}
                </div>
                <div class="brief-betreff">
                    Kündigung meines ${vertragName}${vertragsnummer ? ` (Vertrags-Nr.: ${vertragsnummer})` : ''}
                </div>
            </div>
            <div class="brief-body">
                <p class="brief-anrede">${anredeFormatiert},</p>
                <p>hiermit kündige ich den oben genannten ${vertragName} fristgerecht zum ${kuendDatumFormatiert}.${grundText}${vertragsendeText}${sonderFristText}</p>
                <p>Bitte bestätigen Sie mir den Eingang dieser Kündigung sowie den Beendigungszeitpunkt schriftlich.</p>
            </div>
            <div class="brief-footer">
                <p class="brief-ort">${ortDate}</p>
                <div class="brief-unterschrift">
                    <div class="unterschrift-linie"></div>
                    <p>_________________________<br>${vorname} ${nachname}</p>
                </div>
            </div>
        </div>
    `;

    // Ergebnis anzeigen
    const ergebnisDiv = document.getElementById('ergebnis');
    const briefContainer = document.getElementById('briefContainer');
    briefContainer.innerHTML = brief;
    ergebnisDiv.classList.remove('hidden');
    
    // Zum Ergebnis scrollen
    ergebnisDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Formular ausblenden
    document.getElementById('kuendigungsForm').classList.add('hidden');
}

// Text kopieren
function copyText() {
    const container = document.getElementById('briefContainer');
    const text = container.textContent || container.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Kündigungstext wurde kopiert!');
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNode(container);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        alert('Kündigungstext wurde kopiert!');
    });
}

// Neue Kündigung
function neuErstellen() {
    document.getElementById('ergebnis').classList.add('hidden');
    document.getElementById('kuendigungsForm').classList.remove('hidden');
    selectedVertrag = null;
    document.querySelectorAll('.vertrag-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step4').classList.add('hidden');
    document.getElementById('stepAction').classList.add('hidden');
    document.getElementById('vertragError').style.display = 'none';
    
    // Formular zurücksetzen
    document.getElementById('kuendigungsForm').reset();
    document.getElementById('grundSonstDiv').classList.add('hidden');
    document.getElementById('sonderFristDiv').classList.add('hidden');
    
    // Zum Anfang scrollen
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Aktuelles Datum als Standard
if (document.getElementById('kuendigungsdatum')) {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);
    document.getElementById('kuendigungsdatum').value = defaultDate.toISOString().split('T')[0];
}
