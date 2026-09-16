import { GradeLevel, TerminaleSerie, SubjectInfo, Question } from '../types';

export interface ClassCurriculum {
  grade: GradeLevel;
  label: string;
  examName: string;
  description: string;
  officialRef: string;
  series?: {
    id: TerminaleSerie;
    name: string;
    description: string;
    subjects: SubjectInfo[];
  }[];
  subjects?: SubjectInfo[];
}

export const OFFICIAL_CURRICULUM: Record<GradeLevel, ClassCurriculum> = {
  'CM2': {
    grade: 'CM2',
    label: 'CM2 (Cours Moyen 2ème Année)',
    examName: 'Examen Officiel du CEPE (Certificat d\'Études Primaires Élémentaires)',
    description: 'Programme officiel du Ministère de l\'Éducation Nationale (MEN Madagascar) pour la fin du cycle primaire.',
    officialRef: 'Programme MEN Madagascar - Cycle Primaire Fondamental / Épreuves CEPE',
    subjects: [
      {
        id: 'mathematiques_cm2',
        name: 'Mathématiques / Kajy sy Isa',
        shortName: 'Maths',
        iconName: 'Calculator',
        coefficient: 3,
        description: 'Arithmétique, Opérations, Fractions simples, Règles de trois, Périmètres, Aires, Problèmes concrets',
        themes: ['Arithmétique & Opérations', 'Fractions & Pourcentages', 'Mesures & Géométrie', 'Résolution de Problèmes'],
        color: 'emerald'
      },
      {
        id: 'malagasy_cm2',
        name: 'Malagasy (Fiteny Reny)',
        shortName: 'Malagasy',
        iconName: 'BookOpen',
        coefficient: 3,
        description: 'Famakian-teny, Fitsipi-piteny, Voambolana, Famoahan-kevitra an-tsoratra, Ohabolana fototra',
        themes: ['Fitsipiky ny Tsipelina', 'Fanabeazam-boho ny Voambolana', 'Famakian-teny sy Fahatakarana', 'Ohabolana sy Kolontsaina'],
        color: 'red'
      },
      {
        id: 'francais_cm2',
        name: 'Français (Langue Étrangère)',
        shortName: 'Français',
        iconName: 'Languages',
        coefficient: 2,
        description: 'Grammaire, Conjugaison des temps usuels, Vocabulaire thématique, Compréhension de texte',
        themes: ['Grammaire & Groupe Nominal', 'Conjugaison (Présent, Futur, Passé)', 'Orthographe & Vocabulaire', 'Compréhension Écrite'],
        color: 'blue'
      },
      {
        id: 'connaissances_usuelles_cm2',
        name: 'Connaissances Usuelles / Tontolo Iainana',
        shortName: 'Siansa & Tontolo',
        iconName: 'Sprout',
        coefficient: 2,
        description: 'Ny vatan\'olombelona, Fahasalamana sy fidiovana, Zava-maniry sy biby eto Madagasikara, Tontolo iainana',
        themes: ['Le Corps Humain & Hygiène', 'Faune & Flore de Madagascar', 'Environnement & Écosystème', 'Sciences Pratiques'],
        color: 'amber'
      },
      {
        id: 'histoire_geo_cm2',
        name: 'Histoire-Géo (Tantara sy Jeografia)',
        shortName: 'Tantara-Jeo',
        iconName: 'MapPin',
        coefficient: 2,
        description: 'Madagasikara: Ny faritra 23, renirano, tendrombohitra, ny tantara fohin\'ireo mpanjaka malagasy',
        themes: ['Géographie physique de Madagascar', 'Les 23 Régions de Madagascar', 'Histoire des Souverains Malagasy'],
        color: 'indigo'
      },
      {
        id: 'fov_cm2',
        name: 'Fanabeazana ho Olom-pirenena Vanona (FOV)',
        shortName: 'FOV',
        iconName: 'ShieldCheck',
        coefficient: 2,
        description: 'Fitaizana ny maha olom-pirenena, Zon\'ny ankizy sy andraikitra, Soatoavina malagasy, Fihavanana, Fanevam-pirenena',
        themes: ['Zon\'ny Ankizy sy Andraikitra', 'Fihavanana sy Soatoavina Malagasy', 'Fanajana ny Lalàna sy Fitaovam-bahoaka', 'Fitiavan-tanindrazana'],
        color: 'emerald',
        isNew: true,
        badgeNote: 'Matière Vaovao - 9 Septambra 2026'
      },
      {
        id: 'arts_cm2',
        name: 'Arts sy Kolontsaina Malagasy',
        shortName: 'Arts & Kolontsaina',
        iconName: 'Palette',
        coefficient: 1,
        description: 'Hanto sy kolontsaina, Sary sy loko, Fitaovam-pitendry mozika nentim-paharazana (valiha, marovany, sodina), Vakoka',
        themes: ['Kanto ara-tsary sy Loko', 'Fitaovam-pitendry sy Hira Malagasy', 'Vakoka sy Asa-tanana'],
        color: 'pink',
        isNew: true,
        badgeNote: 'Matière Vaovao - 9 Septambra 2026'
      },
      {
        id: 'climat_cm2',
        name: 'Tontolo Iainana sy Fiovana Toetrandro',
        shortName: 'Toetrandro & Ala',
        iconName: 'Leaf',
        coefficient: 2,
        description: 'Fiarovana ny ala sy ny zavamananaina eto Madagasikara, Ny fiovana toetrandro, Fambolen-kazo sy fiarovana amin\'ny hain-tany sy rivodoza',
        themes: ['Fiarovana ny Ala sy ny Zavaboary', 'Fahatakarana ny Fiovana Toetrandro', 'Fiarovana amin\'ny Loza Voajanahary'],
        color: 'teal',
        isNew: true,
        badgeNote: 'Matière Vaovao - 9 Septambra 2026'
      }
    ]
  },
  '3ème': {
    grade: '3ème',
    label: 'Classe de 3ème (Troisième - BEPC)',
    examName: 'Examen Officiel du BEPC (Brevet d\'Études du Premier Cycle - Réforme 2026)',
    description: 'Programme officiel réformé du Collège par le Ministère de l\'Éducation Nationale (MEN Madagascar).',
    officialRef: 'Curriculum National MEN Madagascar - Réforme Décret 2026 / BEPC Tronc Unique',
    subjects: [
      {
        id: 'mathematiques_3eme',
        name: 'Mathématiques',
        shortName: 'Maths',
        iconName: 'Binary',
        coefficient: 4,
        description: 'Calcul littéral, Racines carrées, Thalès, Pythagore, Trigonométrie, Équations et systèmes, Statistiques',
        themes: ['Calcul Numérique & Puissances', 'Théorèmes de Pythagore & Thalès', 'Calcul Littéral & Factorisation', 'Équations & Inéquations', 'Trigonométrie & Géométrie'],
        color: 'emerald'
      },
      {
        id: 'physique_chimie_3eme',
        name: 'Physique - Chimie',
        shortName: 'Physique-Chimie',
        iconName: 'Atom',
        coefficient: 3,
        description: 'Mouvement et vitesse, Forces, Poids et masse, Électricité, Structure de l\'atome, Réactions acido-basiques',
        themes: ['Mécanique (Forces, Vitesse)', 'Électricité & Puissance', 'Atomes, Molécules & Réactions', 'Solutions Aqueuses & pH'],
        color: 'cyan'
      },
      {
        id: 'svt_3eme',
        name: 'Sciences de la Vie et de la Terre (SVT)',
        shortName: 'SVT',
        iconName: 'Dna',
        coefficient: 3,
        description: 'Système nerveux, Reproduction humaine, Génétique élémentaire, Géodynamique interne et externe, Biodiversité malgache',
        themes: ['Système Nerveux & Réflexes', 'Reproduction Humaine & Génétique', 'Tectonique & Volcanisme', 'Biodiversité & Écosystèmes de Madagascar'],
        color: 'teal'
      },
      {
        id: 'malagasy_3eme',
        name: 'Malagasy',
        shortName: 'Malagasy',
        iconName: 'BookOpen',
        coefficient: 3,
        description: 'Famakafakan-dahatsoratra, Haisoratra sy fitsipi-piteny malagasy, Kabary am-panambadiana, Ohabolana ary fomba amam-panao',
        themes: ['Laisoratra sy Famakafakana', 'Fitsipiky ny Teny Malagasy', 'Kabary & Haisoratra Nentim-paharazana', 'Fandalinana Lahatsoratra'],
        color: 'red'
      },
      {
        id: 'francais_3eme',
        name: 'Français',
        shortName: 'Français',
        iconName: 'Languages',
        coefficient: 3,
        description: 'Compréhension et analyse de textes narratifs et argumentatifs, Grammaire syntaxique, Expression écrite',
        themes: ['Texte Argumentatif & Narratif', 'Grammaire & Subordonnées', 'Figures de Style & Vocabulaire', 'Production d\'Écrit / Essai'],
        color: 'blue'
      },
      {
        id: 'histoire_geo_3eme',
        name: 'Histoire - Géographie (avec Climat & Énergies Renouvelables)',
        shortName: 'Histoire-Géo',
        iconName: 'Landmark',
        coefficient: 3,
        description: 'Madagascar de la période coloniale à l\'indépendance (1947, 1960), Climat et énergies renouvelables à Madagascar, Géographie économique',
        themes: ['Madagascar & Décolonisation (1947, 1960)', 'Changement Climatique & Énergies Renouvelables à Madagascar', 'Géographie Économique des Régions Malgaches'],
        color: 'indigo'
      },
      {
        id: 'anglais_3eme',
        name: 'Anglais (English - Épreuve Obligatoire BEPC)',
        shortName: 'Anglais',
        iconName: 'Globe',
        coefficient: 2,
        description: 'Grammar (Tenses, Modals, Passive voice), Reading comprehension on daily life, environment, society. Obligatoire pour TOUS les candidats au BEPC.',
        themes: ['Verb Tenses & Modals', 'Passive & Active Voice', 'Reading Comprehension', 'Vocabulary & Writing'],
        color: 'violet'
      },
      {
        id: 'fov_3eme',
        name: 'Fanabeazana ho Olom-pirenena Vanona (FOV)',
        shortName: 'FOV',
        iconName: 'ShieldCheck',
        coefficient: 2,
        description: 'Lalàmpanorenana, Andrim-panjakana, Zo sy Andraikitra, Fihavanana sy fampihavanana, Fiarovana ny tombontsoam-bahoaka (ampianarina amin\'ny teny Malagasy)',
        themes: ['Ireo Andrim-panjakana sy ny Lalàmpanorenana', 'Ny Demokrasia sy ny Fifidianana Madio', 'Fihavanana sy Fitantanana ny Fifanolanana', 'Fiarovana ny Harem-pirenena sy ny Tontolo Iainana'],
        color: 'emerald',
        isNew: true,
        badgeNote: 'Matière Vaovao BEPC - 9 Septambra 2026'
      },
      {
        id: 'arts_3eme',
        name: 'Arts (Éducation Artistique et Culturelle)',
        shortName: 'Arts',
        iconName: 'Palette',
        coefficient: 2,
        description: 'Arts visuels, Dessin, Patrimoine musical malgache, Arts vivants et expression corporelle',
        themes: ['Arts Visuels & Géométrie Artistique', 'Patrimoine Musical & Rythmes Traditionnels Malagasy', 'Histoire de l\'Art & Monuments Historiques de Madagascar'],
        color: 'pink',
        isNew: true,
        badgeNote: 'Matière Vaovao BEPC - 9 Septambra 2026'
      },
      {
        id: 'tice_3eme',
        name: 'TICE & Kajy Mirindra (Informatique)',
        shortName: 'TICE',
        iconName: 'Laptop',
        coefficient: 2,
        description: 'Fototry ny solosaina, Fampiasana rindrambaiko birao, Aterineto azo antoka, Cyber-sécurité sy fiarovana ny angon-drakitra manokana',
        themes: ['Fototry ny Kajy Mirindra (Informatique de Base)', 'Fikarakarana Lahatsoratra & Rindrambaiko Birao', 'Aterineto sy Fikarohana Azo Antoka', 'Fiarovana ny Tsiambaratelo & Cyber-sécurité'],
        color: 'cyan',
        isNew: true,
        badgeNote: 'Matière Vaovao BEPC - 9 Septambra 2026'
      }
    ]
  },
  'Terminale': {
    grade: 'Terminale',
    label: 'Classe de Terminale (Lycée)',
    examName: 'Examen Officiel du Baccalauréat Général (Madagascar)',
    description: 'Nouveau régime réformé du Baccalauréat Général par le Ministère de l\'Éducation Nationale (MEN Madagascar) : Séries L (Littéraire), S (Scientifique) et OSE (Organisation, Société et Économie).',
    officialRef: 'Réforme du Baccalauréat MEN Madagascar - Décret & Arrêtés Séries L, S et OSE',
    series: [
      {
        id: 'Série L',
        name: 'Série L (Littéraire)',
        description: 'Filière centrée sur la philosophie, les lettres malgaches et françaises, les langues vivantes et les sciences humaines.',
        subjects: [
          {
            id: 'philo_tl',
            name: 'Philosophie',
            shortName: 'Philo',
            iconName: 'BrainCircuit',
            coefficient: 5,
            description: 'L\'Homme et le Monde, La Connaissance et la Vérité, La Morale, L\'Art, La Politique, Dissertation et Commentaire philosophique',
            themes: ['La Conscience & L\'Inconscient', 'La Vérité & La Raison', 'La Liberté, Le Droit & La Justice', 'La Morale & Le Devoir', 'Méthodologie de la Dissertation'],
            color: 'amber'
          },
          {
            id: 'malagasy_tl',
            name: 'Malagasy',
            shortName: 'Malagasy',
            iconName: 'BookOpen',
            coefficient: 4,
            description: 'Fandalinana lahatsoratra, Haisoratra malagasy ankehitriny, Ny Baiboly sy ny literatiora, Tononkalo, Kabary am-panambadiana sy fandevenana',
            themes: ['Fandalinana Lahatsoratra Lalina', 'Ny Baiboly sy ny Literatiora Malagasy', 'Kabary sy Fanakarana Hevitra', 'Haisoratra sy Tononkalo Malagasy'],
            color: 'red'
          },
          {
            id: 'francais_tl',
            name: 'Français (Littérature & Méthodologie)',
            shortName: 'Français',
            iconName: 'Languages',
            coefficient: 4,
            description: 'Dissertation littéraire, Commentaire composé, Contraction de texte et résumé, Analyse stylistique',
            themes: ['Commentaire Composé', 'Dissertation Littéraire', 'Contraction de Texte & Résumé', 'Courants Littéraires & Poésie'],
            color: 'blue'
          },
          {
            id: 'histoire_geo_tl',
            name: 'Histoire - Géographie',
            shortName: 'Histoire-Géo',
            iconName: 'Landmark',
            coefficient: 4,
            description: 'Le Monde depuis 1945, Décolonisation et émergence du Tiers-Monde, Madagascar dans le monde contemporain, Mondialisation',
            themes: ['Le Monde après 1945 & Guerre Froide', 'Décolonisation en Afrique et à Madagascar', 'La Mondialisation & Territoires', 'Madagascar : Espaces & Défis Économiques'],
            color: 'indigo'
          },
          {
            id: 'anglais_tl',
            name: 'Anglais (English LV1)',
            shortName: 'Anglais',
            iconName: 'Globe',
            coefficient: 3,
            description: 'Advanced comprehension of literary and contemporary texts, Essay writing, Expressing argumentation',
            themes: ['Literary & Non-fiction Comprehension', 'Advanced Grammar & Idioms', 'Argumentative Essay Writing', 'Global Issues & Debates'],
            color: 'violet'
          },
          {
            id: 'maths_tl',
            name: 'Mathématiques Appliquées (Série L)',
            shortName: 'Maths L',
            iconName: 'Calculator',
            coefficient: 2,
            description: 'Statistiques descriptives, Probabilités élémentaires, Suites arithmétiques et géométriques, Fonctions usuelles',
            themes: ['Statistiques à une Variable', 'Probabilités Élémentaires', 'Suites Numériques Simples', 'Fonctions Polynômes et Dérivation de base'],
            color: 'emerald'
          },
          {
            id: 'svt_tl',
            name: 'Sciences de la Vie et de la Terre (SVT L)',
            shortName: 'SVT L',
            iconName: 'Dna',
            coefficient: 2,
            description: 'Santé publique, Écologie et gestion des ressources naturelles à Madagascar, Notions de génétique humaine',
            themes: ['Santé Publique & Épidémiologie', 'Écologie & Forêts Malgaches', 'Génétique Humaine & Hérédité'],
            color: 'teal'
          },
          {
            id: 'eac_tl',
            name: 'Éducation à la Citoyenneté (EAC)',
            shortName: 'EAC',
            iconName: 'ShieldCheck',
            coefficient: 2,
            description: 'Fanabeazana ho olom-pirenena vanona, Fanjakana tan-dalàna, Fitantanana tsara, Fiarovana ny zon\'olombelona sy ny tontolo iainana',
            themes: ['Gouvernance Démocratique & État de Droit', 'Éthique Publique & Lutte contre la Corruption', 'Citoyenneté Écologique & Développement Durable'],
            color: 'emerald',
            isNew: true,
            badgeNote: 'Matière Vaovao Bac - 9 Septambra 2026'
          },
          {
            id: 'tice_tl',
            name: 'TICE & Kajy Mirindra (Informatique)',
            shortName: 'TICE',
            iconName: 'Laptop',
            coefficient: 2,
            description: 'Kolontsaina nomerika, Fikarohana sy fanasokajiana angon-drakitra, Fampiasana solosaina amin\'ny fandalinana literatiora',
            themes: ['Culture Numérique & Société', 'Recherche Documentaire Numérique & Esprit Critique', 'Traitement de Texte Avancé & Outils Collaboratifs'],
            color: 'cyan',
            isNew: true,
            badgeNote: 'Matière Vaovao Bac - 9 Septambra 2026'
          }
        ]
      },
      {
        id: 'Série S',
        name: 'Série S (Scientifique)',
        description: 'Filière d\'excellence scientifique axée sur les Mathématiques approfondies, les Sciences Physiques et Chimiques, et les SVT.',
        subjects: [
          {
            id: 'maths_ts',
            name: 'Mathématiques (Série S)',
            shortName: 'Maths S',
            iconName: 'Binary',
            coefficient: 6,
            description: 'Analyse (Suites, Limites, Dérivation, Intégration, Logarithme, Exponentielle), Nombres Complexes, Géométrie dans l\'espace, Probabilités',
            themes: ['Suites Numériques & Récurrence', 'Fonctions Logarithme & Exponentielle', 'Calcul Intégral & Primitives', 'Nombres Complexes & Géométrie', 'Probabilités & Lois de Densité', 'Géométrie Vectorielle dans l\'Espace'],
            color: 'emerald'
          },
          {
            id: 'physique_chimie_ts',
            name: 'Physique - Chimie (Série S)',
            shortName: 'Physique-Chimie',
            iconName: 'Atom',
            coefficient: 5,
            description: 'Mécanique de Newton, Mouvement de projectiles, Oscillateurs, Ondes, Circuits RLC, Cinétique chimique, Réactions acido-basiques, Chimie organique',
            themes: ['Lois de Newton & Balistique', 'Ondes Mécaniques & Électromagnétisme', 'Circuits RLC & Oscillations', 'Cinétique Chimique & Catalyse', 'Équilibres Acido-Basiques & pH-métrie', 'Chimie Organique (Estérification, Polymères)'],
            color: 'cyan'
          },
          {
            id: 'svt_ts',
            name: 'Sciences de la Vie et de la Terre (SVT S)',
            shortName: 'SVT S',
            iconName: 'Dna',
            coefficient: 5,
            description: 'Génétique mendélienne et moléculaire, Immunologie et défenses de l\'organisme, Neurophysiologie, Géologie de Madagascar et tectonique des plaques',
            themes: ['Génétique Formelle & Moléculaire (ADN, Protéines)', 'Immunologie (Lymphocytes, Anticorps, VIH)', 'Neurophysiologie & Synapses', 'Tectonique des Plaques & Géologie de Madagascar', 'Évolution & Biodiversité'],
            color: 'teal'
          },
          {
            id: 'philo_ts',
            name: 'Philosophie (Série S)',
            shortName: 'Philo S',
            iconName: 'BrainCircuit',
            coefficient: 2,
            description: 'Épistémologie, Méthodes des sciences, Vérité et théorie, Morale et éthique de la recherche',
            themes: ['Épistémologie & Théories Scientifiques', 'Raison & Expérience', 'Morale, Bioéthique & Technique', 'Méthodologie de la Dissertation'],
            color: 'amber'
          },
          {
            id: 'malagasy_ts',
            name: 'Malagasy',
            shortName: 'Malagasy',
            iconName: 'BookOpen',
            coefficient: 2,
            description: 'Laisoratra sy famakafakan-dahatsoratra, Fitsipika, Kolontsaina sy soatoavina malagasy',
            themes: ['Fandalinana Lahatsoratra', 'Fitsipiky ny Teny Malagasy', 'Soatoavina sy Fomba Malagasy'],
            color: 'red'
          },
          {
            id: 'francais_ts',
            name: 'Français',
            shortName: 'Français',
            iconName: 'Languages',
            coefficient: 2,
            description: 'Résumé de texte et discussion argumentée, Analyse logique et stylistique',
            themes: ['Résumé & Contraction de Texte', 'Discussion & Argumentation', 'Vocabulaire & Syntaxe'],
            color: 'blue'
          },
          {
            id: 'anglais_ts',
            name: 'Anglais (English)',
            shortName: 'Anglais',
            iconName: 'Globe',
            coefficient: 2,
            description: 'Comprehension of scientific articles and general culture, Writing and translation exercises',
            themes: ['Scientific & Technical Texts', 'Grammar in Context', 'Written Expression & Summary'],
            color: 'violet'
          },
          {
            id: 'histoire_geo_ts',
            name: 'Histoire - Géographie',
            shortName: 'Histoire-Géo',
            iconName: 'Landmark',
            coefficient: 2,
            description: 'Le monde contemporain et l\'organisation économique, Madagascar et ses potentialités de développement',
            themes: ['Relations Internationales & Géopolitique', 'Mondialisation Économique', 'Madagascar : Territoires & Économie'],
            color: 'indigo'
          },
          {
            id: 'eac_ts',
            name: 'Éducation à la Citoyenneté (EAC)',
            shortName: 'EAC',
            iconName: 'ShieldCheck',
            coefficient: 2,
            description: 'Éthique de la science et technologies, Droits civiques, Développement durable et intégrité',
            themes: ['Éthique Scientifique & Bioéthique', 'Gouvernance & État de Droit', 'Citoyenneté Écologique & Climat'],
            color: 'emerald',
            isNew: true,
            badgeNote: 'Matière Vaovao Bac - 9 Septambra 2026'
          },
          {
            id: 'tice_ts',
            name: 'TICE & Kajy Mirindra (Informatique)',
            shortName: 'TICE',
            iconName: 'Laptop',
            coefficient: 2,
            description: 'Algorithmique, Traitement numérique de données, Simulation scientifique, Sécurité des réseaux',
            themes: ['Algorithmique & Résolution de Problèmes', 'Traitement & Visualisation Numérique de Données', 'Réseaux & Cyber-sécurité'],
            color: 'cyan',
            isNew: true,
            badgeNote: 'Matière Vaovao Bac - 9 Septambra 2026'
          }
        ]
      },
      {
        id: 'Série OSE',
        name: 'Série OSE (Organisation, Société et Économie)',
        description: 'Nouvelle filière officielle à Madagascar préparant aux carrières en Économie, Gestion, Droit, Sociologie et Management.',
        subjects: [
          {
            id: 'ses_tose',
            name: 'Sciences Économiques et Sociales (SES)',
            shortName: 'SES',
            iconName: 'TrendingUp',
            coefficient: 5,
            description: 'L\'activité économique, Marché et fixation des prix, L\'entreprise et son organisation, Monnaie et système bancaire, Croissance et développement à Madagascar',
            themes: ['Acteurs Économiques & Circuits', 'Fonctionnement du Marché & Concurrence', 'L\'Entreprise : Gestion & Organisation', 'Monnaie, Inflation & Financement', 'Croissance, Pauvreté & Développement à Madagascar', 'Mondialisation & Intégration Régionale (COI, SADC)'],
            color: 'orange'
          },
          {
            id: 'maths_tose',
            name: 'Mathématiques Économiques (Série OSE)',
            shortName: 'Maths OSE',
            iconName: 'BarChart3',
            coefficient: 4,
            description: 'Statistiques à deux variables (ajustement linéaire), Probabilités conditionnelles, Suites numériques financières, Optimisation et fonctions de coût',
            themes: ['Statistiques à Deux Variables & Régression', 'Probabilités Conditionnelles & Arbres', 'Suites Arithmétiques/Géométriques & Intérêts', 'Fonctions Économiques (Coût, Recette, Bénéfice)', 'Programmation Linéaire Élémentaire'],
            color: 'emerald'
          },
          {
            id: 'histoire_geo_tose',
            name: 'Histoire - Géographie (Série OSE)',
            shortName: 'Histoire-Géo',
            iconName: 'Landmark',
            coefficient: 4,
            description: 'Histoire économique contemporaine (crises, mondialisation), Géographie économique et humaine de Madagascar, Flux mondiaux',
            themes: ['Crises Économiques Mondiales (1929, 1973, 2008)', 'Mondialisation des Échanges & Acteurs Transnationaux', 'Économie de Madagascar : Agriculture, Mines & Services', 'Aménagement du Territoire & Urbanisation à Madagascar'],
            color: 'indigo'
          },
          {
            id: 'philo_tose',
            name: 'Philosophie (Série OSE)',
            shortName: 'Philo OSE',
            iconName: 'BrainCircuit',
            coefficient: 3,
            description: 'Le Travail et la Technique, La Société et l\'État, La Justice et le Droit, Éthique économique et responsabilité sociale',
            themes: ['Le Travail & La Technique', 'La Société, L\'État & Le Pouvoir', 'La Justice Sociale & Le Droit', 'Morale Économique & Bien Commun'],
            color: 'amber'
          },
          {
            id: 'francais_tose',
            name: 'Français (Série OSE)',
            shortName: 'Français',
            iconName: 'Languages',
            coefficient: 3,
            description: 'Commentaire de texte d\'actualité socio-économique, Dissertation argumentée, Techniques de synthèse',
            themes: ['Texte d\'Opinion & Réflexion Sociale', 'Dissertation Thématique', 'Techniques de Synthèse & Résumé'],
            color: 'blue'
          },
          {
            id: 'malagasy_tose',
            name: 'Malagasy (Série OSE)',
            shortName: 'Malagasy',
            iconName: 'BookOpen',
            coefficient: 3,
            description: 'Famakafakan-dahatsoratra, Voambolana ara-toekarena sy ara-piarahamonina amin\'ny teny malagasy, Laisoratra',
            themes: ['Lahatsoratra Ara-toekarena sy Ara-tsosialy', 'Voambolana sy Fitsipika', 'Fomba sy Fiainam-piaraha-monina Malagasy'],
            color: 'red'
          },
          {
            id: 'anglais_tose',
            name: 'Anglais Commercial & Économique (Business English)',
            shortName: 'Anglais OSE',
            iconName: 'Globe',
            coefficient: 3,
            description: 'Business and economic vocabulary, International trade texts, Formal correspondence and essay writing',
            themes: ['Economy & Business Vocabulary', 'Reading Comprehension of Economic Articles', 'Report & Essay Writing', 'Communication in Global Trade'],
            color: 'violet'
          },
          {
            id: 'eac_tose',
            name: 'Éducation à la Citoyenneté (EAC)',
            shortName: 'EAC',
            iconName: 'ShieldCheck',
            coefficient: 2,
            description: 'Responsabilité Sociétale des Entreprises (RSE), Transparence financière, Lutte contre la corruption, Éthique des affaires',
            themes: ['Responsabilité Sociétale des Entreprises (RSE)', 'Transparence Financière & Anti-Corruption', 'Citoyenneté Économique & Justice Sociale'],
            color: 'emerald',
            isNew: true,
            badgeNote: 'Matière Vaovao Bac - 9 Septambra 2026'
          },
          {
            id: 'tice_tose',
            name: 'TICE & Kajy Mirindra (Informatique de Gestion)',
            shortName: 'TICE',
            iconName: 'Laptop',
            coefficient: 2,
            description: 'Informatique de gestion, Tableurs avancés, Commerce électronique et modélisation de flux d\'entreprise',
            themes: ['Tableurs & Analyse Numérique de Données', 'Commerce Électronique & Économie Numérique', 'Sécurité des Systèmes d\'Information'],
            color: 'cyan',
            isNew: true,
            badgeNote: 'Matière Vaovao Bac - 9 Septambra 2026'
          }
        ]
      }
    ]
  }
};

