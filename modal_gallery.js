
function tutupModal() {
    var m = document.getElementById('artModal');
    if (m) m.classList.remove('active');
    if (window.history && window.history.pushState) {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
}

function openDetail(rawId) {
    var targetId = String(rawId || '').trim();
    if (!targetId) return;

    var item = null;
    if (typeof catalogData !== 'undefined' && Array.isArray(catalogData)) {
        item = catalogData.find(function(x) { return String(x.ID || x.id || '').trim() === targetId; });
    }
    if (!item && typeof rawCatalog !== 'undefined' && Array.isArray(rawCatalog)) {
        item = rawCatalog.find(function(x) { return String(x.ID || x.id || '').trim() === targetId; });
    }
    if (!item) return;

    var id = item.ID || item.id || targetId;
    var judul = item.Judul || item.judul || '';
    var tahun = item.Tahun || item.tahun || '2026';
    var media = item.Media || item.media || '';
    var ukuran = item.Ukuran || item.ukuran || '';
    var fileName = item.gambar || item.file || '';
    var imgSrc = 'assets/' + fileName;
    var pageUrl = window.location.origin + '/#' + id;
    var imgFull = window.location.origin + '/assets/' + fileName;
    var kuratorial = item.deskripsi_kuratorial || item.deskripsi || '';
    var statement = item.artist_statement_id || item.statement || '';

    var mailSub = encodeURIComponent('[Private Viewing] ' + judul + ' - Maruto Septriono');
    var mailBody = encodeURIComponent('Yth. Rekan,\n\nSilakan tinjau rincian kuratorial karya "' + judul + '" melalui tautan resmi:\n' + pageUrl + '\n\nSalam hangat,\nMaruto Septriono');
    var pinUrl = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(pageUrl) + '&media=' + encodeURIComponent(imgFull) + '&description=' + encodeURIComponent(judul);

    var html = '';
    html += '<img src="' + imgSrc + '" alt="' + judul.replace(/"/g, '&quot;') + '">';
    html += '<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem; color:#aaa;">';
    html += '<span style="background:rgba(255,255,255,0.1); padding:3px 8px; border-radius:4px; color:#fff;">' + id + '</span>';
    html += '<span>' + tahun + '</span>';
    html += '</div>';
    html += '<h2 style="font-size:1.5rem; margin:6px 0; color:#fff;">' + judul + '</h2>';
    html += '<p style="color:#888; font-size:0.9rem; margin-bottom:14px;">' + ukuran + ' • ' + media + '</p>';

    if (statement) {
        html += '<div style="background:rgba(255,255,255,0.04); border-left:3px solid #ff4d4f; padding:10px 14px; margin-bottom:15px; font-style:italic; font-size:0.9rem; color:#ddd;">"' + statement + '"</div>';
    }

    if (kuratorial) {
        html += '<div style="line-height:1.6; font-size:0.95rem; color:#ccc; margin-bottom:20px;">';
        html += '<strong style="display:block; color:#fff; margin-bottom:4px;">Catatan Kuratorial:</strong>';
        html += kuratorial;
        html += '</div>';
    }

    html += '<div class="share-row">';
    html += '<span style="font-size:0.85rem; color:#999; margin-right:4px;">Bagikan:</span>';
    html += '<a class="btn-action pin" href="' + pinUrl + '" target="_blank" rel="noopener">📌 Pinterest</a>';
    html += '<button type="button" class="btn-action ig" id="btnShareIg">📸 DM Instagram</button>';
    html += '<a class="btn-action mail" href="mailto:?subject=' + mailSub + '&body=' + mailBody + '">✉️ Email</a>';
    html += '<button type="button" class="btn-action copy" id="btnShareCopy">📋 Salin Link</button>';
    html += '</div>';

    var bodyEl = document.getElementById('artModalBody');
    var modalEl = document.getElementById('artModal');
    if (bodyEl && modalEl) {
        bodyEl.innerHTML = html;
        modalEl.classList.add('active');
        window.location.hash = id;

        // Pasang event listener tombol salin & IG tanpa string escaping inline
        document.getElementById('btnShareIg').onclick = function() {
            var msg = 'Lihat karya "' + judul + '" oleh Maruto Septriono: ' + pageUrl;
            navigator.clipboard.writeText(msg).then(function() {
                alert('Teks & tautan karya berhasil disalin!\nSilakan paste (Ctrl+V) di DM Instagram.');
                window.open('https://www.instagram.com/direct/inbox/', '_blank');
            });
        };
        document.getElementById('btnShareCopy').onclick = function() {
            navigator.clipboard.writeText(pageUrl).then(function() {
                alert('Tautan karya berhasil disalin ke clipboard!');
            });
        };
    }
}

// Inisialisasi Event Listener
document.addEventListener('DOMContentLoaded', function() {
    var m = document.getElementById('artModal');
    if (m) {
        m.addEventListener('click', function(e) {
            if (e.target === m) tutupModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') tutupModal();
    });

    if (window.location.hash) {
        var h = window.location.hash.replace('#', '').trim();
        if (h) setTimeout(function() { openDetail(h); }, 400);
    }
});
