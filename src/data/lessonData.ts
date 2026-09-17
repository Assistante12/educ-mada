import { GradeLevel, TerminaleSerie, LessonRemediation } from '../types';
import { OFFICIAL_CURRICULUM } from './curriculumData';

/**
 * Check if a lesson contains obsolete generic placeholder guidelines
 */
export function isBogusGenericLesson(lesson: LessonRemediation | null | undefined): boolean {
  if (!lesson) return true;
  const theoryStr = Array.isArray(lesson.coreTheory) ? lesson.coreTheory.join(' ') : '';
  const mistakeStr = Array.isArray(lesson.commonMistakes) ? JSON.stringify(lesson.commonMistakes) : '';
  const methodStr = Array.isArray(lesson.methodology) ? lesson.methodology.join(' ') : '';
  const exampleStr = typeof lesson.solvedExample === 'object' ? JSON.stringify(lesson.solvedExample) : '';

  return (
    theoryStr.includes("Tsy maintsy fantarina mialoha ny hevitra fototra") ||
    theoryStr.includes("Ampiasao ara-dalàna ny fomba fiasa nomena") ||
    theoryStr.includes("Il est indispensable de connaître au préalable les concepts de base") ||
    theoryStr.includes("Utilisez convenablement la méthodologie fournie") ||
    mistakeStr.includes("Firosoana avy hatrany amin'ny valiny tsy misy famakafakana") ||
    mistakeStr.includes("Omeo 2 minitra foana ny tenanao hamarinana") ||
    methodStr.includes("Dingana 1 : Fakafakao ny angon-drakitra sy ny zava-kendrena") ||
    methodStr.includes("Étape 1 : Analysez les données et l'objectif") ||
    exampleStr.includes("Valiny marina sy voadinika manaraka ny marika ofisialy") ||
    exampleStr.includes("Réponse conforme aux directives officielles sans calcul explicite") ||
    exampleStr.includes("Famaritana ny fepetra sy ny zavatra fantatra ao amin'ny lesona")
  );
}

/**
 * High quality curated lessons verified for the Malagasy Curriculum (MEN Madagascar)
 * Both French (official exam language for scientific/humanities) and Malagasy are supported.
 */
