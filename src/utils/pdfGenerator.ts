import { jsPDF } from 'jspdf';
import { LessonRemediation } from '../types';

export interface ExportPdfOptions {
  lesson: LessonRemediation;
  studentName?: string;
  schoolName?: string;
}

/**
 * Strips LaTeX delimiters and normalizes operators for clean PDF rendering:
 * 1. Replaces '*' with '×'
 * 2. Replaces bare arithmetic '/' with '÷'
 * 3. Converts LaTeX \times, \div, \frac{a}{b} into clear mathematical notation
 */
function cleanMathForPdf(raw: string): string {
  if (!raw) return '';
  let str = raw;

  // Replace LaTeX frac \frac{num}{den} with (num ÷ den)
  str = str.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 ÷ $2)');
  str = str.replace(/\\times/g, '×');
  str = str.replace(/\\div/g, '÷');
  str = str.replace(/\\approx/g, '≈');
  str = str.replace(/\\neq/g, '≠');
  str = str.replace(/\\le/g, '≤');
  str = str.replace(/\\ge/g, '≥');
  str = str.replace(/\\mathbb\{R\}/g, 'R');
  str = str.replace(/\\text\{([^}]+)\}/g, '$1');
  str = str.replace(/\\quad/g, ' ');
  str = str.replace(/\\,/g, ' ');
  str = str.replace(/\$\$?/g, ''); // strip $ and $$ delimiters

  // Replace multiplication '*' with '×'
  str = str.replace(/(\d|[a-zA-Z\)])\s*\*\s*(\d|[a-zA-Z\(])/g, '$1 × $2');
  str = str.replace(/\s\*\s/g, ' × ');

  // Replace division '/' with '÷' (avoid dates like 26/06/1960)
  str = str.replace(/(\d|[a-zA-Z\)])\s*\/\s*(\d|[a-zA-Z\(])/g, (match, p1, p2, offset, original) => {
    const before = original.slice(Math.max(0, offset - 5), offset);
    const after = original.slice(offset, offset + match.length + 5);
    if (/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(before + match + after)) {
      return match;
    }
    return `${p1} ÷ ${p2}`;
  });

  return str;
}

/**
 * Generates and downloads a clean, professional, high-standard PDF document
 * formatted specifically for Malagasy national education standards (A4).
 */
