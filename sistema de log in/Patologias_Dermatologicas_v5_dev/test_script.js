
// Variables de control de estado global
let currentTree = null;
let currentStepIdx = 0;
const configHideDev = false;

// ─────────────────────────────────────────────────────────────
// BASE DE DATOS DE PATRONES CLÍNICOS (ESTRUCTURA DE DATOS)
// ─────────────────────────────────────────────────────────────
const TREES = {

// ──────────────────── 1. PATRÓN ALOPÉCICO ────────────────────
alopécico: {
    name: 'Patrón Alopécico Canino',
    phases: ['Observación Visual','Exploración Física','Confirmación Laboratorio'],
    steps: [
        {
            title: '¿La pérdida de pelo se presenta en placas circulares y bien delimitadas con descamación fina?',
            desc: 'La alopecia anular localizada es típica de dermatofitosis (tiña) y demodicosis inicial, mientras que la alopecia simétrica difusa sugiere endocrinopatía.',
            instruct: '<p><strong>Examen clínico:</strong> Inspeccione el hocico, extremidades y lomo. Diferencie si la pérdida de pelo forma "anillos" de bordes limpios o si es difusa bilateral en tronco.</p>',
            opts: [
                { type:'pos', title:'Sí — Alopecia circular delimitada', desc:'Presencia de parches redondos alopécicos con escamas superficiales.', next:'alopécico-2' },
                { type:'neg', title:'No — Alopecia difusa o simétrica', desc:'Alopecia generalizada, simétrica o con patrón endocrino (tronco respetando extremidades).', next:'result-alopecia-endocrina' }
            ],
            type: 'visual',
            img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=320&fit=crop&auto=format'
        },
        {
            title: '¿La piel alopécica carece de calor local palpable y el paciente no presenta prurito activo?',
            desc: 'La dermatofitosis clásica no cursa con inflamación calorífica aguda ni rascado severo (prurito 0-3/10), a diferencia de la foliculitis bacteriana.',
            instruct: '<p><strong>Prueba física:</strong> Palpe el centro y borde de la lesión circular alopécica. Pregunte al propietario si hay rascado frecuente de esa zona.</p>',
            opts: [
                { type:'pos', title:'Sí — Placa fría y prurito nulo/leve', desc:'Lesión no eritematosa inflamatoria, compatible con dermatofitos.', next:'alopécico-3' },
                { type:'neg', title:'No — Piel caliente y prurito notable', desc:'Sugestivo de pioderma bacteriana secundaria o sarna demodécica infectada.', next:'result-derivar-alo' }
            ],
            type: 'diagram'
        },
        {
            title: 'Test de Wood o Cultivo DTM: ¿se aprecia fluorescencia verde brillante o cambio de color en el medio?',
            desc: 'La fluorescencia verdosa en tallos pilosos confirma Microsporum canis (50-60% de cepas). El cultivo DTM es el diagnóstico confirmatorio estándar.',
            instruct: '<p><strong>Procedimiento:</strong> Realice examen en oscuridad total con Lámpara de Wood. Si es negativo, siembre raspado periférico y pelos rotos en tubo DTM.</p>',
            opts: [
                { type:'pos', title:'Positivo — Fluorescencia o cultivo positivo', desc:'Diagnóstico fúngico confirmado.', next:'result-dermatofitosis' },
                { type:'neg', title:'Negativo — Sin fluorescencia ni crecimiento fúngico', desc:'Evaluación de foliculitis estéril o alopecia areata.', next:'result-alopecia-areata' }
            ],
            type: 'micro'
        }
    ],
    results: {
        'result-dermatofitosis': {
            diagnosis: 'Dermatofitosis Fúngica (Tiña Canina)',
            confidence: 'Alta (94%)',
            items: [
                'Lesiones alopécicas anulares delimitadas con descamación fina.',
                'Ausencia de eritema inflamatorio (lesiones frías al tacto) y prurito ausente.',
                'Confirmación laboratorial por fluorescencia activa Wood o cultivo DTM positivo.'
            ],
            treats: {
                'sistemico': [
                    { name:'Itraconazol oral', dose:'5-10 mg/kg VO cada 24 horas durante 4-6 semanas', note:'Administrar con alimento graso. Mantener hasta obtener cultivo de control negativo.' },
                    { name:'Terbinafina (Alternativa)', dose:'20-30 mg/kg VO cada 24 horas', note:'Gran penetración folicular. Utilizar si se prefiere evitar antifúngicos azólicos.' }
                ],
                'topico': [
                    { name:'Champú de Enilconazol o Miconazol 2%', dose:'Baño completo 2 veces por semana, dejando actuar 10 minutos', note:'Obligatorio para evitar la diseminación de esporas (fómites) en el entorno.' }
                ],
                'entorno': [
                    { name:'Limpieza de superficies', dose:'Aspirado diario y aplicación de lejía diluida 1:10 en zonas de descanso', note:'Las esporas de Microsporum canis son altamente resistentes en el ambiente.' }
                ]
            }
        },
        'result-alopecia-areata': {
            diagnosis: 'Alopecia Areata (Origen Autoinmune)',
            confidence: 'Intermedia (70%)',
            items: [
                'Alopecia localizada circular limpia.',
                'Ausencia de calor, costras, pústulas o prurito.',
                'Descarte fúngico de tiña (Wood y cultivos negativos).'
            ],
            treats: {
                'sistemico': [
                    { name:'Derivación para biopsia cutánea', dose:'Punch de 6mm de folículos activos periféricos', note:'La histopatología mostrará infiltración linfocitaria bulbar (peribulbitis en "enjambre de abejas").' }
                ],
                'topico': [
                    { name:'Pipetas dermocosméticas reestructurantes', dose:'Aplicación semanal (Allerderm®)', note:'Favorece la hidratación y nutrición del estrato córneo para estimular el rebrote folicular.' }
                ],
                'entorno': [
                    { name:'Monitorización clínica de repoblación', dose:'Control fotográfico cada 21 días', note:'Muchas alopecias areatas o de origen post-vacunal se resuelven espontáneamente sin fármacos.' }
                ]
            }
        },
        'result-alopecia-endocrina': {
            diagnosis: 'Sospecha de Alopecia Endocrina / Sistémica',
            confidence: 'Intermedia (75%)',
            items: [
                'Pérdida de pelo con patrón simétrico bilateral, respetando cabeza y extremidades.',
                'Ausencia de prurito primario y signos inflamatorios.',
                'Piel adelgazada con comedones y posible hiperpigmentación.'
            ],
            treats: {
                'sistemico': [
                    { name:'Perfil Hormonal Completo', dose:'Determinación de T4 libre, TSH y prueba de estimulación con ACTH', note:'Descartar Hipotiroidismo canino o Cushing como causas primarias de la atrofia folicular.' }
                ],
                'topico': [
                    { name:'Champú queratomodulador suave', dose:'Baño cada 10 días para remover descamación y detritos grasos secundarios', note:'Previene la colonización oportuna de levaduras Malassezia.' }
                ],
                'entorno': [
                    { name:'Control de dieta y peso corporal', dose:'Evaluación nutricional de grasas esenciales', note:'Los pacientes hipotiroideos suelen presentar letargo y ganancia de peso concomitantes.' }
                ]
            }
        },
        'result-derivar-alo': {
            diagnosis: 'Foliculitis Infecciosa Mixta',
            confidence: 'Baja (40%)',
            items: [
                'Alopecia de patrón circular pero asociada a prurito y calor dérmico.',
                'Sospecha de demodicosis complicada o foliculitis estafilocócica.',
                'Requiere análisis citológicos adicionales.'
            ],
            treats: {
                'sistemico': [
                    { name:'Citología de raspado profundo y cinta adhesiva', dose:'Examen a 400x para buscar ácaros Demodex canis', note:'El ácaro folicular Demodex causa alopecia circular que se complica rápidamente con pioderma bacteriana.' },
                    { name:'Antibioterapia empírica temporal', dose:'Cefalexina 22 mg/kg VO cada 12 horas si hay pápulas/pústulas satélite', note:'Trata la foliculitis bacteriana concurrente que distorsiona el patrón alopécico.' }
                ],
                'topico': [
                    { name:'Lavados localizados con clorhexidina 3%', dose:'Aplicación diaria en la placa afectada', note:'Disminuye la carga bacteriana folicular sin enmascarar posibles cultivos fúngicos tardíos.' }
                ],
                'entorno': [
                    { name:'Prevención antiparasitaria sistémica', dose:'Isoxazolinas mensuales (Afoxolaner/Fluralaner)', note:'Excelente espectro contra demodicosis concomitante.' }
                ]
            }
        }
    }
},

// ──────────────────── 2. PATRÓN PUSTULAR-VESICULAR ────────────────────
pustular_vesicular: {
    name: 'Patrón Pustular-Vesicular',
    phases: ['Observación Visual','Exploración Física','Confirmación Laboratorio'],
    steps: [
        {
            title: '¿Se aprecian pústulas amarillentas foliculares o collaretes epidérmicos circulares con borde descamativo?',
            desc: 'La pústula es la lesión primaria de la infección bacteriana dérmica, mientras que el collarete epidérmico representa una pústula rota curada.',
            instruct: '<p><strong>Examen clínico:</strong> Explore ingles, axilas y abdomen. Diferencie pústulas frágiles bacterianas de vesículas de contenido claro (autoinmunes o víricas).</p>',
            opts: [
                { type:'pos', title:'Sí — Pústulas/Collaretes presentes', desc:'Lesiones clásicas compatibles con foliculitis superficial estafilocócica.', next:'pustular_vesicular-2' },
                { type:'neg', title:'No — Vesículas claras o costras gruesas solas', desc:'Lesiones ulceradas o vesiculosas no centradas en folículos.', next:'result-derivar-pustular' }
            ],
            type: 'visual',
            img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=320&fit=crop&auto=format'
        },
        {
            title: '¿La exploración física de contacto revela calor local marcado y dolor a la palpación de las pústulas?',
            desc: 'La foliculitis bacteriana superficial activa genera una respuesta inflamatoria focal con dolor leve al tacto e hipertermia regional.',
            instruct: '<p><strong>Prueba física:</strong> Compare la temperatura con una zona de piel sana. Ejerza presión leve sobre las pústulas para notar molestia.</p>',
            opts: [
                { type:'pos', title:'Sí — Calor local y dolor activo', desc:'Signos compatibles con infección bacteriana activa aguda.', next:'pustular_vesicular-3' },
                { type:'neg', title:'No — Lesiones indoloras/frías', desc:'Falta de calor inflamatorio agudo. Sospechar pústulas estériles o pénfigo.', next:'result-pemphigus-foliaceus' }
            ],
            type: 'diagram'
        },
        {
            title: 'Citología por impronta: ¿se identifican neutrófilos degenerados con cocos bacterianos intracelulares?',
            desc: 'La visualización de bacterias en el citoplasma de los neutrófilos confirma infección bacteriana activa. Si se observan células acantolíticas, apunta a pénfigo.',
            instruct: '<p><strong>Procedimiento:</strong> Rompa una pústula intacta con aguja de 21G, presione un portaobjetos sobre el pus, tiña con Diff-Quik y observe a 1000x.</p>',
            opts: [
                { type:'pos', title:'Cocos intracelulares visibles', desc:'Confirmación de pioderma superficial bacteriana.', next:'result-pioderma' },
                { type:'neg', title:'Ausencia de bacterias o células acantolíticas solas', desc:'Sospecha de pústula estéril de origen autoinmune.', next:'result-pemphigus-foliaceus' }
            ],
            type: 'micro'
        }
    ],
    results: {
        'result-pioderma': {
            diagnosis: 'Pioderma Superficial Bacteriana',
            confidence: 'Alta (95%)',
            items: [
                'Presencia de pústulas foliculares y collaretes epidérmicos en áreas de piel fina.',
                'Hipertermia local y dolor inflamatorio a la palpación.',
                'Citología con neutrófilos degenerados repletos de cocos Gram+ (Staphylococcus pseudintermedius).'
            ],
            treats: {
                'sistemico': [
                    { name:'Cefalexina vía oral', dose:'15-30 mg/kg VO cada 12 horas durante 21-30 días', note:'Tratar hasta 7-10 días después de la resolución clínica completa de los collaretes. No interrumpir antes.' },
                    { name:'Cefovecina SC (Alternativo)', dose:'8 mg/kg SC dosis única (Convenia®)', note:'Alternativa inyectable de larga duración si la obediencia del tratamiento oral falla.' }
                ],
                'topico': [
                    { name:'Champú de Clorhexidina al 3%', dose:'Baños cada 3 días frotando las zonas inguinales y abdominales', note:'Efecto antiséptico directo que acorta los días de tratamiento antibiótico oral.' }
                ],
                'entorno': [
                    { name:'Investigación etiológica primaria', dose:'Estudio de alergias o atopia si la pioderma recurre frecuentemente', note:'La pioderma es casi siempre secundaria a un daño de barrera subyacente.' }
                ]
            }
        },
        'result-pemphigus-foliaceus': {
            diagnosis: 'Pénfigo Foliáceo (Enfermedad Autoinmune)',
            confidence: 'Alta (90%)',
            items: [
                'Pústulas amarillentas y collaretes secos localizados en cara, hocico y almohadillas.',
                'Ausencia de calor bacteriano agudo y dolor típico.',
                'Citología libre de bacterias con presencia masiva de neutrófilos no degenerados y células acantolíticas.'
            ],
            treats: {
                'sistemico': [
                    { name:'Prednisona (Terapia inmunosupresora)', dose:'2-3 mg/kg VO cada 24 horas inicialmente hasta remisión', note:'Efecto inmunosupresor. Requiere monitorización estricta y analíticas de control regulares.' },
                    { name:'Azatioprina (Coadyuvante)', dose:'1-2 mg/kg VO cada 24 horas para ahorro de corticoides', note:'No utilizar en gatos. Tarda semanas en ejercer su máximo efecto terapéutico.' }
                ],
                'topico': [
                    { name:'Champú de fitosfingosina o calmante', dose:'Baños suaves cada 7 días para control de descamación', note:'No utilizar champús antisépticos agresivos que resequen el estrato córneo vulnerable.' }
                ],
                'entorno': [
                    { name:'Evitar exposición solar directa', dose:'Reducción de radiación UV en horas centrales del día', note:'La radiación ultravioleta exacerba la acantólisis inmunomediada del pénfigo.' }
                ]
            }
        },
        'result-derivar-pustular': {
            diagnosis: 'Dermatitis Pustulocostrosa Atípica (Derivación)',
            confidence: 'Baja (35%)',
            items: [
                'Vesículas/pústulas de gran tamaño no asociadas a folículos.',
                'Falta de signos citológicos concluyentes en frotis.',
                'Sospecha de dermatosis sensible al zinc o pústulas secundarias a fármacos.'
            ],
            treats: {
                'sistemico': [
                    { name:'Programar Biopsia Cutánea', dose:'Toma de muestras por punch de 6-8mm de lesiones activas', note:'Única prueba definitiva para clasificar pénfigos profundos o dermatosis metabólicas.' }
                ],
                'topico': [
                    { name:'Champú queratolítico suave de azufre y ácido salicílico', dose:'Baño semanal para remover descamación dura', note:'Mantiene la piel protegida sin interferir con la histopatología.' }
                ],
                'entorno': [
                    { name:'Suplementación con Zinc y Ácidos Grasos', dose:'Suplemento nutricional diario', note:'Descartar deficiencia relativa de zinc, común en razas nórdicas.' }
                ]
            }
        }
    }
},

// ──────────────────── 3. PATRÓN PRURIGINOSO ────────────────────
pruriginoso: {
    name: 'Patrón Pruriginoso Canino',
    phases: ['Observación Visual','Exploración Física','Confirmación Laboratorio'],
    steps: [
        {
            title: '¿Las lesiones eritematosas se localizan preferentemente en pabellones auriculares, codos y tarsos?',
            desc: 'La distribución anatómica del prurito y lesiones es clave: sarna sarcóptica afecta bordes auriculares y codos, mientras que atopia prefiere axilas, ingles y cara.',
            instruct: '<p><strong>Examen clínico:</strong> Inspeccione la cara interna y márgenes de las orejas, los codos del perro y la cara ventral. Observe si hay eritema o pápulas eritematosas.</p>',
            opts: [
                { type:'pos', title:'Sí — Márgenes auriculares y codos afectados', desc:'Distribución clásica de sarna sarcóptica (escabiosis).', next:'pruriginoso-2' },
                { type:'neg', title:'No — Afecta axilas, ingles o espacios interdigitales', desc:'Distribución clásica de Dermatitis Atópica o alergia alimentaria.', next:'result-dermatitis-atopica-excl' }
            ],
            type: 'visual',
            img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=320&fit=crop&auto=format'
        },
        {
            title: '¿Al frotar el margen auricular del paciente se desencadena el test de reflejo otopodal positivo?',
            desc: 'El test otopodal es altamente sugestivo de sarna sarcóptica activa debido a la hipersensibilidad al movimiento del ácaro en la oreja.',
            instruct: '<p><strong>Prueba física:</strong> Sujete el pabellón auricular y frote el margen suavemente con el dedo pulgar. Si la pata trasera ipsilateral realiza movimientos de rascado, el test es positivo.</p>',
            opts: [
                { type:'pos', title:'Sí — Reflejo otopodal positivo', desc:'Signo clínico altamente confirmatorio de infestación acaricida.', next:'pruriginoso-3' },
                { type:'neg', title:'No — Reflejo otopodal negativo', desc:'Ausencia de rascado reflejo. Sugiere atopia u otitis alérgica pura.', next:'result-dermatitis-atopica-excl' }
            ],
            type: 'diagram'
        },
        {
            title: 'Raspado cutáneo profundo: ¿se visualizan ácaros Sarcoptes scabiei o sus huevos al microscopio?',
            desc: 'El raspado cutáneo confirma el ácaro, pero debido a la baja carga en perros y la respuesta inmune, suele dar falsos negativos hasta en el 50% de los casos.',
            instruct: '<p><strong>Procedimiento:</strong> Aplique aceite mineral. Raspe profundamente con hoja de bisturí hasta sangrado capilar fino. Observe a 100x con KOH.</p>',
            opts: [
                { type:'pos', title:'Ácaros visibles — Confirmado', desc:'Visualización del ácaro S. scabiei. Diagnóstico confirmatorio.', next:'result-sarcoptes-confirmado' },
                { type:'neg', title:'Ácaros no visibles — Raspado negativo', desc:'Ausencia de parásitos en muestra. Se sugiere tratamiento terapéutico de prueba.', next:'result-sarna-empirica' }
            ],
            type: 'micro'
        }
    ],
    results: {
        'result-sarcoptes-confirmado': {
            diagnosis: 'Sarna Sarcóptica (Escabiosis) Confirmada',
            confidence: 'Alta (96%)',
            items: [
                'Alopecia costrosa localizada en márgenes auriculares y codos.',
                'Reflejo otopodal positivo e hipertermia regional.',
                'Confirmación directa por visualización microscópica de Sarcoptes scabiei.'
            ],
            treats: {
                'sistemico': [
                    { name:'Isoxazolinas acaricidas', dose:'Fluralaner (Bravecto®) o Afoxolaner (NexGard®) dosis comercial estándar', note:'Tratamiento altamente eficaz de dosis única o mensual. Resuelve la infestación rápidamente.' },
                    { name:'Selamectina Spot-on (Alternativo)', dose:'6 mg/kg vía tópica cada 15 días, 3 aplicaciones', note:'Indicado en cachorros o en pacientes con historial de convulsiones sensibles a isoxazolinas.' }
                ],
                'topico': [
                    { name:'Champú antiséptico queratolítico', dose:'Baños semanales con champú calmante de avena o clorhexidina al 2%', note:'Favorece el desprendimiento de costras y reduce el prurito secundario.' }
                ],
                'entorno': [
                    { name:'Lavado de camas y accesorios', dose:'Lavar todos los textiles en contacto con el perro a >60ºC', note:'Evita la reinfestación pasiva por ácaros caídos al ambiente.' }
                ]
            }
        },
        'result-sarna-empirica': {
            diagnosis: 'Escabiosis Clínica (Raspado Negativo)',
            confidence: 'Intermedia (80%)',
            items: [
                'Signos clínicos e historia totalmente compatibles con sarna sarcóptica.',
                'Reflejo otopodal positivo.',
                'Raspado cutáneo negativo (común por baja densidad parasitaria o autoinmunidad).'
            ],
            treats: {
                'sistemico': [
                    { name:'Tratamiento acaricida de prueba (Bravecto/NexGard)', dose:'Administrar 1 dosis completa de Isoxazolina vía oral', note:'Por protocolo dermatológico, ante alta sospecha de sarna con raspado negativo, debe realizarse tratamiento de prueba antes de diagnosticar alergias.' },
                    { name:'Cefalexina oral (si hay infección secundaria)', dose:'22 mg/kg VO cada 12 horas si hay pústulas/exudado costroso', note:'Tratamiento de la pioderma secundaria causada por el rascado intenso.' }
                ],
                'topico': [
                    { name:'Champú hidratante y calmante', dose:'Baños cada 4 días durante las primeras 2 semanas', note:'Disminuye el eritema y acondiciona la piel traumatizada por rascado.' }
                ],
                'entorno': [
                    { name:'Control del prurito de transición', dose:'Apoquel (Oclacitinib) 0.4-0.6 mg/kg VO cada 12h durante los primeros 4 días', note:'Alivia el prurito agudo mientras el acaricida reduce la población de ácaros.' }
                ]
            }
        },
        'result-dermatitis-atopica-excl': {
            diagnosis: 'Dermatitis Atópica Canina (DAC)',
            confidence: 'Alta (92%)',
            items: [
                'Eritema y prurito bilateral en flexuras (axilas, ingles) y cara interdigital.',
                'Reflejo otopodal negativo y ausencia de patrón auricular periférico compatible con sarna.',
                'Historia de prurito crónico persistente tras exclusión de alergia alimentaria y DAP.'
            ],
            treats: {
                'sistemico': [
                    { name:'Oclacitinib (Apoquel®)', dose:'0.4-0.6 mg/kg VO cada 12 horas por 14 días, luego cada 24 horas', note:'Inhibidor de JAK-1. Bloquea selectivamente la vía inflamatoria del prurito con rapidez de acción (<4h).' },
                    { name:'Lokivetmab SC (Cytopoint®) — Terapia Biológica', dose:'2 mg/kg subcutáneo cada 4-8 semanas según necesidad', note:'Anticuerpo monoclonal que neutraliza la IL-31. Excelente perfil de seguridad en tratamientos crónicos a largo plazo.' }
                ],
                'topico': [
                    { name:'Champú de Ceramidas y Fitosfingosina', dose:'Baño semanal con tiempo de contacto de 10 minutos (Douxo S3®)', note:'Restaura la barrera lipídica deficiente en la piel del paciente atópico.' }
                ],
                'entorno': [
                    { name:'Inmunoterapia específica (Vacuna)', dose:'Formulación de hiposensibilización alérgeno-específica', note:'Único tratamiento curativo modificador de la atopia. Requiere test intradérmico o serología IgE previa.' }
                ]
            }
        }
    }
}
};

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE PATRONES EN PANTALLA INICIAL (FILTRABLE)
// ─────────────────────────────────────────────────────────────
const PATTERNS_LIST = [
    {
        key: 'alopécico',
        title: 'Patrón Alopécico',
        desc: 'Áreas de pérdida de pelo parcial o total. Parches circulares localizados o alopecia endocrina simétrica.',
        badge: 'FÚNGICO / ENDOCRINO',
        badgeClass: 'purple',
        img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=320&fit=crop&auto=format',
        active: true
    },
    {
        key: 'pustular_vesicular',
        title: 'Patrón Pustular-vesicular',
        desc: 'Elevaciones con contenido purulento (pústulas), vesículas transitorias o collaretes descamativos.',
        badge: 'BACTERIANO / AUTOINMUNE',
        badgeClass: 'orange',
        img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=320&fit=crop&auto=format',
        active: true
    },
    {
        key: 'pruriginoso',
        title: 'Patrón Pruriginoso',
        desc: 'Prurito persistente (rascado, lamido, mordisqueo). Eritema difuso en pliegues flexores o márgenes articulares.',
        badge: 'ALÉRGICO / PARASITARIO',
        badgeClass: 'red',
        img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=320&fit=crop&auto=format',
        active: true
    },
    {
        key: 'seborreico',
        title: 'Patrón Descamativo-seborreico',
        desc: 'Descamación excesiva, caspa, piel grasa u olor rancio. Lesiones descamativas en tronco.',
        badge: 'PRÓXIMAMENTE',
        badgeClass: 'gray',
        img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&h=320&fit=crop&auto=format',
        active: false
    },
    {
        key: 'ulcerativo',
        title: 'Patrón Erosivo-ulcerativo',
        desc: 'Pérdida de la integridad de la epidermis. Exudación húmeda, úlceras profundas, costras hemáticas.',
        badge: 'PRÓXIMAMENTE',
        badgeClass: 'gray',
        img: 'https://images.unsplash.com/photo-1537151608828-ea2b117b6281?w=500&h=320&fit=crop&auto=format',
        active: false
    },
    {
        key: 'nodular',
        title: 'Patrón Papulo-placo-nodular',
        desc: 'Masas cutáneas sólidas. Elevaciones firmes de la dermis de diverso tamaño (pápulas o nódulos).',
        badge: 'PRÓXIMAMENTE',
        badgeClass: 'gray',
        img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&h=320&fit=crop&auto=format',
        active: false
    }
];

