/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemComponent {
  component_name: string;
  description: string;
  technical_specs?: string;
  metrics?: string[];
  key_technologies?: string[];
}

export interface SportsAiDoc {
  id: string;
  topic: string;
  category: string;
  summary: string;
  system_components: SystemComponent[];
  hardware_layer?: string;
  algorithmic_core?: string;
  impact_metric?: string;
}

export const SPORTS_AI_DOCUMENTS: SportsAiDoc[] = [
  {
    id: "doc_001",
    topic: "Digital Athlete & Injury Prevention",
    category: "Sports Analytics / Predictive AI",
    summary: "The NFL tracks player injuries and assesses risk through a sophisticated platform known as the Digital Athlete. This system integrates massive amounts of data to understand biomechanical stresses during games and practices to prevent injuries before they occur.",
    hardware_layer: "Zebra RFID shoulder pad tags, Catapult GPS/accelerometers, 4K 60fps All-22 multi-camera array",
    algorithmic_core: "Biomechanical kinematic inverse dynamics, Acute:Chronic Workload Ratio (ACWR) forecasting, Gradient Boosted Survival trees",
    impact_metric: "Estimated 28% reduction in non-contact lower extremity soft tissue strains through workload load management",
    system_components: [
      {
        component_name: "Computer Vision & Pose Estimation",
        description: "Uses video footage and AI models to perform pose estimation, tracking player body movement in space and time to identify high-risk maneuvers linked to concussions or soft-tissue strains.",
        technical_specs: "Multi-view 3D skeletal tracking, 17 COCO keypoints + 6 head kinematic points, 60fps temporal smoothing with temporal convolutional networks (TCN).",
        metrics: ["Knee Valgus Angle (< 12° optimal)", "Deceleration Rate (g-force)", "Torso Lean / Center of Mass Delta"],
        key_technologies: ["OpenPose / HRNet", "Multi-Camera Homography", "Temporal ConvNets"]
      },
      {
        component_name: "Wearable Technology & Sensor Data",
        description: "Sensors collect real-time performance metrics like speed, acceleration, deceleration, and heart rate to monitor workload and prevent fatigue-related injuries.",
        technical_specs: "Tri-axial accelerometers (up to 16g sampling at 100Hz), optical heart rate telemetry, ultra-wideband (UWB) spatial locators.",
        metrics: ["Player Load (AU)", "Explosive Efforts (> 4.5 m/s²)", "High-Speed Running Distance (HSRD)"],
        key_technologies: ["Tri-axial Accelerometry", "Bio-impedance Sensors", "Telemetry Transceivers"]
      },
      {
        component_name: "Predictive Analytics",
        description: "Combines wearable sensor data, electronic health records, and gameplay information with AI algorithms to forecast individual player injury risks.",
        technical_specs: "Ensemble models combining XGBoost, Cox proportional hazards regression, and LSTM neural networks trained on 10+ seasons of injury logs.",
        metrics: ["Acute:Chronic Workload Ratio (ACWR)", "Hamstring Strain Probability Score", "Recovery Deficit Index"],
        key_technologies: ["Bayesian Hazard Estimation", "Ensemble Random Forests", "Electronic Health Record (EHR) Ingestion"]
      },
      {
        component_name: "Biomechanical Wearables & Risk Trend Modeling",
        description: "Accepts multi-axis joint angle sensors, smart-insole ground reaction forces (GRF), and range-of-motion (ROM) deficits to simulate cumulative soft-tissue injury risk trends over consecutive game snaps.",
        technical_specs: "Multi-sensor fusion combining 100Hz IMUs (knee valgus/flexion), insole capacitive force arrays (up to 6.5x BW), and dynamic goniometer ROM tracking.",
        metrics: ["Frontal Knee Valgus Angle (< 10° safe)", "Ground Reaction Force (BW)", "Hamstring ROM Deficit %", "Cumulative Snap Failure Hazard"],
        key_technologies: ["Insole Force Array Sensors", "Tri-axial IMU Joint Goniometry", "Fatigue Compounding Trend Predictor"]
      }
    ]
  },
  {
    id: "doc_002",
    topic: "Radio Frequency Identification (RFID)",
    category: "Hardware / Sensor Technology",
    summary: "RFID is a wireless technology used to identify and track objects using radio waves, relying on RFID tags and RFID readers.",
    hardware_layer: "Active/Passive Ultra-Wideband (UWB) & UHF RFID tags embedded in shoulder pads and game balls; 20-30 stadium mast receivers",
    algorithmic_core: "Time Difference of Arrival (TDOA) multilateration, Friis transmission propagation physics, Kalman signal filtering",
    impact_metric: "Real-time positional accuracy within 10-15 cm at 20 updates per second across all 22 players and the football",
    system_components: [
      {
        component_name: "The Tag",
        description: "Contains a microchip with unique information and an antenna. Passive tags remain dormant until within range of a reader.",
        technical_specs: "Coin-sized footprint (3.5g), dual-tag redundancy inside shoulder pads, battery-assisted active/passive chirps at 20Hz, IP67 ruggedized against 150g impacts.",
        metrics: ["Transmit Power: -14 dBm", "Beacon Interval: 50ms (20Hz)", "Weight: 3.8 grams"],
        key_technologies: ["ASIC Microchip", "Miniaturized Printed Antenna", "Shock-absorbent Resin Housing"]
      },
      {
        component_name: "The Reader",
        description: "Constantly broadcasts radio frequency signals through an antenna, creating a radio field.",
        technical_specs: "PoE-powered stadium receivers mounted along catwalks and stadium bowls, directional patch antennas with 65° beamwidth, synchronised down to 100 picoseconds via PTP.",
        metrics: ["Receiver Sensitivity: -95 dBm", "Operating Band: 3.5 GHz - 6.5 GHz UWB / 915 MHz UHF", "Sampling Rate: 20Hz continuous"],
        key_technologies: ["Phased Array Antennas", "Precision Time Protocol (IEEE 1588)", "RF Front-End Amplifiers"]
      },
      {
        component_name: "Communication",
        description: "Energy from the reader signal powers passive tags upon entry, which transmit stored identification data back to the reader.",
        technical_specs: "Backscatter modulation in passive modes; deterministic ultra-wideband pulse bursts in active modes to mitigate multi-path stadium reflection.",
        metrics: ["Packet Transmission Latency: < 12ms", "Signal-to-Noise Ratio (SNR): > 18dB", "Packet Error Rate: < 0.05%"],
        key_technologies: ["Pulse Radio Modulation", "Direct Sequence Spread Spectrum", "Multi-path Rejection Filtering"]
      },
      {
        component_name: "Data Processing",
        description: "The reader captures signals and sends information to software systems to log real-time location or status.",
        technical_specs: "Edge stadium compute clusters process raw timestamp differences, performing multilateration algorithms and pushing normalized X/Y coordinates to the cloud via gRPC/Kafka.",
        metrics: ["Multilateration Compute Time: 4.2ms", "Position Jitter: ± 6 cm", "Throughput: 440 packets/sec per play"],
        key_technologies: ["TDOA Multilateration Engine", "Extended Kalman Filters (EKF)", "Apache Kafka Edge Broker"]
      }
    ]
  },
  {
    id: "doc_003",
    topic: "AI Handling Adverse Weather Conditions",
    category: "Computer Vision / Sensor Fusion",
    summary: "Detecting players in rainy or adverse weather relies on combining Computer Vision with physical tracking technologies.",
    hardware_layer: "Synchronized dual-spectrum 4K cameras (optical + infrared) + 20Hz RFID radio tracking network",
    algorithmic_core: "Deep Residual Rain Removal Networks (PReNet / DeRainNet), Sensor Fusion via Unscented Kalman Filtering (UKF)",
    impact_metric: "Maintains 99.4% player tracking continuity during heavy downpours (>25 mm/h rain) where pure video drops to 71%",
    system_components: [
      {
        component_name: "Sensor Fusion (RFID & Video)",
        description: "Combines video with embedded RFID tags in equipment, providing location data unaffected by rain, drizzle, or overcast skies.",
        technical_specs: "Unscented Kalman Filter fusing high-accuracy RF X/Y coordinates (robust to precipitation) with rich visual bounding boxes (depth, orientation, pose).",
        metrics: ["Fusion Reliability: 99.8%", "Occlusion Recovery: 0.1s", "Sensor Discrepancy Gate: < 0.5m"],
        key_technologies: ["Unscented Kalman Filter (UKF)", "Probabilistic Data Association", "Bimodal Sensor Calibration"]
      },
      {
        component_name: "Image De-raining Models",
        description: "AI algorithms use de-raining networks to filter visual noise caused by rain droplets and spray, cleaning images before detection.",
        technical_specs: "Convolutional neural network decomposing input frame into background clear layer and rain streak residue layer using contextual dilated convolutions.",
        metrics: ["Peak SNR Improvement: +8.4 dB", "SSIM Metric: 0.942", "Inference Latency: 14ms per frame on TensorRT"],
        key_technologies: ["Progressive Recurrent Network (PReNet)", "ResNet Dilated Layers", "Perceptual Loss Optimization"]
      },
      {
        component_name: "Feature Extraction",
        description: "Models focus on high-level patterns such as skeletal tracking and core/extremities movement rather than color or texture.",
        technical_specs: "Geometric invariant feature extractors resilient to jersey saturation, mud splatters, and lens moisture artifacts.",
        metrics: ["Keypoint Confidence Retention: 91.2%", "Jersey Number OCR Resilience: 88.5%", "Edge Gradient Robustness: 94%"],
        key_technologies: ["Feature Pyramid Networks (FPN)", "Spatial Attention Modules", "Contrastive Learning Representations"]
      },
      {
        component_name: "Temporal Tracking",
        description: "Tracks objects across consecutive video frames to maintain target lock despite degraded image quality.",
        technical_specs: "ByteTrack and DeepSORT integration with visual embedding caches and motion prediction to bridge multi-frame optical dropouts.",
        metrics: ["Track Switch Rate: < 0.12 per minute", "Max Occlusion Gap Tolerance: 45 frames (1.5s)", "Identity Retention: 98.7%"],
        key_technologies: ["DeepSORT / ByteTrack", "Hungarian Linear Assignment", "Recurrent Trajectory Predictor"]
      }
    ]
  },
  {
    id: "doc_004",
    topic: "AI Coaching Assistant Pipeline",
    category: "Computer Vision / Tactical Analytics",
    summary: "Converts raw broadcast or aerial video into structured datasets tracking player movement, positioning, and tactical execution.",
    hardware_layer: "All-22 All-Angle Stadium Fixed Lenses (50mm & 35mm), On-premise Edge GPU Servers (Dual NVIDIA H100s)",
    algorithmic_core: "YOLOv10 Real-time Object Detection, Planar Homography Warping, Graph Neural Networks (GNN) for Scheme Classification",
    impact_metric: "Delivers defensive coverage classification and playbook counter-recommendations within 1.8 seconds of play whistle",
    system_components: [
      {
        component_name: "Data Acquisition & Player Detection",
        description: "Uses YOLO architectures to detect players in every frame and maps jersey numbers/colors to assign unique IDs.",
        technical_specs: "Fine-tuned YOLOv10/YOLOv11 detecting player bounding boxes, referees, and football at 120fps; optical character recognition for jersey numbers.",
        metrics: ["Detection mAP@50: 97.4%", "Jersey Number OCR Precision: 94.8%", "Processing FPS: 110 FPS on GPU"],
        key_technologies: ["YOLO Architecture", "CRNN Text Recognition", "Foreground Segmentation"]
      },
      {
        component_name: "Movement & Positional Mapping",
        description: "Translates visual pixels into X, Y coordinate data to calculate player velocity, acceleration, space coverage, and formation recognition.",
        technical_specs: "4-point planar homography calibrated to field yard markers, yard lines, and hash marks, transforming camera pixels (u,v) to field coordinates (x,y in yards).",
        metrics: ["Coordinate Accuracy: ± 0.15 yards", "Instantaneous Velocity Precision: ± 0.2 mph", "Pitch Warping Homography Error: < 0.08%"],
        key_technologies: ["Planar Homography Transform", "Voronoi Space Decomposition", "Convex Hull Spacing Analysis"]
      },
      {
        component_name: "Tactical Analytics & Pattern Recognition",
        description: "Compares movement patterns against historical performance metrics to provide AI coaching recommendations in real time.",
        technical_specs: "Spatial-temporal Graph Neural Network (ST-GNN) classifying offensive play concepts (Mesh, Dagger, Outside Zone) and defensive coverages (Cover 2, Cover 3, Quarters, Zero Blitz).",
        metrics: ["Coverage Classification Accuracy: 93.6%", "Expected Points Added (EPA) Computation: < 300ms", "Open Receiver Separation Delta: Calculated at 20Hz"],
        key_technologies: ["Spatio-Temporal Graph Neural Networks", "Dynamic Time Warping (DTW)", "Rule-based Coaching Engine"]
      }
    ]
  }
];

