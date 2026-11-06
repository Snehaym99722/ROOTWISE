import { Investigation } from '../types/investigation.ts';

export const INITIAL_INVESTIGATIONS: Investigation[] = [
  {
    id: 'DEV-2026-0842',
    title: 'OOS Impurity D Excursion & Crystallizer Thermal Excursion in Atorvastatin Lot',
    apiProduct: 'Atorvastatin Calcium Trihydrate',
    batchNumber: 'ATV-2026-0482B',
    manufacturingStage: 'Stage 4: Controlled Anti-Solvent Crystallization',
    equipmentId: 'CRY-104 (Hastelloy C-22 Crystallizer, 3000L)',
    facility: 'Commercial API Suite 2, Building B (GMP)',
    incidentDate: '2026-11-04T14:22:00Z',
    detectionDate: '2026-11-04T18:45:00Z',
    targetClosureDate: '2026-11-25T17:00:00Z',
    severity: 'CRITICAL',
    status: 'UNDER_INVESTIGATION',
    investigatorLead: 'Dr. Elena Rostova (Senior QA Investigator)',
    qaApprover: 'Marcus Vance (Director of Quality Assurance)',
    eventDescription: 'During final release testing of Atorvastatin Calcium Trihydrate Lot ATV-2026-0482B, Quality Control reported an Out-of-Specification (OOS) result for Related Substance Impurity D at 0.38% w/w (Specification: NMT 0.15% w/w via Ph. Eur. / USP HPLC assay). SCADA review revealed that during crystallization cooling from 58°C to 12°C, the jacket temperature spiked unexpectedly to 41.5°C at Step 6, causing a 4.2°C temperature overshoot in the slurry for 38 minutes.',
    immediateContainment: '1. Lot ATV-2026-0482B (net weight 412.5 kg) placed under physical and SAP quarantine status QA-HOLD.\n2. Crystallizer CRY-104 locked out from subsequent batch charging.\n3. Preceding and succeeding batches (ATV-2026-0481B and ATV-2026-0483B) flagged for mandatory impurity profiling review.',
    batchDisposition: 'QUARANTINED',
    telemetryData: [
      { time: '12:00', jacketTemp: 58.2, slurryTemp: 58.0, targetTemp: 58.0, agitatorRpm: 120, pressure: 0.12, pH: 7.2 },
      { time: '12:30', jacketTemp: 52.1, slurryTemp: 53.4, targetTemp: 53.0, agitatorRpm: 120, pressure: 0.12, pH: 7.2 },
      { time: '13:00', jacketTemp: 44.8, slurryTemp: 47.1, targetTemp: 46.0, agitatorRpm: 110, pressure: 0.11, pH: 7.1 },
      { time: '13:30', jacketTemp: 35.0, slurryTemp: 39.5, targetTemp: 38.0, agitatorRpm: 95, pressure: 0.10, pH: 7.1 },
      { time: '14:00', jacketTemp: 31.4, slurryTemp: 32.8, targetTemp: 30.0, agitatorRpm: 90, pressure: 0.10, pH: 7.0 },
      { time: '14:22', jacketTemp: 41.5, slurryTemp: 36.2, targetTemp: 24.0, agitatorRpm: 90, pressure: 0.28, pH: 6.8, isExcursion: true },
      { time: '14:45', jacketTemp: 38.2, slurryTemp: 35.8, targetTemp: 20.0, agitatorRpm: 90, pressure: 0.25, pH: 6.8, isExcursion: true },
      { time: '15:00', jacketTemp: 29.0, slurryTemp: 31.4, targetTemp: 18.0, agitatorRpm: 85, pressure: 0.14, pH: 6.9, isExcursion: true },
      { time: '15:30', jacketTemp: 16.5, slurryTemp: 21.0, targetTemp: 15.0, agitatorRpm: 80, pressure: 0.11, pH: 7.0 },
      { time: '16:00', jacketTemp: 11.8, slurryTemp: 12.9, targetTemp: 12.0, agitatorRpm: 75, pressure: 0.10, pH: 7.0 }
    ],
    labResults: [
      {
        id: 'LAB-01',
        testName: 'Related Substances (HPLC)',
        parameter: 'Impurity D (Di-tert-butyl analog)',
        result: '0.38%',
        specification: 'NMT 0.15%',
        unit: '% w/w',
        status: 'OOS',
        instrumentId: 'HPLC-AG-09',
        analyst: 'T. Krishnan'
      },
      {
        id: 'LAB-02',
        testName: 'Active Assay by Potentiometry',
        parameter: 'Atorvastatin Calcium purity',
        result: '98.9%',
        specification: '98.0% - 102.0%',
        unit: '%',
        status: 'PASS',
        instrumentId: 'POT-TIT-03',
        analyst: 'A. Chen'
      },
      {
        id: 'LAB-03',
        testName: 'Karl Fischer Volumetric Titration',
        parameter: 'Water Content (Trihydrate)',
        result: '4.6%',
        specification: '3.5% - 5.5%',
        unit: '% w/w',
        status: 'PASS',
        instrumentId: 'KF-MET-01',
        analyst: 'A. Chen'
      },
      {
        id: 'LAB-04',
        testName: 'Particle Size Distribution (Laser Diffraction)',
        parameter: 'D90 (microns)',
        result: '48.2',
        specification: 'NMT 55.0',
        unit: 'µm',
        status: 'PASS',
        instrumentId: 'MALVERN-02',
        analyst: 'R. Simmons'
      },
      {
        id: 'LAB-05',
        testName: 'Residual Solvents by GC Headspace',
        parameter: 'Methanol & Ethyl Acetate',
        result: '210 ppm / 420 ppm',
        specification: 'NMT 3000 / 5000 ppm',
        unit: 'ppm',
        status: 'PASS',
        instrumentId: 'GC-FID-04',
        analyst: 'T. Krishnan'
      }
    ],
    fiveWhys: [
      {
        id: 'W1',
        level: 1,
        question: 'Why did Batch ATV-2026-0482B fail final release for Impurity D (0.38% vs Spec NMT 0.15%)?',
        answer: 'Excessive thermal stress during crystallization catalyzed premature acid-mediated ester degradation into the Impurity D analog.',
        evidence: 'HPLC chromatogram confirmed single distinct degradant peak matching Impurity D reference standard; LC-MS confirmed retention time 14.8 min.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Material'
      },
      {
        id: 'W2',
        level: 2,
        question: 'Why did excessive thermal stress occur during the controlled crystallization phase?',
        answer: 'Slurry temperature unexpectedly rose by 4.2°C at 14:22 UTC instead of following the programmed linear cooling ramp.',
        evidence: 'SCADA Historian Tag TIC-104-PV shows excursion lasting 38 minutes between 14:22 and 15:00.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Method'
      },
      {
        id: 'W3',
        level: 3,
        question: 'Why did the crystallizer slurry temperature spike during active chilling?',
        answer: 'Hot Syltherm heat transfer fluid flooded the cooling jacket due to the temperature control valve TCV-104A remaining stuck 60% open.',
        evidence: 'DCS log recorded command 0% (closed), but valve feedback position sensor ZS-104 indicated 58.4% open during chiller cycle.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W4',
        level: 4,
        question: 'Why did valve TCV-104A fail to close when commanded by the automation system?',
        answer: 'Pneumatic actuator diaphragm suffered micro-tear and particulate ingress into instrument air regulator, causing mechanical binding of the valve stem.',
        evidence: 'Maintenance physical teardown report #MTR-2026-88 found 2mm tear in nitrile diaphragm and desiccant fines in regulator port.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W5',
        level: 5,
        question: 'Why was the pneumatic diaphragm deterioration and desiccant dust contamination not detected prior to batch execution?',
        answer: 'Preventive maintenance schedule PM-VLV-12M had been deferred from Q3 to Q4 without documented engineering change assessment, and instrument air dryer sub-filter replacement had lapsed by 62 days.',
        evidence: 'CMMS Work Order #WO-89110 shows PM status "Deferred"; Instrument Air Header Filter F-201 differential pressure gauge was pegged in red zone.',
        status: 'VERIFIED',
        isRootCause: true,
        contributingCategory: 'Method'
      }
    ],
    fishboneFactors: [
      {
        id: 'F-MCH-01',
        category: 'Machine',
        factor: 'TCV-104A pneumatic bypass valve stem mechanical seizure',
        likelihood: 'HIGH',
        verified: true,
        notes: 'Confirmed by physical inspection: torn diaphragm and seized stem',
        isRootCause: true
      },
      {
        id: 'F-MCH-02',
        category: 'Machine',
        factor: 'Secondary Syltherm circulation pump impeller cavitation',
        likelihood: 'LOW',
        verified: false,
        notes: 'Pump vibration spectrum normal (<1.2 mm/s RMS)'
      },
      {
        id: 'F-MTH-01',
        category: 'Method',
        factor: 'Preventive maintenance deferral procedure without engineering risk review',
        likelihood: 'HIGH',
        verified: true,
        notes: 'SOP-ENG-014 lacked formal MOC gating for critical utility PM deferrals',
        isRootCause: true
      },
      {
        id: 'F-MTH-02',
        category: 'Method',
        factor: 'Crystallization cooling rate recipe step duration insufficient',
        likelihood: 'LOW',
        verified: false,
        notes: 'Recipe cooling curve matches validated process BMR 04'
      },
      {
        id: 'F-MAT-01',
        category: 'Material',
        factor: 'Starting material Crude Atorvastatin had elevated baseline Impurity D',
        likelihood: 'LOW',
        verified: false,
        notes: 'Crude batch CA-8819 assay showed Impurity D at 0.04% (well within spec)'
      },
      {
        id: 'F-MAN-01',
        category: 'Man',
        factor: 'Operator delayed manual override on SCADA alarm',
        likelihood: 'MEDIUM',
        verified: false,
        notes: 'Alarm acknowledged in 42 seconds; operator followed standard SOP by notifying Shift Lead'
      },
      {
        id: 'F-MEA-01',
        category: 'Measurement',
        factor: 'PT100 Temperature sensor calibration drift on CRY-104',
        likelihood: 'LOW',
        verified: false,
        notes: 'Post-incident calibration check verified within ±0.1°C tolerance'
      },
      {
        id: 'F-MIL-01',
        category: 'Milieu',
        factor: 'Utility plant cooling tower water temperature surge',
        likelihood: 'LOW',
        verified: false,
        notes: 'Central utility logs show chilled water supply constant at 6.4°C'
      }
    ],
    riskAssessment: {
      severity: 8, // Critical API OOS impacting batch release
      occurrence: 6, // PM deferrals occurred on 2 other vessels
      detection: 4, // Detected at release QC, not automated SCADA interlock
      rpn: 192,
      riskCategory: 'HIGH',
      rationale: 'High RPN driven by potential patient impact if OOS lot were distributed and lack of automatic automated shutdown interlock when thermal profile drifts.'
    },
    capas: [
      {
        id: 'CAPA-2026-0842-01',
        type: 'CORRECTIVE',
        title: 'Complete overhaul and recalibration of TCV-104A pneumatic actuator',
        description: 'Replace actuator diaphragm with fluorocarbon viton material, install dedicated particulate coalescing filter on local instrument air drop, and stroke-test valve across 0-100% travel.',
        owner: 'David Miller (Plant Maintenance Lead)',
        department: 'Engineering & Maintenance',
        dueDate: '2026-11-14',
        status: 'IN_PROGRESS',
        verificationMethod: '10-point calibration certificate and 24-hr cold run loop test'
      },
      {
        id: 'CAPA-2026-0842-02',
        type: 'PREVENTIVE',
        title: 'Revise Maintenance Deferral SOP with Quality Unit sign-off gating',
        description: 'Update SOP-ENG-014 to prohibit deferral of critical utility and direct-impact process equipment PMs without formal Quality Risk Assessment (ICH Q9) and QA Director sign-off.',
        owner: 'Sarah Jenkins (Compliance Manager)',
        department: 'Quality Assurance',
        dueDate: '2026-11-20',
        status: 'OPEN',
        verificationMethod: 'Audit next 3 months of CMMS work order deferrals for 100% compliance'
      },
      {
        id: 'CAPA-2026-0842-03',
        type: 'PREVENTIVE',
        title: 'Implement SCADA automated temperature delta alarm and hold interlock',
        description: 'Configure DCS interlock in recipe: if |Slurry Temp - Recipe Setpoint| > 2.0°C for > 5 minutes, automatically pause cooling ramp and trigger audible alert on operator console.',
        owner: 'Vikram Joshi (Automation Lead)',
        department: 'Process Automation',
        dueDate: '2026-11-30',
        status: 'OPEN',
        verificationMethod: 'Software change control validation protocol execution and simulation test'
      }
    ],
    historicalMatches: [
      {
        id: 'HIST-01',
        batchNumber: 'ATV-2025-0912A',
        deviationId: 'DEV-2025-0411',
        date: '2025-08-14',
        product: 'Atorvastatin Calcium Trihydrate',
        failureMode: 'Crystallization thermal excursion (+3.5°C over setpoint)',
        rootCause: 'Chiller secondary glycol loop airlock during seasonal switchover',
        similarityScore: 89,
        capaEffective: true,
        learnings: 'Glycol de-aeration valves were added. This proved current event was NOT glycol airlock, but localized pneumatic valve failure.'
      },
      {
        id: 'HIST-02',
        batchNumber: 'ROS-2025-0210C',
        deviationId: 'DEV-2025-0105',
        date: '2025-02-09',
        product: 'Rosuvastatin Intermediate R-2',
        failureMode: 'Impurity spike following temperature excursion in Reactor R-102',
        rootCause: 'Instrument air line moisture condensation seized control valve',
        similarityScore: 84,
        capaEffective: false,
        learnings: 'CAPA addressed reactor R-102 local dryer only, failed to review site-wide instrument air header filtration.'
      }
    ],
    electronicSignatures: [
      {
        id: 'SIG-01',
        signerName: 'Dr. Elena Rostova',
        signerEmail: 'e.rostova@pharmamanuf.demo',
        role: 'Lead Investigator',
        timestamp: '2026-11-05T16:30:12Z',
        reason: 'Root cause analysis hypothesis and 5-Whys deduction verified against physical maintenance evidence.',
        sha256Checksum: '',
        isVerified: false
      }
    ],
    auditLogs: [
      {
        id: 'LOG-01',
        timestamp: '2026-11-04T18:50:00Z',
        operator: 'QC Analyst T. Krishnan',
        action: 'OOS Initial Alert Logged',
        category: 'STATUS_CHANGE',
        details: 'Initial OOS result 0.38% Impurity D logged into LIMS and flagged to QA Operations.',
        hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
      },
      {
        id: 'LOG-02',
        timestamp: '2026-11-04T19:15:22Z',
        operator: 'QA Lead E. Rostova',
        action: 'Investigation Initiated & Batch Quarantined',
        category: 'RECORD_EDIT',
        details: 'Deviation DEV-2026-0842 opened under ICH Q7 guidelines; physical quarantine initiated.',
        hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
      },
      {
        id: 'LOG-03',
        timestamp: '2026-11-05T10:20:00Z',
        operator: 'Maint Lead D. Miller',
        action: 'Physical Evidence Attached',
        category: 'RECORD_EDIT',
        details: 'Attached teardown report MTR-2026-88 identifying pneumatic diaphragm perforation.',
        hash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9'
      },
      {
        id: 'LOG-04',
        timestamp: '2026-11-05T16:30:12Z',
        operator: 'QA Lead E. Rostova',
        action: 'Demo review acknowledgement recorded',
        category: 'SIGNATURE',
        details: 'Electronic signature appended with reason: Root cause analysis hypothesis verified.',
        hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'
      }
    ],
    rootCauseSummary: 'Thermal degradation in crystallizer CRY-104 caused by pneumatic temperature control valve TCV-104A seizing open due to actuator diaphragm rupture and instrument air particulate contamination, compounded by deferred preventive maintenance without engineering risk review.',
    aiSuggestedSummary: 'High probability causal chain: Preventive maintenance deferral on instrument air filtration led to pneumatic actuator particulate fouling, freezing valve TCV-104A in open position. Resulting 4.2°C thermal overshoot accelerated hydrolysis/ester rearrangement into Impurity D degradant.',
    isAiAssisted: true,
    createdAt: '2026-11-04T18:50:00Z',
    updatedAt: '2026-11-05T16:30:12Z'
  },
  {
    id: 'DEV-2026-0719',
    title: 'Foreign Particulate Contamination (Black Specks) in Remdesivir Intermediate R-4',
    apiProduct: 'Remdesivir Intermediate R-4 (Phosphoramidate)',
    batchNumber: 'REM-2026-0199',
    manufacturingStage: 'Coupling Synthesis & Primary Pressure Filtration',
    equipmentId: 'RCT-201 (Glass-Lined Reactor 5000L) & NUT-03 (Nutsche Filter)',
    facility: 'High Potency Synthesis Suite 1',
    incidentDate: '2026-10-28T09:15:00Z',
    detectionDate: '2026-10-28T11:00:00Z',
    targetClosureDate: '2026-11-18T17:00:00Z',
    severity: 'MAJOR',
    status: 'CAPA_PENDING',
    investigatorLead: 'Dr. Tariq Al-Mansoor (Principal Process Chemist)',
    qaApprover: 'Marcus Vance (Director of Quality Assurance)',
    eventDescription: 'During post-coupling slurry discharge onto Nutsche Filter NUT-03, visual inspection of wet cake revealed scattered visible black speck particulate contamination (>100 µm). FTIR and SEM-EDX microanalysis identified particulate material as silicon carbide (SiC) and carbon graphite consistent with mechanical agitator seal face composition.',
    immediateContainment: '1. Slurry filtration halted immediately; remaining 1800L in reactor isolated.\n2. Filter cake segregated and sampled for microscopic count.\n3. Reactor RCT-201 tagged out for mechanical seal endoscopy inspection.',
    batchDisposition: 'UNDER_EVALUATION',
    telemetryData: [
      { time: '06:00', jacketTemp: 22.0, slurryTemp: 21.8, targetTemp: 22.0, agitatorRpm: 140, pressure: 0.85 },
      { time: '07:00', jacketTemp: 22.2, slurryTemp: 22.0, targetTemp: 22.0, agitatorRpm: 140, pressure: 0.85 },
      { time: '08:00', jacketTemp: 24.1, slurryTemp: 23.9, targetTemp: 24.0, agitatorRpm: 140, pressure: 0.82 },
      { time: '08:45', jacketTemp: 25.0, slurryTemp: 24.8, targetTemp: 25.0, agitatorRpm: 140, pressure: 0.25, isExcursion: true },
      { time: '09:00', jacketTemp: 25.1, slurryTemp: 25.0, targetTemp: 25.0, agitatorRpm: 140, pressure: 0.22, isExcursion: true },
      { time: '09:15', jacketTemp: 25.0, slurryTemp: 25.1, targetTemp: 25.0, agitatorRpm: 140, pressure: 0.20, isExcursion: true }
    ],
    labResults: [
      {
        id: 'LAB-11',
        testName: 'Foreign Particulate Matter (USP <788>)',
        parameter: 'Particles >= 10 µm / 25 µm',
        result: '1420 / 380 per container',
        specification: 'NMT 600 / 60',
        unit: 'count',
        status: 'OOS',
        instrumentId: 'HIAC-9703',
        analyst: 'M. Gomez'
      },
      {
        id: 'LAB-12',
        testName: 'Particulate Composition (SEM-EDX)',
        parameter: 'Elemental Spectrum',
        result: 'Carbon (91%), Silicon (8.2%)',
        specification: 'Match Agitator Seal Face Material',
        unit: 'wt%',
        status: 'PASS',
        instrumentId: 'JEOL-SEM-01',
        analyst: 'Dr. K. Patel'
      }
    ],
    fiveWhys: [
      {
        id: 'W1',
        level: 1,
        question: 'Why were black speck particulates present on the Nutsche filter cake?',
        answer: 'Mechanical seal faces shed graphite and silicon carbide particles directly into the reactor vessel.',
        evidence: 'SEM-EDX spectral fingerprint matches EagleBurgmann double mechanical seal face composition exactly.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W2',
        level: 2,
        question: 'Why did the mechanical seal faces shed particulate material into the vessel?',
        answer: 'The primary seal ring experienced dry running and severe frictional micro-spalling.',
        evidence: 'Borescope inspection of seal housing showed scoring and carbon dust accumulation along seal faces.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W3',
        level: 3,
        question: 'Why did the mechanical seal experience dry running?',
        answer: 'Barrier fluid pressure dropped below reactor internal pressure, disrupting the lubricating film between the seal faces.',
        evidence: 'Telemetry tag PIT-201-BF shows barrier pressure dropped from 3.5 bar to 0.2 bar at 08:42 UTC.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W4',
        level: 4,
        question: 'Why did the barrier fluid pressure collapse during synthesis?',
        answer: 'The nitrogen supply regulator to the seal pot had a ruptured elastomeric diaphragm.',
        evidence: 'Pressure regulator PRV-BF-01 dissembled; internal diaphragm had radial rupture along clamping edge.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W5',
        level: 5,
        question: 'Why did the reactor agitator keep running when barrier fluid pressure dropped below minimum safety threshold?',
        answer: 'The low barrier fluid pressure switch was wired as an informational alert on SCADA rather than a hardwired safety interlock to stop the agitator drive motor.',
        evidence: 'P&ID drawing API-E-201 rev 2 confirms PIT-201-BF alarm configured as Low-Alarm only, without motor trip logic.',
        status: 'VERIFIED',
        isRootCause: true,
        contributingCategory: 'Method'
      }
    ],
    fishboneFactors: [
      {
        id: 'F-MCH-11',
        category: 'Machine',
        factor: 'Barrier fluid nitrogen pressure regulator diaphragm rupture',
        likelihood: 'HIGH',
        verified: true,
        notes: 'Confirmed ruptured diaphragm on physical teardown',
        isRootCause: true
      },
      {
        id: 'F-MTH-11',
        category: 'Method',
        factor: 'Lack of automated agitator motor trip interlock upon seal barrier pressure loss',
        likelihood: 'HIGH',
        verified: true,
        notes: 'Design flaw in P&ID safety interlock matrix',
        isRootCause: true
      },
      {
        id: 'F-MAT-11',
        category: 'Material',
        factor: 'Raw material solvent Dimethylformamide had particulate contamination',
        likelihood: 'LOW',
        verified: false,
        notes: 'Pre-charge cartridge 0.45µm filter clean; solvent certificate verified'
      },
      {
        id: 'F-MAN-11',
        category: 'Man',
        factor: 'Operator failure to inspect seal pot level sight glass during shift round',
        likelihood: 'MEDIUM',
        verified: false,
        notes: 'Log sheet signed at 07:00; event occurred at 08:42'
      },
      {
        id: 'F-MEA-11',
        category: 'Measurement',
        factor: 'Pressure transmitter PIT-201-BF faulty reading',
        likelihood: 'LOW',
        verified: false,
        notes: 'Sensor bench calibration confirmed accurate to ±0.05 bar'
      },
      {
        id: 'F-MIL-11',
        category: 'Milieu',
        factor: 'Vibration from adjacent centrifuge C-01 transmitting to reactor shaft',
        likelihood: 'LOW',
        verified: false,
        notes: 'Centrifuge was idle during the entire coupling reaction window'
      }
    ],
    riskAssessment: {
      severity: 7, // Particulate contamination in intermediate requiring rework
      occurrence: 5, // 2 prior seal pot pressure dip events recorded
      detection: 5, // Detected visually on filter cake, not by automated shutoff
      rpn: 175,
      riskCategory: 'HIGH',
      rationale: 'Risk of downstream carryover into final API if filtration integrity fails; engineering interlock required.'
    },
    capas: [
      {
        id: 'CAPA-2026-0719-01',
        type: 'CORRECTIVE',
        title: 'Install new mechanical seal cartridge and replace barrier fluid regulator',
        description: 'Install factory-assembled EagleBurgmann seal cartridge with certified face flatness, replace PRV with stainless steel bellows design, and flush reactor with 500L clean solvent.',
        owner: 'Gary Henderson (Maintenance Specialist)',
        department: 'Plant Engineering',
        dueDate: '2026-11-12',
        status: 'IN_PROGRESS',
        verificationMethod: 'Helium leak test < 1x10^-6 mbar.l/s and 4-hour dynamic pressure hold'
      },
      {
        id: 'CAPA-2026-0719-02',
        type: 'PREVENTIVE',
        title: 'Hardwire Agitator Emergency Trip Interlock to Barrier Pressure PIT-201-BF',
        description: 'Modify PLC logic and safety relay: if barrier fluid pressure falls below (Reactor Pressure + 1.0 bar) for > 15 seconds, initiate immediate controlled agitator motor trip.',
        owner: 'Vikram Joshi (Automation Lead)',
        department: 'Process Automation',
        dueDate: '2026-11-22',
        status: 'OPEN',
        verificationMethod: 'Safety Instrument Systems (SIS) qualification protocol validation run'
      }
    ],
    historicalMatches: [
      {
        id: 'HIST-11',
        batchNumber: 'REM-2025-0088',
        deviationId: 'DEV-2025-0290',
        date: '2025-05-18',
        product: 'Remdesivir Intermediate R-4',
        failureMode: 'Mechanical seal barrier fluid loss',
        rootCause: 'Seal pot manual fill valve left unlatched',
        similarityScore: 92,
        capaEffective: false,
        learnings: 'Added check valve but did NOT implement automated agitator trip interlock, leaving system vulnerable to other pressure loss modes.'
      }
    ],
    electronicSignatures: [
      {
        id: 'SIG-11',
        signerName: 'Dr. Tariq Al-Mansoor',
        signerEmail: 't.almansoor@pharmamanuf.demo',
        role: 'Lead Investigator',
        timestamp: '2026-10-30T14:10:00Z',
        reason: '5 Whys root cause analysis finalized with SEM-EDX metallurgical proof.',
        sha256Checksum: '',
        isVerified: false
      }
    ],
    auditLogs: [
      {
        id: 'LOG-11',
        timestamp: '2026-10-28T11:05:00Z',
        operator: 'Shift Lead K. Olsen',
        action: 'Incident Created & Reactor Locked Out',
        category: 'RECORD_EDIT',
        details: 'Visual particulate finding reported on Nutsche filter; DEV-2026-0719 opened.',
        hash: '93f0b240590a3693f18e90e7a82c61d5f2a1b9c7d4e3f2a1b0c9d8e7f6a5b4c3'
      }
    ],
    rootCauseSummary: 'Mechanical seal dry running and graphite/SiC face micro-spalling caused by nitrogen regulator failure, exacerbated by absence of an automated safety motor trip upon barrier fluid pressure collapse.',
    aiSuggestedSummary: 'Frictional wear of primary mechanical seal faces due to loss of nitrogen barrier pressurization; root cause is system engineering design lacking fail-safe agitator interlock when barrier differential is compromised.',
    isAiAssisted: true,
    createdAt: '2026-10-28T11:05:00Z',
    updatedAt: '2026-10-30T14:10:00Z'
  },
  {
    id: 'DEV-2026-0604',
    title: 'OOT Residual Moisture & Extended Drying Cycle in Metformin HCl API',
    apiProduct: 'Metformin Hydrochloride Pure Grade API',
    batchNumber: 'MET-2026-0911',
    manufacturingStage: 'Stage 3: Vacuum Paddle Drying & Milling',
    equipmentId: 'DRY-02 (Conical Vacuum Paddle Dryer, 4000L)',
    facility: 'Bulk API Powder Facility Building A',
    incidentDate: '2026-10-15T08:00:00Z',
    detectionDate: '2026-10-15T15:30:00Z',
    targetClosureDate: '2026-11-05T17:00:00Z',
    severity: 'MAJOR',
    status: 'QA_REVIEW',
    investigatorLead: 'Jennifer Haas (Senior Quality Engineer)',
    qaApprover: 'Marcus Vance (Director of Quality Assurance)',
    eventDescription: 'At the conclusion of the standard 14-hour drying cycle for Metformin HCl Lot MET-2026-0911, In-Process Control (IPC) Karl Fischer water determination yielded 0.85% w/w, exceeding the drying endpoint limit of NMT 0.50% w/w. Total drying time was extended to 26 hours, risking thermal discoloration and caking of bulk powder.',
    immediateContainment: 'Drying extended under continuous vacuum at reduced jacket temperature (45°C) to prevent polymorphic transition. IPC re-sampling frequency doubled to every 2 hours.',
    batchDisposition: 'UNDER_EVALUATION',
    telemetryData: [
      { time: '00:00', jacketTemp: 55.0, slurryTemp: 28.0, targetTemp: 55.0, agitatorRpm: 12, pressure: 0.05 },
      { time: '04:00', jacketTemp: 55.0, slurryTemp: 44.0, targetTemp: 55.0, agitatorRpm: 12, pressure: 0.06 },
      { time: '08:00', jacketTemp: 55.0, slurryTemp: 50.0, targetTemp: 55.0, agitatorRpm: 12, pressure: 0.18, isExcursion: true },
      { time: '12:00', jacketTemp: 55.0, slurryTemp: 51.5, targetTemp: 55.0, agitatorRpm: 12, pressure: 0.22, isExcursion: true },
      { time: '14:00', jacketTemp: 55.0, slurryTemp: 52.0, targetTemp: 55.0, agitatorRpm: 12, pressure: 0.24, isExcursion: true }
    ],
    labResults: [
      {
        id: 'LAB-21',
        testName: 'Karl Fischer Volumetric Titration',
        parameter: 'Water Content at 14h',
        result: '0.85%',
        specification: 'NMT 0.50%',
        unit: '% w/w',
        status: 'OOS',
        instrumentId: 'KF-MET-02',
        analyst: 'A. Chen'
      },
      {
        id: 'LAB-22',
        testName: 'X-Ray Powder Diffraction (XRPD)',
        parameter: 'Polymorphic Form A Confirmation',
        result: 'Form A 100% (No Form B detected)',
        specification: 'Conforms to Form A reference pattern',
        unit: 'pattern',
        status: 'PASS',
        instrumentId: 'BRUKER-XRD-01',
        analyst: 'Dr. S. Nair'
      }
    ],
    fiveWhys: [
      {
        id: 'W1',
        level: 1,
        question: 'Why was the residual water content 0.85% after 14 hours of drying?',
        answer: 'Vapor evacuation rate inside the vacuum paddle dryer was 40% lower than standard baseline.',
        evidence: 'Vapor condenser condensate collection vessel accumulated only 120L vs expected 200L by hour 14.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W2',
        level: 2,
        question: 'Why was the solvent vapor evacuation rate severely impeded?',
        answer: 'Internal dryer vacuum exhaust filter candles experienced severe cake blinding by ultra-fine crystal dust.',
        evidence: 'Differential pressure across exhaust filter housing PIT-DRY-02 climbed from 20 mbar to 185 mbar.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Machine'
      },
      {
        id: 'W3',
        level: 3,
        question: 'Why did the filter candles get blinded by excessive fine crystal dust?',
        answer: 'Incoming wet cake from centrifuge CENT-04 had a high proportion of sub-15 micron fines (D10 = 4.2 µm vs typical 18 µm).',
        evidence: 'Laser diffraction particle size analysis of wet cake showed bimodal distribution with 24% fines.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Material'
      },
      {
        id: 'W4',
        level: 4,
        question: 'Why did the wet cake have abnormal fine crystal distribution?',
        answer: 'Centrifuge spin wash cycle wash solvent was charged at 8°C colder than SOP specification, causing rapid secondary nucleation on the basket.',
        evidence: 'Wash solvent vessel TIC-WSH-01 chiller setpoint was set to 5°C instead of standard 15°C.',
        status: 'VERIFIED',
        isRootCause: false,
        contributingCategory: 'Method'
      },
      {
        id: 'W5',
        level: 5,
        question: 'Why was the wash solvent chilled below validated recipe temperature?',
        answer: 'Batch record BMR-MET-03 did not mandate electronic sign-off verification on solvent chiller setpoint prior to wash valve actuation.',
        evidence: 'Review of executed batch record page 34 showed chiller temperature was treated as an unverified informational field.',
        status: 'VERIFIED',
        isRootCause: true,
        contributingCategory: 'Method'
      }
    ],
    fishboneFactors: [
      {
        id: 'F-MTH-21',
        category: 'Method',
        factor: 'BMR lacked mandatory recipe verification for wash solvent temperature',
        likelihood: 'HIGH',
        verified: true,
        notes: 'Identified as procedural loophole in BMR-MET-03',
        isRootCause: true
      },
      {
        id: 'F-MCH-21',
        category: 'Machine',
        factor: 'Filter candle reverse pulse-jet nitrogen blowback pressure low',
        likelihood: 'MEDIUM',
        verified: true,
        notes: 'Pulse pressure was 4.0 bar instead of recommended 6.0 bar'
      },
      {
        id: 'F-MAT-21',
        category: 'Material',
        factor: 'Sub-15 micron fine crystal agglomeration blinding porous sintered metal',
        likelihood: 'HIGH',
        verified: true,
        notes: 'Scanning electron microscopy confirmed pore blinding'
      }
    ],
    riskAssessment: {
      severity: 5, // Yield delay and rework evaluation
      occurrence: 4, // Occasional fine generation during winter chiller operation
      detection: 3, // Detected readily by IPC Karl Fischer
      rpn: 60,
      riskCategory: 'MEDIUM',
      rationale: 'Medium risk: Product chemistry remains unaffected (XRD confirms Form A), but cycle time variance disrupts commercial supply schedule.'
    },
    capas: [
      {
        id: 'CAPA-2026-0604-01',
        type: 'PREVENTIVE',
        title: 'Update BMR-MET-03 with Critical Process Parameter (CPP) interlock',
        description: 'Designate wash solvent temperature (15 ± 2°C) as a Critical Process Parameter with mandatory two-person electronic verification in MES before centrifuge wash sequence opens.',
        owner: 'Jennifer Haas (Senior Quality Engineer)',
        department: 'Manufacturing Science & Technology',
        dueDate: '2026-11-15',
        status: 'IN_PROGRESS',
        verificationMethod: 'Review executed MES records for subsequent 5 batches'
      }
    ],
    historicalMatches: [
      {
        id: 'HIST-21',
        batchNumber: 'MET-2025-0618',
        deviationId: 'DEV-2025-0182',
        date: '2025-06-20',
        product: 'Metformin Hydrochloride Pure Grade API',
        failureMode: 'Dryer filter candle blinding',
        rootCause: 'Filter blowback valve solenoid coil burned out',
        similarityScore: 78,
        capaEffective: true,
        learnings: 'Blowback timer was improved, but root upstream cause of fine crystal generation was not addressed at the centrifuge.'
      }
    ],
    electronicSignatures: [
      {
        id: 'SIG-21',
        signerName: 'Jennifer Haas',
        signerEmail: 'j.haas@pharmamanuf.demo',
        role: 'Lead Investigator',
        timestamp: '2026-10-22T11:30:00Z',
        reason: 'Root cause identified and CAPA defined with MS&T approval.',
        sha256Checksum: '',
        isVerified: false
      }
    ],
    auditLogs: [
      {
        id: 'LOG-21',
        timestamp: '2026-10-15T16:00:00Z',
        operator: 'QA Eng J. Haas',
        action: 'Deviation Opened',
        category: 'RECORD_EDIT',
        details: 'Investigation initiated following IPC Karl Fischer moisture out of trend.',
        hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      }
    ],
    rootCauseSummary: 'Excessive fine crystal fraction caused by unverified low wash solvent temperature in centrifuge CENT-04 blinded vacuum dryer exhaust filter candles, crippling solvent vapor removal.',
    aiSuggestedSummary: 'Upstream crystallization/centrifugation thermal shock caused fine crystal formation that blinded vacuum filters, prolonging drying.',
    isAiAssisted: true,
    createdAt: '2026-10-15T16:00:00Z',
    updatedAt: '2026-10-22T11:30:00Z'
  }
];
