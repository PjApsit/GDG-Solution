/**
 * Certificate — Impact Certificate Generator using jsPDF
 */
import React, { useState } from 'react';
import { Award, Download, Share2, Star } from 'lucide-react';

const Certificate = () => {
  const [generating, setGenerating] = useState(false);

  const volunteerData = {
    name: 'Volunteer User',
    tasksCompleted: 12,
    impactPoints: 850,
    ngosSupported: 3,
    startDate: 'January 2026',
    endDate: 'April 2026',
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Background
      doc.setFillColor(250, 248, 255);
      doc.rect(0, 0, 297, 210, 'F');

      // Border
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);
      doc.setLineWidth(0.5);
      doc.rect(14, 14, 269, 182);

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 74, 198);
      doc.text('IMPACTFLOW AI', 148.5, 35, { align: 'center' });

      doc.setFontSize(28);
      doc.setTextColor(25, 27, 35);
      doc.text('Certificate of Impact', 148.5, 55, { align: 'center' });

      // Decorative line
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1);
      doc.line(80, 62, 217, 62);

      // Body
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(67, 70, 85);
      doc.text('This certificate is proudly presented to', 148.5, 78, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(0, 74, 198);
      doc.text(volunteerData.name, 148.5, 95, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(67, 70, 85);
      doc.text(`For outstanding contribution to humanitarian impact during ${volunteerData.startDate} - ${volunteerData.endDate}`, 148.5, 112, { align: 'center' });

      // Stats
      const statsY = 130;
      const stats = [
        { label: 'Tasks Completed', value: String(volunteerData.tasksCompleted) },
        { label: 'Impact Points', value: String(volunteerData.impactPoints) },
        { label: 'NGOs Supported', value: String(volunteerData.ngosSupported) },
      ];

      stats.forEach((stat, i) => {
        const x = 70 + i * 75;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(0, 74, 198);
        doc.text(stat.value, x, statsY, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(88, 95, 108);
        doc.text(stat.label, x, statsY + 8, { align: 'center' });
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(88, 95, 108);
      doc.text('Google Solution Challenge 2026', 148.5, 175, { align: 'center' });
      doc.text(`Issued: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 148.5, 182, { align: 'center' });

      doc.save(`ImpactFlow_Certificate_${volunteerData.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally { setGenerating(false); }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">Impact Certificate</h1>
        <p className="text-body-base text-on-surface-variant">Generate and download your volunteer impact certificate.</p>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Certificate Preview */}
        <div className="card bg-gradient-to-br from-white to-blue-50/50 border-2 border-primary/20 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><Award className="w-8 h-8 text-primary" /></div>
            <p className="text-label-caps uppercase text-primary tracking-widest">ImpactFlow AI</p>
            <h2 className="text-h1 text-on-surface">Certificate of Impact</h2>
            <div className="w-24 h-0.5 bg-primary mx-auto" />
            <p className="text-body-base text-on-surface-variant">Proudly presented to</p>
            <p className="text-h1 text-primary font-bold">{volunteerData.name}</p>
            <p className="text-body-base text-on-surface-variant max-w-md mx-auto">
              For outstanding contribution to humanitarian impact during {volunteerData.startDate} - {volunteerData.endDate}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: 'Tasks', value: volunteerData.tasksCompleted, icon: Star },
                { label: 'Points', value: volunteerData.impactPoints, icon: Award },
                { label: 'NGOs', value: volunteerData.ngosSupported, icon: Share2 },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-h1 text-primary font-bold">{s.value}</p>
                  <p className="text-label-caps uppercase text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleGenerate} disabled={generating} className="btn-primary flex-1 py-3 disabled:opacity-50">
            <Download className="w-4 h-4" />{generating ? 'Generating...' : 'Download PDF Certificate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