/**
 * Seed questions verified strictly according to the Malagasy Curriculum
 * Covering Levels 1 to 10 across key subjects.
 */
export const SEED_QUESTIONS: Question[] = [
  // --- CM2 Mathématiques ---
  {
    id: 'cm2_math_lvl1_1',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    level: 1,
    theme: 'Arithmétique & Opérations',
    question: 'Kajio : Ohatrinona ny fitambaran\'ny 3 450 Ariary sy 2 550 Ariary ? (Calculez la somme de 3 450 Ar et 2 550 Ar)',
    options: ['5 900 Ariary', '6 000 Ariary', '6 100 Ariary', '5 000 Ariary'],
    correctIndex: 1,
    explanation: '3 450 + 2 550 = 6 000. (3 000 + 2 000 = 5 000 ; 450 + 550 = 1 000 ; 5 000 + 1 000 = 6 000 Ariary).',
    source: 'Programme MEN Madagascar - Mathématiques CM2 (Calcul mental & Arithmétique)'
  },
  {
    id: 'cm2_math_lvl1_2',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    level: 1,
    theme: 'Mesures & Géométrie',
    question: 'Firy metatra (m) ny 1 kilometatra (1 km) ? (Combien de mètres y a-t-il dans 1 km ?)',
    options: ['10 m', '100 m', '1 000 m', '10 000 m'],
    correctIndex: 2,
    explanation: 'Araka ny fari-drefy : 1 kilometatra (km) dia mitovy amin\'ny 1 000 metatra (m).',
    source: 'Programme MEN Madagascar - Unités de mesure'
  },
  {
    id: 'cm2_math_lvl2_1',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    level: 2,
    theme: 'Fractions & Pourcentages',
    question: 'Raha zaraina 4 mitovy ny mofo iray ka nalaina ny 3 amin\'ireo, ahoana no fanoratana io ampahany io amin\'ny endrika fraction ?',
    options: ['4/3', '3/4', '1/4', '3/1'],
    correctIndex: 1,
    explanation: 'Ny isa ambany (dénominateur) no milaza ny fizarana manontolo (4), ary ny isa ambony (numérateur) no milaza ny ampahany nalaina (3), ka 3/4 no valiny.',
    source: 'Programme MEN Madagascar - Notions de fractions'
  },
  {
    id: 'cm2_math_lvl4_1',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    level: 4,
    theme: 'Mesures & Géométrie',
    question: 'Manana tanimbary manana halava (L) = 25 m sy sakany (l) = 15 m i Rakoto. Ohatrinona ny refin\'ny manodidina (périmètre) an\'io tanimbary io ?',
    options: ['40 m', '80 m', '375 m²', '160 m'],
    correctIndex: 1,
    explanation: 'Périmètre du rectangle = (Halava + Sakany) × 2 = (25 m + 15 m) × 2 = 40 m × 2 = 80 m.',
    source: 'Programme MEN Madagascar - Périmètre du rectangle'
  },
  {
    id: 'cm2_math_lvl7_1',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    level: 7,
    theme: 'Résolution de Problèmes',
    question: 'Mivarotra vary 3 gony milanja 50 kg avy ny mpivarotra iray. Nividy izany 2 400 Ar ny kilao izy. Namidiny 2 800 Ar ny kilao. Ohatrinona ny tombom-barotra (bénéfice) azony ?',
    options: ['40 000 Ariary', '60 000 Ariary', '150 000 Ariary', '420 000 Ariary'],
    correctIndex: 1,
    explanation: 'Totalin\'ny lanjan\'ny vary = 3 × 50 kg = 150 kg. Tombony isaky ny kilao = 2 800 Ar - 2 400 Ar = 400 Ar. Totalin\'ny tombony = 150 kg × 400 Ar = 60 000 Ariary.',
    source: 'Épreuve type CEPE Madagascar - Problème commercial'
  },
  {
    id: 'cm2_math_lvl10_1',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    level: 10,
    theme: 'Résolution de Problèmes',
    question: 'Bassin mahitsizoro manana halava 8 m, sakany 5 m ary halalinana 1,5 m. Feno rano 75% io bassin io. Firy litatra ny rano ao anatiny ? (Fantaro fa 1 m³ = 1 000 litatra)',
    options: ['45 000 litatra', '60 000 litatra', '30 000 litatra', '4 500 litatra'],
    correctIndex: 0,
    explanation: 'Hatezerana manontolo (Volume total) = 8 m × 5 m × 1,5 m = 60 m³. Satria feno 75% : 60 m³ × 0,75 = 45 m³. Niova ho litatra : 45 × 1 000 = 45 000 litatra.',
    source: 'Épreuve d\'excellence CEPE Madagascar - Volume et capacité'
  },

  // --- CM2 Malagasy ---
  {
    id: 'cm2_mlg_lvl1_1',
    classId: 'CM2',
    subjectId: 'malagasy_cm2',
    level: 1,
    theme: 'Fitsipiky ny Tsipelina',
    question: 'Inona amin\'ireto teny ireto no voasoratra marina tsara araka ny fitsipi-panoratana malagasy ?',
    options: ['trano kely', 'tranonkely', 'trano-kely', 'tranokely'],
    correctIndex: 0,
    explanation: 'Manaraka ny fitsipika : Ny teny roa mifampitohy manana heviny manokana dia sarahina (trano kely). Tsy manao fanakambanana raha tsy teny manokana efa latsaka anaty voambolana.',
    source: 'Programme MEN Madagascar - Fitsipi-piteny Malagasy CM2'
  },
  {
    id: 'cm2_mlg_lvl3_1',
    classId: 'CM2',
    subjectId: 'malagasy_cm2',
    level: 3,
    theme: 'Ohabolana sy Kolontsaina',
    question: 'Fenoy ity ohabolana malagasy ity : "Ny firaisankina no hery, ny fizarazarana kosa no..."',
    options: ['fahafatesana', 'fahalemena', 'faharavana', 'fahaverezana'],
    correctIndex: 1,
    explanation: 'Ny ohabolana fanta-daza dia : "Ny firaisankina no hery, ny fizarazarana no fahalemena".',
    source: 'Ohabolana Malagasy ofisialy - Fampianarana fototra'
  },
  {
    id: 'cm2_mlg_lvl6_1',
    classId: 'CM2',
    subjectId: 'malagasy_cm2',
    level: 6,
    theme: 'Fitsipiky ny Tsipelina',
    question: 'Inona ny sokajin-teny (classe grammaticale) misy ny teny hoe "Mianatra" ao amin\'ny fehezanteny hoe : "Mianatra tsara ny ankizy" ?',
    options: ['Anarana (Nom)', 'Mpamari-toetra (Adjectif)', 'Matoanteny (Verbe)', 'Tambinteny (Adverbe)'],
    correctIndex: 2,
    explanation: 'Ny teny hoe "Mianatra" dia milaza asa na toetra atao, ka matoanteny (verbe mialoha lazaina amin\'ny fehezanteny manaraka ny rafitra VOS).',
    source: 'Fitsipi-piteny Malagasy - Ambaratonga voalohany'
  },

  // --- 3ème Mathématiques ---
  {
    id: '3eme_math_lvl1_1',
    classId: '3ème',
    subjectId: 'mathematiques_3eme',
    level: 1,
    theme: 'Calcul Numérique & Puissances',
    question: 'Kajio ny lanjan\'ny : √64 + √25',
    options: ['11', '13', '89', '40'],
    correctIndex: 1,
    explanation: '√64 = 8 satria 8² = 64. √25 = 5 satria 5² = 25. Ka 8 + 5 = 13.',
    source: 'Programme BEPC Madagascar - Racines carrées'
  },
  {
    id: '3eme_math_lvl3_1',
    classId: '3ème',
    subjectId: 'mathematiques_3eme',
    level: 3,
    theme: 'Théorèmes de Pythagore & Thalès',
    question: 'Ao amin\'ny telolafy mahitsy ABC mahitsy eo amin\'ny A, raha AB = 6 cm ary AC = 8 cm, ohatrinona ny halavan\'ny hypoténuse BC ?',
    options: ['10 cm', '12 cm', '14 cm', '100 cm'],
    correctIndex: 0,
    explanation: 'Araka ny théorème de Pythagore : BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100. Koa BC = √100 = 10 cm.',
    source: 'Programme BEPC Madagascar - Théorème de Pythagore'
  },
  {
    id: '3eme_math_lvl5_1',
    classId: '3ème',
    subjectId: 'mathematiques_3eme',
    level: 5,
    theme: 'Calcul Littéral & Factorisation',
    question: 'Factorisez l\'expression suivante : E = (2x - 3)² - 25',
    options: ['(2x - 8)(2x + 2)', '(2x - 2)(2x + 8)', '(2x - 28)(2x + 22)', '(2x + 2)²'],
    correctIndex: 0,
    explanation: 'Il s\'agit de la forme a² - b² = (a - b)(a + b) avec a = (2x - 3) et b = 5 (car 25 = 5²). E = [(2x - 3) - 5][(2x - 3) + 5] = (2x - 8)(2x + 2).',
    source: 'Annales BEPC Madagascar - Identités remarquables'
  },
  {
    id: '3eme_math_lvl7_1',
    classId: '3ème',
    subjectId: 'mathematiques_3eme',
    level: 7,
    theme: 'Équations & Inéquations',
    question: 'Résolvez dans ℝ le système d\'équations linéaires : { 2x + y = 11 ; 3x - 2y = 6 }',
    options: ['x = 4, y = 3', 'x = 3, y = 5', 'x = 5, y = 1', 'x = 2, y = 7'],
    correctIndex: 0,
    explanation: 'De la 1ère équation : y = 11 - 2x. En remplaçant dans la 2ème : 3x - 2(11 - 2x) = 6 => 3x - 22 + 4x = 6 => 7x = 28 => x = 4. Alors y = 11 - 2(4) = 11 - 8 = 3. Le couple solution est (4, 3).',
    source: 'Épreuve officielle BEPC Madagascar - Systèmes à deux inconnues'
  },
  {
    id: '3eme_math_lvl10_1',
    classId: '3ème',
    subjectId: 'mathematiques_3eme',
    level: 10,
    theme: 'Trigonométrie & Géométrie',
    question: 'Soit un triangle rectangle en A tel que tan(B) = 3/4. Que vaut la valeur exacte de cos(B) ?',
    options: ['4/5', '3/5', '5/4', '4/3'],
    correctIndex: 0,
    explanation: 'On sait que 1 + tan²(B) = 1/cos²(B). Donc 1 + (3/4)² = 1 + 9/16 = 25/16. Par conséquent cos²(B) = 16/25, et comme l\'angle B est aigu, cos(B) = 4/5 = 0,8.',
    source: 'Sujet Concours d\'Excellence BEPC Madagascar - Trigonométrie avancée'
  },

  // --- 3ème Physique-Chimie ---
  {
    id: '3eme_pc_lvl1_1',
    classId: '3ème',
    subjectId: 'physique_chimie_3eme',
    level: 1,
    theme: 'Mécanique (Forces, Vitesse)',
    question: 'Quelle est l\'unité légale internationale (SI) de la force ?',
    options: ['Le Kilogramme (kg)', 'Le Newton (N)', 'Le Joule (J)', 'Le Watt (W)'],
    correctIndex: 1,
    explanation: 'L\'unité internationale de la force dans le Système International est le Newton, symbolisé par N.',
    source: 'Programme MEN Madagascar - Mécanique 3ème'
  },
  {
    id: '3eme_pc_lvl4_1',
    classId: '3ème',
    subjectId: 'physique_chimie_3eme',
    level: 4,
    theme: 'Solutions Aqueuses & pH',
    question: 'Une solution aqueuse a un pH mesuré égal à 3 à 25°C. Comment qualifie-t-on cette solution ?',
    options: ['Basique', 'Neutre', 'Acide', 'Saturée'],
    correctIndex: 2,
    explanation: 'À 25°C, une solution est acide si son pH < 7, neutre si pH = 7, et basique si pH > 7. Avec un pH de 3, la solution est acide.',
    source: 'Programme BEPC Madagascar - Solutions acido-basiques'
  },

  // --- 3ème SVT ---
  {
    id: '3eme_svt_lvl2_1',
    classId: '3ème',
    subjectId: 'svt_3eme',
    level: 2,
    theme: 'Reproduction Humaine & Génétique',
    question: 'Combien de chromosomes comporte une cellule somatique humaine normale ?',
    options: ['23 chromosomes', '46 chromosomes (23 paires)', '48 chromosomes', '92 chromosomes'],
    correctIndex: 1,
    explanation: 'L\'espèce humaine possède 46 chromosomes (soit 23 paires) dans chaque cellule somatique diploïde (2n = 46).',
    source: 'Programme BEPC Madagascar - Génétique humaine'
  },

  // --- Terminale S (Scientifique) ---
  {
    id: 'ts_math_lvl1_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'maths_ts',
    level: 1,
    theme: 'Fonctions Logarithme & Exponentielle',
    question: 'Quelle est la dérivée de la fonction f définie sur ]0, +∞[ par f(x) = ln(x) ?',
    options: ['f\'(x) = 1/x', 'f\'(x) = e^x', 'f\'(x) = x', 'f\'(x) = -1/x²'],
    correctIndex: 0,
    explanation: 'Par définition du cours d\'analyse en Terminale S, la dérivée de la fonction logarithme népérien f(x) = ln(x) est f\'(x) = 1/x pour tout x > 0.',
    source: 'Programme officiel Baccalauréat Série S Madagascar - Fonctions usuelles'
  },
  {
    id: 'ts_math_lvl3_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'maths_ts',
    level: 3,
    theme: 'Nombres Complexes & Géométrie',
    question: 'Quel est le module du nombre complexe z = 3 - 4i ?',
    options: ['7', '5', '1', '25'],
    correctIndex: 1,
    explanation: 'Le module |z| = √(a² + b²) = √(3² + (-4)²) = √(9 + 16) = √25 = 5.',
    source: 'Baccalauréat Série S Madagascar - Nombres complexes'
  },
  {
    id: 'ts_math_lvl6_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'maths_ts',
    level: 6,
    theme: 'Calcul Intégral & Primitives',
    question: 'Calculez l\'intégrale I = ∫₀¹ (2x + 3) dx',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation: 'Une primitive de (2x + 3) est F(x) = x² + 3x. Donc I = F(1) - F(0) = (1² + 3(1)) - (0) = 1 + 3 = 4.',
    source: 'Programme officiel Bac S Madagascar - Calcul Intégral'
  },
  {
    id: 'ts_math_lvl9_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'maths_ts',
    level: 9,
    theme: 'Suites Numériques & Récurrence',
    question: 'Soit la suite (uₙ) définie par u₀ = 2 et uₙ₊₁ = (uₙ + 6) / 4. Que vaut la limite de cette suite lorsque n tend vers +∞ ?',
    options: ['1', '2', '3', 'La suite diverge'],
    correctIndex: 1,
    explanation: 'Si la suite converge vers L, la relation de récurrence donne L = (L + 6)/4 => 4L = L + 6 => 3L = 6 => L = 2. On démontre facilement par récurrence que uₙ = 2 pour tout n, donc lim uₙ = 2.',
    source: 'Annales du Baccalauréat Scientifique Madagascar - Analyse'
  },
  {
    id: 'ts_math_lvl10_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'maths_ts',
    level: 10,
    theme: 'Probabilités & Lois de Densité',
    question: 'Une variable aléatoire X suit la loi exponentielle de paramètre λ = 0,5. Quelle est la probabilité conditionnelle P(X > 6 | X > 2) ?',
    options: ['e^(-2)', 'e^(-3)', '1 - e^(-2)', 'e^(-1)'],
    correctIndex: 0,
    explanation: 'La loi exponentielle est sans mémoire : P(X > s + t | X > s) = P(X > t). Ici avec s = 2 et t = 4 : P(X > 6 | X > 2) = P(X > 4) = e^(-λ × 4) = e^(-0,5 × 4) = e^(-2).',
    source: 'Épreuve d\'excellence Bac S Madagascar - Probabilités continues'
  },

  // --- Terminale S Physique-Chimie ---
  {
    id: 'ts_pc_lvl2_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'physique_chimie_ts',
    level: 2,
    theme: 'Lois de Newton & Balistique',
    question: 'D\'après la 2ème loi de Newton appliquée à un point matériel de masse constante m dans un référentiel galiléen, quelle est la relation fondamentale ?',
    options: ['Σ F_ext = m · a', 'Σ F_ext = m · v', 'Σ F_ext = ½ m v²', 'Σ F_ext = 0'],
    correctIndex: 0,
    explanation: 'La deuxième loi de Newton (principe fondamental de la dynamique) énonce que la somme vectorielle des forces extérieures appliquées à un solide est égale au produit de sa masse par le vecteur accélération : Σ F_ext = m · a.',
    source: 'Programme MEN Madagascar - Terminale S Physique'
  },
  {
    id: 'ts_pc_lvl6_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'physique_chimie_ts',
    level: 6,
    theme: 'Équilibres Acido-Basiques & pH-métrie',
    question: 'Quelle est la valeur du produit ionique de l\'eau pure Ke à la température de 25°C ?',
    options: ['10^(-7)', '10^(-14)', '14', '7'],
    correctIndex: 1,
    explanation: 'À 25°C, le produit ionique de l\'eau Ke = [H₃O⁺] · [OH⁻] = 1,0 × 10^(-14). D\'où pKe = -log(Ke) = 14.',
    source: 'Baccalauréat Série S Madagascar - Chimie en solution'
  },

  // --- Terminale S SVT ---
  {
    id: 'ts_svt_lvl3_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'svt_ts',
    level: 3,
    theme: 'Génétique Formelle & Moléculaire (ADN, Protéines)',
    question: 'Au cours de la biosynthèse des protéines, quelle molécule transporte les acides aminés spécifiques jusqu\'aux ribosomes ?',
    options: ['L\'ARN messager (ARNm)', 'L\'ARN de transfert (ARNt)', 'L\'ADN polymérase', 'L\'ATP synthétase'],
    correctIndex: 1,
    explanation: 'L\'ARNt (ARN de transfert) possède un anticodon complémentaire du codon de l\'ARNm et fixe à son extrémité 3\' l\'acide aminé correspondant qu\'il achemine au ribosome.',
    source: 'Programme Terminale S Madagascar - SVT Génétique moléculaire'
  },

  // --- Terminale OSE (Organisation, Société et Économie) ---
  {
    id: 'tose_ses_lvl1_1',
    classId: 'Terminale',
    serieId: 'Série OSE',
    subjectId: 'ses_tose',
    level: 1,
    theme: 'Acteurs Économiques & Circuits',
    question: 'En économie, quelle est la fonction principale attribuée aux ménages dans le circuit économique ?',
    options: ['La production de biens et services marchands', 'La consommation finale de biens et services', 'La régulation monétaire', 'Le prélèvement des impôts'],
    correctIndex: 1,
    explanation: 'La fonction économique principale des ménages est la consommation finale de biens et services et la fourniture des facteurs de production (travail et capital).',
    source: 'Programme officiel Série OSE Madagascar - SES Terminale'
  },
  {
    id: 'tose_ses_lvl3_1',
    classId: 'Terminale',
    serieId: 'Série OSE',
    subjectId: 'ses_tose',
    level: 3,
    theme: 'Fonctionnement du Marché & Concurrence',
    question: 'Sur un marché de concurrence parfaite, que se produit-il lorsque l\'offre d\'un produit agricole (ex: la vanille à Madagascar) est largement supérieure à sa demande ?',
    options: ['Le prix d\'équilibre a tendance à baisser', 'Le prix d\'équilibre augmente automatiquement', 'La demande disparaît', 'L\'offre diminue instantanément de moitié'],
    correctIndex: 0,
    explanation: 'Selon la loi de l\'offre et de la demande, un excès d\'offre par rapport à la demande crée une situation de surplus qui pousse les prix d\'équilibre à la baisse.',
    source: 'Programme officiel Série OSE Madagascar - Marchés & Prix'
  },
  {
    id: 'tose_ses_lvl6_1',
    classId: 'Terminale',
    serieId: 'Série OSE',
    subjectId: 'ses_tose',
    level: 6,
    theme: 'Croissance, Pauvreté & Développement à Madagascar',
    question: 'Quelle est la différence fondamentale entre la "croissance économique" et le "développement" ?',
    options: [
      'La croissance est quantitative (hausse du PIB), tandis que le développement est qualitatif (amélioration des conditions de vie, IDH)',
      'La croissance ne concerne que l\'agriculture, le développement ne concerne que l\'industrie',
      'Le développement se mesure uniquement en Ariary, la croissance en Dollars',
      'Il n\'y a aucune différence, ce sont deux termes strictement synonymes'
    ],
    correctIndex: 0,
    explanation: 'La croissance économique mesure l\'augmentation quantitative de la production de richesse (PIB sur une période donnée). Le développement englobe des transformations structurelles, sociales, sanitaires et éducatives améliorant le bien-être (mesuré notamment par l\'IDH).',
    source: 'Baccalauréat Série OSE Madagascar - Économie du développement'
  },
  {
    id: 'tose_math_lvl2_1',
    classId: 'Terminale',
    serieId: 'Série OSE',
    subjectId: 'maths_tose',
    level: 2,
    theme: 'Suites Arithmétiques/Géométriques & Intérêts',
    question: 'Un entrepreneur dépose 1 000 000 Ar sur un compte à intérêts simples au taux annuel de 10%. Quel sera le capital total au bout de 3 ans ?',
    options: ['1 100 000 Ar', '1 300 000 Ar', '1 331 000 Ar', '3 000 000 Ar'],
    correctIndex: 1,
    explanation: 'À intérêts simples : Intérêt annuel = 1 000 000 × 0,10 = 100 000 Ar. Pour 3 ans : 3 × 100 000 = 300 000 Ar. Capital total = 1 000 000 + 300 000 = 1 300 000 Ar.',
    source: 'Programme Série OSE Madagascar - Mathématiques financières'
  },

  // --- Terminale L (Littéraire) ---
  {
    id: 'tl_philo_lvl1_1',
    classId: 'Terminale',
    serieId: 'Série L',
    subjectId: 'philo_tl',
    level: 1,
    theme: 'La Conscience & L\'Inconscient',
    question: 'À quel philosophe attribue-t-on la célèbre formule fondatrice du rationalisme moderne : "Cogito, ergo sum" (Je pense, donc je suis) ?',
    options: ['René Descartes', 'Jean-Jacques Rousseau', 'Socrate', 'Emmanuel Kant'],
    correctIndex: 0,
    explanation: 'C\'est René Descartes dans le Discours de la méthode (1637) et les Méditations métaphysiques qui fonde la première certitude sur le "Cogito" (la conscience pensante de soi).',
    source: 'Programme officiel Baccalauréat Série L Madagascar - Philosophie'
  },
  {
    id: 'tl_malagasy_lvl4_1',
    classId: 'Terminale',
    serieId: 'Série L',
    subjectId: 'malagasy_tl',
    level: 4,
    theme: 'Kabary & Haisoratra Nentim-paharazana',
    question: 'Amin\'ny Kabary Malagasy, inona no atao hoe "Fialan-tsiny" na "Azafady", ary inona no anjara asany ?',
    options: [
      'Fanekena ho resy alohan\'ny hitenenana',
      'Fanajana ny mpanatrika sy fanalana tsiny amin\'ireo zokiolona sy manam-pahefana',
      'Famaranana ny lahateny amin\'ny fomba ofisialy',
      'Fitalahoana mba tsy hosaziana'
    ],
    correctIndex: 1,
    explanation: 'Ny fialan-tsiny amin\'ny kabary malagasy dia dingana tsy maintsy lalovana hanehoana fanetren-tena, fanajana ny zoky sy ny fomba amam-panao, mba hisorohana ny tsiny alohan\'ny hanaterana ny votoatin-daharana.',
    source: 'Programa Malagasy Terminale L - Haisoratra sy Kolontsaina Malagasy'
  },

  // --- CM2 Français ---
  {
    id: 'cm2_fr_lvl1_1',
    classId: 'CM2',
    subjectId: 'francais_cm2',
    level: 1,
    theme: 'Grammaire & Groupe Nominal',
    question: 'Identifiez le groupe nominal sujet dans la phrase : "Les élèves de CM2 préparent consciencieusement leur examen du CEPE."',
    options: [
      'préparent consciencieusement',
      'leur examen du CEPE',
      'Les élèves de CM2',
      'de CM2 préparent'
    ],
    correctIndex: 2,
    explanation: 'Le groupe nominal sujet répond à la question "Qui est-ce qui prépare... ?". La réponse est : "Les élèves de CM2".',
    source: 'Programme MEN Madagascar - Français Fondamental CM2'
  },
  {
    id: 'cm2_fr_lvl3_1',
    classId: 'CM2',
    subjectId: 'francais_cm2',
    level: 3,
    theme: 'Conjugaison (Présent, Futur, Passé)',
    question: 'Conjuguez le verbe "finir" au futur simple avec le pronom "nous" : "Demain, nous ______ nos exercices."',
    options: ['finissons', 'finirons', 'finissions', 'finirions'],
    correctIndex: 1,
    explanation: 'Au futur simple de l\'indicatif, les verbes du 2ème groupe prennent la terminaison -ons précédée de l\'infinitif : nous finirons.',
    source: 'Programme MEN Madagascar - Conjugaison CM2'
  },

  // --- CM2 Connaissances Usuelles / Tontolo Iainana ---
  {
    id: 'cm2_cu_lvl1_1',
    classId: 'CM2',
    subjectId: 'connaissances_usuelles_cm2',
    level: 1,
    theme: 'Le Corps Humain & Hygiène',
    question: 'Inona no taova lehibe indrindra mandrakotra ny vatan\'olombelona ary miaro azy amin\'ny mikraoba sy ny hafanana ?',
    options: ['Ny fo (Le cœur)', 'Ny hoditra (La peau)', 'Ny avokavoka (Les poumons)', 'Ny aty (Le foie)'],
    correctIndex: 1,
    explanation: 'Ny hoditra (la peau) no taova ivelany lehibe indrindra miaro ny vatana amin\'ny herisetra ivelany, mikraoba, ary manampy amin\'ny fifehezana ny hafanana.',
    source: 'Programme MEN Madagascar - Connaissances Usuelles CEPE'
  },
  {
    id: 'cm2_cu_lvl3_1',
    classId: 'CM2',
    subjectId: 'connaissances_usuelles_cm2',
    level: 3,
    theme: 'Faune & Flore de Madagascar',
    question: 'Iza amin\'ireto biby ireto no biby tsy manam-paharoa (endémique) ary tandindomin-doza eto Madagasikara ?',
    options: ['Ny Varika / Gidro (Lémurien)', 'Ny Liona (Lion)', 'Ny Soavaly (Cheval)', 'Ny Rameva (Chameau)'],
    correctIndex: 0,
    explanation: 'I Madagasikara dia malaza amin\'ireo karazana Varika na Gidro (lémuriens) maro izay eto an-toerana ihany no misy azy voajanahary (endémiques).',
    source: 'Programme MEN Madagascar - Biodiversité et Écosystèmes'
  },

  // --- CM2 Histoire-Géographie ---
  {
    id: 'cm2_hg_lvl1_1',
    classId: 'CM2',
    subjectId: 'histoire_geo_cm2',
    level: 1,
    theme: 'Géographie physique de Madagascar',
    question: 'Inona ny tendrombohitra avo indrindra eto Madagasikara (2 876 metatra) ?',
    options: ['Ankaratra', 'Marojejy', 'Maromokotro (Tsaratanana)', 'Andringitra'],
    correctIndex: 2,
    explanation: 'Ny tendrombohitra Maromokotro ao amin\'ny tangorom-bohitra Tsaratanana (faritra avaratr\'i Madagasikara) no tendro avo indrindra mirefy 2 876 m.',
    source: 'Programme MEN Madagascar - Géographie de Madagascar CEPE'
  },
  {
    id: 'cm2_hg_lvl3_1',
    classId: 'CM2',
    subjectId: 'histoire_geo_cm2',
    level: 3,
    theme: 'Les 23 Régions de Madagascar',
    question: 'Firy ny isan\'ny Faritra (Régions) mandrafitra ny tanin\'ny Repoblikan\'i Madagasikara amin\'izao fotoana izao ?',
    options: ['6 Faritra', '18 Faritra', '22 Faritra', '23 Faritra'],
    correctIndex: 3,
    explanation: 'Misy 23 ny faritra eto Madagasikara amin\'izao fotoana izao taorian\'ny nananganana ny Faritra Vatovavy sy Fitovinany ho faritra roa samy mahaleotena.',
    source: 'Programme MEN Madagascar - Éducation Civique & Territoire'
  },

  // --- 3ème Français ---
  {
    id: '3eme_fr_lvl2_1',
    classId: '3ème',
    subjectId: 'francais_3eme',
    level: 2,
    theme: 'Texte Argumentatif & Narratif',
    question: 'Dans un texte argumentatif, quel terme désigne la proposition ou l\'idée principale que défend l\'auteur ?',
    options: ['L\'exemple', 'La thèse', 'Le connecteur logique', 'La réfutation'],
    correctIndex: 1,
    explanation: 'La thèse est l\'opinion, le point de vue ou l\'idée générale que l\'auteur soutient et cherche à faire admettre par ses arguments.',
    source: 'Programme BEPC Madagascar - Français / Écriture argumentative'
  },

  // --- 3ème Histoire-Géographie ---
  {
    id: '3eme_hg_lvl2_1',
    classId: '3ème',
    subjectId: 'histoire_geo_3eme',
    level: 2,
    theme: 'L\'Insurrection de 1947 et l\'Indépendance',
    question: 'Tamin\'ny taona firy no niverenan\'ny Fahaleovantenan\'i Madagasikara (Indépendance de Madagascar) ?',
    options: ['29 Martsa 1947', '26 Jona 1960', '14 Oktobra 1958', '13 Mey 1972'],
    correctIndex: 1,
    explanation: 'Ny 26 Jona 1960 no niverenan\'ny Fahaleovantenan\'i Madagasikara tamin\'ny fomba ofisialy rehefa nifarana ny fanjanahan-tany frantsay.',
    source: 'Programme BEPC Madagascar - Histoire de Madagascar'
  },

  // --- 3ème Anglais ---
  {
    id: '3eme_eng_lvl1_1',
    classId: '3ème',
    subjectId: 'anglais_3eme',
    level: 1,
    theme: 'Verb Tenses & Modals',
    question: 'Choose the correct form to complete the sentence: "Every day, students in Madagascar ______ to school with dedication."',
    options: ['goes', 'go', 'went', 'have gone'],
    correctIndex: 1,
    explanation: 'With "students" (plural third person) and "Every day" (habitual present simple), the correct base form is "go".',
    source: 'Programme BEPC Madagascar - English Grammar'
  },
  {
    id: '3eme_eng_lvl3_1',
    classId: '3ème',
    subjectId: 'anglais_3eme',
    level: 3,
    theme: 'Passive & Active Voice',
    question: 'Turn this active sentence into passive: "The teacher explains the lesson clearly."',
    options: [
      'The lesson is explained clearly by the teacher.',
      'The lesson was explained clearly by the teacher.',
      'The lesson has been explained clearly.',
      'The teacher is explained the lesson.'
    ],
    correctIndex: 0,
    explanation: 'Present simple active ("explains") becomes present simple passive: "is + past participle" = "is explained".',
    source: 'Programme BEPC Madagascar - English Passive Voice'
  },

  // --- Terminale Histoire-Géo (L & S & OSE) ---
  {
    id: 'tl_hg_lvl2_1',
    classId: 'Terminale',
    serieId: 'Série L',
    subjectId: 'histoire_geo_tl',
    level: 2,
    theme: 'Le Monde après 1945 & Guerre Froide',
    question: 'De quelle année à quelle année s\'étend traditionnellement la période de la Guerre Froide entre les États-Unis et l\'URSS ?',
    options: ['1914 - 1918', '1939 - 1945', '1947 - 1991', '1960 - 2000'],
    correctIndex: 2,
    explanation: 'La Guerre Froide débute avec les doctrines Truman et Jdanov en 1947 et s\'achève avec l\'effondrement de l\'Union Soviétique en décembre 1991.',
    source: 'Baccalauréat Madagascar - Histoire Terminale'
  },
  {
    id: 'ts_hg_lvl2_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'histoire_geo_ts',
    level: 2,
    theme: 'Madagascar : Espaces & Défis Économiques',
    question: 'Quel est le premier port de commerce maritime de Madagascar pour l\'exportation et l\'importation de marchandises ?',
    options: ['Le port de Mahajanga', 'Le Grand Port de Toamasina (Tamatave)', 'Le port d\'Antsiranana (Diego Suarez)', 'Le port de Toliara'],
    correctIndex: 1,
    explanation: 'Le port de Toamasina (Tamatave) est le premier port maritime de Madagascar, concentrant l\'immense majorité du trafic conteneurisé et du commerce international du pays.',
    source: 'Programme Baccalauréat Madagascar - Géographie économique'
  },

  // --- Terminale Anglais ---
  {
    id: 'tl_eng_lvl2_1',
    classId: 'Terminale',
    serieId: 'Série L',
    subjectId: 'anglais_tl',
    level: 2,
    theme: 'Advanced Grammar & Idioms',
    question: 'Complete the sentence with the appropriate conditional: "If biodiversity in Madagascar ______ protected, unique species will disappear forever."',
    options: ['is not', 'was not', 'would not be', 'had not been'],
    correctIndex: 0,
    explanation: 'First conditional structure: "If + present simple, will + base form". Here, "If biodiversity is not protected, unique species will disappear".',
    source: 'Baccalauréat Série L Madagascar - English Examination'
  },
  // --- FOV CM2 (Fanabeazana ho Olom-pirenena Vanona) ---
  {
    id: 'cm2_fov_lvl1_1',
    classId: 'CM2',
    subjectId: 'fov_cm2',
    level: 1,
    theme: "Fihavanana sy Soatoavina Malagasy",
    question: "Araka ny soatoavina malagasy nentim-paharazana sy ny fampianarana FOV, inona no hevitry ny ohabolana hoe : \"Ny fihavanana toy ny kofehy manify, raha toprana tapaka, fa raha tohizana mitohy\" ?",
    options: [
      "Mila koloina sy tandremana mandrakariva ny fifandraisana tsara eo amin'ny fiarahamonina",
      "Tsy misy ilana azy ny mifandray amin'ny mpiara-belona",
      "Ny vola no zava-dehibe indrindra mihoatra ny havana",
      "Tsy azo amboarina intsony ny disadisa rehefa mitranga"
    ],
    correctIndex: 0,
    explanation: "Ny Fihavanana dia soatoavina iankinan'ny fiarahamonina malagasy, izay mitaky fifanajana, fifandeferana ary fihazonana ny firaisankina.",
    source: "Fandaharam-pianarana Ofisialy MEN Madagascar - FOV CM2"
  },
  {
    id: 'cm2_fov_lvl2_1',
    classId: 'CM2',
    subjectId: 'fov_cm2',
    level: 2,
    theme: "Zon'ny Ankizy sy Andraikitra",
    question: "Inona no zony fototra lehibe indrindra ananan'ny ankizy malagasy rehetra araka ny Lalàna sy ny Fifanarahana Iraisam-pirenena ?",
    options: [
      "Zo hanana anarana, zom-pirenena ary hahazo fanabeazana sy fahasalamana",
      "Zo hiasa sy hitady vola hatramin'ny fahazazana",
      "Zo tsy handeha hianatra raha tsy mazoto",
      "Zo tsy hanaja ray aman-dreny sy mpampianatra"
    ],
    correctIndex: 0,
    explanation: "Ny ankizy tsirairay dia manan-jo hahazo anarana, zom-pirenena, fiahiana ara-pahasalamana ary fampianarana maimaimpoana sy manara-penitra.",
    source: "Fandaharam-pianarana Ofisialy MEN Madagascar - FOV CM2"
  },
  // --- Arts CM2 ---
  {
    id: 'cm2_arts_lvl1_1',
    classId: 'CM2',
    subjectId: 'arts_cm2',
    level: 1,
    theme: "Fitaovam-pitendry sy Hira Malagasy",
    question: "Iza amin'ireto fitaovam-pitendry mozika nentim-paharazana ireto no vita amin'ny volotsangana (bambou) ary mampiavaka an'i Madagasikara maneran-tany ?",
    options: ["Ny Valiha", "Ny Gitara elektrika", "Ny Lokanga tandrefana", "Ny Pianô"],
    correctIndex: 0,
    explanation: "Ny Valiha dia zavamaneno nentim-paharazana malagasy manana kofehy maro manodidina ny vatany vita amin'ny volotsangana.",
    source: "Fandaharam-pianarana Ofisialy MEN Madagascar - Arts CM2"
  },
  // --- Climat CM2 ---
  {
    id: 'cm2_climat_lvl1_1',
    classId: 'CM2',
    subjectId: 'climat_cm2',
    level: 1,
    theme: "Fiarovana ny Ala sy ny Zavaboary",
    question: "Nahoana no tena zava-dehibe ho an'i Madagasikara ny fambolen-kazo sy ny fampitsaharana ny doro ala (tavy) ?",
    options: [
      "Mba hiarovana ny tany tsy hokafohan'ny riaka sy hitazomana ny loharano ary ny biby mampiavaka ny nosy",
      "Mba hahafahana mandoro hazo bebe kokoa amin'ny taona manaraka",
      "Satria tsy misy orana intsony raha tsy may ny ala",
      "Tsy misy ifandraisany amin'ny fiainana andavanandro ny ala"
    ],
    correctIndex: 0,
    explanation: "Ny ala dia miaro ny nofon-tany amin'ny lavaka sy erosiona, mitahiry ny rano ambanin'ny tany ary miantoka ny toetrandro mandamina.",
    source: "Fandaharam-pianarana Ofisialy MEN Madagascar - Tontolo Iainana CM2"
  },
  // --- FOV 3ème ---
  {
    id: '3eme_fov_lvl1_1',
    classId: '3ème',
    subjectId: 'fov_3eme',
    level: 1,
    theme: "Ireo Andrim-panjakana sy ny Lalàmpanorenana",
    question: "Araka ny Lalàmpanorenan'ny Repoblikan'i Madagasikara, iza no Andrim-panjakana miantoka ny fiarovana ny fiandrianam-pirenena sy ny firaisam-pirenena ?",
    options: [
      "Ny Filohan'ny Repoblika",
      "Ny Ben'ny tanàna fotsiny",
      "Ny Fikambanana tsy miankina amin'ny fanjakana (ONG)",
      "Ny Kaoperativa mpamboly"
    ],
    correctIndex: 0,
    explanation: "Ny Filohan'ny Repoblika no Lehiben'ny Fanjakana, miantoka ny fanajana ny Lalàmpanorenana sy ny fiandrianam-pirenena.",
    source: "Fandaharam-pianarana Ofisialy BEPC - FOV 3ème"
  },
  // --- TICE 3ème ---
  {
    id: '3eme_tice_lvl1_1',
    classId: '3ème',
    subjectId: 'tice_3eme',
    level: 1,
    theme: "Fiarovana ny Tsiambaratelo & Cyber-sécurité",
    question: "Inona no fepetra tsara indrindra ampiasaina amin'ny famoronana tenimiafina (mot de passe) matanjaka amin'ny aterineto ?",
    options: [
      "Fampifangaroana litera lehibe sy kely, tarehimarika ary mari-tsoratra mihoatra ny 10 isa",
      "Fampiasana ny daty nahaterahana fotsiny mba ho mora tadidy",
      "Fampiasana ny teny hoe \"123456\" na \"madagascar\"",
      "Fizarana ny tenimiafina amin'ny namana rehetra ao anaty tambajotra sosialy"
    ],
    correctIndex: 0,
    explanation: "Ny tenimiafina azo antoka dia manambatra litera isan-karazany, tarehimarika ary mari-tsoratra manokana, ary tsy tokony hozaraina amin'olon-kafa na oviana na oviana.",
    source: "Fandaharam-pianarana Ofisialy BEPC - TICE 3ème"
  },
  // --- EAC Terminale ---
  {
    id: 'term_eac_lvl1_1',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'eac_ts',
    level: 1,
    theme: "Éthique Scientifique & Bioéthique",
    question: "Dans le cadre de l'Éducation à la Citoyenneté (EAC) au Baccalauréat, quelle est la responsabilité éthique fondamentale du scientifique vis-à-vis de la société ?",
    options: [
      "Veiller à ce que les innovations respectent la dignité humaine, la santé publique et la biodiversité",
      "Rechercher le profit commercial sans se soucier des conséquences environnementales",
      "Développer des technologies destructrices sans concertation citoyenne",
      "Garder secrètes toutes les découvertes susceptibles de sauver des vies"
    ],
    correctIndex: 0,
    explanation: "La bioéthique et l'éthique scientifique imposent le respect fondamental de la personne humaine et la préservation de l'écosystème planétaire.",
    source: "Programme Officiel Baccalauréat Madagascar - EAC Terminale"
  }
];

