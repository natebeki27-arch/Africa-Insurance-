import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Upload, 
  Car, 
  Building2, 
  Anchor, 
  HardHat, 
  HeartHandshake, 
  ArrowRight,
  Send,
  HelpCircle
} from 'lucide-react';

interface ClaimsPageProps {
  navigate: (route: string) => void;
}

export const ClaimsPage: React.FC<ClaimsPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'procedure' | 'notify' | 'requirements'>('procedure');
  const [selectedClass, setSelectedClass] = useState<string>('motor');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [claimForm, setClaimForm] = useState({
    policyNumber: '',
    claimantName: '',
    phone: '',
    email: '',
    insuranceClass: 'motor',
    dateOfLoss: '',
    locationOfLoss: '',
    lossDescription: '',
    estimatedLossETB: ''
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const requirementsData: Record<string, { title: string; docs: string[]; timeline: string }> = {
    motor: {
      title: 'Motor Own Damage, Collision & Third-Party Claims',
      docs: [
        'Duly completed and signed AIC Motor Claim Form',
        'Official Traffic Police Report with incident sketch and liability verdict',
        'Valid Driver\'s License of the person driving at the time of accident',
        'Original Vehicle Ownership Certificate / Libre (Yellow/Blue book)',
        'Annual Ministry of Transport Roadworthiness / Inspection Certificate',
        'Commercial Transport Permit (for commercial passenger & freight vehicles)'
      ],
      timeline: 'Survey conducted within 24 hours of notification; settlement offer within 5-7 working days of final repair invoice'
    },
    fire: {
      title: 'Fire, Lightning, Explosion & Commercial Property Claims',
      docs: [
        'Official Fire & Emergency Services Brigade Investigation Report',
        'Local Police Kebele/Sub-City incident registration docket',
        'Detailed itemized inventory of destroyed, burnt, or damaged stock and machinery',
        'Original purchase invoices, inventory registers, or audited asset schedules',
        'Technical engineer / electrician assessment report if electrical surge is suspected'
      ],
      timeline: 'Joint loss survey within 48 hours; interim relief available for major industrial losses'
    },
    marine: {
      title: 'Marine Cargo & Inland Transit (Djibouti Corridor) Claims',
      docs: [
        'Original Insurance Policy Certificate or Marine Cargo Declaration',
        'Original Commercial Invoice, Packing List, and Clean Bill of Lading (B/L) or Air Waybill',
        'Customs Import Declaration (IM4) and Port Delivery Order',
        'Joint Customs / ESLSE / Port Surveyor Outturn & Damage Report',
        'Carrier delivery note with endorsement of shortage or damage upon receipt in Modjo or Addis Ababa'
      ],
      timeline: 'Survey at dry port or warehouse within 24 hours of container de-stuffing'
    },
    engineering: {
      title: 'Contractors’ All Risks (CAR) & Machinery Breakdown Claims',
      docs: [
        'Consulting Engineer or Resident Site Supervisor incident narrative report',
        'Contract Bill of Quantities (BOQ) with affected work items highlighted',
        'Manufacturer maintenance service logs for damaged machinery',
        'Detailed repair quotation from authorized equipment distributors (e.g., Caterpillar, Komatsu)'
      ],
      timeline: 'Site inspection within 24-48 hours anywhere in Ethiopia'
    },
    life: {
      title: 'Group Life, Medical & Personal Accident Claims',
      docs: [
        'Attending Physician Medical Report with diagnosis and treatment summary',
        'Official Hospital Discharge Certificate and itemized medical invoices',
        'Death Certificate issued by Vital Events Registration Agency (for life claims)',
        'Employer formal notification letter verifying continuous active employment'
      ],
      timeline: 'Medical claim reimbursements processed within 3-5 business days'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
            <span>Claims Management Department</span>
            <span aria-hidden="true">·</span>
            <span>Committed to Fair & Prompt Settlement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#12366e] tracking-tight leading-tight">
            Authoritative Claims Service & Settlement
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            At Africa Insurance Company S.C., our core guiding policy is to handle all claim notifications fairly, consistently, and without delay. Managed by experienced claim professionals under the direction of our Claims Management Department, we ensure immediate surveyor dispatch and prompt financial indemnification.
          </p>
        </div>

        {/* Emergency Loss Notification Banner */}
        <div className="bg-gradient-to-r from-[#12366e] via-[#164284] to-[#1c53a3] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#f0cb5a]">24/7 Accident & Emergency Support</span>
            <h3 className="text-xl font-bold text-white">Need Immediate Loss Assistance or Surveyor Dispatch?</h3>
            <p className="text-xs text-slate-200 max-w-xl">
              Report traffic collisions, major fire incidents, or cargo damage along the transport corridor directly to our Head Office claims helpline.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+251116637716"
              className="bg-[#f0cb5a] hover:bg-[#e0bb45] text-slate-900 text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-900" />
              <span>+251 11 663 7716 / 17</span>
            </a>
            <button
              onClick={() => setActiveTab('notify')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold px-5 py-3 rounded-xl transition-all backdrop-blur-sm whitespace-nowrap cursor-pointer"
            >
              Submit Notice Online
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('procedure')}
            className={`pb-4 px-2 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'procedure'
                ? 'border-[#12366e] text-[#12366e]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Claims Procedure & Steps
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-4 px-2 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'requirements'
                ? 'border-[#12366e] text-[#12366e]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Required Documentation by Class
          </button>
          <button
            onClick={() => setActiveTab('notify')}
            className={`pb-4 px-2 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'notify'
                ? 'border-[#12366e] text-[#12366e]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Online Claim Notification
          </button>
        </div>

        {/* Tab 1: Claims Procedure & Steps */}
        {activeTab === 'procedure' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#12366e] text-[#f0cb5a] font-bold text-base flex items-center justify-center">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Immediate Notice</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Notify Africa Insurance Company within 24 to 48 hours of any accident, damage, or incident via phone, online notice, or at any of our branches nationwide.
                </p>
                <div className="text-[11px] font-medium text-[#12366e] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  Tip: In traffic accidents, do not move the vehicle until authorized by traffic police.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#12366e] text-[#f0cb5a] font-bold text-base flex items-center justify-center">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Survey & Inspection</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our licensed claims engineers or appointed loss adjusters will inspect the damaged vehicle, property, or goods and compile an official Survey Report.
                </p>
                <div className="text-[11px] font-medium text-[#12366e] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  Inspections conducted within 24 hours in Addis Ababa and major hubs.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#12366e] text-[#f0cb5a] font-bold text-base flex items-center justify-center">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Document Review</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit the police report, repair estimates, purchase invoices, and completed claim form. Our claims team validates the documents against your policy schedule.
                </p>
                <div className="text-[11px] font-medium text-[#12366e] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  All documents tracked via secure internal audit logs.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#12366e] text-[#f0cb5a] font-bold text-base flex items-center justify-center">
                  4
                </div>
                <h3 className="text-base font-bold text-slate-900">Prompt Settlement</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upon agreement on the assessed loss, a Discharge Voucher is executed, and indemnification payment is disbursed via bank transfer, Telebirr, or certified draft.
                </p>
                <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  Guaranteed settlement within statutory timelines.
                </div>
              </div>
            </div>

            {/* Claims Guiding Principles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#12366e]">Our Guiding Claims Philosophy</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                <div className="space-y-2">
                  <strong className="text-slate-900 text-sm block">Transparency & Fairness</strong>
                  <p>
                    Every policyholder is treated with complete transparency. Deductibles, depreciation rules, and exclusions are applied strictly in accordance with certified NBE policy schedules.
                  </p>
                </div>
                <div className="space-y-2">
                  <strong className="text-slate-900 text-sm block">Authorized Repair Network</strong>
                  <p>
                    We partner with reputable automotive garages and engineering maintenance workshops throughout Ethiopia to ensure quality repairs and genuine replacement parts.
                  </p>
                </div>
                <div className="space-y-2">
                  <strong className="text-slate-900 text-sm block">Direct Customer Advocate</strong>
                  <p>
                    Our Claims Management Department provides direct phone and in-person consultations at our Bole Road Head Office to explain every stage of your claim file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Required Documentation by Class */}
        {activeTab === 'requirements' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Category Selectors */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'motor', label: 'Motor Insurance', icon: Car },
                { id: 'fire', label: 'Fire & Property', icon: Building2 },
                { id: 'marine', label: 'Marine & Cargo', icon: Anchor },
                { id: 'engineering', label: 'Engineering & Machinery', icon: HardHat },
                { id: 'life', label: 'Life & Medical', icon: HeartHandshake }
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClass(c.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedClass === c.id
                        ? 'bg-[#12366e] text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Class Requirements Details */}
            {requirementsData[selectedClass] && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#12366e]">
                    Mandatory Checklists
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {requirementsData[selectedClass].title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Required Supporting Documents
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {requirementsData[selectedClass].docs.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                  <Clock className="w-5 h-5 text-[#12366e] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">Assessment & Settlement Benchmark</strong>
                    <span className="text-slate-600">{requirementsData[selectedClass].timeline}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Online Claim Notification */}
        {activeTab === 'notify' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-10 shadow-sm max-w-3xl space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#12366e]">Online Loss Notification</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Submit Incident Notification</h2>
              <p className="text-xs text-slate-500 mt-1">
                Submitting this notification creates an immediate claim docket in our Claims Management Department. A claim investigator will contact you within 4 business hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Notification Received Successfully</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Your claim docket reference is <strong className="font-mono">AIC-CLM-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our Claims Department in Addis Ababa has received your notification and will coordinate surveyor assignment shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setClaimForm({
                        policyNumber: '',
                        claimantName: '',
                        phone: '',
                        email: '',
                        insuranceClass: 'motor',
                        dateOfLoss: '',
                        locationOfLoss: '',
                        lossDescription: '',
                        estimatedLossETB: ''
                      });
                    }}
                    className="text-xs font-semibold text-emerald-800 underline cursor-pointer"
                  >
                    Submit another notification
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Policy Number / Verification Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AIC/MTR/2026/004812"
                      value={claimForm.policyNumber}
                      onChange={(e) => setClaimForm({ ...claimForm, policyNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Insurance Class *
                    </label>
                    <select
                      value={claimForm.insuranceClass}
                      onChange={(e) => setClaimForm({ ...claimForm, insuranceClass: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    >
                      <option value="motor">Motor Insurance</option>
                      <option value="fire">Fire & Property</option>
                      <option value="marine">Marine Cargo & Transit</option>
                      <option value="engineering">Engineering & CAR</option>
                      <option value="life">Life & Medical</option>
                      <option value="liability">Liability / Pecuniary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Claimant / Insured Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name / Enterprise Name"
                      value={claimForm.claimantName}
                      onChange={(e) => setClaimForm({ ...claimForm, claimantName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 91 123 4567"
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm({ ...claimForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="claimant@example.et"
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Date & Time of Loss *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={claimForm.dateOfLoss}
                      onChange={(e) => setClaimForm({ ...claimForm, dateOfLoss: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Location of Incident *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bole Road / Adama Toll Rd"
                      value={claimForm.locationOfLoss}
                      onChange={(e) => setClaimForm({ ...claimForm, locationOfLoss: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Estimated Loss (ETB)
                    </label>
                    <input
                      type="number"
                      placeholder="Approximate ETB value"
                      value={claimForm.estimatedLossETB}
                      onChange={(e) => setClaimForm({ ...claimForm, estimatedLossETB: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Circumstances & Description of Loss *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide a clear description of how the damage occurred, parties involved, third-party injuries (if any), and whether police report was filed..."
                    value={claimForm.lossDescription}
                    onChange={(e) => setClaimForm({ ...claimForm, lossDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#12366e] focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#12366e] hover:bg-[#184486] text-white px-7 py-3 rounded-xl font-semibold text-xs tracking-tight transition-all flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Official Notification</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
