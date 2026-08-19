/* ============================================================
 * DermVet Pro — Motor de la aplicación (v5)
 *
 * Flujo: home → información del patrón → pregunta clínica
 *        → orientación diagnóstica diferencial → abordaje terapéutico
 *
 * Los datos clínicos se registran desde archivos externos
 * (p. ej. data-seborreico.js) mediante window.DermVet.registerPattern().
 * ============================================================ */
(function () {
    'use strict';

    /* ────────────────────────────────────────────────
     * Registro de patrones (API pública para archivos de datos)
     * ──────────────────────────────────────────────── */
    window.DermVet = window.DermVet || {};

    var PATTERN_REGISTRY = {};

    window.DermVet.registerPattern = function (key, data) {
        if (!key || !data || typeof data !== 'object') {
            console.error('Registro de patrón no válido:', key);
            return false;
        }
        PATTERN_REGISTRY[key] = data;
        return true;
    };

    /* ────────────────────────────────────────────────
     * Catálogo de patrones mostrados en la pantalla inicial
     * ──────────────────────────────────────────────── */
    var PATTERNS_LIST = [
        {
            key: 'seborreico',
            title: 'Descamativo-seborreico',
            desc: 'Descamación excesiva, caspa, piel grasa u olor rancio. Lesiones descamativas en tronco.',
            img: 'Imagenes_Patologias/seborreico.jpg',
            active: false,
            badge: 'NO DISPONIBLE',
            badgeClass: 'gray'
        },
        {
            key: 'alopécico',
            title: 'Alopécico',
            desc: 'Áreas de pérdida de pelo parcial o total. Parches circulares localizados o alopecia endocrina simétrica.',
            img: 'Imagenes_Patologias/alopecico.jpg',
            active: false,
            badge: 'NO DISPONIBLE',
            badgeClass: 'gray'
        },
        {
            key: 'pustular_vesicular',
            title: 'Pustular-vesicular',
            desc: 'Elevaciones con contenido purulento (pústulas), vesículas transitorias o collaretes descamativos.',
            img: 'Imagenes_Patologias/pustular_vesicular.jpg',
            active: false,
            badge: 'NO DISPONIBLE',
            badgeClass: 'gray'
        },
        {
            key: 'pruriginoso',
            title: 'Pruriginoso',
            desc: 'Prurito persistente (rascado, lamido, mordisqueo). Eritema difuso en pliegues flexores o márgenes articulares.',
            img: 'Imagenes_Patologias/pruriginoso.jpg',
            active: false,
            badge: 'NO DISPONIBLE',
            badgeClass: 'gray'
        },
        {
            key: 'ulcerativo',
            title: 'Erosivo-ulcerativo',
            desc: 'Pérdida de la integridad de la epidermis. Exudación húmeda, úlceras profundas, costras hemáticas.',
            img: 'Imagenes_Patologias/ulcerativo.jpg',
            active: false,
            badge: 'NO DISPONIBLE',
            badgeClass: 'gray'
        },
        {
            key: 'nodular',
            title: 'Papulo-placo-nodular',
            desc: 'Masas cutáneas sólidas. Elevaciones firmes de la dermis de diverso tamaño (pápulas o nódulos).',
            img: 'Imagenes_Patologias/nodular.jpg',
            active: false,
            badge: 'NO DISPONIBLE',
            badgeClass: 'gray'
        }
    ];

    /* ────────────────────────────────────────────────
     * Registro de pruebas diagnósticas (pictogramas del manual)
     * ──────────────────────────────────────────────── */
    var DIAGNOSTIC_TESTS = {
        ensayo_terapeutico:    { label: 'Ensayo terapéutico',        cssClass: 'ensayo_terapeutico' },
        citologia:             { label: 'Citología',                 cssClass: 'citologia' },
        histopatologia:        { label: 'Histopatología',            cssClass: 'histopatologia' },
        cultivo_fungico_pcr:   { label: 'Cultivo fúngico / PCR de dermatofitos', cssClass: 'cultivo_fungico_pcr' },
        cultivo_bacteriano:    { label: 'Cultivo bacteriano',        cssClass: 'cultivo_bacteriano' },
        protocolo_alergias:    { label: 'Protocolo diagnóstico de las alergias', cssClass: 'protocolo_alergias' },
        anamnesis_resena:      { label: 'Diagnóstico basado en gran medida en la anamnesis/reseña del paciente', cssClass: 'anamnesis_resena' },
        lampara_wood:          { label: 'Lámpara de Wood',           cssClass: 'lampara_wood' },
        examen_pelo:           { label: 'Examen microscópico del pelo', cssClass: 'examen_pelo' },
        analiticas_sangre:     { label: 'Analíticas específicas en sangre', cssClass: 'analiticas_sangre' },
        raspado_cutaneo:       { label: 'Raspado cutáneo',           cssClass: 'raspado_cutaneo' },
        tinciones_especificas: { label: '± Tinciones específicas',   cssClass: 'tinciones_especificas' }
    };

    /* ────────────────────────────────────────────────
     * Iconos SVG (el color se controla desde CSS)
     * ──────────────────────────────────────────────── */
    var ICON_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
    var ICON_ARROW = '<svg class="answer-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    var ICON_ARROW_SMALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    var ICON_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="10 8 15 12 10 16"/></svg>';
    var ICON_ALERT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    var ICON_CHECK_CIRCLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    var ICON_SHIELD_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
    var ICON_BOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
    var ICON_PRINTER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
    var ICON_HOME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
    var ICON_RESTART = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';
    var ICON_CLIPBOARD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>';
    var ICON_COPY = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

    var THERAPY_ICONS = {
        search:   '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        shield:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        bug:      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M19 8l-3 1"/><path d="M5 8l3 1"/><path d="M19 16l-3-1"/><path d="M5 16l3-1"/><path d="M19 12h-3"/><path d="M5 12h3"/><path d="M10 2l2 4 2-4"/></svg>',
        bacteria: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a4 4 0 0 0-4 4c0 3 4 6 4 6s4-3 4-6a4 4 0 0 0-4-4z"/><path d="M12 12v10"/><path d="M8 16l4-4 4 4"/></svg>',
        alert:    ICON_ALERT,
        hormone:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    };

    /* ────────────────────────────────────────────────
     * Estado de la aplicación
     * ──────────────────────────────────────────────── */
    var state = {
        patternKey: null,
        branchId: null,
        history: ['home']
    };

    var FLOW_STEPS = ['Información', 'Pregunta', 'Orientación', 'Tratamiento'];

    var VIEW_ANNOUNCE = {
        'home': 'Panel inicial.',
        'pattern-info': 'Pantalla de información del patrón.',
        'question': 'Pregunta clínica.',
        'differential': 'Orientación diagnóstica diferencial cargada.',
        'therapeutic': 'Pantalla de abordaje terapéutico.'
    };

    /* ────────────────────────────────────────────────
     * Utilidades
     * ──────────────────────────────────────────────── */
    function $(id) {
        return document.getElementById(id);
    }

    function createEl(tag, className, text) {
        var el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined && text !== null) el.textContent = text;
        return el;
    }

    function announceToScreenReader(message) {
        var el = $('screen-status');
        if (el) el.textContent = message;
    }

    function getPattern() {
        return state.patternKey ? PATTERN_REGISTRY[state.patternKey] : null;
    }

    /* ────────────────────────────────────────────────
     * Validación de datos de un patrón
     * ──────────────────────────────────────────────── */
    function validatePatternData(pattern) {
        var errors = [];
        if (!pattern || typeof pattern !== 'object') {
            return ['Los datos del patrón no son un objeto'];
        }
        if (!pattern.meta || !pattern.meta.flowType) errors.push('Falta meta.flowType');
        if (!pattern.meta || !pattern.meta.name) errors.push('Falta meta.name');
        if (!pattern.decisionTree || !pattern.decisionTree.question || !pattern.decisionTree.question.text) {
            errors.push('Falta la pregunta del árbol de decisión');
        }
        var answers = pattern.decisionTree && pattern.decisionTree.answers;
        if (!Array.isArray(answers) || answers.length < 2) {
            errors.push('Se requieren al menos 2 respuestas');
        }
        if (!pattern.decisionTree || !pattern.decisionTree.branches || typeof pattern.decisionTree.branches !== 'object') {
            errors.push('Faltan las ramas del árbol de decisión');
        }
        return errors;
    }

    /* ────────────────────────────────────────────────
     * Navegación entre pantallas
     * ──────────────────────────────────────────────── */
    var VIEW_RENDERERS = {
        'pattern-info': renderPatternIntroduction,
        'question': renderDecisionQuestion,
        'differential': renderDifferential,
        'therapeutic': renderTherapeutic
    };

    function showScreen(view) {
        var screens = document.querySelectorAll('.screen-view');
        Array.prototype.forEach.call(screens, function (s) {
            s.classList.remove('active');
        });
        var screen = $('screen-' + view);
        if (screen) {
            screen.classList.add('active');
            var heading = screen.querySelector('h1');
            if (heading) heading.focus({ preventScroll: true });
        }
        window.scrollTo(0, 0);
    }

    function renderAndShow(view) {
        var renderer = VIEW_RENDERERS[view];
        if (renderer) renderer();
        showScreen(view);
        announceToScreenReader(VIEW_ANNOUNCE[view] || '');
    }

    function navigateTo(view) {
        if (state.history[state.history.length - 1] !== view) {
            state.history.push(view);
        }
        renderAndShow(view);
    }

    function navigateBack() {
        if (state.history.length > 1) {
            state.history.pop();
        }
        renderAndShow(state.history[state.history.length - 1] || 'home');
    }

    function goHome() {
        state.patternKey = null;
        state.branchId = null;
        state.history = ['home'];
        showScreen('home');
        announceToScreenReader(VIEW_ANNOUNCE.home);
    }

    function resetOrientation() {
        state.branchId = null;
        var qIndex = state.history.lastIndexOf('question');
        if (qIndex >= 0) {
            state.history = state.history.slice(0, qIndex + 1);
        }
        renderAndShow('question');
        announceToScreenReader('Orientación reiniciada.');
    }

    /* ────────────────────────────────────────────────
     * Componentes compartidos
     * ──────────────────────────────────────────────── */
    function buildBackButton(label) {
        var btn = createEl('button', 'btn-back-home');
        btn.type = 'button';
        btn.setAttribute('aria-label', label);
        btn.innerHTML = ICON_BACK + '<span>' + label + '</span>';
        btn.addEventListener('click', navigateBack);
        return btn;
    }

    function buildFlowSteps(currentIndex) {
        var ol = createEl('ol', 'flow-steps');
        ol.setAttribute('aria-label', 'Progreso del flujo clínico');
        FLOW_STEPS.forEach(function (label, i) {
            var li = document.createElement('li');
            if (i < currentIndex) {
                li.className = 'done';
            } else if (i === currentIndex) {
                li.className = 'current';
                li.setAttribute('aria-current', 'step');
            }
            li.appendChild(createEl('span', 'step-dot', String(i + 1)));
            li.appendChild(createEl('span', 'step-label', label));
            ol.appendChild(li);
        });
        return ol;
    }

    function buildTestChips(tests) {
        var chips = createEl('div', 'test-chips');
        tests.forEach(function (t) {
            var test = DIAGNOSTIC_TESTS[t] || { label: t, cssClass: null };
            var chip = createEl('div', 'test-chip', test.label);
            if (test.cssClass) chip.classList.add(test.cssClass);
            chips.appendChild(chip);
        });
        return chips;
    }

    function buildBibliography(bib) {
        var wrap = createEl('div', 'bibliography-block');
        var a = createEl('a', 'bibliography-link');
        a.href = bib.qrUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = ICON_BOOK + '<span>Consultar la bibliografía del manual</span>';
        wrap.appendChild(a);
        if (bib.source) {
            wrap.appendChild(createEl('span', 'bibliography-source', bib.source));
        }
        return wrap;
    }

    function buildWarnings(warnings) {
        var card = createEl('div', 'disclaimer-card-info');
        card.insertAdjacentHTML('afterbegin', ICON_ALERT);
        var texts = createEl('div');
        warnings.forEach(function (w) {
            texts.appendChild(createEl('p', null, typeof w === 'string' ? w : (w.text || '')));
        });
        card.appendChild(texts);
        return card;
    }

    /* ────────────────────────────────────────────────
     * Pantalla inicial: grid de patrones
     * ──────────────────────────────────────────────── */
    function renderPatternsGrid() {
        var grid = $('diseases-grid');
        if (!grid) return;
        grid.textContent = '';

        PATTERNS_LIST.forEach(function (p) {
            var card = createEl('button', 'disease-card' + (p.active ? '' : ' is-locked'));
            card.type = 'button';
            card.setAttribute('aria-label', p.active
                ? 'Iniciar patrón ' + p.title
                : p.title + ' — módulo no disponible todavía');

            var imgWrap = createEl('div', 'card-image-container');
            var img = document.createElement('img');
            img.src = p.img;
            img.alt = 'Imagen de referencia del patrón ' + p.title;
            img.loading = 'lazy';
            img.decoding = 'async';
            imgWrap.appendChild(img);

            if (p.badge) {
                imgWrap.appendChild(createEl('span', 'card-overlay-badge ' + (p.badgeClass || ''), p.badge));
            }

            var iconOverlay = createEl('div', 'card-icon-overlay');
            iconOverlay.innerHTML = p.active ? ICON_PLAY : ICON_LOCK;
            imgWrap.appendChild(iconOverlay);
            card.appendChild(imgWrap);

            var details = createEl('div', 'card-details');
            details.appendChild(createEl('h3', null, p.title));
            details.appendChild(createEl('p', null, p.desc));

            var cta = createEl('span', 'card-cta');
            if (p.active) {
                cta.innerHTML = '<span>Iniciar patrón</span>' + ICON_ARROW_SMALL;
            } else {
                cta.innerHTML = '<span>Módulo en validación</span>';
            }
            details.appendChild(cta);
            card.appendChild(details);

            card.addEventListener('click', function () {
                if (p.active) {
                    startPatternFlow(p.key);
                } else {
                    openLockedModal(p.title);
                }
            });

            grid.appendChild(card);
        });
    }

    /* ────────────────────────────────────────────────
     * Modal de patrón en calibración
     * ──────────────────────────────────────────────── */
    var lastFocusedElement = null;

    function openLockedModal(title) {
        $('locked-pattern-title').textContent = title + ' — En calibración';
        $('locked-pattern-desc').textContent =
            'El módulo para el patrón ' + title + ' se encuentra actualmente en fase de validación ' +
            'clínica de su base de datos. Estará disponible en una próxima actualización.';
        lastFocusedElement = document.activeElement;
        $('locked-backdrop').hidden = false;
        $('locked-modal').hidden = false;
        $('locked-modal-close').focus();
        announceToScreenReader('Módulo ' + title + ' en calibración.');
    }

    function closeLockedModal() {
        $('locked-backdrop').hidden = true;
        $('locked-modal').hidden = true;
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    /* ────────────────────────────────────────────────
     * Lightbox de imágenes
     * ──────────────────────────────────────────────── */
    var lightboxEl = null;

    function buildLightbox() {
        lightboxEl = createEl('div', 'image-lightbox');
        lightboxEl.id = 'global-image-lightbox';
        lightboxEl.setAttribute('role', 'dialog');
        lightboxEl.setAttribute('aria-modal', 'true');
        lightboxEl.setAttribute('aria-label', 'Imagen ampliada');

        var closeBtn = createEl('button', 'lightbox-close', '×');
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Cerrar imagen ampliada');
        closeBtn.addEventListener('click', closeImageLightbox);

        var img = document.createElement('img');
        img.id = 'lightbox-img';
        img.alt = '';

        var caption = createEl('div', 'lightbox-caption');
        caption.id = 'lightbox-caption';

        lightboxEl.appendChild(closeBtn);
        lightboxEl.appendChild(img);
        lightboxEl.appendChild(caption);

        lightboxEl.addEventListener('click', function (e) {
            if (e.target === lightboxEl) closeImageLightbox();
        });

        document.body.appendChild(lightboxEl);
    }

    function openImageLightbox(src, alt) {
        if (!lightboxEl) buildLightbox();
        $('lightbox-img').src = src;
        $('lightbox-img').alt = alt || '';
        $('lightbox-caption').textContent = alt || '';
        lightboxEl.classList.add('active');
        var closeBtn = lightboxEl.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function closeImageLightbox() {
        if (lightboxEl) lightboxEl.classList.remove('active');
    }

    /* ────────────────────────────────────────────────
     * Flujo del patrón
     * ──────────────────────────────────────────────── */
    function startPatternFlow(patternKey) {
        var pattern = PATTERN_REGISTRY[patternKey];
        if (!pattern) {
            console.error('Patrón no disponible:', patternKey);
            return;
        }
        state.patternKey = patternKey;
        state.branchId = null;
        state.history = ['home'];
        navigateTo('pattern-info');
    }

    /* ── Pantalla 1: información del patrón ── */
    function renderPatternIntroduction() {
        var pattern = getPattern();
        if (!pattern) return;

        var container = $('screen-pattern-info');
        container.textContent = '';
        container.appendChild(buildBackButton('Volver'));

        var main = createEl('div', 'pattern-flow-container');
        main.appendChild(buildFlowSteps(0));

        var h1 = createEl('h1', null, pattern.meta.name);
        h1.tabIndex = -1;
        main.appendChild(h1);

        /* Tarjeta de definición */
        var infoCard = createEl('div', 'info-card');
        infoCard.appendChild(createEl('h2', null, pattern.definition.title));

        if (pattern.definition.diagramImgs && pattern.definition.diagramImgs.length > 0) {
            infoCard.appendChild(buildDiagramCarousel(pattern.definition));
        } else if (pattern.definition.diagramImg) {
            var singleImg = document.createElement('img');
            singleImg.src = pattern.definition.diagramImg;
            singleImg.alt = pattern.definition.title;
            singleImg.decoding = 'async';
            singleImg.style.maxWidth = '100%';
            singleImg.style.borderRadius = '12px';
            singleImg.style.display = 'block';
            singleImg.style.marginBottom = '16px';
            singleImg.style.cursor = 'zoom-in';
            singleImg.addEventListener('click', function () {
                openImageLightbox(singleImg.src, singleImg.alt);
            });
            infoCard.appendChild(singleImg);
        }

        if (pattern.definition.legend && pattern.definition.legend.length > 0) {
            var details = createEl('details', 'legend-details');
            details.appendChild(createEl('summary', null, 'Ver leyenda de la imagen'));
            var ul = document.createElement('ul');
            pattern.definition.legend.forEach(function (item) {
                ul.appendChild(createEl('li', null, item));
            });
            details.appendChild(ul);
            infoCard.appendChild(details);
        }

        if (pattern.definition.causes) {
            infoCard.appendChild(createEl('h3', null, 'Causas'));
            var ulCauses = document.createElement('ul');
            pattern.definition.causes.forEach(function (c) {
                ulCauses.appendChild(createEl('li', null, c));
            });
            infoCard.appendChild(ulCauses);
        }

        if (pattern.definition.renewalPeriod) {
            var pRenov = createEl('p');
            var strong = createEl('strong', null, 'Renovación epidérmica: ');
            pRenov.appendChild(strong);
            pRenov.appendChild(document.createTextNode(pattern.definition.renewalPeriod));
            infoCard.appendChild(pRenov);
        }

        if (pattern.definition.consequences) {
            infoCard.appendChild(createEl('h3', null, 'Consecuencias'));
            var ulCons = document.createElement('ul');
            pattern.definition.consequences.forEach(function (c) {
                ulCons.appendChild(createEl('li', null, c));
            });
            infoCard.appendChild(ulCons);
        }

        main.appendChild(infoCard);

        /* Galerías de ejemplos */
        main.appendChild(buildGalleryCard(
            pattern.macroscopicExamples,
            'Ejemplos macroscópicos'
        ));
        main.appendChild(buildGalleryCard(
            pattern.microscopicExamples,
            'Hallazgos microscópicos ilustrados'
        ));

        if (pattern.bibliography) {
            main.appendChild(buildBibliography(pattern.bibliography));
        }

        var btnStart = createEl('button', 'btn-primary btn-block', 'Iniciar orientación diagnóstica');
        btnStart.type = 'button';
        btnStart.addEventListener('click', function () {
            navigateTo('question');
        });
        main.appendChild(btnStart);

        container.appendChild(main);
    }

    function buildDiagramCarousel(definition) {
        var carouselContainer = createEl('div', 'diagram-carousel-container');
        var carousel = createEl('div', 'diagram-carousel');

        definition.diagramImgs.forEach(function (src, index) {
            var item = createEl('div', 'diagram-item' + (index === 0 ? ' active' : ''));
            var img = document.createElement('img');
            img.src = src;
            img.alt = definition.title + ' ' + (index + 1);
            img.decoding = 'async';
            img.addEventListener('click', function () {
                openImageLightbox(img.src, img.alt);
            });
            item.appendChild(img);
            carousel.appendChild(item);
        });

        carouselContainer.appendChild(carousel);

        if (definition.diagramImgs.length > 1) {
            var rightBtn = createEl('button', 'carousel-arrow right', '›');
            rightBtn.type = 'button';
            rightBtn.setAttribute('aria-label', 'Imagen siguiente');

            var leftBtn = createEl('button', 'carousel-arrow left hidden', '‹');
            leftBtn.type = 'button';
            leftBtn.setAttribute('aria-label', 'Imagen anterior');

            carouselContainer.appendChild(leftBtn);
            carouselContainer.appendChild(rightBtn);

            var items = Array.prototype.slice.call(carousel.children);

            carousel.addEventListener('scroll', function () {
                var activeIndex = 0;
                var minDiff = Infinity;
                items.forEach(function (item, i) {
                    var itemCenter = item.offsetLeft + item.offsetWidth / 2 - carousel.scrollLeft;
                    var containerCenter = carousel.offsetWidth / 2;
                    var diff = Math.abs(itemCenter - containerCenter);
                    if (diff < minDiff) {
                        minDiff = diff;
                        activeIndex = i;
                    }
                });

                items.forEach(function (item, i) {
                    item.classList.toggle('active', i === activeIndex);
                });

                leftBtn.classList.toggle('hidden', carousel.scrollLeft <= 20);
                rightBtn.classList.toggle('hidden',
                    carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 20);
            });

            rightBtn.addEventListener('click', function () {
                var itemWidth = items[0].offsetWidth + 16;
                carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
            });

            leftBtn.addEventListener('click', function () {
                var itemWidth = items[0].offsetWidth + 16;
                carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            });
        }

        return carouselContainer;
    }

    function buildGalleryCard(examples, title) {
        var frag = document.createDocumentFragment();
        if (!examples || !examples.items || examples.items.length === 0) {
            return frag;
        }

        var card = createEl('div', 'info-card');
        card.appendChild(createEl('h2', null, title));

        var ul = createEl('ul', 'gallery-list');
        examples.items.forEach(function (item) {
            var li = document.createElement('li');
            var btn = createEl('button', 'gallery-item');
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Ampliar imagen: ' + item.description);

            if (item.imgUrl) {
                var img = document.createElement('img');
                img.src = item.imgUrl;
                img.alt = item.description;
                img.loading = 'lazy';
                img.decoding = 'async';
                btn.appendChild(img);
                btn.addEventListener('click', function () {
                    openImageLightbox(item.imgUrl, item.description);
                });
            }
            btn.appendChild(createEl('span', null, item.description));
            li.appendChild(btn);
            ul.appendChild(li);
        });

        card.appendChild(ul);
        frag.appendChild(card);
        return frag;
    }

    /* ── Pantalla 2: pregunta clínica ── */
    function renderDecisionQuestion() {
        var pattern = getPattern();
        if (!pattern) return;

        var container = $('screen-question');
        container.textContent = '';
        container.appendChild(buildBackButton('Volver a la información del patrón'));

        var main = createEl('div', 'pattern-flow-container');
        main.appendChild(buildFlowSteps(1));

        var card = createEl('div', 'question-card');

        var banner = createEl('div', 'question-banner');
        var h1 = createEl('h1', null, pattern.decisionTree.question.text);
        h1.tabIndex = -1;
        banner.appendChild(h1);
        banner.appendChild(createEl('p', null, 'Selecciona la opción que mejor describa al paciente.'));
        card.appendChild(banner);

        var body = createEl('div', 'question-body');
        pattern.decisionTree.answers.forEach(function (ans, idx) {
            var btn = createEl('button', 'answer-btn');
            btn.type = 'button';
            btn.appendChild(createEl('span', 'answer-letter', ans.id || String.fromCharCode(65 + idx)));
            btn.appendChild(createEl('span', 'answer-text', ans.text));
            btn.insertAdjacentHTML('beforeend', ICON_ARROW);
            btn.addEventListener('click', function () {
                handleDecision(ans.id);
            });
            body.appendChild(btn);
        });
        card.appendChild(body);

        main.appendChild(card);
        container.appendChild(main);
    }

    function handleDecision(branchId) {
        state.branchId = branchId;
        navigateTo('differential');
    }

    /* Resuelve la rama elegida (incluidas las referencias entre ramas)
     * y devuelve los grupos, el contexto secundario y la respuesta elegida. */
    function resolveBranch(pattern, branchId) {
        var branches = (pattern.decisionTree && pattern.decisionTree.branches) || {};
        var branchData = branches[branchId];
        var secondaryContext = null;
        var validationNote = null;

        if (branchData && branchData.referenceToBranch) {
            secondaryContext = branchData.secondaryInfectionContext || null;
            validationNote = branchData.validationNote || null;
            branchData = branches[branchData.referenceToBranch];
        }

        var answer = (pattern.decisionTree.answers || []).find(function (a) {
            return a.id === branchId;
        });

        return {
            groups: Array.isArray(branchData) ? branchData : null,
            secondaryContext: secondaryContext,
            validationNote: validationNote,
            answerText: answer ? answer.text : ''
        };
    }

    /* ── Pantalla 3: orientación diagnóstica diferencial ── */
    function renderDifferential() {
        var pattern = getPattern();
        if (!pattern) return;

        var container = $('screen-differential');
        container.textContent = '';
        container.appendChild(buildBackButton('Volver a la pregunta'));

        var main = createEl('div', 'pattern-flow-container');
        main.appendChild(buildFlowSteps(2));

        var h1 = createEl('h1', null, 'Orientación Diagnóstica Diferencial');
        h1.tabIndex = -1;
        main.appendChild(h1);

        var resolved = resolveBranch(pattern, state.branchId);
        var branchData = resolved.groups;
        var secondaryContext = resolved.secondaryContext;
        var validationNote = resolved.validationNote;
        var answerText = resolved.answerText;

        if (!Array.isArray(branchData)) {
            var errNote = createEl('div', 'validation-note',
                'No se pudo cargar la orientación para la respuesta seleccionada. Vuelve a la pregunta e inténtalo de nuevo.');
            main.appendChild(errNote);
            var errNav = createEl('div', 'nav-buttons-row');
            var errBack = createEl('button', 'btn-secondary', 'Volver a la pregunta');
            errBack.type = 'button';
            errBack.addEventListener('click', navigateBack);
            errNav.appendChild(errBack);
            main.appendChild(errNav);
            container.appendChild(main);
            console.error('Rama de decisión no válida:', state.branchId);
            return;
        }

        /* Respuesta seleccionada */
        var recap = createEl('div', 'answer-recap');
        var recapP = createEl('p');
        recapP.appendChild(document.createTextNode('Respuesta seleccionada: '));
        recapP.appendChild(createEl('strong', null, answerText));
        recap.appendChild(recapP);
        main.appendChild(recap);

        if (validationNote) {
            main.appendChild(createEl('div', 'validation-note', validationNote));
        }

        /* Contexto de infección secundaria (rama referenciada) */
        if (secondaryContext) {
            var secGroup = createEl('div', 'differential-group group-danger');
            secGroup.appendChild(createEl('h3', null, secondaryContext.title || 'Infecciones Secundarias'));
            if (secondaryContext.text) {
                secGroup.appendChild(createEl('p', null, secondaryContext.text));
            }
            if (secondaryContext.tests && secondaryContext.tests.length > 0) {
                secGroup.appendChild(buildTestChips(secondaryContext.tests));
            }
            main.appendChild(secGroup);
        }

        /* Grupos de diagnóstico diferencial */
        var groupsContainer = createEl('div');
        branchData.forEach(function (group) {
            var grp = createEl('div', 'differential-group');
            grp.appendChild(createEl('h3', null, group.title));

            if (group.context) {
                var pCtx = createEl('p', 'group-context');
                pCtx.appendChild(createEl('em', null, 'Contexto: ' + group.context));
                grp.appendChild(pCtx);
            }

            if (group.diagnoses && group.diagnoses.length > 0) {
                var ul = document.createElement('ul');
                group.diagnoses.forEach(function (d) {
                    ul.appendChild(createEl('li', null, d.label || d));
                });
                grp.appendChild(ul);
            }

            if (group.tests && group.tests.length > 0) {
                grp.appendChild(buildTestChips(group.tests));
            }

            if (group.additionalProcedures) {
                group.additionalProcedures.forEach(function (p) {
                    grp.appendChild(createEl('div', 'additional-procedure', p.label || p));
                });
            }

            if (group.note || group.notes) {
                var notes = group.notes || [group.note];
                notes.forEach(function (n) {
                    grp.appendChild(createEl('div', 'editorial-note', n));
                });
            }

            if (group.editorialNote) {
                grp.appendChild(createEl('div', 'editorial-note', group.editorialNote.text || ''));
            }

            groupsContainer.appendChild(grp);
        });
        main.appendChild(groupsContainer);

        if (pattern.therapeuticApproach) {
            var btnTherapeutic = createEl('button', 'btn-primary btn-block', 'Continuar al abordaje terapéutico');
            btnTherapeutic.type = 'button';
            btnTherapeutic.addEventListener('click', function () {
                navigateTo('therapeutic');
            });
            main.appendChild(btnTherapeutic);
        }

        if (pattern.bibliography) {
            main.appendChild(buildBibliography(pattern.bibliography));
        }

        if (pattern.warnings && pattern.warnings.length > 0) {
            main.appendChild(buildWarnings(pattern.warnings));
        }

        /* Navegación inferior */
        var navRow = createEl('div', 'nav-buttons-row');

        var btnBack = createEl('button', 'btn-secondary');
        btnBack.type = 'button';
        btnBack.innerHTML = ICON_BACK + '<span>Volver a la pregunta</span>';
        btnBack.addEventListener('click', navigateBack);

        var btnReset = createEl('button', 'btn-secondary');
        btnReset.type = 'button';
        btnReset.innerHTML = ICON_RESTART + '<span>Reiniciar orientación</span>';
        btnReset.addEventListener('click', resetOrientation);

        var btnHome = createEl('button', 'btn-primary');
        btnHome.type = 'button';
        btnHome.innerHTML = ICON_HOME + '<span>Volver al panel inicial</span>';
        btnHome.addEventListener('click', goHome);

        navRow.appendChild(btnBack);
        navRow.appendChild(btnReset);
        navRow.appendChild(btnHome);
        main.appendChild(navRow);

        container.appendChild(main);
    }

    /* ── Pantalla 4: abordaje terapéutico ── */
    function renderTherapeutic() {
        var pattern = getPattern();
        if (!pattern || !pattern.therapeuticApproach) return;

        var container = $('screen-therapeutic');
        container.textContent = '';
        container.appendChild(buildBackButton('Volver a la orientación'));

        var main = createEl('div', 'pattern-flow-container');
        main.appendChild(buildFlowSteps(3));

        /* Cabecera */
        var headerDiv = createEl('div', 'therapeutic-header');
        var hIcon = createEl('div', 'therapeutic-header-icon');
        hIcon.innerHTML = ICON_SHIELD_CHECK;
        headerDiv.appendChild(hIcon);

        var hText = createEl('div');
        var h1 = createEl('h1', null, 'Abordaje Terapéutico');
        h1.tabIndex = -1;
        hText.appendChild(h1);
        hText.appendChild(createEl('p', 'therapeutic-subtitle',
            'Plan de tratamiento — ' + pattern.meta.name));
        headerDiv.appendChild(hText);
        main.appendChild(headerDiv);

        /* Bloques condicionales */
        if (pattern.therapeuticApproach.blocks) {
            var blocksContainer = createEl('div', 'therapeutic-blocks-grid');
            pattern.therapeuticApproach.blocks.forEach(function (block, idx) {
                var card = createEl('div', 'therapeutic-card');
                card.style.setProperty('--card-color', block.color || '#3b82f6');
                card.style.animationDelay = (idx * 0.08) + 's';

                var iconWrap = createEl('div', 'therapeutic-card-icon');
                iconWrap.innerHTML = THERAPY_ICONS[block.icon] || THERAPY_ICONS.shield;
                card.appendChild(iconWrap);

                var contentDiv = createEl('div', 'therapeutic-card-content');
                contentDiv.appendChild(createEl('h3', null, block.title));
                if (block.items && block.items.length > 0) {
                    var ul = document.createElement('ul');
                    block.items.forEach(function (item) {
                        ul.appendChild(createEl('li', null, item));
                    });
                    contentDiv.appendChild(ul);
                }
                card.appendChild(contentDiv);
                blocksContainer.appendChild(card);
            });
            main.appendChild(blocksContainer);
        }

        /* Separador */
        var sep = createEl('div', 'therapeutic-separator');
        sep.appendChild(createEl('span', null, '✦ Medidas transversales ✦'));
        main.appendChild(sep);

        /* Medidas generales */
        if (pattern.therapeuticApproach.generalMeasures) {
            var gm = pattern.therapeuticApproach.generalMeasures;
            var tCard = createEl('div', 'therapeutic-general-card');
            var h2 = createEl('h2');
            h2.innerHTML = ICON_CHECK_CIRCLE + '<span></span>';
            h2.querySelector('span').textContent = gm.title || 'En todos los casos puede ser adecuado:';
            tCard.appendChild(h2);
            if (gm.items && gm.items.length > 0) {
                var ulGm = document.createElement('ul');
                gm.items.forEach(function (item) {
                    ulGm.appendChild(createEl('li', null, item));
                });
                tCard.appendChild(ulGm);
            }
            main.appendChild(tCard);
        }

        /* Resumen editable de la sesión para copiar al expediente */
        main.appendChild(buildSessionSummary(pattern));

        if (pattern.warnings && pattern.warnings.length > 0) {
            main.appendChild(buildWarnings(pattern.warnings));
        }

        /* Navegación inferior */
        var navRow = createEl('div', 'nav-buttons-row');

        var btnBack = createEl('button', 'btn-secondary');
        btnBack.type = 'button';
        btnBack.innerHTML = ICON_BACK + '<span>Volver a la orientación</span>';
        btnBack.addEventListener('click', navigateBack);

        var btnPrint = createEl('button', 'btn-secondary');
        btnPrint.type = 'button';
        btnPrint.innerHTML = ICON_PRINTER + '<span>Imprimir orientación</span>';
        btnPrint.addEventListener('click', function () {
            window.print();
        });

        var btnHome = createEl('button', 'btn-primary');
        btnHome.type = 'button';
        btnHome.innerHTML = ICON_HOME + '<span>Finalizar (ir al inicio)</span>';
        btnHome.addEventListener('click', goHome);

        navRow.appendChild(btnBack);
        navRow.appendChild(btnPrint);
        navRow.appendChild(btnHome);
        main.appendChild(navRow);

        container.appendChild(main);
    }

    /* ────────────────────────────────────────────────
     * Resumen de la sesión (editable, para copiar al expediente)
     * ──────────────────────────────────────────────── */
    function generateSessionSummaryText(pattern) {
        var resolved = resolveBranch(pattern, state.branchId);
        var today = new Date().toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
        var lines = [];

        lines.push('ORIENTACIÓN DIAGNÓSTICA DIFERENCIAL — DermVet Pro');
        lines.push('Fecha: ' + today);
        lines.push('Patrón: ' + pattern.meta.name);
        lines.push('');
        lines.push('── RECORRIDO ──────────────────────────');
        lines.push('Pregunta clínica: ' + pattern.decisionTree.question.text);
        lines.push('Respuesta seleccionada: ' + (resolved.answerText || '—'));

        if (resolved.secondaryContext) {
            var secTests = (resolved.secondaryContext.tests || []).map(function (t) {
                return (DIAGNOSTIC_TESTS[t] || { label: t }).label;
            });
            if (secTests.length > 0) {
                lines.push('Evaluación del prurito secundario: ' + secTests.join(', '));
            }
        }

        lines.push('');
        lines.push('── ORIENTACIÓN DIFERENCIAL ──────────────────────────');
        if (resolved.groups) {
            resolved.groups.forEach(function (group, i) {
                var heading = (i + 1) + '. ' + group.title;
                if (group.context) heading += ' (' + group.context + ')';
                lines.push(heading);
                if (group.diagnoses && group.diagnoses.length > 0) {
                    lines.push('   Diagnósticos: ' + group.diagnoses.map(function (d) {
                        return d.label || d;
                    }).join(', '));
                }
                if (group.tests && group.tests.length > 0) {
                    lines.push('   Pruebas: ' + group.tests.map(function (t) {
                        return (DIAGNOSTIC_TESTS[t] || { label: t }).label;
                    }).join(', '));
                }
                var notes = group.notes || (group.note ? [group.note] : []);
                notes.forEach(function (n) {
                    lines.push('   Nota: ' + n);
                });
            });
        } else {
            lines.push('(Sin recorrido registrado en esta sesión)');
        }

        lines.push('');
        lines.push('── ABORDAJE TERAPÉUTICO ──────────────────────────');
        var blocks = (pattern.therapeuticApproach && pattern.therapeuticApproach.blocks) || [];
        blocks.forEach(function (block) {
            lines.push('• ' + block.title + ':');
            (block.items || []).forEach(function (item) {
                lines.push('   - ' + item);
            });
        });

        var gm = pattern.therapeuticApproach && pattern.therapeuticApproach.generalMeasures;
        if (gm && gm.items && gm.items.length > 0) {
            lines.push('');
            lines.push('── MEDIDAS TRANSVERSALES ──────────────────────────');
            gm.items.forEach(function (item) {
                lines.push('• ' + item);
            });
        }

        if (pattern.warnings && pattern.warnings.length > 0) {
            lines.push('');
            lines.push('── AVISOS ──────────────────────────');
            pattern.warnings.forEach(function (w) {
                lines.push('! ' + (typeof w === 'string' ? w : (w.text || '')));
            });
        }

        lines.push('');
        lines.push('Orientación diagnóstica diferencial. No sustituye el juicio clínico');
        lines.push('veterinario ni las pruebas diagnósticas confirmatorias.');

        return lines.join('\n');
    }

    function copyToClipboard(text, textareaEl, callback) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(
                function () { callback(true); },
                function () { legacyCopy(textareaEl, callback); }
            );
        } else {
            legacyCopy(textareaEl, callback);
        }
    }

    function legacyCopy(textareaEl, callback) {
        try {
            textareaEl.focus();
            textareaEl.select();
            callback(!!document.execCommand('copy'));
        } catch (e) {
            callback(false);
        }
    }

    function buildSessionSummary(pattern) {
        var card = createEl('div', 'summary-card');

        var header = createEl('div', 'summary-card-header');
        var titleWrap = createEl('div', 'summary-card-title');
        titleWrap.innerHTML = ICON_CLIPBOARD;
        titleWrap.appendChild(createEl('h2', null, 'Resumen de la sesión'));
        header.appendChild(titleWrap);

        var copyBtn = createEl('button', 'btn-secondary btn-sm summary-copy-btn');
        copyBtn.type = 'button';
        copyBtn.innerHTML = ICON_COPY + '<span>Copiar resumen</span>';
        header.appendChild(copyBtn);
        card.appendChild(header);

        card.appendChild(createEl('p', 'summary-hint',
            'Texto editable: revisa o ajusta las notas y péguelas en el sistema de gestión de tu clínica.'));

        var textarea = createEl('textarea', 'summary-textarea');
        textarea.spellcheck = false;
        textarea.setAttribute('aria-label', 'Resumen editable de la sesión clínica');
        textarea.value = generateSessionSummaryText(pattern);
        card.appendChild(textarea);

        /* Vista para impresión: refleja también las ediciones del texto */
        var printView = createEl('pre', 'summary-print-view');
        printView.textContent = textarea.value;
        textarea.addEventListener('input', function () {
            printView.textContent = textarea.value;
        });
        card.appendChild(printView);

        var originalBtnHTML = copyBtn.innerHTML;
        copyBtn.addEventListener('click', function () {
            copyToClipboard(textarea.value, textarea, function (ok) {
                if (ok) {
                    copyBtn.innerHTML = ICON_CHECK + '<span>¡Copiado!</span>';
                    copyBtn.classList.add('copied');
                } else {
                    copyBtn.innerHTML = ICON_ALERT + '<span>Copia manual: Ctrl+C</span>';
                    textarea.focus();
                    textarea.select();
                }
                setTimeout(function () {
                    copyBtn.innerHTML = originalBtnHTML;
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

        return card;
    }

    /* ────────────────────────────────────────────────
     * Fondo animado de microbios (decorativo)
     * ──────────────────────────────────────────────── */
    function initMicrobeCanvas() {
        var canvas = $('microbe-canvas');
        if (!canvas) return;

        var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        var ctx = canvas.getContext('2d');
        var width = canvas.width = window.innerWidth;
        var height = canvas.height = window.innerHeight;

        var PARTICLE_COUNT = 35;
        var COLORS = [
            { fill: 'rgba(99, 102, 241, 0.04)',  stroke: 'rgba(99, 102, 241, 0.09)' },
            { fill: 'rgba(56, 189, 248, 0.05)',  stroke: 'rgba(56, 189, 248, 0.10)' },
            { fill: 'rgba(6, 182, 212, 0.03)',   stroke: 'rgba(6, 182, 212, 0.08)' },
            { fill: 'rgba(37, 99, 235, 0.04)',   stroke: 'rgba(37, 99, 235, 0.09)' }
        ];

        function Microbe() {
            this.reset();
            this.y = Math.random() * height;
        }

        Microbe.prototype.reset = function () {
            this.x = Math.random() * width;
            this.y = Math.random() * 80 - 80;
            this.size = Math.random() * 20 + 8;
            this.speed = Math.random() * 0.12 + 0.04;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() - 0.5) * 0.003;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.type = Math.floor(Math.random() * 3); // 0 bacilo, 1 coco, 2 espiral
            this.drift = Math.random() * 0.1 - 0.05;
            this.pulseSpeed = Math.random() * 0.008 + 0.003;
            this.pulseState = Math.random() * Math.PI;
            this.blur = Math.random() > 0.75 ? Math.random() * 4 + 2 : 0;
        };

        Microbe.prototype.update = function () {
            this.y += this.speed;
            this.x += Math.sin(this.angle) * 0.1 + this.drift;
            this.angle += this.spinSpeed;
            this.pulseState += this.pulseSpeed;

            if (this.y > height + 50 || this.x < -50 || this.x > width + 50) {
                this.reset();
            }
        };

        Microbe.prototype.draw = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            if (this.blur > 0 && ctx.filter !== undefined) {
                ctx.filter = 'blur(' + this.blur + 'px)';
            }

            ctx.fillStyle = this.color.fill;
            ctx.strokeStyle = this.color.stroke;
            ctx.lineWidth = 1;

            var scale = 1 + Math.sin(this.pulseState) * 0.05;

            if (this.type === 0) {
                ctx.beginPath();
                var length = this.size * 2.2 * scale;
                var radius = this.size * 0.5 * scale;
                if (ctx.roundRect) {
                    ctx.roundRect(-length / 2, -radius, length, radius * 2, radius);
                } else {
                    ctx.arc(-length / 2 + radius, 0, radius, Math.PI / 2, Math.PI * 1.5);
                    ctx.lineTo(length / 2 - radius, -radius);
                    ctx.arc(length / 2 - radius, 0, radius, Math.PI * 1.5, Math.PI / 2);
                    ctx.closePath();
                }
                ctx.fill();
                ctx.stroke();
            } else if (this.type === 1) {
                ctx.beginPath();
                var r = this.size * 0.6 * scale;
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                if (this.size > 14) {
                    ctx.beginPath();
                    ctx.arc(r * 0.6, r * 0.2, r * 0.85, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            } else {
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineWidth = 2.5 * scale;
                var len = this.size * 1.6;
                ctx.moveTo(-len / 2, 0);
                for (var i = -len / 2; i <= len / 2; i += 2) {
                    var waveY = Math.sin((i / len) * Math.PI * 3.5) * 3 * scale;
                    ctx.lineTo(i, waveY);
                }
                ctx.stroke();
            }

            ctx.restore();
        };

        var particles = [];
        for (var p = 0; p < PARTICLE_COUNT; p++) {
            particles.push(new Microbe());
        }

        function drawFrame() {
            ctx.clearRect(0, 0, width, height);

            var grad = ctx.createRadialGradient(
                width / 2, height / 2, width / 4,
                width / 2, height / 2, Math.max(width, height) * 0.8
            );
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(1, 'rgba(37, 99, 235, 0.02)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(function (particle) {
                particle.update();
                particle.draw();
            });
        }

        var rafId = null;

        function loop() {
            drawFrame();
            rafId = window.requestAnimationFrame(loop);
        }

        function start() {
            if (rafId === null && !motionQuery.matches && !document.hidden) {
                rafId = window.requestAnimationFrame(loop);
            }
        }

        function stop() {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        window.addEventListener('resize', function () {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        var onMotionChange = function (e) {
            if (e.matches) {
                stop();
            } else {
                start();
            }
        };
        if (typeof motionQuery.addEventListener === 'function') {
            motionQuery.addEventListener('change', onMotionChange);
        } else if (typeof motionQuery.addListener === 'function') {
            motionQuery.addListener(onMotionChange);
        }

        start();
    }

    /* ────────────────────────────────────────────────
     * Eventos globales
     * ──────────────────────────────────────────────── */
    function bindStaticEvents() {
        $('locked-modal-close').addEventListener('click', closeLockedModal);
        $('locked-backdrop').addEventListener('click', closeLockedModal);

        /* Mantener el foco dentro del modal (solo tiene un botón) */
        $('locked-modal').addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                $('locked-modal-close').focus();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;

            if (lightboxEl && lightboxEl.classList.contains('active')) {
                closeImageLightbox();
                return;
            }
            if (!$('locked-modal').hidden) {
                closeLockedModal();
                return;
            }
            if (state.history[state.history.length - 1] !== 'home') {
                navigateBack();
            }
        });
    }

    /* ────────────────────────────────────────────────
     * Arranque de la aplicación
     * ──────────────────────────────────────────────── */
    function bootstrap() {
        PATTERNS_LIST.forEach(function (p) {
            var pattern = PATTERN_REGISTRY[p.key];
            var errors = pattern ? validatePatternData(pattern) : ['Sin datos registrados'];
            if (pattern && errors.length === 0) {
                p.active = true;
                p.badge = 'NUEVO';
                p.badgeClass = '';
            } else {
                p.active = false;
                p.badge = 'NO DISPONIBLE';
                p.badgeClass = 'gray';
                if (pattern) {
                    console.error('Datos no válidos para el patrón "' + p.key + '":', errors);
                }
            }
        });

        renderPatternsGrid();
        bindStaticEvents();
        initMicrobeCanvas();
    }

    /* Con scripts diferidos, readyState es 'interactive' durante la ejecución
     * y DOMContentLoaded se dispara DESPUÉS de todos los scripts diferidos:
     * así garantizamos que los archivos de datos ya se han registrado. */
    if (document.readyState === 'complete') {
        bootstrap();
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap);
    }
})();