function renderPatternsGrid() {
    const grid = document.getElementById('diseases-grid');
    const filteredPatterns = configHideDev 
        ? PATTERNS_LIST.filter(p => p.active) 
        : PATTERNS_LIST;

    grid.innerHTML = filteredPatterns.map(p => {
        let clickHandler = p.active 
            ? `startTree('${p.key}')` 
            : `showLockedPattern('${p.title}', '${p.key}')`;
            
        let badgeEl = p.badge 
            ? `<span class="card-overlay-badge ${p.badgeClass}">${p.badge}</span>` 
            : '';

        return `
            <div class="disease-card" onclick="${clickHandler}">
                <div class="card-image-container">
                    <img src="${p.img}" alt="${p.title}" loading="lazy">
                    ${badgeEl}
                    <div class="card-icon-overlay">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 16 14"/></svg>
                    </div>
                </div>
                <div class="card-details">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                </div>
            </div>
        `;
    }).join('');
}




// ─────────────────────────────────────────────────────────────
// CONTROL DE FLUJO DE PANTALLAS
// ─────────────────────────────────────────────────────────────
let currentActiveTab = 'sistemico';

function startTree(key) {
    currentTree = key;
    currentStepIdx = 0;
    
    renderStep();
    showScreen('screen-tree');
}