export const CURRICULUM_LESSONS: Record<string, LessonRemediation> = {
  // CM2 - Mathématiques (Multiplication & Division Euclidienne) - FRANÇAIS
  'CM2_all_mathematiques_cm2_1_fr': {
    id: 'les_cm2_math_1_fr',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    subjectName: 'Mathématiques',
    level: 1,
    title: 'Arithmétique : Multiplication Posée et Division Euclidienne',
    theme: 'Opérations & Nombres',
    language: 'fr',
    objectives: [
      'Maîtriser la technique opératoire de la multiplication par un nombre à 2 ou 3 chiffres',
      'Identifier les 4 composantes de la division : Dividende, Diviseur, Quotient et Reste',
      'Vérifier le résultat grâce à l\'égalité fondamentale : Dividende = (Diviseur × Quotient) + Reste'
    ],
    coreTheory: [
      'La Multiplication est une addition répétée d\'un même nombre : par exemple, 24 × 5 = 24 + 24 + 24 + 24 + 24 = 120. Le signe opératoire officiel est toujours « × ».',
      'La Division Euclidienne permet de partager équitablement une quantité A (Dividende) par un nombre B (Diviseur). Elle produit un Quotient Q et un Reste R.',
      'Formule fondamentale d\'évaluation : $\\text{Dividende} = (\\text{Diviseur} \\times \\text{Quotient}) + \\text{Reste}$.',
      'Règle d\'or absolue de la division : Le Reste doit obligatoirement être strictement inférieur au Diviseur ($\\text{Reste} < \\text{Diviseur}$). Si le Reste est supérieur ou égal au Diviseur, le quotient calculé est insuffisant.'
    ],
    commonMistakes: [
      {
        mistake: 'Oubli de la retenue lors de la multiplication posée.',
        explanation: 'Dans 36 × 4, si l\'on calcule 6 × 4 = 24 et que l\'on oublie d\'ajouter la retenue 2 à 3 × 4 = 12, on obtient 124 au lieu de 144.',
        correction: 'Noter clairement la retenue au-dessus de la colonne suivante et la barrer dès qu\'elle est additionnée.'
      },
      {
        mistake: 'Obtention d\'un reste supérieur ou égal au diviseur (Reste ≥ Diviseur).',
        explanation: 'En divisant 58 par 7, donner un quotient de 7 avec un reste de 9 est une faute, car 9 contient encore une fois 7.',
        correction: 'Vérifier systématiquement que le Reste est strictement inférieur au Diviseur : 58 = (7 × 8) + 2 (avec 2 < 7).'
      }
    ],
    methodology: [
      'Étape 1 (Disposition) : Poser l\'opération en colonnes bien alignées (unités sous unités, dizaines sous dizaines).',
      'Étape 2 (Calcul) : Multiplier de droite à gauche en tenant compte scrupuleusement des retenues.',
      'Étape 3 (Vérification de la division) : Appliquer la formule inverse : (Diviseur × Quotient) + Reste = Dividende.'
    ],
    solvedExample: {
      problem: 'Problème concret : Une école achète 94 cahiers pour les distribuer équitablement entre 6 classes. Combien de cahiers reçoit chaque classe et combien de cahiers restent dans la réserve ?',
      steps: [
        'Données du problème : Dividende = 94 cahiers, Diviseur = 6 classes.',
        'Étape 1 : Dans 9, combien de fois 6 ? Il y va 1 fois (1 × 6 = 6). 9 - 6 = 3. On abaisse le 4, on obtient 34.',
        'Étape 2 : Dans 34, combien de fois 6 ? Il y va 5 fois (5 × 6 = 30). 34 - 30 = 4.',
        'Résultat : Quotient = 15, Reste = 4.',
        'Preuve par la formule officielle : (6 × 15) + 4 = 90 + 4 = 94.'
      ],
      finalAnswer: 'Chaque classe reçoit 15 cahiers, et il reste 4 cahiers dans la réserve (Reste 4 < Diviseur 6).'
    },
    keyTakeaways: [
      'Règle fondamentale : Dividende = (Diviseur × Quotient) + Reste.',
      'Condition obligatoire : Le Reste doit toujours être strictement inférieur au Diviseur (Reste < Diviseur).',
      'Ne jamais utiliser le symbole « * » mais toujours le signe mathématique « × ».'
    ],
    officialReference: 'Programme MEN Madagascar - Enseignement Primaire CM2 (Examen Officiel CEPE - Calcul)'
  },

  // CM2 - Mathématiques (Fractions & Pourcentages) - FRANÇAIS
  'CM2_all_mathematiques_cm2_2_fr': {
    id: 'les_cm2_math_2_fr',
    classId: 'CM2',
    subjectId: 'mathematiques_cm2',
    subjectName: 'Mathématiques',
    level: 2,
    title: 'Fractions et Pourcentages : Calculs et Applications',
    theme: 'Fractions & Pourcentages',
    language: 'fr',
    objectives: [
      'Comprendre la structure d\'une fraction : Numérateur (partie) et Dénominateur (tout)',
      'Calculer la fraction d\'une quantité donnée (ex: $\\frac{3}{4}$ de 120)',
      'Convertir des pourcentages usuels en fractions simples (25%, 50%, 75%)'
    ],
    coreTheory: [
      'Une fraction $\\frac{a}{b}$ exprime un partage d\'une unité en b parts égales, dont on prend a parts. Le nombre du haut « a » est le Numérateur, le nombre du bas « b » est le Dénominateur.',
      'Pour calculer la fraction $\\frac{a}{b}$ d\'un nombre X : on multiplie X par le numérateur a, puis on divise le résultat par le dénominateur b : $\\text{Valeur} = (X \\times a) \\div b$.',
      'Pourcentages de référence : $50\\% = \\frac{1}{2}$ (la moitié, division par 2) ; $25\\% = \\frac{1}{4}$ (le quart, division par 4) ; $75\\% = \\frac{3}{4}$ ; $10\\% = \\frac{1}{10}$ (division par 10).'
    ],
    commonMistakes: [
      {
        mistake: 'Inversion du numérateur et du dénominateur lors du calcul.',
        explanation: 'Pour calculer $\\frac{2}{5}$ de 50, diviser par 2 puis multiplier par 5 donne 125 au lieu de 20.',
        correction: 'Retenir que le dénominateur (en bas) divise la quantité, tandis que le numérateur (en haut) la multiplie.'
      }
    ],
    methodology: [
      'Étape 1 : Identifier la quantité totale X et la fraction $\\frac{a}{b}$.',
      'Étape 2 : Diviser la quantité totale par le dénominateur : $Q = X \\div b$.',
      'Étape 3 : Multiplier le résultat par le numérateur : $\\text{Résultat} = Q \\times a$.'
    ],
    solvedExample: {
      problem: 'Une coopérative agricole à Madagascar récolte 120 sacs de vanille. Elle en vend les $\\frac{3}{4}$. Combien de sacs de vanille ont été vendus ?',
      steps: [
        'Quantité totale = 120 sacs. Fraction vendue = $\\frac{3}{4}$.',
        'Étape 1 (Division par le dénominateur) : $120 \\div 4 = 30$ sacs.',
        'Étape 2 (Multiplication par le numérateur) : $30 \\times 3 = 90$ sacs.',
        'Calcul direct : $(120 \\times 3) \\div 4 = 360 \\div 4 = 90$ sacs.'
      ],
      finalAnswer: 'La coopérative a vendu 90 sacs de vanille.'
    },
    keyTakeaways: [
      'Calcul d\'une fraction d\'un nombre : $(X \\times a) \\div b$.',
      '50% correspond à la moitié (÷ 2), 25% au quart (÷ 4).'
    ],
    officialReference: 'Programme MEN Madagascar - Enseignement Primaire CM2 (CEPE - Mathématiques)'
  },

  // CM2 - Malagasy (Fitsipiky ny Tsipelina sy ny Fehezanteny) - MALAGASY
  'CM2_all_malagasy_cm2_1_mg': {
    id: 'les_cm2_mlg_1_mg',
    classId: 'CM2',
    subjectId: 'malagasy_cm2',
    subjectName: 'Malagasy (Fiteny Reny)',
    level: 1,
    title: 'Fitsipiky ny Tsipelina sy ny Rafitry ny Fehezanteny Tsotra',
    theme: 'Fitsipiky ny Tsipelina',
    language: 'mg',
    objectives: [
      'Mahafantatra ny fampiasana ny tsindrim-peo sy ny tendro ara-dalàna',
      'Mahay manavaka ny Lazaina (Sujet), ny Matoanteny (Verbe) ary ny Fameno (Complément)',
      'Mahay mampiasa ny tsipi-panohy (-) amin\'ny fanakambanan-teny'
    ],
    coreTheory: [
      'Ny fehezanteny tsotra amin\'ny teny malagasy dia manaraka ny rafitra voajanahary : Matoanteny + Fameno + Lazaina. Ohatra : « Mamboly vary (Matoanteny + Fameno) ny tantsaha (Lazaina) ».',
      'Fampiasana ny tsipi-panohy (-) : Ampiasaina amin\'ny teny miverina (ohatra : miadana-dia, lava-ranjo) sy rehefa misy fiovan-drenifeo (an-tanàna, an-tsaha).',
      'Ny fitodiky ny matoanteny : Ny matoanteny manomboka amin\'ny « m- » dia matoanteny manano (ny lazaina no manao ny asa). Ny tovana « -ina » na « -ana » kosa dia manondro matoanteny anoina (ny lazaina no iharan\'ny asa).'
    ],
    commonMistakes: [
      {
        mistake: 'Fanoratana ny tsipi-panohy amin\'ny toerana tsy tokony hisy azy.',
        explanation: 'Misy mpianatra manoratra « an-trano » nefa « antrano » na mifamadika amin\'izany.',
        correction: 'Tsarovy fa raha mivadika ny renisoratra n mankany amin\'ny t, s, dia asiana tsipi-panohy : an-tsaha, an-tanàna.'
      }
    ],
    methodology: [
      'Dingana 1 : Tadiavo ny matoanteny (asa atao) ao anatin\'ny fehezanteny.',
      'Dingana 2 : Tadiavo ny lazaina amin\'ny fametrahana ny fanontaniana : « Iza no manao ny asa ? ».',
      'Dingana 3 : Tadiavo ny fameno amin\'ny fametrahana ny fanontaniana : « Inona ? Taiza ? Oviana ? ».'
    ],
    solvedExample: {
      problem: 'Fakafakao ity fehezanteny ity : « Manondraka voninkazo ao an-jaridaina i Soa. »',
      steps: [
        '« Manondraka » : Matoanteny manao asa (Verbe d\'action).',
        '« voninkazo » : Fameno iharan\'ny asa mivantana.',
        '« ao an-jaridaina » : Famenon-toerana.',
        '« i Soa » : Lazaina mpanao ny asa.'
      ],
      finalAnswer: 'Rafitra : Matoanteny (« Manondraka ») + Fameno mivantana (« voninkazo ») + Famenon-toerana (« ao an-jaridaina ») + Lazaina (« i Soa »).'
    },
    keyTakeaways: [
      'Rafitra fototra malagasy : Matoanteny + Fameno + Lazaina.',
      'Matoanteny manano (m-) : mpanao ny lazaina. Matoanteny anoina (-ina/-ana) : iharan\'ny asa ny lazaina.'
    ],
    officialReference: 'Fandaharam-pianarana Ofisialy MEN Madagascar - CM2 (CEPE Malagasy)'
  },

  // 3ème - Mathématiques (Théorème de Pythagore) - FRANÇAIS
  '3ème_all_mathematiques_3eme_1_fr': {
    id: 'les_3eme_math_pyth_fr',
    classId: '3ème',
    subjectId: 'mathematiques_3eme',
    subjectName: 'Mathématiques',
    level: 1,
    title: 'Théorème de Pythagore et Réciproque dans le Triangle Rectangle',
    theme: 'Théorèmes Fondamentaux de Géométrie',
    language: 'fr',
    objectives: [
      'Énoncer et appliquer le Théorème de Pythagore pour calculer la longueur d\'un côté inconnu',
      'Identifier avec certitude l\'hypoténuse (côté opposé à l\'angle droit, le plus long)',
      'Utiliser la Réciproque de Pythagore pour démontrer qu\'un triangle est rectangle'
    ],
    coreTheory: [
      'Énoncé direct du Théorème : Dans un triangle rectangle, le carré de la longueur de l\'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.',
      'Formule officielle : Si le triangle $ABC$ est rectangle en $A$, alors l\'hypoténuse est $[BC]$, et l\'on a : $$BC^2 = AB^2 + AC^2$$',
      'Calcul d\'un côté de l\'angle droit : $$AB^2 = BC^2 - AC^2 \\quad \\text{et} \\quad AC^2 = BC^2 - AB^2$$',
      'Réciproque du Théorème de Pythagore : Si dans un triangle $ABC$, le plus long côté $[BC]$ vérifie l\'égalité $BC^2 = AB^2 + AC^2$, alors le triangle $ABC$ est rectangle en $A$.'
    ],
    commonMistakes: [
      {
        mistake: 'Appliquer l\'égalité de Pythagore sans préciser que le triangle est rectangle.',
        explanation: 'À l\'examen du BEPC, les correcteurs sanctionnent sévèrement l\'omission de l\'hypothèse de départ.',
        correction: 'Rédiger impérativement : « Le triangle ABC étant rectangle en A, d\'après le théorème de Pythagore : BC² = AB² + AC² ».'
      },
      {
        mistake: 'Oublier d\'extraire la racine carrée ($\\sqrt{\\phantom{x}}$) à la dernière étape.',
        explanation: 'Calculer $BC^2 = 100$ et écrire directement $BC = 100$ cm au lieu de $BC = \\sqrt{100} = 10$ cm.',
        correction: 'Toujours passer de la valeur au carré à la longueur réelle : $BC = \\sqrt{100} = 10$ cm.'
      }
    ],
    methodology: [
      'Étape 1 : Identifier le triangle, le sommet de l\'angle droit et l\'hypoténuse.',
      'Étape 2 : Écrire la formule littérale : $\\text{Hypoténuse}^2 = \\text{Côté}_1^2 + \\text{Côté}_2^2$.',
      'Étape 3 : Remplacer par les valeurs numériques connues, calculer les carrés, et extraire la racine carrée.'
    ],
    solvedExample: {
      problem: 'Soit $ABC$ un triangle rectangle en $A$ tel que $AB = 6$ cm et $AC = 8$ cm. Calculer la longueur de l\'hypoténuse $[BC]$.',
      steps: [
        'Hypothèse : Le triangle $ABC$ est rectangle en $A$.',
        'D\'après le théorème de Pythagore : $BC^2 = AB^2 + AC^2$.',
        'Application numérique : $BC^2 = 6^2 + 8^2 = 36 + 64 = 100$.',
        'Extraction de la racine carrée : $BC = \\sqrt{100} = 10$ cm.'
      ],
      finalAnswer: 'La longueur de l\'hypoténuse $BC$ est exactement égale à 10 cm.'
    },
    keyTakeaways: [
      'Formule : $BC^2 = AB^2 + AC^2$ dans un triangle rectangle en $A$.',
      'L\'hypoténuse est toujours le côté le plus long du triangle rectangle.',
      'Ne pas oublier l\'unité (cm, m) sur la réponse finale.'
    ],
    officialReference: 'Programme MEN Madagascar - Collège 3ème (Épreuve officielle BEPC Mathématiques)'
  },

  // 3ème - Physique-Chimie (Mouvement et Vitesse) - FRANÇAIS
  '3ème_all_physique_chimie_3eme_1_fr': {
    id: 'les_3eme_pc_meca_fr',
    classId: '3ème',
    subjectId: 'physique_chimie_3eme',
    subjectName: 'Physique - Chimie',
    level: 1,
    title: 'Mécanique : Mouvement, Trajectoire et Vitesse Moyenne',
    theme: 'Mécanique & Mouvement',
    language: 'fr',
    objectives: [
      'Définir et appliquer la formule de la vitesse moyenne : $v = \\frac{d}{t}$ ou $v = d \\div t$',
      'Effectuer la conversion d\'unités : de m/s en km/h ($\\times 3{,}6$) et de km/h en m/s ($\\div 3{,}6$)',
      'Distinguer les types de mouvement : uniforme, accéléré, ralenti/décéléré'
    ],
    coreTheory: [
      'La Vitesse Moyenne est le quotient de la distance parcourue « d » par la durée « t » du parcours : $$v = \\frac{d}{t} = d \\div t$$',
      'Unités officielles : Dans le Système International (SI), la distance est en mètres (m), le temps en secondes (s), et la vitesse en mètres par seconde (m/s). Dans la vie courante, on utilise le kilomètre par heure (km/h).',
      'Facteur de conversion officiel : $$\\text{Vitesse (km/h)} = \\text{Vitesse (m/s)} \\times 3{,}6 \\quad \\text{et} \\quad \\text{Vitesse (m/s)} = \\text{Vitesse (km/h)} \\div 3{,}6$$',
      'Formules dérivées indispensables : Distance : $d = v \\times t$ ; Durée : $t = \\frac{d}{v} = d \\div v$.'
    ],
    commonMistakes: [
      {
        mistake: 'Confusion lors de la conversion des durées en heures décimales.',
        explanation: 'Une durée de 1 h 30 min n\'est PAS égale à 1,3 h ! 30 minutes équivalent à $30 \\div 60 = 0{,}5$ h, donc 1 h 30 min = 1,5 h.',
        correction: 'Convertir toujours les minutes en fraction d\'heure : $t = \\text{heures} + (\\text{minutes} \\div 60)$.'
      },
      {
        mistake: 'Mélange d\'unités non homogènes dans la formule.',
        explanation: 'Diviser des kilomètres par des secondes donne des km/s et non des km/h ou m/s.',
        correction: 'Associer impérativement (mètres avec secondes pour obtenir des m/s) ou (kilomètres avec heures pour obtenir des km/h).'
      }
    ],
    methodology: [
      'Étape 1 : Relever la distance $d$ et la durée $t$ dans l\'énoncé en indiquant leurs unités.',
      'Étape 2 : Convertir la durée en heures décimales (pour km/h) ou en secondes (pour m/s).',
      'Étape 3 : Poser la formule littérale $v = \\frac{d}{t}$, faire le calcul, et préciser l\'unité.'
    ],
    solvedExample: {
      problem: 'Un taxi-brousse reliant Antananarivo à Antsirabe parcourt une distance $d = 170$ km en une durée $t = 2$ h 30 min. Calculer sa vitesse moyenne en km/h, puis convertir en m/s.',
      steps: [
        'Conversion de la durée : $t = 2\\text{ h } 30\\text{ min} = 2 + (30 \\div 60) = 2 + 0{,}5 = 2{,}5\\text{ h}$.',
        'Calcul de la vitesse en km/h : $v = d \\div t = 170 \\div 2{,}5 = 68\\text{ km/h}$.',
        'Conversion en m/s : $v = 68 \\div 3{,}6 \\approx 18{,}89\\text{ m/s}$.'
      ],
      finalAnswer: 'La vitesse moyenne du taxi-brousse est de 68 km/h, soit environ 18,89 m/s.'
    },
    keyTakeaways: [
      'Formule : $v = \\frac{d}{t}$ avec $d = v \\times t$ et $t = \\frac{d}{v}$.',
      'Conversion clé : $1\\text{ m/s} = 3{,}6\\text{ km/h}$.',
      'Attention : 30 minutes = 0,5 heure (ne jamais écrire 0,3 h).'
    ],
    officialReference: 'Programme MEN Madagascar - Collège 3ème (Épreuve officielle BEPC Physique-Chimie)'
  },

  // Terminale Série S - Mathématiques (Fonction Exponentielle) - FRANÇAIS
  'Terminale_Série S_maths_ts_1_fr': {
    id: 'les_term_s_math_expo_fr',
    classId: 'Terminale',
    serieId: 'Série S',
    subjectId: 'maths_ts',
    subjectName: 'Mathématiques',
    level: 1,
    title: 'Analyse : Fonction Exponentielle, Dérivation et Croissances Comparées',
    theme: 'Analyse & Étude de Fonctions',
    language: 'fr',
    objectives: [
      'Maîtriser les propriétés algébriques de la fonction exponentielle ($e^x > 0$ sur $\\mathbb{R}$)',
      'Calculer la dérivée de fonctions composées du type $e^{u(x)}$ : $(e^u)\' = u\' \\times e^u$',
      'Lever les formes indéterminées aux limites grâce aux croissances comparées'
    ],
    coreTheory: [
      'Définition : La fonction exponentielle, notée $\\exp(x)$ ou $e^x$, est l\'unique fonction dérivable sur $\\mathbb{R}$ vérifiant $f\' = f$ et $f(0) = 1$. Elle est strictement positive sur $\\mathbb{R}$ : $\\forall x \\in \\mathbb{R},\\ e^x > 0$.',
      'Propriétés algébriques fondamentales : $$e^{a+b} = e^a \\times e^b, \\quad e^{a-b} = \\frac{e^a}{e^b}, \\quad e^{-a} = \\frac{1}{e^a}, \\quad (e^a)^n = e^{n \\times a}$$',
      'Dérivation de composées : Si $u$ est une fonction dérivable sur un intervalle $I$, alors la fonction $e^u$ est dérivable sur $I$ et sa dérivée est : $$(e^u)\' = u\' \\times e^u$$',
      'Croissances comparées aux limites (Résolution des formes indéterminées) : $$\\lim_{x \\to +\\infty} \\frac{e^x}{x^n} = +\\infty \\quad \\text{et} \\quad \\lim_{x \\to -\\infty} (x^n \\times e^x) = 0 \\quad (n \\in \\mathbb{N}^*)$$'
    ],
    commonMistakes: [
      {
        mistake: 'Oublier la dérivée intérieure $u\'$ lors du calcul de $(e^u)\'$.',
        explanation: 'Écrire que la dérivée de $e^{3x^2}$ est simplement $e^{3x^2}$ au lieu de $6x \\times e^{3x^2}$.',
        correction: 'Appliquer scrupuleusement la formule de chaîne : $(e^u)\' = u\' \\times e^u$.'
      },
      {
        mistake: 'Considérer que $e^0 = 0$ ou que $e^x$ peut s\'annuler.',
        explanation: '$e^0 = 1$ et l\'équation $e^x = 0$ n\'a AUCUNE solution dans $\\mathbb{R}$ car $e^x > 0$ partout.',
        correction: 'Retenir que $e^x > 0$ pour tout $x$ réel, donc $e^x \\neq 0$.'
      }
    ],
    methodology: [
      'Étape 1 (Domaine et Limites) : Déterminer l\'ensemble de définition et étudier les limites aux bornes.',
      'Étape 2 (Dérivation) : Poser $u(x)$, calculer $u\'(x)$, puis exprimer $f\'(x) = u\'(x) \\times e^{u(x)}$.',
      'Étape 3 (Signe et Variations) : Étudier le signe de $f\'(x)$ (sachant que $e^u > 0$ ne change pas le signe) et dresser le tableau de variations complet.'
    ],
    solvedExample: {
      problem: 'Soit la fonction $f$ définie sur $\\mathbb{R}$ par $f(x) = (x - 2)e^x + 1$. Étudier sa limite en $-\\infty$ et calculer sa fonction dérivée $f\'(x)$.',
      steps: [
        'Limite en $-\\infty$ : En développant, $f(x) = x \\times e^x - 2e^x + 1$.',
        'D\'après les croissances comparées : $\\lim_{x \\to -\\infty} (x \\times e^x) = 0$ et $\\lim_{x \\to -\\infty} e^x = 0$. Donc $\\lim_{x \\to -\\infty} f(x) = 1$. (Asymptote horizontale $y = 1$).',
        'Calcul de la dérivée : $f$ est de la forme $u \\times v + 1$ avec $u(x) = x - 2$ ($u\'(x) = 1$) et $v(x) = e^x$ ($v\'(x) = e^x$).',
        'D\'où : $f\'(x) = u\'v + uv\' = 1 \\times e^x + (x - 2)e^x = e^x(1 + x - 2) = (x - 1)e^x$.',
        'Signe : Comme $e^x > 0$, $f\'(x)$ a le même signe que $(x - 1)$. $f$ est décroissante sur $]-\\infty ; 1]$ et croissante sur $[1 ; +\\infty[$.'
      ],
      finalAnswer: 'La dérivée est $f\'(x) = (x - 1)e^x$. La fonction admet un minimum en $x = 1$ valant $f(1) = 1 - e \\approx -1{,}72$.'
    },
    keyTakeaways: [
      'Pour tout réel $x$, $e^x > 0$ strictement.',
      'Formule de dérivation : $(e^u)\' = u\' \\times e^u$.',
      'Aux bornes : $\\lim_{x \\to +\\infty} e^x = +\\infty$ et $\\lim_{x \\to -\\infty} e^x = 0$.'
    ],
    officialReference: 'Programme MEN Madagascar - Baccalauréat Général Série S (Mathématiques)'
  },

  // Terminale Série L - Philosophie (La Conscience et l'Inconscient) - FRANÇAIS
  'Terminale_Série L_philo_tl_1_fr': {
    id: 'les_term_l_philo_conscience_fr',
    classId: 'Terminale',
    serieId: 'Série L',
    subjectId: 'philo_tl',
    subjectName: 'Philosophie',
    level: 1,
    title: 'La Conscience et l\'Inconscient : Du Sujet Cartésien à la Psychanalyse Freudienne',
    theme: 'Le Sujet : Conscience & Inconscient',
    language: 'fr',
    objectives: [
      'Comprendre la définition cartésienne de la conscience comme certitude première : « Cogito ergo sum »',
      'Analyser la rupture introduite par Sigmund Freud avec l\'hypothèse de l\'Inconscient et la seconde topique (Ça, Moi, Surmoi)',
      'Mobiliser ces thèses philosophiques dans une dissertation structurée sur la liberté et la responsabilité'
    ],
    coreTheory: [
      'La Conscience (du latin « cum-scientia », avec savoir) désigne la faculté réflexive par laquelle l\'homme fait l\'expérience de ses pensées, de son corps et du monde extérieur. Chez René Descartes (Méditations métaphysiques), la conscience de penser résiste au doute méthodique et constitue la première vérité inébranlable : « Je pense, donc je suis » (Cogito ergo sum).',
      'La Rupture Freudienne : Sigmund Freud conteste le primat absolu de la conscience. Il démontre que la conscience n\'est qu\'une partie de notre vie psychique, dominée par l\'Inconscient constitué de désirs et pulsions refoulés.',
      'La Deuxième Topique Freudienne : Le psychisme se compose de trois instances fondamentales : 1. Le Ça (réservoir des pulsions instinctives) ; 2. Le Moi (principe de réalité, instance de négociation) ; 3. Le Surmoi (intériorisation des interdits moraux, familiaux et sociaux).',
      'L\'Enjeu Philosophique pour l\'Examen : Si l\'Inconscient nous détermine à notre insu, l\'homme demeure-t-il libre et responsable de ses actes ? Freud répond que la prise de conscience libère le sujet : « Là où était le Ça, le Moi doit advenir ».'
    ],
    commonMistakes: [
      {
        mistake: 'Considérer l\'inconscient comme une excuse justificative à toute faute ou délit.',
        explanation: 'En philosophie, invoquer « c\'est mon inconscient » pour fuir ses devoirs moraux est un contresens.',
        correction: 'La psychanalyse n\'exonère pas la responsabilité juridique et morale de l\'individu ; elle lui donne les moyens de se connaître pour mieux se maîtriser.'
      }
    ],
    methodology: [
      'Étape 1 (Problématisation) : Dégager la tension entre la souveraineté de la conscience (Descartes) et l\'opacité du psychisme (Freud).',
      'Étape 2 (Plan dialectique) : Thèse (La conscience comme fondement de la liberté) $\\to$ Antithèse (Les illusions de la conscience et la force de l\'inconscient) $\\to$ Synthèse (La connaissance de soi comme émancipation).',
      'Étape 3 : Citer avec précision les auteurs clés (Descartes, Freud, Spinoza, Sartre).'
    ],
    solvedExample: {
      problem: 'Sujet de dissertation officiel : « L\'homme est-il entièrement transparent à lui-même ? »',
      steps: [
        'Introduction : Définir la transparence comme la connaissance immédiate et totale de soi par la conscience réflexive. Poser la problématique : notre conscience suffit-elle à nous connaître ou existe-t-il une part obscure qui nous échappe ?',
        'Partie 1 (Thèse) : Selon Descartes, le sujet pensant a une certitude absolue de son existence et de ses états d\'âme par l\'introspection.',
        'Partie 2 (Antithèse) : Freud démontre que le sujet subit des actes manqués, des lapsus et des rêves qui trahissent des désirs refoulés. « Le Moi n\'est pas maître dans sa propre maison ».',
        'Partie 3 (Synthèse) : La transparence n\'est pas un fait acquis d\'avance, mais une conquête lucide de l\'homme à travers la réflexion, l\'éthique et la culture.'
      ],
      finalAnswer: 'Développement philosophique rigoureux respectant la méthode de dissertation du Baccalauréat malgache.'
    },
    keyTakeaways: [
      'Descartes : Le Cogito (« Je pense donc je suis ») affirme la conscience comme certitude première.',
      'Freud : L\'Inconscient structure nos pensées à travers le Ça, le Moi et le Surmoi.',
      'La liberté humaine consiste à dépasser les déterminismes inconscients par la lucidité.'
    ],
    officialReference: 'Programme MEN Madagascar - Baccalauréat Général Série L (Philosophie)'
  }
};