export function exportLessonToPdf({ lesson, studentName, schoolName }: ExportPdfOptions): void {
  const isFrench = lesson.language !== 'mg' && !lesson.subjectId.toLowerCase().includes('malagasy');
  const defaultStudent = isFrench ? 'Élève Candidat' : 'Mpianatra Malagasy';
  const defaultSchool = isFrench ? 'Établissement Scolaire' : 'Sekoly Malagasy';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 15;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      currentY = margin;
      drawPageHeaderMini();
    }
  };

  const drawPageHeaderMini = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`MEN Madagascar — ${lesson.classId} ${lesson.serieId || ''} | ${lesson.subjectName} (Niveau ${lesson.level}/10)`, margin, currentY);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, currentY, { align: 'right' });
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 8;
  };

  // 1. OFFICIAL HEADER (Repoblikan'i Madagasikara)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text("REPOBLIKAN'I MADAGASIKARA", pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Fitiavana - Tanindrazana - Fandrosoana', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110); // Teal-700
  doc.text(isFrench ? "MINISTÈRE DE L'ÉDUCATION NATIONALE (MEN)" : "MINISTERAN'NY FANABEAZAM-PIRENENA (MEN)", pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  // Horizontal separator line
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // 2. DOCUMENT TITLE BADGE
  doc.setFillColor(240, 253, 250); // Mint background
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(13, 148, 136);
  doc.text(isFrench ? "FICHE DE COURS OFFICIELLE" : "TAKELAKA LESONA OFISIALY", pageWidth / 2, currentY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const subtitle = isFrench
    ? `Programme Officiel MEN Madagascar — Niveau ${lesson.level} / 10 | ${lesson.classId} ${lesson.serieId || ''} — ${lesson.subjectName}`
    : `Fandaharam-pianarana MEN Madagascar — Haavo ${lesson.level} / 10 | ${lesson.classId} ${lesson.serieId || ''} — ${lesson.subjectName}`;
  doc.text(subtitle, pageWidth / 2, currentY + 12, { align: 'center' });
  currentY += 21;

  // 3. STUDENT & CLASS INFORMATION BOX
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isFrench ? 'Élève :' : 'Mpianatra :', margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(studentName || defaultStudent, margin + 22, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isFrench ? 'Établissement :' : 'Sekoly :', margin + 85, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(schoolName || defaultSchool, margin + 110, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isFrench ? 'Date :' : 'Daty :', margin + 4, currentY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleDateString('fr-FR'), margin + 18, currentY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isFrench ? 'Référence :' : 'Loharano :', margin + 60, currentY + 10.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(15, 118, 110);
  doc.text(lesson.officialReference || 'Programme Officiel MEN Madagascar', margin + 80, currentY + 10.5);
  currentY += 19;

  // 4. LESSON TITLE & THEME
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const cleanTitle = cleanMathForPdf(lesson.title);
  const titleLines = doc.splitTextToSize(cleanTitle, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += (titleLines.length * 5) + 2;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${isFrench ? 'Thème officiel' : 'Thème ofisialy'} : ${cleanMathForPdf(lesson.theme)}`, margin, currentY);
  currentY += 6;

  // Helper section renderer
  const renderSectionHeader = (titleText: string, color: [number, number, number]) => {
    checkPageBreak(12);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(margin, currentY, 2.5, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(titleText, margin + 5, currentY + 4.2);
    currentY += 8;
  };

  // 5. SECTION I: OBJECTIVES
  if (lesson.objectives && lesson.objectives.length > 0) {
    renderSectionHeader(
      isFrench ? 'I. OBJECTIFS DU COURS (COMPÉTENCES VISÉES)' : 'I. TANJONA SY FAHAIZA-MANAO TRATRARINA',
      [15, 118, 110] // Teal
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    lesson.objectives.forEach(obj => {
      checkPageBreak(6);
      const cleaned = cleanMathForPdf(obj);
      const lines = doc.splitTextToSize(`• ${cleaned}`, contentWidth - 4);
      doc.text(lines, margin + 3, currentY);
      currentY += (lines.length * 4.2);
    });
    currentY += 4;
  }

  // 6. SECTION II: CORE THEORY
  if (lesson.coreTheory && lesson.coreTheory.length > 0) {
    renderSectionHeader(
      isFrench ? 'II. COURS MAGISTRAL, DÉFINITIONS ET FORMULES' : 'II. NY LESONA FOTOTRA SY NY FANAZAVANA',
      [30, 64, 175] // Blue
    );

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    lesson.coreTheory.forEach(paragraph => {
      const cleaned = cleanMathForPdf(paragraph);
      const lines = doc.splitTextToSize(cleaned, contentWidth - 8);
      const blockHeight = lines.length * 4.2 + 4;
      checkPageBreak(blockHeight);

      doc.roundedRect(margin, currentY, contentWidth, blockHeight, 1.5, 1.5, 'FD');
      doc.text(lines, margin + 4, currentY + 4.5);
      currentY += blockHeight + 2.5;
    });
    currentY += 3;
  }

  // 7. SECTION III: COMMON MISTAKES
  if (lesson.commonMistakes && lesson.commonMistakes.length > 0) {
    renderSectionHeader(
      isFrench ? 'III. ERREURS FRÉQUENTES ET PIÈGES D\'EXAMEN' : 'III. FANAMARIHANA SY FANDRIKA HIALANA',
      [217, 119, 6] // Amber
    );

    lesson.commonMistakes.forEach((m, idx) => {
      const cleanedMistake = cleanMathForPdf(m.mistake);
      const cleanedExp = cleanMathForPdf(m.explanation);
      const cleanedCorr = cleanMathForPdf(m.correction);

      const mLines = doc.splitTextToSize(`${isFrench ? 'Piège' : 'Fandrika'} #${idx + 1} : ${cleanedMistake}`, contentWidth - 8);
      const eLines = doc.splitTextToSize(`${isFrench ? 'Explication' : 'Fanazavana'} : ${cleanedExp}`, contentWidth - 8);
      const cLines = doc.splitTextToSize(`${isFrench ? 'Correction' : 'Fomba marina'} : ${cleanedCorr}`, contentWidth - 8);

      const totalH = (mLines.length + eLines.length + cLines.length) * 4.2 + 8;
      checkPageBreak(totalH);

      doc.setFillColor(254, 252, 232); // Amber light
      doc.setDrawColor(253, 224, 71);
      doc.roundedRect(margin, currentY, contentWidth, totalH, 1.5, 1.5, 'FD');

      let innerY = currentY + 4.5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9);
      doc.text(mLines, margin + 4, innerY);
      innerY += (mLines.length * 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(eLines, margin + 4, innerY);
      innerY += (eLines.length * 4.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 118, 110);
      doc.text(cLines, margin + 4, innerY);

      currentY += totalH + 3;
    });
    currentY += 3;
  }

  // 8. SECTION IV: METHODOLOGY
  if (lesson.methodology && lesson.methodology.length > 0) {
    renderSectionHeader(
      isFrench ? 'IV. MÉTHODOLOGIE DE RÉSOLUTION PAS À PAS' : 'IV. FOMBA FIASA DINGANA MANARAKA',
      [126, 34, 206] // Purple
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    lesson.methodology.forEach((step, idx) => {
      checkPageBreak(6);
      const cleaned = cleanMathForPdf(step);
      const lines = doc.splitTextToSize(`${idx + 1}. ${cleaned}`, contentWidth - 4);
      doc.text(lines, margin + 3, currentY);
      currentY += (lines.length * 4.2);
    });
    currentY += 4;
  }

  // 9. SECTION V: SOLVED EXAMPLE
  if (lesson.solvedExample && lesson.solvedExample.problem) {
    renderSectionHeader(
      isFrench ? 'V. EXEMPLE D\'APPLICATION RÉSOLU PAS À PAS' : 'V. OHATRA FAMPIHARANA VOAVAHA',
      [4, 120, 87] // Emerald
    );

    // Problem box
    const cleanProb = cleanMathForPdf(lesson.solvedExample.problem);
    const probLines = doc.splitTextToSize(`${isFrench ? 'Énoncé' : 'Fanontaniana'} : ${cleanProb}`, contentWidth - 8);
    const probH = probLines.length * 4.2 + 5;
    checkPageBreak(probH);

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, currentY, contentWidth, probH, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 83, 45);
    doc.text(probLines, margin + 4, currentY + 4.5);
    currentY += probH + 3;

    // Steps
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    lesson.solvedExample.steps.forEach(st => {
      const cleanStep = cleanMathForPdf(st);
      checkPageBreak(6);
      const splitSt = doc.splitTextToSize(`• ${cleanStep}`, contentWidth - 6);
      doc.text(splitSt, margin + 4, currentY);
      currentY += (splitSt.length * 4.2);
    });

    // Final answer
    checkPageBreak(8);
    currentY += 1.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 118, 110);
    const cleanAns = cleanMathForPdf(lesson.solvedExample.finalAnswer);
    const ansLines = doc.splitTextToSize(`${isFrench ? 'Réponse finale' : 'Valiny ofisialy'} : ${cleanAns}`, contentWidth - 6);
    doc.text(ansLines, margin + 4, currentY);
    currentY += (ansLines.length * 4.5) + 4;
  }

  // 10. KEY TAKEAWAYS
  if (lesson.keyTakeaways && lesson.keyTakeaways.length > 0) {
    checkPageBreak(20);
    renderSectionHeader(
      isFrench ? 'VI. POINTS CLÉS DU COURS À RETENIR' : 'VI. FEHIN-KEVITRA TSY AZO ADINOINA',
      [217, 119, 6]
    );
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(253, 224, 71);
    const takeAwayLines = lesson.keyTakeaways.map(k => `★ ${cleanMathForPdf(k)}`);
    let boxH = 6;
    takeAwayLines.forEach(l => {
      const sp = doc.splitTextToSize(l, contentWidth - 8);
      boxH += (sp.length * 4);
    });

    doc.roundedRect(margin, currentY, contentWidth, boxH, 1.5, 1.5, 'FD');
    let kY = currentY + 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(133, 77, 14);
    takeAwayLines.forEach(l => {
      const sp = doc.splitTextToSize(l, contentWidth - 8);
      doc.text(sp, margin + 4, kY);
      kY += (sp.length * 4);
    });
    currentY += boxH + 6;
  }

  // OFFICIAL SEAL / FOOTER BADGE
  checkPageBreak(20);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isFrench 
      ? 'Fiche de cours validée pédagogiquement — Ministère de l\'Éducation Nationale Madagascar.'
      : 'Takelaka voamarina ara-panabeazana — Ministère de l\'Éducation Nationale Madagascar.',
    margin, 
    currentY
  );
  doc.text('Programme Officiel Madagascar 2026', pageWidth - margin, currentY, { align: 'right' });

  // Save the PDF
  const safeTitle = lesson.subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `Cours_${lesson.classId}_${safeTitle}_Niveau_${lesson.level}.pdf`;
  doc.save(filename);
}