function goHome() {
    currentTree = null;
    currentStepIdx = 0;
    showScreen('screen-home');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showLockedPattern(title, key) {
    document.getElementById('locked-pattern-title').textContent = title + ' (En Calibración)';
    document.getElementById('locked-pattern-desc').textContent = `El módulo para el ${title} se encuentra actualmente en fase de validación clínica de su base de datos. Estará disponible en la próxima actualización.`;
    document.getElementById('locked-modal').style.display = 'block';
    document.getElementById('locked-backdrop').style.display = 'block';
}

function closeLockedModal() {
    document.getElementById('locked-modal').style.display = 'none';
    document.getElementById('locked-backdrop').style.display = 'none';
}

// Genera los elementos visuales de la pregunta en la pantalla de consulta (Referencia clínica pura)
function renderVisualReference(stepObj) {
    if (stepObj.type === 'visual') {
        // Retornar la foto de la lesión
        return `
            <div class="step-reference-photo-wrap">
                <img src="${stepObj.img}" alt="Foto de lesión de referencia">
            </div>
        `;
    } 
    else if (stepObj.type === 'diagram') {
        // Silueta anatómica estática de referencia
        return `
            <div class="step-reference-diagram-wrap">
                <svg class="hud-dog-silhouette" viewBox="0 0 300 200">
                    <path d="M 40,110 C 45,100 50,85 55,80 C 60,75 58,55 60,45 C 62,35 68,32 72,40 C 75,45 74,65 77,70 C 85,72 105,74 125,76 C 145,78 165,72 185,68 C 205,64 215,62 225,70 C 230,75 232,90 235,95 C 245,98 255,96 260,94 C 265,92 268,96 262,100 C 255,105 245,112 238,114 C 235,116 230,125 228,135 C 225,145 228,175 224,178 C 220,180 215,180 212,176 C 208,170 212,150 208,140 C 195,140 185,141 175,143 C 170,147 168,172 164,178 C 160,180 155,180 152,176 C 148,170 150,150 145,140 C 130,140 115,140 100,140 C 95,145 92,172 88,178 C 84,180 79,180 76,176 C 72,170 74,150 70,140 C 62,140 55,140 48,142 C 45,145 42,172 38,178 C 34,180 29,180 26,176 C 22,170 25,140 22,130 C 18,126 12,120 10,115 C 8,110 12,105 18,107 C 24,109 32,110 40,110 Z" 
                        fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                    ${renderManualHotspots(currentTree)}
                </svg>
            </div>
        `;
    } 
    else if (stepObj.type === 'micro') {
        // Lente de microscopio de referencia estático
        let labSVG = "";
        if (currentTree === 'pruriginoso') {
            labSVG = `
                <svg class="microscope-content-svg" viewBox="0 0 100 100">
                    <path d="M 50,30 C 42,30 38,40 38,50 C 38,60 42,70 50,70 C 58,70 62,60 62,50 C 62,40 58,30 50,30 Z" fill="rgba(148,163,184,0.15)" stroke="var(--cyan)" stroke-width="1.5" />
                    <circle cx="47" cy="42" r="1.5" fill="var(--danger)" />
                    <circle cx="53" cy="42" r="1.5" fill="var(--danger)" />
                    <path d="M 38,45 Q 26,40 22,45 M 38,52 Q 24,52 20,58 M 38,60 Q 24,68 22,75" fill="none" stroke="var(--cyan)" stroke-width="1.5" />
                    <path d="M 62,45 Q 74,40 78,45 M 62,52 Q 76,52 80,58 M 62,60 Q 76,68 78,75" fill="none" stroke="var(--cyan)" stroke-width="1.5" />
                </svg>
            `;
        } else if (currentTree === 'pustular_vesicular') {
            labSVG = `
                <svg class="microscope-content-svg" viewBox="0 0 100 100">
                    <path d="M 50,22 C 34,22 18,34 18,50 C 18,64 28,72 38,77 C 46,80 60,82 72,75 C 82,67 82,50 82,40 C 82,26 66,22 50,22 Z" fill="rgba(99,102,241,0.1)" stroke="var(--primary)" stroke-width="1.2" stroke-dasharray="2 2" />
                    <circle cx="46" cy="42" r="2.2" fill="var(--cyan)" />
                    <circle cx="50" cy="44" r="2.2" fill="var(--cyan)" />
                    <circle cx="44" cy="46" r="2.2" fill="var(--cyan)" />
                    <circle cx="28" cy="38" r="2.2" fill="var(--cyan)" />
                    <circle cx="70" cy="60" r="2.2" fill="var(--cyan)" />
                </svg>
            `;
        } else if (currentTree === 'alopécico') {
            labSVG = `
                <svg class="microscope-content-svg" viewBox="0 0 100 100">
                    <path d="M 30,0 L 45,100" stroke="#1e293b" stroke-width="8" />
                    <path d="M 30,0 L 45,100" stroke="#10b981" stroke-width="3" />
                    <path d="M 70,0 L 55,100" stroke="#1e293b" stroke-width="8" />
                    <path d="M 70,0 L 55,100" stroke="#10b981" stroke-width="3" />
                    <circle cx="35" cy="40" r="2.5" fill="#34d399" filter="drop-shadow(0 0 3px #10b981)" />
                    <circle cx="65" cy="35" r="3" fill="#34d399" filter="drop-shadow(0 0 3px #10b981)" />
                </svg>
            `;
        }
        return `
            <div class="step-reference-diagram-wrap">
                <div class="microscope-lens">
                    ${labSVG}
                </div>
            </div>
        `;
    }
    return '';
}

// Retorna marcas fijas de hotspots para la silueta del perro
function renderManualHotspots(treeKey) {
    if (treeKey === 'pruriginoso') {
        return `
            <g>
                <circle cx="68" cy="45" r="3.5" fill="var(--cyan)" />
                <text x="76" y="44" fill="var(--text-secondary)" font-size="7" font-family="monospace">Bordes Auriculares</text>
                <circle cx="88" cy="140" r="3.5" fill="var(--cyan)" />
                <text x="96" y="143" fill="var(--text-secondary)" font-size="7" font-family="monospace">Codos</text>
                <circle cx="168" cy="140" r="3.5" fill="var(--cyan)" />
                <text x="178" y="143" fill="var(--text-secondary)" font-size="7" font-family="monospace">Tarsos</text>
            </g>
        `;
    } else if (treeKey === 'pustular_vesicular') {
        return `
            <g>
                <circle cx="130" cy="135" r="3.5" fill="var(--cyan)" />
                <text x="140" y="138" fill="var(--text-secondary)" font-size="7" font-family="monospace">Abdomen Ventral</text>
                <circle cx="105" cy="125" r="3.5" fill="var(--cyan)" />
                <text x="115" y="123" fill="var(--text-secondary)" font-size="7" font-family="monospace">Pliegue Axilar</text>
            </g>
        `;
    } else if (treeKey === 'alopécico') {
        return `
            <g>
                <circle cx="50" cy="85" r="3.5" fill="var(--cyan)" />
                <text x="22" y="74" fill="var(--text-secondary)" font-size="7" font-family="monospace">Cara / Hocico</text>
                <circle cx="38" cy="165" r="3.5" fill="var(--cyan)" />
                <text x="46" y="168" fill="var(--text-secondary)" font-size="7" font-family="monospace">Extr. Anteriores</text>
                <circle cx="135" cy="78" r="3.5" fill="var(--cyan)" />
                <text x="143" y="75" fill="var(--text-secondary)" font-size="7" font-family="monospace">Región Lumbar</text>
            </g>
        `;
    }
    return '';
}

// ─────────────────────────────────────────────────────────────
// RENDERIZADO DE PASOS DEL ÁRBOL
// ─────────────────────────────────────────────────────────────
function renderStep() {
    const t = TREES[currentTree];
    const s = t.steps[currentStepIdx];
    const total = t.steps.length;
    const pct = ((currentStepIdx + 1) / total) * 100;

    // Actualiza textos de progreso
    document.getElementById('prog-title').textContent = t.phases[currentStepIdx];
    document.getElementById('prog-step').textContent = `PASO ${currentStepIdx + 1} DE ${total}`;
    document.getElementById('prog-fill').style.width = pct + '%';

    // Rellena la terminal visual integrada (dentro de la misma tarjeta del paso para un look limpio y centrado)
    const visualContent = renderVisualReference(s);

    // Renderizar la tarjeta de decisión
    const stepCard = document.getElementById('step-card');
    stepCard.innerHTML = `
        <div class="step-header-banner">
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
        </div>
        ${visualContent}
        <div class="step-body-content">
            <div class="step-clinical-instruction">
                ${s.instruct}
            </div>
            <div class="diagnostic-options-list">
                ${s.opts.map(o => `
                    <button class="option-button" onclick="chooseOption('${o.next}')">
                        <div class="option-btn-icon ${o.type==='pos'?'pos':'neg'}">
                            ${o.type==='pos'
                                ? '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
                                : '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}
                        </div>
                        <div class="option-btn-texts">
                            <span class="title">${o.title}</span>
                            <span class="desc">${o.desc}</span>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function chooseOption(next) {
    if (next.startsWith('result-')) {
        showResultScreen(next);
    } else {
        currentStepIdx = parseInt(next.split('-')[1]) - 1;
        renderStep();
    }
}

// ─────────────────────────────────────────────────────────────
// PANTALLA DE RESULTADOS Y TRATAMIENTOS
// ─────────────────────────────────────────────────────────────
let activeResultData = null;

function showResultScreen(resultKey) {
    const r = TREES[currentTree].results[resultKey];
    activeResultData = r;
    
    document.getElementById('result-diagnosis-title').textContent = r.diagnosis;
    document.getElementById('result-confidence-val').textContent = r.confidence;
    
    const confValEl = document.getElementById('result-confidence-val');
    if (r.confidence.includes('Alta')) {
        confValEl.className = 'val';
        confValEl.style.color = 'var(--success)';
        confValEl.style.borderColor = 'var(--success-border)';
    } else if (r.confidence.includes('Intermedia')) {
        confValEl.className = 'val';
        confValEl.style.color = 'var(--warning)';
        confValEl.style.borderColor = 'var(--warning-border)';
    } else {
        confValEl.className = 'val';
        confValEl.style.color = 'var(--danger)';
        confValEl.style.borderColor = 'var(--danger-border)';
    }

    const factsContainer = document.getElementById('result-facts-container');
    factsContainer.innerHTML = r.items.map((item, idx) => `
        <div class="fact-step-item">
            <span class="fact-step-num">Fase ${idx + 1}</span>
            <div>${item}</div>
        </div>
    `).join('');

    const notesTextarea = document.getElementById('clinical-notes-textarea');
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    notesTextarea.value = `INFORME CLÍNICO DERMATOLÓGICO — FECHA: ${today}
------------------------------------------------------------
PACIENTE CANINO MOCK-DEMO
SINTOMATOLOGÍA: Evaluación por patrón dermatológico primario.

DIAGNÓSTICO PRESUNTIVO: ${r.diagnosis} (Confianza: ${r.confidence})
CRITERIOS CLÍNICOS COMPROBADOS:
${r.items.map((it, i) => ` - Fase ${i+1}: ${it}`).join('\n')}

PROTOCOLO DE TRATAMIENTO:
${Object.keys(r.treats).map(cat => {
    let catName = cat === 'sistemico' ? 'Sistémico (Oral)' : cat === 'topico' ? 'Tópico / Acondicionamiento' : 'Manejo Ambiental';
    return `[${catName}] \n` + r.treats[cat].map(t => `  * ${t.name}: ${t.dose}`).join('\n');
}).join('\n')}
------------------------------------------------------------
Firma: Dr/a. Veterinario Clínico`;

    renderTreatmentTabs();
    showScreen('screen-result');
}

function renderTreatmentTabs() {
    const r = activeResultData;
    const tabsNav = document.getElementById('treatment-tabs-nav');
    
    const availableCategories = Object.keys(r.treats);
    currentActiveTab = availableCategories[0];

    tabsNav.innerHTML = availableCategories.map(cat => {
        let label = "";
        if (cat === 'sistemico') label = "Sistémico (Oral)";
        else if (cat === 'topico') label = "Tópico / Baños";
        else if (cat === 'entorno') label = "Medio / Soporte";
        
        return `
            <button class="tab-nav-btn ${cat === currentActiveTab ? 'active' : ''}" 
                    onclick="switchTreatmentTab('${cat}')">
                ${label}
            </button>
        `;
    }).join('');

    renderTreatmentTabContent();
}

function switchTreatmentTab(categoryKey) {
    currentActiveTab = categoryKey;
    
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const buttons = document.querySelectorAll('.tab-nav-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${categoryKey}'`)) {
            btn.classList.add('active');
        }
    });

    renderTreatmentTabContent();
}

function renderTreatmentTabContent() {
    const r = activeResultData;
    const contentPanel = document.getElementById('treatment-tab-content');
    const currentTreats = r.treats[currentActiveTab] || [];
    
    if (currentTreats.length === 0) {
        contentPanel.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No se requieren acciones específicas para esta categoría.</p>`;
        return;
    }

    let cevaProduct = "Douxo S3 Calm Champú (Ceva)";
    const diag = r.diagnosis.toLowerCase();
    if (diag.includes('pioderma') || diag.includes('foliculitis') || diag.includes('fúngica') || diag.includes('tiña')) {
        cevaProduct = "Douxo S3 Pyo Champú (Ceva) — Antiséptico purificante";
    } else if (diag.includes('atopia') || diag.includes('areata')) {
        cevaProduct = "Douxo S3 Calm Pipetas (Ceva) — Alivio de prurito y barrera cutánea";
    } else if (diag.includes('seborreica') || diag.includes('endocrina') || diag.includes('atípica')) {
        cevaProduct = "Douxo S3 Seb Champú (Ceva) — Control de descamación y grasa";
    } else {
        cevaProduct = "Douxo S3 Calm Champú (Ceva) — Hidratación y calma de prurito";
    }

    contentPanel.innerHTML = currentTreats.map(t => `
        <div class="treatment-prescription-block">
            <h4>${t.name}</h4>
            <div class="dose-text">${t.dose}</div>
            <div class="note-text"><strong>Indicaciones:</strong> ${t.note}</div>
        </div>
    `).join('') + `
        <div class="ceva-cta-block" style="margin-top: 16px; padding: 14px; background: rgba(6, 182, 212, 0.08); border: 1px dashed var(--cyan-border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display:flex; flex-direction:column; gap:2px;">
                <span style="font-size: 0.65rem; color: var(--cyan); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Tratamiento Coadyuvante Recomendado</span>
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">${cevaProduct}</span>
            </div>
            <a href="https://www.ceva.es/Productos" target="_blank" onclick="trackCevaClick()" class="btn-action btn-primary-action" style="padding: 6px 12px; font-size: 0.72rem; border-radius: var(--radius-sm); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; margin-bottom: 0;">
                <span>Ver Ficha Técnica</span>
                <svg viewBox="0 0 24 24" style="width:12px; height:12px; stroke:currentColor; fill:none; stroke-width:3; margin-bottom:0;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
        </div>
    `;
}

function copyClinicalRecord() {
    const textarea = document.getElementById('clinical-notes-textarea');
    textarea.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.btn-action-secondary');
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        ¡Copiado con Éxito!
    `;
    copyBtn.style.color = "var(--success)";
    copyBtn.style.borderColor = "var(--success-border)";
    
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.color = "";
        copyBtn.style.borderColor = "";
    }, 2000);
}

function trackCevaClick() {
    let clicks = parseInt(localStorage.getItem('ceva_clicks') || '0');
    localStorage.setItem('ceva_clicks', (clicks + 1).toString());
}

// ─────────────────────────────────────────────────────────────
// TEMA CLARO / OSCURO
// ─────────────────────────────────────────────────────────────
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const themeLabel = document.getElementById('theme-label');
    const themeIcon = document.getElementById('theme-icon');
    
    if (newTheme === 'light') {
        themeLabel.textContent = 'MODO OSCURO';
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`; // Luna
    } else {
        themeLabel.textContent = 'MODO CLARO';
        themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        `; // Sol
    }
}

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// INICIALIZACIÓN DE LA APLICACIÓN Y MOTOR V5
// ─────────────────────────────────────────────────────────────
window.DermVet = window.DermVet || {};

window.DermVet.registerPattern = function(key, data) {
    if (!key || !data || typeof data !== 'object') {
        console.error('Registro de patrón no válido:', key);
        return false;
    }
    TREES[key] = data;
    return true;
};

const DIAGNOSTIC_TESTS = {
  ensayo_terapeutico: { id: 'ensayo_terapeutico', label: 'Ensayo terapéutico', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  citologia: { id: 'citologia', label: 'Citología', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  histopatologia: { id: 'histopatologia', label: 'Histopatología', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  cultivo_fungico_pcr: { id: 'cultivo_fungico_pcr', label: 'Cultivo fúngico o PCR de dermatofitos', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  cultivo_bacteriano: { id: 'cultivo_bacteriano', label: 'Cultivo bacteriano', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  protocolo_alergias: { id: 'protocolo_alergias', label: 'Protocolo diagnóstico de las alergias', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  anamnesis_resena: { id: 'anamnesis_resena', label: 'Diagnóstico basado en la anamnesis y la reseña', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  lampara_wood: { id: 'lampara_wood', label: 'Lámpara de Wood', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  examen_pelo: { id: 'examen_pelo', label: 'Examen microscópico del pelo', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  analiticas_sangre: { id: 'analiticas_sangre', label: 'Analíticas específicas en sangre', source: { page: 4, section: '3. Pruebas diagnósticas' } },
  raspado_cutaneo: { id: 'raspado_cutaneo', label: 'Raspado cutáneo', source: { page: 4, section: '3. Pruebas diagnósticas' } }
};

function validatePatternData(pattern) {
    const errors = [];
    if (!pattern.meta?.flowType) errors.push('Missing flowType');
    if (!pattern.decisionTree?.question) errors.push('Missing question');
    if (!pattern.decisionTree?.answers || pattern.decisionTree.answers.length !== 3) errors.push('Missing exactly 3 answers');
    return errors;
}

let appBootstrapped = false;

window.bootstrap = function() {
    if (appBootstrapped) return;
    appBootstrapped = true;

    const seborreicoItem = PATTERNS_LIST.find(p => p.key === 'seborreico');
    if (seborreicoItem) {
        const pattern = TREES['seborreico'];
        if (pattern && validatePatternData(pattern).length === 0) {
            seborreicoItem.active = true;
            seborreicoItem.locked = false;
            seborreicoItem.badge = 'NUEVO';
            seborreicoItem.badgeClass = 'cyan';
        } else {
            seborreicoItem.active = false;
            seborreicoItem.badge = 'NO DISPONIBLE';
            seborreicoItem.badgeClass = 'gray';
            console.error('El patrón descamativo-seborreico no cargó correctamente.');
        }
    }

    // Override renderPatternsGrid's click handler
    window.renderPatternsGrid = function() {
        const grid = document.getElementById('diseases-grid');
        const filteredPatterns = typeof configHideDev !== 'undefined' && configHideDev 
            ? PATTERNS_LIST.filter(p => p.active) 
            : PATTERNS_LIST;

        grid.innerHTML = filteredPatterns.map(p => {
            let clickHandler = p.active 
                ? `startPatternFlow('${p.key}')` 
                : `showLockedPattern('${p.title}', '${p.key}')`;
                
            let badgeEl = p.badge 
                ? `<span class="card-overlay-badge ${p.badgeClass}">${p.badge}</span>` 
                : '';

            return `
                <div class="disease-card" onclick="${clickHandler}">
                    <div class="card-image-container">
                        <img src="${p.img}" alt="${p.title}" loading="lazy">
                        ${badgeEl}
                        <div class="card-icon-overlay">
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 16 14"/></svg>
                        </div>
                    </div>
                    <div class="card-details">
                        <h3>${p.title}</h3>
                        <p>${p.desc}</p>
                    </div>
                </div>
            `;
        }).join('');
    };

    renderPatternsGrid();
};

let currentView = 'home';
let currentPatternKey = null;
let selectedBranchId = null;
let navigationHistory = [];

function announceToScreenReader(message) {
    const el = document.getElementById('screen-status');
    if (el) el.textContent = message;
}

window.navigateTo = function(view, options = {}) {
    const replace = options.replace || false;
    if (replace) {
        navigationHistory[navigationHistory.length - 1] = view;
    } else if (navigationHistory.at(-1) !== view) {
        navigationHistory.push(view);
    }
    currentView = view;
    showScreen(`screen-${view}`);
    
    // Manage focus
    const screen = document.getElementById(`screen-${view}`);
    if (screen) {
        const heading = screen.querySelector('h1');
        if (heading) heading.focus();
    }
};

window.navigateBack = function() {
    navigationHistory.pop();
    const previous = navigationHistory.at(-1) || 'home';
    currentView = previous;
    showScreen(`screen-${previous}`);
    announceToScreenReader('Navegación hacia atrás.');
};

window.goHome = function() {
    currentPatternKey = null;
    selectedBranchId = null;
    navigationHistory.length = 0;
    navigationHistory.push('home');
    currentView = 'home';
    showScreen('screen-home');
};

window.resetOrientation = function() {
    selectedBranchId = null;
    window.renderDecisionQuestion();
};

window.startPatternFlow = function(patternKey) {
    const pattern = TREES[patternKey];
    if (!pattern) {
        console.error("Patrón no disponible");
        return;
    }

    currentPatternKey = patternKey;
    navigationHistory.length = 0;
    navigationHistory.push('home');

    if (pattern.meta?.flowType === 'single-question-differential') {
        resetTreeScreen();
        window.renderPatternIntroduction(pattern);
        navigateTo('pattern-info');
    } else {
        if (typeof startTree === 'function') {
            startTree(patternKey);
        }
    }
};

window.resetTreeScreen = function() {
    const card = document.getElementById('step-card');
    if (card) card.textContent = ''; 
    const progress = document.querySelector('.progress-indicator-card');
    if (progress) progress.style.display = 'none';
};

window.renderPatternIntroduction = function(pattern) {
    const container = document.getElementById('screen-pattern-info');
    container.textContent = ''; 

    const btnBack = document.createElement('button');
    btnBack.className = 'btn-back-home';
    btnBack.onclick = navigateBack;
    btnBack.setAttribute('aria-label', 'Volver');
    btnBack.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Volver`;
    container.appendChild(btnBack);

    const mainDiv = document.createElement('div');
    mainDiv.className = 'pattern-flow-container';

    const h1 = document.createElement('h1');
    h1.tabIndex = -1;
    h1.textContent = pattern.meta.name;
    mainDiv.appendChild(h1);

    const infoCard = document.createElement('div');
    infoCard.className = 'info-card';
    
    const h2Def = document.createElement('h2');
    h2Def.textContent = pattern.definition.title;
    infoCard.appendChild(h2Def);
    
    const h3Causas = document.createElement('h3');
    h3Causas.textContent = 'Causas';
    infoCard.appendChild(h3Causas);
    
    const ulCausas = document.createElement('ul');
    pattern.definition.causes.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ulCausas.appendChild(li);
    });
    infoCard.appendChild(ulCausas);
    
    const pRenov = document.createElement('p');
    pRenov.innerHTML = `<strong>Renovación epidérmica:</strong> ${pattern.definition.renewalPeriod}`;
    infoCard.appendChild(pRenov);
    
    const h3Cons = document.createElement('h3');
    h3Cons.textContent = 'Consecuencias';
    infoCard.appendChild(h3Cons);
    
    const ulCons = document.createElement('ul');
    pattern.definition.consequences.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ulCons.appendChild(li);
    });
    infoCard.appendChild(ulCons);
    mainDiv.appendChild(infoCard);

    if (pattern.macroscopicExamples && pattern.macroscopicExamples.items.length > 0) {
        const mCard = document.createElement('div');
        mCard.className = 'info-card';
        const mH2 = document.createElement('h2');
        mH2.textContent = 'Ejemplos macroscópicos';
        mCard.appendChild(mH2);
        const mUl = document.createElement('ul');
        pattern.macroscopicExamples.items.forEach(i => {
            const li = document.createElement('li');
            li.textContent = i.description;
            mUl.appendChild(li);
        });
        mCard.appendChild(mUl);
        mainDiv.appendChild(mCard);
    }

    if (pattern.microscopicExamples && pattern.microscopicExamples.items.length > 0) {
        const mCard = document.createElement('div');
        mCard.className = 'info-card';
        const mH2 = document.createElement('h2');
        mH2.textContent = 'Hallazgos microscópicos ilustrados';
        mCard.appendChild(mH2);
        const mUl = document.createElement('ul');
        pattern.microscopicExamples.items.forEach(i => {
            const li = document.createElement('li');
            li.textContent = i.description;
            mUl.appendChild(li);
        });
        mCard.appendChild(mUl);
        mainDiv.appendChild(mCard);
    }

    if (pattern.bibliography) {
        const a = document.createElement('a');
        a.href = pattern.bibliography.qrUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'bibliography-link';
        a.textContent = 'Consultar la bibliografía del manual';
        mainDiv.appendChild(a);
    }

    const btnStart = document.createElement('button');
    btnStart.className = 'btn-start-flow';
    btnStart.onclick = window.renderDecisionQuestion;
    btnStart.textContent = 'Iniciar orientación diagnóstica';
    mainDiv.appendChild(btnStart);
    
    container.appendChild(mainDiv);
    announceToScreenReader(`Pantalla de información: ${pattern.meta.name}`);
};

