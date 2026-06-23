// Product Editor content helpers (admin panel).
//
// The contribution-product `description` and `service_info` columns are stored as
// HTML and rendered on the customer site via toSafeHtml() (an allowlist sanitizer
// that STRIPS HTML comments). To give the admin a structured editor (About =
// headline + body; Service Info = comparison tiers + "What's included" features)
// while keeping the customer site rendering unchanged, we:
//
//   - compose the structured data into clean semantic HTML (h3/p/h4/ul/li/strong)
//   - prepend a hidden  <!--CHPED:base64(json)-->  marker so the editor can reload
//     the exact structured values on edit. The marker is invisible on the customer
//     site because the sanitizer removes comment nodes.
//
// Legacy products (authored with the old rich-text editor, no marker) are NOT lost:
// their existing text is loaded into the About body / a single Service Info tier so
// the admin can re-save them into the new structured format.

const MARKER_RE = /<!--CHPED:([A-Za-z0-9+/=]*)-->/;

// UTF-8 safe base64 (handles emojis) — MDN recommended approach.
function utf8ToB64(str) {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p) => String.fromCharCode(parseInt(p, 16))));
    } catch (e) {
        return '';
    }
}

function b64ToUtf8(str) {
    try {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
        return '';
    }
}

function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function stripToText(html) {
    if (!html) return '';
    try {
        if (typeof DOMParser !== 'undefined') {
            const doc = new DOMParser().parseFromString(String(html), 'text/html');
            // remove our own marker comment text just in case
            return (doc.body.textContent || '').trim();
        }
    } catch (e) { /* fall through */ }
    return String(html).replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '').trim();
}

export function parseEditorJson(html) {
    if (!html || typeof html !== 'string') return null;
    const m = html.match(MARKER_RE);
    if (!m) return null;
    const json = b64ToUtf8(m[1]);
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

// ---- About (headline + body) <-> description HTML ----

export function composeAbout(about) {
    const headline = (about && about.headline ? about.headline : '').trim();
    const body = (about && about.body ? about.body : '').trim();
    const json = JSON.stringify({headline, body});
    let html = `<!--CHPED:${utf8ToB64(json)}-->`;
    if (headline) html += `<h3>${esc(headline)}</h3>`;
    if (body) {
        const paras = body.split(/\n{2,}/).map((p) => esc(p).replace(/\n/g, '<br>'));
        html += paras.map((p) => `<p>${p}</p>`).join('');
    }
    return html;
}

export function parseAbout(html) {
    const j = parseEditorJson(html);
    if (j && (typeof j.headline === 'string' || typeof j.body === 'string')) {
        return {headline: j.headline || '', body: j.body || ''};
    }
    // legacy: no marker → preserve old text in the body field
    return {headline: '', body: stripToText(html)};
}

// ---- Service Info (tiers + features) <-> service_info HTML ----

export function composeServiceInfo(si) {
    const tiers = ((si && si.tiers) || []).map((t) => ({
        emoji: t.emoji || '', name: t.name || '', best: !!t.best, points: t.points || ''
    }));
    const features = ((si && si.features) || []).map((f) => ({
        emoji: f.emoji || '', title: f.title || '', desc: f.desc || ''
    }));
    const json = JSON.stringify({tiers, features});
    let html = `<!--CHPED:${utf8ToB64(json)}-->`;

    tiers.forEach((t) => {
        const name = (t.name || '').trim();
        if (!name && !String(t.points).trim()) return;
        const best = t.best ? ' (Best)' : '';
        const heading = (t.emoji ? t.emoji + ' ' : '') + name + best;
        html += `<h4>${esc(heading)}</h4>`;
        const pts = String(t.points).split('\n').map((x) => x.trim()).filter(Boolean);
        if (pts.length) html += '<ul>' + pts.map((p) => `<li>${esc(p)}</li>`).join('') + '</ul>';
    });

    const validFeatures = features.filter((f) => (f.title || '').trim() || (f.desc || '').trim());
    if (validFeatures.length) {
        html += `<h4>What's included</h4><ul>`;
        validFeatures.forEach((f) => {
            const title = (f.emoji ? f.emoji + ' ' : '') + (f.title || '');
            html += `<li><strong>${esc(title)}</strong>${f.desc ? ' — ' + esc(f.desc) : ''}</li>`;
        });
        html += '</ul>';
    }
    return html;
}

export function parseServiceInfo(html) {
    const j = parseEditorJson(html);
    if (j && (Array.isArray(j.tiers) || Array.isArray(j.features))) {
        return {
            tiers: (j.tiers || []).map((t) => ({
                emoji: t.emoji || '', name: t.name || '', best: !!t.best, points: t.points || ''
            })),
            features: (j.features || []).map((f) => ({
                emoji: f.emoji || '', title: f.title || '', desc: f.desc || ''
            }))
        };
    }
    // legacy: preserve old text as a single editable tier so nothing is lost
    const txt = stripToText(html);
    return {
        tiers: txt ? [{emoji: '', name: 'Service Info', best: false, points: txt}] : [],
        features: []
    };
}