/**
 * Universal safe fallback question selector usable both on server and client.
 */
export function getCurriculumFallbackQuestion(
  classId: GradeLevel,
  subjectId: string,
  level: number,
  serieId?: TerminaleSerie,
  excludeIds: string[] = []
): Question {
  // 1. Check exact match in SEED_QUESTIONS
  const candidates = SEED_QUESTIONS.filter(q => {
    if (q.classId !== classId) return false;
    if (serieId && q.serieId && q.serieId !== serieId) return false;
    if (q.subjectId !== subjectId) return false;
    return !excludeIds.includes(q.id);
  });

  if (candidates.length > 0) {
    candidates.sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level));
    return candidates[0];
  }

  // 2. If all specific seeds were excluded, recycle matching candidates with fresh ID
  const allSubjectSeeds = SEED_QUESTIONS.filter(q => {
    if (q.classId !== classId) return false;
    if (serieId && q.serieId && q.serieId !== serieId) return false;
    return q.subjectId === subjectId;
  });

  if (allSubjectSeeds.length > 0) {
    allSubjectSeeds.sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level));
    const chosen = allSubjectSeeds[Math.floor(Math.random() * allSubjectSeeds.length)];
    return {
      ...chosen,
      id: `${chosen.id}_cyc_${Date.now()}`
    };
  }

  // 3. Subject-level intelligent fallback based on official curriculum data
  const curriculumObj = OFFICIAL_CURRICULUM[classId];
  let subjectName = subjectId;
  let theme = "Notions Fondamentales";
  let officialRef = "Programme officiel MEN Madagascar";

  if (curriculumObj?.subjects) {
    const s = curriculumObj.subjects.find(sub => sub.id === subjectId);
    if (s) {
      subjectName = s.name;
      theme = s.themes[Math.min(level - 1, s.themes.length - 1)] || s.themes[0] || theme;
    }
  } else if (curriculumObj?.series && serieId) {
    const sSerie = curriculumObj.series.find(ser => ser.id === serieId);
    const s = sSerie?.subjects.find(sub => sub.id === subjectId);
    if (s) {
      subjectName = s.name;
      theme = s.themes[Math.min(level - 1, s.themes.length - 1)] || s.themes[0] || theme;
    }
  }

  return {
    id: `fb_${classId}_${subjectId}_lvl${level}_${Date.now()}`,
    classId,
    serieId,
    subjectId,
    level,
    theme,
    question: `[${subjectName} - Niveau ${level}/10] Fampiharana ofisialy : Ao anatin'ny fandaharam-pianarana mikasika ny "${theme}", inona no fitsipika sy fomba fiasa takina mifanaraka amin'ny fenitry ny Ministeran'ny Fanabeazam-pirenena (MEN) ?`,
    options: [
      "Famakafakana ny zava-misy, fampiharana ny fitsipika ofisialy ary famoahana ny vokatra marina",
      "Fanombanana maimaika tsy mila fanamarinana ny famaritana sy ny fepetra fototra",
      "Fanaovana kajy na fandinihana tsy miankina amin'ny lalànan'ny fandaharam-pianarana",
      "Famaliana an-jambany tsy mampiasa ny fomba fiasa nianarana tany an-tsekoly"
    ],
    correctIndex: 0,
    explanation: `Fanazavana pedagojika ofisialy : Amin'ny taranja ${subjectName} ho an'ny kilasy ${classId} (Niveau ${level}), ny fomba fiasa takina dia ny famantarana ny angon-drakitra fototra, ny fampiasana ny fitsipika sy ny fomba fiasa voasoratra ao amin'ny fandaharam-pianaran'ny MEN, ary ny fanamarinana ny famaranan-kevitra.`,
    source: `${officialRef} - ${subjectName} (${theme})`
  };
}