window.renderDecisionQuestion = function() {
    const pattern = TREES[currentPatternKey];
    const card = document.getElementById('step-card');
    resetTreeScreen();
    
    const banner = document.createElement('div');
    banner.className = 'step-header-banner';
    banner.style.background = 'linear-gradient(135deg, var(--primary), var(--cyan))';
    banner.style.borderRadius = 'var(--radius-md) var(--radius-md) 0 0';
    banner.style.padding = '24px';
    
    const h1 = document.createElement('h1');
    h1.tabIndex = -1;
    h1.style.color = 'white';
    h1.style.margin = '0';
    h1.style.fontSize = '1.5rem';
    h1.textContent = pattern.decisionTree.question.text;
    banner.appendChild(h1);
    
    const content = document.createElement('div');
    content.style.padding = '24px';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.gap = '12px';

    pattern.decisionTree.answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.onclick = () => window.handleDecision(ans.id);
        btn.style.textAlign = 'left';
        btn.style.padding = '16px';
        btn.style.border = '1px solid var(--border-color)';
        btn.style.borderRadius = 'var(--radius-sm)';
        btn.style.background = 'var(--bg-surface-elevated)';
        btn.style.color = 'var(--text-primary)';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '12px';
        
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        const span = document.createElement('span');
        span.style.fontSize = '1.05rem';
        span.style.fontWeight = '500';
        span.textContent = ans.text;
        btn.appendChild(span);
        content.appendChild(btn);
    });

    const navRow = document.createElement('div');
    navRow.className = 'nav-buttons-row';
    navRow.style.padding = '0 24px 24px';
    const btnBack = document.createElement('button');
    btnBack.className = 'btn-secondary';
    btnBack.onclick = navigateBack;
    btnBack.textContent = 'Volver';
    navRow.appendChild(btnBack);

    card.appendChild(banner);
    card.appendChild(content);
    card.appendChild(navRow);
    
    navigateTo('tree');
    announceToScreenReader(`Pregunta: ${pattern.decisionTree.question.text}`);
};