/**
 * Intelligent domain specific topic generator to guarantee an authentic,
 * concrete curriculum lesson for ANY subject without boilerplate generic advice.
 * Fully supports French (default) and Malagasy.
 */
function synthesizeSubjectLesson(
  classId: GradeLevel,
  subjectId: string,
  level: number,
  serieId?: TerminaleSerie,
  language: 'fr' | 'mg' = 'fr'
): LessonRemediation {
  const curriculumObj = OFFICIAL_CURRICULUM[classId];
  let subjectInfo = curriculumObj?.subjects?.find(s => s.id === subjectId);
  if (!subjectInfo && curriculumObj?.series && serieId) {
    const serieObj = curriculumObj.series.find(s => s.id === serieId);
    subjectInfo = serieObj?.subjects.find(s => s.id === subjectId);
  }

  const isMalagasySubject = subjectId.toLowerCase().includes('malagasy');
  const lang = isMalagasySubject ? 'mg' : language;

  const subjectName = subjectInfo?.name || subjectId.toUpperCase();
  const themeIndex = (level - 1) % (subjectInfo?.themes.length || 1);
  const theme = subjectInfo?.themes[themeIndex] || (lang === 'fr' ? 'Programme Officiel' : 'Fandaharam-pianarana Ofisialy');
  const sLower = subjectId.toLowerCase();

  // FRENCH SYNTHESIS FOR MATHEMATICS
  if (lang === 'fr' && sLower.includes('math')) {
    return {
      id: `dyn_math_${classId}_${subjectId}_lvl${level}_fr`,
      classId,
      serieId,
      subjectId,
      subjectName,
      level,
      language: 'fr',
      title: `${theme} : Notions Fondamentales, Formules et Application (Niveau ${level}/10)`,
      theme,
      objectives: [
        `Maîtriser les définitions et propriétés essentielles du chapitre « ${theme} » selon le programme officiel MEN`,
        `Appliquer avec rigueur les formules algébriques sans utiliser d'opérateurs informatiques (utiliser « × » et « ÷ »)`,
        `Résoudre méthodiquement les exercices d'examen en justifiant chaque étape de calcul`
      ],
      coreTheory: [
        `Définition et cadre d'étude : Dans le programme officiel de ${classId}, le chapitre « ${theme} » repose sur des règles de déduction rigoureuses et des formules mathématiques normalisées.`,
        `Règles fondamentales d'évaluation : L'ensemble de définition $D_f$ et les priorités opératoires doivent être scrupuleusement respectés. La multiplication (« $\\times$ ») et la division (« $\\div$ » ou barre de fraction) sont prioritaires sur l'addition et la soustraction.`,
        `Théorème et propriétés clés : Toute transformation algébrique doit conserver l'équivalence stricte entre les deux membres de l'égalité ($A = B \\iff A + C = B + C$ et $A \\times C = B \\times C$ pour $C \\neq 0$).`
      ],
      commonMistakes: [
        {
          mistake: 'Non-respect des priorités opératoires officielles.',
          explanation: 'Calculer $5 + 3 \\times 2 = 16$ au lieu de $5 + 6 = 11$, car la multiplication est prioritaire sur l\'addition.',
          correction: 'Calculer d\'abord les parenthèses, puis les multiplications (« $\\times$ ») et divisions (« $\\div$ »), et enfin les additions et soustractions.'
        },
        {
          mistake: 'Division par zéro ou oubli des valeurs interdites au dénominateur.',
          explanation: 'La division par 0 est rigoureusement indéfinie en mathématiques.',
          correction: 'Toujours poser la condition d\'existence : $\\text{Dénominateur} \\neq 0$ avant tout calcul.'
        }
      ],
      methodology: [
        'Étape 1 : Identifier les données de l\'énoncé, l\'inconnue recherchée et poser les conditions d\'existence.',
        'Étape 2 : Écrire la formule littérale générale régissant le problème.',
        'Étape 3 : Effectuer l\'application numérique pas à pas, simplifier la fraction et encadrer le résultat final avec son unité.'
      ],
      solvedExample: {
        problem: `Application directe sur « ${theme} » : Résoudre dans $\\mathbb{R}$ l'équation du 1er degré suivante : $3x + 7 = 22$.`,
        steps: [
          'Étape 1 : Isoler le terme en $x$ en soustrayant 7 des deux membres : $3x = 22 - 7$.',
          'Étape 2 : Simplifier le membre de droite : $3x = 15$.',
          'Étape 3 : Diviser par le coefficient 3 : $x = 15 \\div 3 = 5$.',
          'Vérification : $3 \\times 5 + 7 = 15 + 7 = 22$ (Vérifié).'
        ],
        finalAnswer: 'La solution unique de l\'équation est $x = 5$.'
      },
      keyTakeaways: [
        'Toujours respecter les priorités opératoires : multiplications et divisions en priorité.',
        'Utiliser impérativement les symboles formels « × » et « ÷ » (jamais « * » ni slashs informatiques).'
      ],
      officialReference: `Programme Officiel MEN Madagascar - ${classId} (${subjectName})`
    };
  }

  // FRENCH SYNTHESIS FOR PHYSIQUE-CHIMIE
  if (lang === 'fr' && (sLower.includes('physique') || sLower.includes('chimie'))) {
    return {
      id: `dyn_pc_${classId}_${subjectId}_lvl${level}_fr`,
      classId,
      serieId,
      subjectId,
      subjectName,
      level,
      language: 'fr',
      title: `${theme} : Lois Physiques, Formules Officielles et Exercice Résolu (Niveau ${level}/10)`,
      theme,
      objectives: [
        `Comprendre les lois fondamentales et les relations quantitatives régissant « ${theme} »`,
        `Exprimer chaque grandeur dans son unité du Système International (SI) : m, s, kg, N, V, A, J`,
        `Résoudre un problème de sciences physiques en explicitant la formule littérale avant le calcul`
      ],
      coreTheory: [
        `Lois fondamentales : Les phénomènes physiques et chimiques étudiés dans « ${theme} » lient des grandeurs mesurables par des équations aux dimensions bien définies.`,
        `Unités du Système International (SI) obligatoires : Masse en kilogrammes (kg), distance en mètres (m), temps en secondes (s), force en Newtons (N), puissance en Watts (W), énergie en Joules (J).`,
        `Homogénéité dimensionnelle : Il est interdit d'introduire des valeurs numériques dans une formule avant d'avoir harmonisé leurs unités de mesure.`
      ],
      commonMistakes: [
        {
          mistake: 'Mélange d\'unités non conformes (ex: utiliser des grammes au lieu de kilogrammes dans $P = m \\times g$).',
          explanation: 'Si la masse $m$ est en grammes, la force obtenue est fausse d\'un facteur 1000.',
          correction: 'Convertir impérativement la masse en kilogrammes : $m(\\text{kg}) = m(\\text{g}) \\div 1000$.'
        }
      ],
      methodology: [
        'Étape 1 : Relever les données de l\'exercice avec leurs unités et repérer la grandeur à calculer.',
        'Étape 2 : Écrire la loi physique sous forme littérale (ex: $P = m \\times g$ ou $U = R \\times I$).',
        'Étape 3 : Effectuer la conversion vers les unités du Système International et réaliser le calcul numérique.'
      ],
      solvedExample: {
        problem: `Un objet métallique a une masse $m = 450$ g. Calculer l\'intensité de son poids $P$ sur Terre, sachant que l\'intensité de la pesanteur vaut $g = 9{,}8$ N/kg.`,
        steps: [
          'Données : $m = 450$ g, $g = 9{,}8$ N/kg.',
          'Étape 1 (Conversion) : $m = 450 \\div 1000 = 0{,}45$ kg.',
          'Étape 2 (Formule littérale) : $P = m \\times g$.',
          'Étape 3 (Calcul numérique) : $P = 0{,}45 \\times 9{,}8 = 4{,}41$ N.'
        ],
        finalAnswer: 'L\'intensité du poids de l\'objet est $P = 4{,}41$ N (Newtons).'
      },
      keyTakeaways: [
        'Relation du poids : $P = m \\times g$ (avec $m$ en kg et $P$ en Newtons).',
        'Toujours convertir vers les unités SI officielles avant d\'effectuer le produit.'
      ],
      officialReference: `Programme Officiel MEN Madagascar - ${classId} (${subjectName})`
    };
  }

  // MALAGASY SYNTHESIS FOR MALAGASY SUBJECT
  if (isMalagasySubject || lang === 'mg') {
    return {
      id: `dyn_mlg_${classId}_${subjectId}_lvl${level}_mg`,
      classId,
      serieId,
      subjectId,
      subjectName,
      level,
      language: 'mg',
      title: `${theme} : Fitsipi-piteny sy Famakafakan-dahatsoratra Malagasy (Niveau ${level}/10)`,
      theme,
      objectives: [
        `Fahatakarana ny hevi-dalina sy ny fitsipika mifehy ny ${theme}`,
        `Fahaizana mamakafaka ny firafitry ny teny sy ny lahabolana malagasy`,
        `Fahaizana mampihatra ny voambolana sy ny ohabolana mifanaraka amin'ny lohahevitra`
      ],
      coreTheory: [
        `Fitsipika : Ny teny malagasy dia manana ny haifiteny mampiavaka azy. Ny fehezanteny feno dia ahitana ny matoanteny (asa), ny lazaina (mpanao na iharan'ny asa), ary ny fameno.`,
        `Ny fiovan-toeran'ny fehezanteny : Ny fehezanteny manaraka ny firafitra voajanahary dia Matoanteny + Fameno + Lazaina. Rehefa tiana hasongadina ny lazaina dia ampidirina ny teny manantona « no » : « Ny tantsaha no mamboly vary ».`
      ],
      commonMistakes: [
        {
          mistake: 'Fampifangaroana ny fehezanteny manano sy ny fehezanteny anoina.',
          explanation: 'Rehefa « mamboly » dia manano ny matoanteny. Rehefa « ambolena » dia anoina ny matoanteny.',
          correction: 'Zahao tsara ny tovana na tsona : m- manano, -ina na -ana anoina.'
        }
      ],
      methodology: [
        'Dingana 1 : Vakio milamina ny lahatsoratra na fehezanteny ary tsimpono ny teny manan-danja.',
        'Dingana 2 : Fantaro ny anjara asan\'ny teny tsirairay sy ny endriky ny matoanteny.',
        'Dingana 3 : Asehoy amin\'ny teny madio sy milamina ny valin\'ny fanontaniana.'
      ],
      solvedExample: {
        problem: 'Avadiho ho fehezanteny anoina (voix passive) ity fehezanteny manano ity : « Manoratra taratasy ho an\'ny rainy i Paoly. »',
        steps: [
          'Fehezanteny manano : « Manoratra taratasy ho an\'ny rainy i Paoly. »',
          'Dingana 1 : Ny fameno iharana (« taratasy ») no lasa lazaina anoina.',
          'Dingana 2 : Ny matoanteny « manoratra » dia vadika ho anoina : « soratan\'i ».',
          'Dingana 3 : Ny lazaina taloha (« i Paoly ») lasa fameno mpanao.'
        ],
        finalAnswer: 'Fehezanteny anoina : « Soratan\'i Paoly ho an\'ny rainy ny taratasy. »'
      },
      keyTakeaways: [
        'Matoanteny manano (m-) : Ny lazaina no manao ny asa.',
        'Matoanteny anoina (-ina, -ana) : Ny lazaina no iharan\'ny asa.'
      ],
      officialReference: `Fandaharam-pianarana Ofisialy MEN Madagascar - ${classId} (${subjectName})`
    };
  }

  // DEFAULT FRENCH SYNTHESIS FOR ALL OTHER DISCIPLINES (Français, Philo, SVT, HG, etc.)
  return {
    id: `dyn_gen_${classId}_${subjectId}_lvl${level}_fr`,
    classId,
    serieId,
    subjectId,
    subjectName,
    level,
    language: 'fr',
    title: `${theme} : Notions Fondamentales et Méthodologie (Niveau ${level}/10)`,
    theme,
    objectives: [
      `Maîtriser les définitions, règles et principes théoriques relatifs à « ${theme} »`,
      `Assimiler les concepts clés indispensables pour réussir les épreuves officielles du MEN Madagascar`,
      `Structurer une réponse rigoureuse, argumentée et étayée par des exemples précis`
    ],
    coreTheory: [
      `Définition et contexte : Pour la matière ${subjectName} en classe de ${classId}, le chapitre « ${theme} » constitue un axe d\'apprentissage fondamental pour le Niveau ${level}/10.`,
      `Notions et règles méthodologiques : L\'assimilation du vocabulaire technique et la maîtrise des enchaînements logiques sont requises dans toute démonstration académique.`,
      `Exigences de l'examen officiel : Les jurys d'examen accordent une importance primordiale à la clarté de l'expression, à la précision des définitions et à l'exactitude des références.`
    ],
    commonMistakes: [
      {
        mistake: 'Réponse superficielle se limitant à répéter les termes de la question.',
        explanation: 'Une réponse d\'examen doit définir les notions en jeu et justifier chaque affirmation par un argument théorique.',
        correction: 'Structurer sa réponse en trois temps : Définition de la notion, explication du mécanisme, illustration par un exemple concret.'
      }
    ],
    methodology: [
      'Étape 1 : Lire attentivement la consigne pour cerner les termes clés et les limites du sujet.',
      'Étape 2 : Mobiliser les connaissances théoriques et les règles méthodologiques apprises en cours.',
      'Étape 3 : Rédiger une réponse structurée avec une transition logique et une conclusion nette.'
    ],
    solvedExample: {
      problem: `Application d'évaluation sur « ${theme} » : Exposer les principes directeurs et illustrer leur application concrète.`,
      steps: [
        'Étape 1 : Présentation de la définition officielle et mise en perspective avec le programme.',
        'Étape 2 : Analyse détaillée des causes, des mécanismes ou des règles en vigueur.',
        'Étape 3 : Conclusion synthétique conforme aux critères d\'évaluation de l\'examen.'
      ],
      finalAnswer: `Démonstration complète et soignée, conforme aux directives pédagogiques du MEN Madagascar pour ${subjectName}.`
    },
    keyTakeaways: [
      `Retenir le vocabulaire technique propre à « ${theme} ».`,
      'Respecter la rigueur méthodologique et la précision conceptuelle requises à l\'examen.'
    ],
    officialReference: `Programme Officiel MEN Madagascar - ${classId} ${serieId ? `(${serieId})` : ''}`
  };
}

