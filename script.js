/* ========================================
   Kündigungsgenerator - JavaScript v2.0
   ======================================== */

let selectedVertrag = null;
let heute = new Date().toISOString().split('T')[0];
const kuendDatum = document.getElementById('kuendigungsdatum');
if (kuendDatum) { kuendDatum.min = heute; }

// ========================================
// EVENT LISTENER
// ========================================
document.getElementById('grund').addEventListener('change', function() {
    document.getElementById('grundSonstDiv').classList.toggle('hidden', this.value !== 'Sonstiges');
});
document.getElementById('sonderkuendigung').addEventListener('change', function() {
    document.getElementById('sonderFristDiv').classList.toggle('hidden', !this.checked);
});

// ========================================
// DARK MODE
// ========================================
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    darkToggle.textContent = '☀️';
}
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    darkToggle.textContent = isDark ? '☀️' : '🌙';
});

// ========================================
// VERTRAGSART
// ========================================
function selectVertrag(type) {
    document.querySelectorAll('.vertrag-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.vertrag-btn[data-type="${type}"]`);
    if (btn) btn.classList.add('active');
    selectedVertrag = type;
    document.getElementById('vertragError').style.display = 'none';
    showSteps();
}

function showSteps() {
    if (selectedVertrag) {
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('step3').classList.remove('hidden');
        document.getElementById('step4').classList.remove('hidden');
        document.getElementById('stepAction').classList.remove('hidden');
        document.getElementById('progressBar').classList.add('visible');
        updateProgress(1);
        setTimeout(() => { window.scrollTo({ top: document.querySelector('.form').offsetTop - 100, behavior: 'smooth' }); }, 300);
    }
}

function updateProgress(step) {
    const fill = document.getElementById('progressFill');
    const pct = ((step) / 4) * 100;
    fill.style.width = pct + '%';
    document.querySelectorAll('.prog-step').forEach(el => {
        const s = parseInt(el.dataset.step);
        el.classList.toggle('active', s <= step);
    });
}

// Form Step Tracking
document.querySelectorAll('#step2 input, #step2 select').forEach(el => {
    el.addEventListener('change', () => updateProgress(2));
    el.addEventListener('input', () => updateProgress(2));
});
document.querySelectorAll('#step3 input').forEach(el => {
    el.addEventListener('change', () => updateProgress(3));
    el.addEventListener('input', () => updateProgress(3));
});
document.querySelectorAll('#step4 input, #step4 select').forEach(el => {
    el.addEventListener('change', () => updateProgress(4));
});

// ========================================
// VERTRAGSNAME
// ========================================
function getVertragName(type) {
    const names = {
        handy: 'Handyvertrag',
        strom: 'Strom-/Gasvertrag',
        fitness: 'Fitnessstudio-Vertrag',
        internet: 'Internet-/DSL-Vertrag',
        versicherung: 'Versicherungsvertrag',
        abo: 'Abo / Mitgliedschaft',
        miete: 'Mietvertrag',
        kreditkarte: 'Kreditkartenvertrag',
        gez: 'GEZ / Rundfunkbeitrag',
        mobilfunk: 'Mobilfunkvertrag',
        dazn: 'Sport-Streaming-Abo',
        zeitung: 'Zeitungs-/Zeitschriften-Abo',
        sonstige: 'Vertrag'
    };
    return names[type] || 'Vertrag';
}

// ========================================
// FORMULAR SUBMIT
// ========================================
document.getElementById('kuendigungsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!selectedVertrag) {
        document.getElementById('vertragError').style.display = 'block';
        document.getElementById('vertragError').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    generateLetter();
});