export const LEVEL_CRITERIA: Record<number, { title: string; description: string; badge: string }> = {
  1: {
    title: 'Niveau 1 : Fondations & Notions Fondamentales',
    description: 'Fanontaniana mora sy fototra. Définitions, concepts clés et calculs directs.',
    badge: 'Débutant / Fototra'
  },
  2: {
    title: 'Niveau 2 : Compréhension Élémentaire',
    description: 'Fanontaniana mbola fototra fa mitaky fahatakarana bebe kokoa.',
    badge: 'Élémentaire'
  },
  3: {
    title: 'Niveau 3 : Application Directe',
    description: 'Application de formules et de règles directes du cours officiel.',
    badge: 'Application'
  },
  4: {
    title: 'Niveau 4 : Intermédiaire & Raisonnement',
    description: 'Fanontaniana antonony, misy raisonnement sy dingana maromaro.',
    badge: 'Intermédiaire'
  },
  5: {
    title: 'Niveau 5 : Analyse Guidée',
    description: 'Problèmes avec étapes de déduction et interprétation des données.',
    badge: 'Analytique'
  },
  6: {
    title: 'Niveau 6 : Raisonnement Avancé',
    description: 'Mise en relation de notions et synthèse intermédiaire.',
    badge: 'Raisonnement'
  },
  7: {
    title: 'Niveau 7 : Difficulté Élevée (Niveau Examen)',
    description: 'Fanontaniana sarotra kokoa, type examen officiel (CEPE, BEPC, Bac).',
    badge: 'Avancé'
  },
  8: {
    title: 'Niveau 8 : Problèmes Complexes & Synthèse',
    description: 'Problèmes multi-notions nécessitant rigueur et méthode complète.',
    badge: 'Expert'
  },
  9: {
    title: 'Niveau 9 : Haut Niveau (Mention & Concours)',
    description: 'Fanontaniana avo lenta, requérant intuition et esprit critique.',
    badge: 'Haut Niveau'
  },
  10: {
    title: 'Niveau 10 : Maîtrise Totale & Excellence',
    description: 'Fanontaniana tena sarotra, mitaky fahatakarana lalina sy raisonnement matotra.',
    badge: 'Maîtrise Suprême'
  }
};

export const OFFICIAL_SOURCES = [
  {
    title: "Programmes Scolaires Officiels de l'Enseignement Secondaire Général (Terminale)",
    authority: "Ministère de l'Éducation Nationale (MEN Madagascar)",
    year: "2020 - Présent",
    notes: "Réforme officielle instaurant les Séries L (Littéraire), S (Scientifique) et OSE (Organisation, Société et Économie) avec les coefficients officiels."
  },
  {
    title: "Programmes Officiels de l'Enseignement Fondamental - Collège (Classe de 3ème)",
    authority: "Direction des Curricula et de la Recherche Pédagogique (DCRP / MEN)",
    year: "Programme en vigueur",
    notes: "Directives officielles pour le BEPC : Mathématiques, Sciences Physiques, SVT, Malagasy, Français, Histoire-Géographie & Éducation à la Citoyenneté, Anglais."
  },
  {
    title: "Curriculum Primaire & Référentiel de Compétences CEPE (Classe de CM2)",
    authority: "Ministère de l'Éducation Nationale (MEN Madagascar)",
    year: "Programme en vigueur",
    notes: "Objectifs pédagogiques et d'évaluation pour le Certificat d'Études Primaires Élémentaires (CEPE)."
  }
];