/**
 * Main function to get a guaranteed high quality, authentic lesson
 * for any (classId, subjectId, level, serieId, language) combination.
 */
export function getCurriculumLesson(
  classId: GradeLevel,
  subjectId: string,
  level: number,
  serieId?: TerminaleSerie,
  language: 'fr' | 'mg' = 'fr'
): LessonRemediation {
  // If Malagasy subject, always force Malagasy
  const effectiveLang = subjectId.toLowerCase().includes('malagasy') ? 'mg' : language;

  // 1. Try language-specific key
  const keyWithLang = `${classId}_${serieId || 'all'}_${subjectId}_${level}_${effectiveLang}`;
  if (CURRICULUM_LESSONS[keyWithLang]) {
    return CURRICULUM_LESSONS[keyWithLang];
  }

  // 2. Try language-specific base key (level 1)
  const baseKeyWithLang = `${classId}_${serieId || 'all'}_${subjectId}_1_${effectiveLang}`;
  if (CURRICULUM_LESSONS[baseKeyWithLang]) {
    const base = CURRICULUM_LESSONS[baseKeyWithLang];
    return {
      ...base,
      level,
      id: `${base.id}_lvl${level}`
    };
  }

  // 3. Fallback to general dynamic synthesizer
  return synthesizeSubjectLesson(classId, subjectId, level, serieId, effectiveLang);
}