export interface BiomechanicalWearableData {
  jointAngles: {
    kneeFlexionDeg: number;       // e.g. 38°
    kneeValgusDeg: number;         // e.g. 14.2° (optimal < 10°)
    hipExtensionDeg: number;       // e.g. 18°
    ankleDorsiflexionDeg: number;  // e.g. 24°
    shoulderRotationDeg: number;   // e.g. 82°
  };
  impactForces: {
    peakGroundReactionForceBW: number; // in multiples of Body Weight (BW), e.g. 4.6x BW
    decelerationImpulseNs: number;     // Newton-seconds, e.g. 840 N*s
    impactCollisionG: number;          // G-force from smart mouthguard / helmet sensor, e.g. 24.2g
    limbAsymmetryPct: number;          // % difference between L and R limb loading, >10% is danger
  };
  rangeOfMotion: {
    activeKneeFlexionArc: number;      // degrees, e.g. 132° (norm 135-145°)
    hipExtensionDeficitPct: number;    // % deficit, e.g. -8.5%
    thoracicRotationDeg: number;       // degrees, e.g. 44°
  };
  detailedRiskAssessment: {
    aclStrainProbability: number;      // 0 - 100%
    hamstringEccentricTearRisk: number;// 0 - 100%
    patellarTendonStress: 'low' | 'moderate' | 'critical';
    primaryRiskFactor: string;
  };
  performanceRecommendations: {
    trainingAdjustment: string;
    inGameAction: string;
    kineticIntervention: string;
  };
}

