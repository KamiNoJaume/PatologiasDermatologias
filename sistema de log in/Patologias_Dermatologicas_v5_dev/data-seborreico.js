/* 
 * Modelo de datos del patrón descamativo-seborreico
 * Basado estrictamente en la v5 (Plan_completo_patron_descamativo_seborreico_v5.md)
 */

window.DermVet.registerPattern('seborreico', {
    meta: {
      name: "Patrón Descamativo-Seborreico",
      flowType: "single-question-differential"
    },
    definition: {
      title: "Trastornos de la queratinización (seborrea)",
      diagramImgs: [
        "Imagenes_Patologias/Breve_Aproximacion_1.png",
        "Imagenes_Patologias/Descamativo Saborreico/Aproximacion_2.jpg"
      ],
      legend: [
        "1. Tallo del pelo",
        "2. Melanocitos",
        "3. Glándula sudorípara",
        "4. Vaso sanguíneo",
        "5. Corpúsculo de Pacini",
        "6. Glándula sebácea",
        "7. Folículo piloso",
        "8. Músculo erector del pelo",
        "9. Descarga de cuerpos lamelares",
        "10. Cuerpos lamelares",
        "11. Gránulos de queratohialina",
        "12. Núcleo en degeneración",
        "13. Cuerpos lamelares",
        "14. Membrana basal"
      ]
    },
    macroscopicExamples: {
      items: [
        { description: "Dermatitis descamativa por leishmaniosis", imgUrl: "Imagenes_Patologias/Descamativo Saborreico/Dermatitis descamativa por lesihmaniosis.jpg" },
        { description: "Descamación masiva por ictiosis", imgUrl: "Imagenes_Patologias/Descamativo Saborreico/Descamacion masiva por ictiosis.jpg" },
        { description: "Seborrea seca en adenitis sebácea", imgUrl: "Imagenes_Patologias/Descamativo Saborreico/Seborracea seca en dos perros con adenitis sebacea.jpg" },
        { description: "Seborrea oleosa por Demodex injai", imgUrl: "Imagenes_Patologias/Descamativo Saborreico/Seborrea Oleosa por Demodex injai.jpg" }
      ]
    },
    microscopicExamples: {
      items: [
        { description: "Demodex injai en un raspado", imgUrl: "Imagenes_Patologias/Descamativo Saborreico/Demodex injai en un raspado.jpg" },
        { description: "Sarcoptes scabei en un raspado", imgUrl: "Imagenes_Patologias/Descamativo Saborreico/Sarcoptes scabei en un raspado.jpg" }
      ]
    },
    decisionTree: {
      question: {
        id: "q_prurito",
        text: "¿Tiene prurito?"
      },
      answers: [
        { id: "A", text: "Sí, desde el principio.", icon: "fa-solid fa-arrow-right" },
        { id: "B", text: "No.", icon: "fa-solid fa-arrow-right" },
        { id: "C", text: "Sí, pero apareció después de empezar la dermatitis seborreica.", icon: "fa-solid fa-arrow-right" }
      ],
      branches: {
        A: [
          {
            title: "Ectoparásitos",
            diagnoses: ["Sarcoptes", "Pulgas", "Cheyletiella", "Demodex spp., incluido D. injai"],
            tests: ["raspado_cutaneo", "examen_pelo", "ensayo_terapeutico"]
          },
          {
            title: "Dermatitis alérgica ± infecciones secundarias",
            diagnoses: ["Bacterias", "Levaduras"],
            tests: ["citologia", "protocolo_alergias", "anamnesis_resena"]
          },
          {
            title: "Dermatofitosis",
            note: "El prurito inicial no está presente en muchos casos.",
            tests: ["lampara_wood", "cultivo_fungico_pcr"]
          },
          {
            title: "Linfoma epiteliotrópico",
            context: "Perros geriátricos",
            tests: ["citologia", "histopatologia"]
          }
        ],
        B: [
          {
            title: "Dermatosis seborreica primaria",
            context: "Perros jóvenes",
            diagnoses: ["Seborrea idiopática", "Ictiosis", "Dermatosis que responden al zinc"],
            tests: ["anamnesis_resena", "histopatologia"]
          },
          {
            title: "Adenitis sebácea",
            diagnoses: ["Idiopática granulomatosa", "Por leishmaniosis"],
            tests: ["histopatologia", "tinciones_especificas"]
          },
          {
            title: "Dermatosis exfoliativa por Leishmania",
            tests: ["analiticas_sangre", "histopatologia", "tinciones_especificas"]
          },
          {
            title: "Dermatofitosis",
            note: "El prurito es variable entre individuos.",
            tests: ["lampara_wood", "cultivo_fungico_pcr"]
          },
          {
            title: "Demodicosis",
            tests: ["examen_pelo", "raspado_cutaneo", "ensayo_terapeutico"]
          },
          {
            title: "Patologías del folículo que pueden cursar con seborrea",
            diagnoses: ["Secuestro folicular", "Displasia folicular"],
            tests: ["histopatologia"]
          },
          {
            title: "Deficiencias nutricionales",
            context: "Mala calidad del alimento",
            note: "El algoritmo del manual no especifica una prueba diagnóstica para esta categoría."
          },
          {
            title: "Alteraciones hormonales",
            diagnoses: ["Hipotiroidismo", "Hiperadrenocorticismo"],
            tests: ["analiticas_sangre"]
          }
        ],
        C: {
          referenceToBranch: "B",
          secondaryInfectionContext: {
            title: "Evaluación adicional del prurito secundario",
            tests: ["citologia", "anamnesis_resena"]
          },
          validationStatus: "pending_clinical_review",
          validationNote: "Esta traducción digital se implementará con validationStatus: pending_clinical_review. El prurito aparece al desarrollarse infecciones secundarias."
        }
      }
    },
    therapeuticApproach: {
      blocks: [
        {
          title: "Con prurito asociado",
          icon: "search",
          color: "#2563eb",
          items: ["Investigar y tratar la causa primaria del prurito."]
        },
        {
          title: "Control del prurito",
          icon: "shield",
          color: "#0891b2",
          items: ["Antiinflamatorios tópicos/sistémicos."]
        },
        {
          title: "Control de ectoparásitos",
          icon: "bug",
          color: "#059669",
          items: ["Antiparasitarios externos con acción acaricida."]
        },
        {
          title: "Control del componente infeccioso secundario",
          icon: "bacteria",
          color: "#d97706",
          items: [
            "Uso de antisépticos tópicos (clorhexidina 2–4 %).",
            "Uso de antibiótico únicamente si es estrictamente necesario.",
            "Antifúngicos tópicos/sistémicos si es estrictamente necesario."
          ]
        },
        {
          title: "En caso de linfoma",
          icon: "alert",
          color: "#dc2626",
          items: ["Seguir las recomendaciones oncológicas adecuadas."]
        },
        {
          title: "Tratamiento hormonal",
          icon: "hormone",
          color: "#7c3aed",
          items: ["Añadir tratamiento hormonal si procede."]
        }
      ],
      generalMeasures: {
        title: "En todos los casos puede ser adecuado:",
        items: [
          "Uso de productos antiseborreicos/seborreguladores tópicos.",
          "Uso de productos tópicos para hidratación cutánea intensiva.",
          "Evitar infecciones secundarias principalmente a base de baños.",
          "En casos puntuales puede ser adecuado el uso de suplementos de zinc ± retinoides."
        ]
      }
    },
    bibliography: {
      qrUrl: "https://www.worldvet.org",
      source: "Manual Clínico de Dermatología Veterinaria, p. 7"
    },
    warnings: [
      "El patrón descamativo-seborreico incluye diagnósticos tanto primarios como secundarios.",
      "La confirmación definitiva de la mayoría de etiologías del grupo no pruriginoso o de prurito tardío (endocrinopatías, displasias, autoinmunes, neoplasias) requiere siempre el uso de histopatología y analíticas sanguíneas específicas."
    ]
});

