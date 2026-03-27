/**
 * DRONE BUILDER - SMART CONFIGURATION ENGINE (INR VERSION)
 */

// 1. SMART COMPATIBILITY CATALOG
// This ensures "Racing" never shows "10 inch" and "Agriculture" never shows "3 inch".
const SMART_CATALOG = {
    "Racing": {
        sizes: ["3 inch", "4 inch", "5 inch"],
        models: [
            { name: "TBS Source One V5 Carbon", price: 5430 },
            { name: "iFlight Nazgul5 V3 Carbon", price: 7430 },
            { name: "Armattan Chameleon Ti", price: 10020 }
        ]
    },
    "Freestyle": {
        sizes: ["5 inch", "6 inch"],
        models: [
            { name: "iFlight Nazgul5 V3 Carbon", price: 7430 },
            { name: "Armattan Chameleon Ti", price: 10020 }
        ]
    },
    "Cinematic": {
        sizes: ["3 inch (CineWhoop)", "5 inch", "7 inch (Long Range)"],
        models: [
            { name: "GEPRC Cinelog 35", price: 8200 },
            { name: "iFlight Nazgul5 V3 Carbon", price: 7430 },
            { name: "Custom 3D Print PLA", price: 1840 }
        ]
    },
    "Agriculture": {
        sizes: ["10+ inch (Heavy Lift)"],
        models: [
            { name: "Tarot X6 Heavy Lift", price: 15030 },
            { name: "DJI F450 Aluminum", price: 4590 }
        ]
    },
    "Prototype": {
        sizes: ["3 inch", "5 inch", "7 inch", "10+ inch"],
        models: [
            { name: "Custom 3D Print PLA", price: 1840 },
            { name: "DJI F450 Aluminum", price: 4590 }
        ]
    }
};

const FIELDS = [
    { id: 'f-model', cat: 'Cat 1', label: 'Frame' },
    { id: 'm-model', cat: 'Cat 2', label: 'Motor' },
    { id: 'p-model', cat: 'Cat 2', label: 'Propeller' },
    { id: 'e-model', cat: 'Cat 3', label: 'ESC' },
    { id: 'fc', cat: 'Cat 3', label: 'FC' },
    { id: 'b-model', cat: 'Cat 4', label: 'Battery' },
    { id: 'gps', cat: 'Cat 5', label: 'GPS', or: true },
    { id: 'cam', cat: 'Cat 5', label: 'Camera', or: true },
    { id: 'vtx-model', cat: 'Cat 5', label: 'VTX', or: true },
];

// 2. DYNAMIC FILTERING (The "Smart" part)
function filterOptions() {
    const typeSelect = document.getElementById('f-type');
    const selectedType = typeSelect.value.split('|')[0];
    
    const sizeSelect = document.getElementById('f-size');
    const modelSelect = document.getElementById('f-model');

    // If no type is selected, reset and return
    if (!selectedType || !SMART_CATALOG[selectedType]) {
        sizeSelect.innerHTML = '<option value="">— Select frame type first —</option>';
        modelSelect.innerHTML = '<option value="">— Select frame type first —</option>';
        return;
    }

    const data = SMART_CATALOG[selectedType];

    // Inject ONLY compatible sizes
    sizeSelect.innerHTML = '<option value="">— Select relevant size —</option>';
    data.sizes.forEach(size => {
        sizeSelect.innerHTML += `<option value="${size}|0">${size}</option>`;
    });

    // Inject ONLY compatible models with formatted INR prices
    modelSelect.innerHTML = '<option value="">— Select relevant model —</option>';
    data.models.forEach(m => {
        modelSelect.innerHTML += `<option value="${m.name}|${m.price}">${m.name} – ₹${m.price.toLocaleString('en-IN')}</option>`;
    });

    // Smart Auto-selection (Selects first valid option automatically)
    if (data.sizes.length > 0) sizeSelect.selectedIndex = 1;
    if (data.models.length > 0) modelSelect.selectedIndex = 1;

    upd(); // Trigger cost and UI refresh
}