window.handleDecision = function(branchId) {
    selectedBranchId = branchId;
    window.showDifferentialResult(branchId);
};

window.showDifferentialResult = function(branchId) {
    const pattern = TREES[currentPatternKey];
    const container = document.getElementById('screen-differential');
    container.textContent = ''; 

    let branchData = pattern.decisionTree.branches[branchId];
    let isBranchC = false;
    let secondaryContext = null;
    let validationNote = null;

    if (branchData && branchData.referenceToBranch) {
        isBranchC = true;
        secondaryContext = branchData.secondaryInfectionContext;
        validationNote = branchData.validationNote;
        branchData = pattern.decisionTree.branches[branchData.referenceToBranch];
    }

    const answerText = pattern.decisionTree.answers.find(a => a.id === branchId)?.text || '';

    const mainDiv = document.createElement('div');
    mainDiv.className = 'pattern-flow-container';
    
    const h1 = document.createElement('h1');
    h1.tabIndex = -1;
    h1.textContent = 'Orientación Diferencial';
    mainDiv.appendChild(h1);

    const ansCard = document.createElement('div');
    ansCard.style.background = 'var(--bg-surface-elevated)';
    ansCard.style.padding = '16px';
    ansCard.style.borderRadius = 'var(--radius-md)';
    ansCard.style.border = '1px solid var(--border-color)';
    const pAns = document.createElement('p');
    pAns.style.color = 'var(--text-secondary)';
    pAns.style.margin = '0';
    pAns.innerHTML = `Respuesta seleccionada: <strong style="color: var(--text-primary);">${answerText}</strong>`;
    ansCard.appendChild(pAns);
    mainDiv.appendChild(ansCard);

    if (validationNote) {
        const valDiv = document.createElement('div');
        valDiv.className = 'validation-note';
        valDiv.textContent = validationNote;
        mainDiv.appendChild(valDiv);
    }

    if (isBranchC && secondaryContext) {
        const grp = document.createElement('div');
        grp.className = 'differential-group';
        grp.style.borderLeftColor = 'var(--danger)';
        const h3 = document.createElement('h3');
        h3.textContent = 'Infecciones Secundarias';
        grp.appendChild(h3);
        const pSec = document.createElement('p');
        pSec.textContent = secondaryContext.text;
        grp.appendChild(pSec);
        
        const chips = document.createElement('div');
        chips.className = 'test-chips';
        secondaryContext.additionalTests.forEach(t => {
            const test = DIAGNOSTIC_TESTS[t];
            if (test) {
                const chip = document.createElement('div');
                chip.className = 'test-chip';
                chip.textContent = test.label;
                chips.appendChild(chip);
            }
        });
        grp.appendChild(chips);
        mainDiv.appendChild(grp);
    }

    const groupsContainer = document.createElement('div');
    branchData.forEach(group => {
        const grp = document.createElement('div');
        grp.className = 'differential-group';
        const h3 = document.createElement('h3');
        h3.textContent = group.title;
        grp.appendChild(h3);
        
        if (group.context) {
            const pCtx = document.createElement('p');
            pCtx.style.color = 'var(--text-secondary)';
            pCtx.style.marginBottom = '12px';
            const em = document.createElement('em');
            em.textContent = `Contexto: ${group.context}`;
            pCtx.appendChild(em);
            grp.appendChild(pCtx);
        }
        
        if (group.diagnoses && group.diagnoses.length > 0) {
            const ul = document.createElement('ul');
            group.diagnoses.forEach(d => {
                const li = document.createElement('li');
                li.textContent = d.label || d;
                ul.appendChild(li);
            });
            grp.appendChild(ul);
        }

        if (group.tests && group.tests.length > 0) {
            const chips = document.createElement('div');
            chips.className = 'test-chips';
            group.tests.forEach(t => {
                const test = DIAGNOSTIC_TESTS[t];
                if (test) {
                    const chip = document.createElement('div');
                    chip.className = 'test-chip';
                    chip.textContent = test.label;
                    chips.appendChild(chip);
                }
            });
            grp.appendChild(chips);
        }

        if (group.additionalProcedures) {
            group.additionalProcedures.forEach(p => {
                const pProc = document.createElement('div');
                pProc.className = 'additional-procedure';
                pProc.textContent = p.label || p;
                grp.appendChild(pProc);
            });
        }
        
        if (group.notes) {
            group.notes.forEach(n => {
                const divNote = document.createElement('div');
                divNote.className = 'editorial-note';
                divNote.textContent = n;
                grp.appendChild(divNote);
            });
        }

        if (group.editorialNote) {
            const edNote = document.createElement('div');
            edNote.className = 'editorial-note';
            edNote.style.borderLeft = '2px solid var(--text-muted)';
            edNote.textContent = group.editorialNote.text;
            grp.appendChild(edNote);
        }
        
        groupsContainer.appendChild(grp);
    });
    mainDiv.appendChild(groupsContainer);

    if (pattern.therapeuticApproach) {
        const tCard = document.createElement('div');
        tCard.className = 'info-card';
        const h2 = document.createElement('h2');
        h2.textContent = 'Abordaje Terapéutico General';
        tCard.appendChild(h2);
        
        pattern.therapeuticApproach.items.forEach(item => {
            const tBlock = document.createElement('div');
            tBlock.className = 'therapeutic-block';
            const h4 = document.createElement('h4');
            h4.textContent = item.situation;
            tBlock.appendChild(h4);
            const p = document.createElement('p');
            p.textContent = item.recommendation;
            tBlock.appendChild(p);
            tCard.appendChild(tBlock);
        });
        mainDiv.appendChild(tCard);
    }

    if (pattern.bibliography) {
        const a = document.createElement('a');
        a.href = pattern.bibliography.qrUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'bibliography-link';
        a.textContent = 'Consultar la bibliografía del manual';
        mainDiv.appendChild(a);
    }

    if (pattern.warnings) {
        const wCard = document.createElement('div');
        wCard.className = 'disclaimer-card-info';
        pattern.warnings.forEach(w => {
            const p = document.createElement('p');
            p.style.marginBottom = '8px';
            p.textContent = w.text || w;
            wCard.appendChild(p);
        });
        mainDiv.appendChild(wCard);
    }

    const navRow = document.createElement('div');
    navRow.className = 'nav-buttons-row';
    const btnBack = document.createElement('button');
    btnBack.className = 'btn-secondary';
    btnBack.onclick = navigateBack;
    btnBack.textContent = 'Volver a la pregunta';
    const btnReset = document.createElement('button');
    btnReset.className = 'btn-secondary';
    btnReset.onclick = resetOrientation;
    btnReset.textContent = 'Reiniciar orientación';
    const btnHome = document.createElement('button');
    btnHome.className = 'btn-start-flow';
    btnHome.style.marginTop = '0';
    btnHome.style.width = 'auto';
    btnHome.style.flex = '1';
    btnHome.onclick = window.goHome;
    btnHome.textContent = 'Volver al panel inicial';
    
    navRow.appendChild(btnBack);
    navRow.appendChild(btnReset);
    navRow.appendChild(btnHome);
    mainDiv.appendChild(navRow);
    
    container.appendChild(mainDiv);
    navigateTo('differential');
    announceToScreenReader('Orientación diferencial cargada.');
};