function generateLetter() {
    const vorname = document.getElementById('vorname').value.trim();
    const nachname = document.getElementById('nachname').value.trim();
    if (!vorname || !nachname) { alert('Bitte geben Sie Ihren Vor- und Nachnamen ein.'); return; }

    const anrede = document.getElementById('anrede').value;
    const strasse = document.getElementById('strasse').value.trim();
    const plz = document.getElementById('plz').value.trim();
    const ort = document.getElementById('ort').value.trim();
    const email = document.getElementById('email').value.trim();
    const empfaenger = document.getElementById('empfaenger').value.trim();
    const e_str = document.getElementById('empfaenger_strasse').value.trim();
    const e_plz = document.getElementById('empfaenger_plz').value.trim();
    const e_ort = document.getElementById('empfaenger_ort').value.trim();
    const vnr = document.getElementById('vertragsnummer').value.trim();
    const kdatum = document.getElementById('kuendigungsdatum').value;
    const vende = document.getElementById('vertragsende').value;
    const grund = document.getElementById('grund').value;
    const gsonst = document.getElementById('grundSonstig').value.trim();
    const sonder = document.getElementById('sonderkuendigung').checked;
    const sfrist = document.getElementById('sonderFrist').value;

    const vName = getVertragName(selectedVertrag);
    const today = new Date();
    const ortDate = strasse ? `${ort}, den ${today.toLocaleDateString('de-DE')}` : `Den ${today.toLocaleDateString('de-DE')}`;

    // Anrede
    let anredeTxt = 'Sehr geehrte Damen und Herren,';
    if (anrede === 'Herrn') anredeTxt = 'Sehr geehrter Herr ' + nachname + ',';
    else if (anrede === 'Frau') anredeTxt = 'Sehr geehrte Frau ' + nachname + ',';
    else if (anrede && anrede !== 'Herrn' && anrede !== 'Frau') anredeTxt = 'Sehr geehrte/r ' + anrede + ' ' + nachname + ',';

    // Empfänger
    let empfAdr = empfaenger;
    if (e_str) empfAdr += '\n' + e_str;
    if (e_plz && e_ort) empfAdr += '\n' + e_plz + ' ' + e_ort;

    // Datum
    const kDatumFmt = new Date(kdatum + 'T12:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });

    // Grund
    let grundText = '';
    if (sonder) {
        grundText = '\n\nIch mache von meinem Sonderkündigungsrecht Gebrauch.';
        if (grund) grundText += '\nGrund: ' + (grund === 'Sonstiges' ? gsonst : grund);
    } else if (grund) {
        grundText = '\n\nKündigungsgrund: ' + (grund === 'Sonstiges' ? gsonst : grund);
    }

    let vendeText = '';
    if (vende) vendeText = '\n\n(Mein Vertrag läuft planmäßig am ' + new Date(vende + 'T12:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) + '.)';

    let sfristText = '';
    if (sonder && sfrist) sfristText = '\nIch bitte um Bestätigung, dass die Kündigung spätestens zum ' + new Date(sfrist + 'T12:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) + ' wirksam wird.';

    const betreff = 'Kündigung meines ' + vName + (vnr ? ' (Vertrags-Nr.: ' + vnr + ')' : '');

    const brief = `
        <div class="brief-content">
            <div class="brief-header">
                <div class="brief-absender">${vorname} ${nachname}${strasse ? ', ' + strasse : ''}${plz && ort ? ', ' + plz + ' ' + ort : ''}</div>
                <div class="brief-empfaenger">${empfAdr.replace(/\n/g, '<br>')}</div>
                <div class="brief-betreff">${betreff}</div>
            </div>
            <div class="brief-body">
                <p class="brief-anrede">${anredeTxt}</p>
                <p>hiermit kündige ich den oben genannten ${vName} fristgerecht zum ${kDatumFmt}.${grundText}${vendeText}${sfristText}</p>
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

    document.getElementById('briefContainer').innerHTML = brief;
    document.getElementById('ergebnis').classList.remove('hidden');
    document.getElementById('ergebnis').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('kuendigungsForm').classList.add('hidden');
    document.getElementById('progressBar').classList.remove('visible');
    updateProgress(4);
}

// ========================================
// PDF DOWNLOAD
// ========================================
function downloadPDF() {
    const element = document.getElementById('briefContainer');
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Generiere PDF...';
    btn.disabled = true;

    const opt = {
        margin:       [15, 15, 15, 15],
        filename:     'kuendigung.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }).catch(() => {
        alert('PDF-Fehler. Nutzen Sie "Drucken" als Alternative.');
        btn.textContent = originalText;
        btn.disabled = false;
    });
}

// ========================================
// KOPIEREN
// ========================================
function copyText() {
    const text = document.getElementById('briefContainer').textContent || document.getElementById('briefContainer').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Kündigungstext wurde kopiert!');
    }).catch(() => {
        const range = document.createRange();
        range.selectNode(document.getElementById('briefContainer'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        alert('✅ Kündigungstext wurde kopiert!');
    });
}

// ========================================
// NEU ERSTELLEN
// ========================================
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
    document.getElementById('progressBar').classList.remove('visible');
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('kuendigungsForm').reset();
    document.getElementById('grundSonstDiv').classList.add('hidden');
    document.getElementById('sonderFristDiv').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// DEFAULT DATUM
// ========================================
if (kuendDatum) {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);
    kuendDatum.value = defaultDate.toISOString().split('T')[0];
}