// 3. MAIN CALCULATION ENGINE
function upd() {
    const comps = [];
    let total = 0, n = 0;

    // Determine motor count multiplier (4 for Quad, 6 for Hexa, etc.)
    const dTypeSelect = document.getElementById('d-type');
    const motorCount = dTypeSelect.value ? (parseInt(dTypeSelect.value.split('|')[1]) / 30) : 4;

    FIELDS.forEach(f => {
        const el = document.getElementById(f.id);
        if (!el || !el.value) return;
        
        const txt = el.options[el.selectedIndex].text;
        
        // Extract price from formatted string like "₹7,430"
        const match = txt.match(/₹([0-9,]+)/);
        let price = match ? parseInt(match[1].replace(/,/g, '')) : 0;

        // Smart Scaling: Multiply price if it's a Motor or Propeller
        if (f.id === 'm-model') price *= Math.floor(motorCount);
        if (f.id === 'p-model') price *= Math.floor(motorCount / 2);

        comps.push({ cat: f.cat, label: f.label, name: txt.split(' – ')[0], price, or: f.or });
        total += price;
        n++;
    });

    // Update Selected Components UI
    const cl = document.getElementById('clist');
    cl.innerHTML = comps.length ? comps.map((c, i) => `
        <div class="ci" style="animation: pI .3s both ${i * .04}s">
            <div class="cd${c.or ? ' or' : ''}"></div>
            <span class="ccat">${c.cat}</span>
            <span class="cnm">${c.label}: ${c.name}</span>
            <span class="cprc">${c.price ? formatINR(c.price) : '—'}</span>
        </div>`).join('') : '<div class="ehint"><span class="ei">🚁</span>Configure your drone to see parts</div>';

    // Estimate Stats
    const weight = n ? 160 + (n * 55) : 0;
    const time = n >= 4 ? Math.min(38, 3 + (n * 3)) : 0;
    const speed = n >= 3 ? Math.min(150, 10 + (n * 13)) : 0;

    // Sync all price displays
    const formattedTotal = formatINR(total);
    setVal('t-val', formattedTotal);
    setVal('sv-w', weight ? weight + 'g' : '—');
    setVal('sv-t', time ? time.toFixed(0) + ' min' : '—');
    setVal('sv-s', speed ? speed.toFixed(0) + ' km/h' : '—');
    setVal('sv-c', formattedTotal);
    
    setVal('h-w', weight ? weight + 'g' : '—');
    setVal('h-t', time ? time.toFixed(0) + ' min' : '—');
    setVal('h-s', speed ? speed.toFixed(0) + ' km/h' : '—');
    setVal('h-c', formattedTotal);

    // Update Progress Bars (Scaled for INR ~₹1.5 Lakh)
    setBar('sb-w', Math.min(100, weight / 10));
    setBar('sb-t', Math.min(100, (time / 38) * 100));
    setBar('sb-s', Math.min(100, (speed / 150) * 100));
    setBar('sb-c', Math.min(100, (total / 150000) * 100));
}

// 4. UTILITIES & UI
function formatINR(num) {
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    }).format(num);
}

function setVal(id, v) { document.getElementById(id).textContent = v; }
function setBar(id, pct) { document.getElementById(id).style.width = pct + '%'; }

function tog(id) {
    const section = document.getElementById(id);
    section.classList.toggle('open');
    section.querySelector('.sarr').textContent = section.classList.contains('open') ? '▲' : '▼';
}

// Background Star Generator
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 130; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.4 + .4;
    star.className = 'star';
    star.style.cssText = `width:${size}px; height:${size}px; top:${Math.random() * 100}%; left:${Math.random() * 100}%; --d:${2 + Math.random() * 5}s; --dl:${Math.random() * 5}s`;
    starsContainer.appendChild(star);
}

function buildDrone() {
    if (document.getElementById('clist').querySelector('.ehint')) return showToast('⚠️', 'Select parts first!');
    showToast('🚀', 'Build report generated successfully!');
}

function showToast(icon, msg) {
    document.getElementById('t-icon').textContent = icon;
    document.getElementById('t-msg').textContent = msg;
    const t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

window.onload = upd;