export interface TacticalPlayer {
  id: number;
  jersey: string;
  name: string;
  role: string;
  team: 'offense' | 'defense';
  x: number; // field yards 0 - 100
  y: number; // field yards 0 - 53.3
  targetX: number;
  targetY: number;
  speed: number; // mph
  accel: number; // m/s^2
  acwr: number; // acute chronic ratio
  fatigueIndex: number; // 0 - 100
  rfidSignalDb: number; // -45 to -90 dBm
  detectionConfidence: number; // 0.80 - 0.99
  injuryRiskScore: 'low' | 'moderate' | 'high';
  poseRiskFlag?: string;
  biomechanics?: BiomechanicalWearableData;
}

export const INITIAL_FIELD_PLAYERS: TacticalPlayer[] = [
  // Offense
  {
    id: 1, jersey: "15", name: "P. Mahomes", role: "QB", team: "offense", x: 28, y: 26.6, targetX: 25, targetY: 26.6, speed: 7.2, accel: -1.8, acwr: 1.08, fatigueIndex: 32, rfidSignalDb: -62, detectionConfidence: 0.99, injuryRiskScore: 'low',
    biomechanics: {
      jointAngles: { kneeFlexionDeg: 42, kneeValgusDeg: 6.8, hipExtensionDeg: 22, ankleDorsiflexionDeg: 26, shoulderRotationDeg: 96 },
      impactForces: { peakGroundReactionForceBW: 2.8, decelerationImpulseNs: 420, impactCollisionG: 4.2, limbAsymmetryPct: 4.1 },
      rangeOfMotion: { activeKneeFlexionArc: 140, hipExtensionDeficitPct: -2.1, thoracicRotationDeg: 54 },
      detailedRiskAssessment: { aclStrainProbability: 8, hamstringEccentricTearRisk: 12, patellarTendonStress: 'low', primaryRiskFactor: "Optimal rotational kinetic chain balance" },
      performanceRecommendations: {
        trainingAdjustment: "Maintain rotational thoracic mobility and rotator cuff eccentric deceleration routine.",
        inGameAction: "Full snap clearance; pocket mechanics and ground reaction force transfer optimal.",
        kineticIntervention: "Post-game shoulder passive internal rotation stretch + contrast recovery."
      }
    }
  },
  {
    id: 2, jersey: "10", name: "I. Pacheco", role: "RB", team: "offense", x: 26, y: 29.5, targetX: 38, targetY: 34.0, speed: 17.4, accel: 3.8, acwr: 1.42, fatigueIndex: 68, rfidSignalDb: -64, detectionConfidence: 0.97, injuryRiskScore: 'moderate', poseRiskFlag: "Hamstring stretch at 84% peak threshold",
    biomechanics: {
      jointAngles: { kneeFlexionDeg: 48, kneeValgusDeg: 11.4, hipExtensionDeg: 16, ankleDorsiflexionDeg: 20, shoulderRotationDeg: 74 },
      impactForces: { peakGroundReactionForceBW: 4.9, decelerationImpulseNs: 890, impactCollisionG: 22.8, limbAsymmetryPct: 9.8 },
      rangeOfMotion: { activeKneeFlexionArc: 131, hipExtensionDeficitPct: -9.4, thoracicRotationDeg: 40 },
      detailedRiskAssessment: { aclStrainProbability: 34, hamstringEccentricTearRisk: 62, patellarTendonStress: 'moderate', primaryRiskFactor: "High ground contact impulse and eccentric hamstring stretch" },
      performanceRecommendations: {
        trainingAdjustment: "Introduce eccentric Nordic curls at 3x6 reps; soft tissue foam roll on left biceps femoris.",
        inGameAction: "Rotate touches; avoid more than 4 consecutive downhill zone carries without a 2-play breath.",
        kineticIntervention: "Gluteus maximus activation bridge before second half re-entry."
      }
    }
  },
  {
    id: 3, jersey: "87", name: "T. Kelce", role: "TE", team: "offense", x: 33, y: 31.0, targetX: 42, targetY: 28.5, speed: 14.1, accel: 2.1, acwr: 1.15, fatigueIndex: 54, rfidSignalDb: -58, detectionConfidence: 0.98, injuryRiskScore: 'low',
    biomechanics: {
      jointAngles: { kneeFlexionDeg: 44, kneeValgusDeg: 8.2, hipExtensionDeg: 20, ankleDorsiflexionDeg: 24, shoulderRotationDeg: 86 },
      impactForces: { peakGroundReactionForceBW: 3.7, decelerationImpulseNs: 650, impactCollisionG: 16.4, limbAsymmetryPct: 5.6 },
      rangeOfMotion: { activeKneeFlexionArc: 138, hipExtensionDeficitPct: -3.8, thoracicRotationDeg: 48 },
      detailedRiskAssessment: { aclStrainProbability: 14, hamstringEccentricTearRisk: 19, patellarTendonStress: 'low', primaryRiskFactor: "Stable joint kinematics with balanced bilateral loading" },
      performanceRecommendations: {
        trainingAdjustment: "Low-impact plyometric maintenance and ankle joint mobilizations.",
        inGameAction: "Full play availability; route leverage separation metrics consistent with baseline.",
        kineticIntervention: "Thoracic spine extension rollers during sideline bench intervals."
      }
    }
  },
  {
    id: 4, jersey: "4", name: "R. Rice", role: "WR", team: "offense", x: 33, y: 12.0, targetX: 52, targetY: 10.0, speed: 19.8, accel: -4.6, acwr: 1.54, fatigueIndex: 79, rfidSignalDb: -70, detectionConfidence: 0.95, injuryRiskScore: 'high', poseRiskFlag: "Knee valgus angle 14.2° on hard plant cut",
    biomechanics: {
      jointAngles: { kneeFlexionDeg: 28, kneeValgusDeg: 14.8, hipExtensionDeg: 12, ankleDorsiflexionDeg: 15, shoulderRotationDeg: 70 },
      impactForces: { peakGroundReactionForceBW: 5.4, decelerationImpulseNs: 980, impactCollisionG: 18.2, limbAsymmetryPct: 14.6 },
      rangeOfMotion: { activeKneeFlexionArc: 124, hipExtensionDeficitPct: -14.2, thoracicRotationDeg: 36 },
      detailedRiskAssessment: { aclStrainProbability: 78, hamstringEccentricTearRisk: 84, patellarTendonStress: 'critical', primaryRiskFactor: "Dynamic knee valgus collapse + acute deceleration shear force" },
      performanceRecommendations: {
        trainingAdjustment: "Immediate neuromuscular retraining: hip abductor glute medius loading, deceleration drop-landing mechanics.",
        inGameAction: "CRITICAL: Pull from next 4 snaps. Peak deceleration strain exceeds safety threshold by 28%.",
        kineticIntervention: "Lateral band walks + bilateral hip hinge drill before returning to field."
      }
    }
  },
  {
    id: 5, jersey: "84", name: "J. Watson", role: "WR", team: "offense", x: 33, y: 44.0, targetX: 58, targetY: 42.0, speed: 18.9, accel: 2.9, acwr: 1.22, fatigueIndex: 59, rfidSignalDb: -68, detectionConfidence: 0.96, injuryRiskScore: 'low',
    biomechanics: {
      jointAngles: { kneeFlexionDeg: 40, kneeValgusDeg: 7.9, hipExtensionDeg: 19, ankleDorsiflexionDeg: 23, shoulderRotationDeg: 80 },
      impactForces: { peakGroundReactionForceBW: 4.1, decelerationImpulseNs: 690, impactCollisionG: 12.1, limbAsymmetryPct: 6.2 },
      rangeOfMotion: { activeKneeFlexionArc: 137, hipExtensionDeficitPct: -4.5, thoracicRotationDeg: 46 },
      detailedRiskAssessment: { aclStrainProbability: 16, hamstringEccentricTearRisk: 22, patellarTendonStress: 'low', primaryRiskFactor: "Kinematic alignment within safe thresholds" },
      performanceRecommendations: {
        trainingAdjustment: "Sprint cadence drills and hamstring length-tension curve tuning.",
        inGameAction: "Full availability on deep clear-out routes.",
        kineticIntervention: "Dynamic calf stretches on sideline slant board."
      }
    }
  },
  { id: 6, jersey: "74", name: "J. Taylor", role: "OT", team: "offense", x: 32.5, y: 21.0, targetX: 31.5, targetY: 20.5, speed: 5.1, accel: 1.2, acwr: 1.12, fatigueIndex: 48, rfidSignalDb: -61, detectionConfidence: 0.98, injuryRiskScore: 'low' },
  { id: 7, jersey: "65", name: "T. Smith", role: "OG", team: "offense", x: 32.5, y: 24.0, targetX: 31.8, targetY: 24.0, speed: 4.8, accel: 1.4, acwr: 1.19, fatigueIndex: 51, rfidSignalDb: -63, detectionConfidence: 0.97, injuryRiskScore: 'low' },
  { id: 8, jersey: "52", name: "C. Humphrey", role: "C", team: "offense", x: 33.0, y: 26.6, targetX: 32.2, targetY: 26.6, speed: 4.2, accel: 0.9, acwr: 1.05, fatigueIndex: 44, rfidSignalDb: -60, detectionConfidence: 0.99, injuryRiskScore: 'low' },
  { id: 9, jersey: "69", name: "M. Caliendo", role: "OG", team: "offense", x: 32.5, y: 29.0, targetX: 31.9, targetY: 29.0, speed: 4.7, accel: 1.1, acwr: 1.14, fatigueIndex: 49, rfidSignalDb: -62, detectionConfidence: 0.97, injuryRiskScore: 'low' },
  { id: 10, jersey: "79", name: "D. Smith", role: "OT", team: "offense", x: 32.5, y: 32.5, targetX: 31.4, targetY: 33.0, speed: 5.3, accel: 1.5, acwr: 1.20, fatigueIndex: 52, rfidSignalDb: -64, detectionConfidence: 0.96, injuryRiskScore: 'low' },
  { id: 11, jersey: "11", name: "M. Valdes", role: "WR", team: "offense", x: 33.0, y: 4.0, targetX: 62, targetY: 6.0, speed: 20.6, accel: 3.4, acwr: 1.31, fatigueIndex: 61, rfidSignalDb: -74, detectionConfidence: 0.94, injuryRiskScore: 'moderate' },

  // Defense
  { id: 12, jersey: "95", name: "C. Jones", role: "DT", team: "defense", x: 34.5, y: 25.0, targetX: 32.0, targetY: 26.0, speed: 7.8, accel: 3.2, acwr: 1.25, fatigueIndex: 58, rfidSignalDb: -59, detectionConfidence: 0.99, injuryRiskScore: 'low' },
  { id: 13, jersey: "91", name: "D. Nnadi", role: "DT", team: "defense", x: 34.5, y: 28.0, targetX: 32.5, targetY: 27.5, speed: 6.2, accel: 2.8, acwr: 1.18, fatigueIndex: 55, rfidSignalDb: -61, detectionConfidence: 0.98, injuryRiskScore: 'low' },
  {
    id: 14, jersey: "56", name: "G. Karlaftis", role: "DE", team: "defense", x: 34.0, y: 19.5, targetX: 29.0, targetY: 22.0, speed: 9.4, accel: 4.1, acwr: 1.48, fatigueIndex: 72, rfidSignalDb: -63, detectionConfidence: 0.97, injuryRiskScore: 'moderate', poseRiskFlag: "Repeated high contact torque on right shoulder",
    biomechanics: {
      jointAngles: { kneeFlexionDeg: 46, kneeValgusDeg: 9.6, hipExtensionDeg: 15, ankleDorsiflexionDeg: 19, shoulderRotationDeg: 104 },
      impactForces: { peakGroundReactionForceBW: 4.8, decelerationImpulseNs: 810, impactCollisionG: 26.4, limbAsymmetryPct: 11.2 },
      rangeOfMotion: { activeKneeFlexionArc: 130, hipExtensionDeficitPct: -7.8, thoracicRotationDeg: 38 },
      detailedRiskAssessment: { aclStrainProbability: 28, hamstringEccentricTearRisk: 39, patellarTendonStress: 'moderate', primaryRiskFactor: "High cumulative acromioclavicular and labral contact torque" },
      performanceRecommendations: {
        trainingAdjustment: "Rotator cuff eccentric stabilization; monitor bull-rush collision counts.",
        inGameAction: "Limit to passing-down edge rush packages in 4th quarter.",
        kineticIntervention: "Scapular retraction isometrics between defensive series."
      }
    }
  },
  { id: 15, jersey: "51", name: "M. Danna", role: "DE", team: "defense", x: 34.0, y: 34.0, targetX: 29.5, targetY: 31.0, speed: 8.9, accel: 3.7, acwr: 1.21, fatigueIndex: 60, rfidSignalDb: -65, detectionConfidence: 0.96, injuryRiskScore: 'low' },
  { id: 16, jersey: "32", name: "N. Bolton", role: "MLB", team: "defense", x: 38.5, y: 26.6, targetX: 36.0, targetY: 29.0, speed: 11.5, accel: 2.6, acwr: 1.16, fatigueIndex: 50, rfidSignalDb: -62, detectionConfidence: 0.98, injuryRiskScore: 'low' },
  { id: 17, jersey: "23", name: "D. Tranquill", role: "WLB", team: "defense", x: 38.0, y: 20.0, targetX: 37.0, targetY: 16.0, speed: 12.2, accel: 2.9, acwr: 1.23, fatigueIndex: 53, rfidSignalDb: -64, detectionConfidence: 0.97, injuryRiskScore: 'low' },
  { id: 18, jersey: "54", name: "L. Chenal", role: "SLB", team: "defense", x: 38.0, y: 33.0, targetX: 39.0, targetY: 35.0, speed: 10.8, accel: 2.2, acwr: 1.12, fatigueIndex: 47, rfidSignalDb: -66, detectionConfidence: 0.97, injuryRiskScore: 'low' },
  { id: 19, jersey: "22", name: "T. McDuffie", role: "CB", team: "defense", x: 40.0, y: 12.0, targetX: 50.0, targetY: 10.5, speed: 18.5, accel: -3.9, acwr: 1.34, fatigueIndex: 65, rfidSignalDb: -69, detectionConfidence: 0.95, injuryRiskScore: 'low' },
  { id: 20, jersey: "35", name: "J. Watson", role: "CB", team: "defense", x: 41.0, y: 44.0, targetX: 56.0, targetY: 42.5, speed: 18.1, accel: 3.1, acwr: 1.29, fatigueIndex: 63, rfidSignalDb: -71, detectionConfidence: 0.95, injuryRiskScore: 'low' },
  { id: 21, jersey: "20", name: "J. Reid", role: "SS", team: "defense", x: 44.0, y: 22.0, targetX: 43.0, targetY: 26.0, speed: 13.9, accel: 2.4, acwr: 1.19, fatigueIndex: 52, rfidSignalDb: -65, detectionConfidence: 0.96, injuryRiskScore: 'low' },
  { id: 22, jersey: "6", name: "B. Cook", role: "FS", team: "defense", x: 50.0, y: 30.0, targetX: 52.0, targetY: 25.0, speed: 15.2, accel: 2.7, acwr: 1.27, fatigueIndex: 57, rfidSignalDb: -72, detectionConfidence: 0.94, injuryRiskScore: 'low' },
];

