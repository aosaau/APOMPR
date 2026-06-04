export interface OpalData {
  id: number;
  name: string;
  mk_ppg: number;
  mk_ppc_cut: number | null;
  mk_rough_total: number;
  mk_cut_total: number | null;
  mk_grade: number;
  mr_offer: number | null;
  mr_ppg_implied: number;
  mr_grade: number;
  wg: number;
  ct: number;
  brightness: string;
  bodyTone: string;
  pattern: string;
  treatmentQuality: string;
  stabilityRisk: string;
  nft: boolean;
  img: string;
}

export const opalsData: OpalData[] = [
  { id: 1, name: "Low Grade Soft Matrix", mk_ppg: 0.30, mk_ppc_cut: 1.50, mk_rough_total: 9.24, mk_cut_total: 231.00, mk_grade: 2, mr_offer: 0.62, mr_ppg_implied: 0.02, mr_grade: 1, wg: 30.8, ct: 154, brightness: "B6", bodyTone: "N7", pattern: "Pinfire", treatmentQuality: "Poor", stabilityRisk: "High", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/LM2_nkylci.jpg" },
  { id: 2, name: "High Saturation Matrix", mk_ppg: 3.00, mk_ppc_cut: null, mk_rough_total: 77.40, mk_cut_total: null, mk_grade: 4, mr_offer: null, mr_ppg_implied: 2.50, mr_grade: 3, wg: 25.8, ct: 129, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417215/High-Saturation-Matrix_qlhpzg.png" },
  { id: 3, name: "Low Grade Colour Concrete Treated", mk_ppg: 0.075, mk_ppc_cut: 0.38, mk_rough_total: 0.90, mk_cut_total: 22.88, mk_grade: 1, mr_offer: 0.24, mr_ppg_implied: 0.02, mr_grade: 1, wg: 12.04, ct: 60.2, brightness: "B7", bodyTone: "N8", pattern: "Pinfire", treatmentQuality: "Poor", stabilityRisk: "High", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417216/Low-grade-concrete_vtfa2n.png" },
  { id: 4, name: "Low Grade Matrix", mk_ppg: 1.00, mk_ppc_cut: 7.50, mk_rough_total: 13.58, mk_cut_total: 509.25, mk_grade: 3, mr_offer: 20.00, mr_ppg_implied: 1.47, mr_grade: 2, wg: 13.58, ct: 67.9, brightness: "B6", bodyTone: "N7", pattern: "Pinfire", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417215/Quartzy_mqk0oa.png" },
  { id: 5, name: "High Grade Colour Concrete Treated", mk_ppg: .75, mk_ppc_cut: 7.50, mk_rough_total: 21.51, mk_cut_total: 1072.50, mk_grade: 5, mr_offer: 0.57, mr_ppg_implied: 0.02, mr_grade: 1, wg: 28.60, ct: 143, brightness: "B3", bodyTone: "N4", pattern: "Flash", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417214/Concrete1_vuyjxo.png" },
  { id: 6, name: "Mid Grade Hard Matrix", mk_ppg: 2.50, mk_ppc_cut: 20.00, mk_rough_total: 27.73, mk_cut_total: 1109.00, mk_grade: 4, mr_offer: 500.00, mr_ppg_implied: 45.09, mr_grade: 6, wg: 11.09, ct: 55.45, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417215/Mid-Grade-Hard_xtt52q.png" },
  { id: 7, name: "Mid Grade High Colour Matrix", mk_ppg: 3.00, mk_ppc_cut: 30.00, mk_rough_total: 17.22, mk_cut_total: 861.00, mk_grade: 5, mr_offer: 600.00, mr_ppg_implied: 104.53, mr_grade: 7, wg: 5.74, ct: 28.7, brightness: "B3", bodyTone: "N4", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777183367/IMG_4822_jhvoa0.jpg" },
  { id: 8, name: "High Grade Hard Matrix Treated", mk_ppg: 4.00, mk_ppc_cut: 45.00, mk_rough_total: 157.44, mk_cut_total: 8856.90, mk_grade: 6, mr_offer: 900.00, mr_ppg_implied: 22.86, mr_grade: 5, wg: 39.36, ct: 196.82, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777183367/IMG_4822_jhvoa0.jpg" },
  { id: 9, name: "High Grade Hard Matrix Untreated", mk_ppg: 5.00, mk_ppc_cut: 100.00, mk_rough_total: 920.00, mk_cut_total: 92000.00, mk_grade: 8, mr_offer: 500.00, mr_ppg_implied: 2.72, mr_grade: 3, wg: 184, ct: 920, brightness: "B1", bodyTone: "N1", pattern: "Harlequin", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417214/High-Grade-A-Matrix_aobrfu.png" },
  { id: 10, name: "Mid Grade Colour Concrete Treated", mk_ppg: 0.20, mk_ppc_cut: 0.75, mk_rough_total: 2.97, mk_cut_total: 55.61, mk_grade: 2, mr_offer: 0.30, mr_ppg_implied: 0.02, mr_grade: 1, wg: 14.83, ct: 74.15, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417215/Mid-grade-concrete_ifu7gk.png" },
  { id: 11, name: "High Grade Hard Matrix Small", mk_ppg: 3.50, mk_ppc_cut: 45.00, mk_rough_total: 20.65, mk_cut_total: 1327.50, mk_grade: 7, mr_offer: 700.00, mr_ppg_implied: 118.64, mr_grade: 8, wg: 5.9, ct: 29.5, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417214/High-Grade_Matrix_mrcg9t.png" },
  { id: 12, name: "High Grade Hard Matrix Large", mk_ppg: 3.50, mk_ppc_cut: 45.00, mk_rough_total: 179.45, mk_cut_total: 11535.75, mk_grade: 7, mr_offer: 300.00, mr_ppg_implied: 5.85, mr_grade: 4, wg: 51.27, ct: 256.35, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417214/High-Grade-A-Matrix_aobrfu.png" },
  { id: 13, name: "Highest Grade Gem Hard Matrix Treated", mk_ppg: 10.00, mk_ppc_cut: null, mk_rough_total: 25.30, mk_cut_total: 1265.00, mk_grade: 9, mr_offer: 1200.00, mr_ppg_implied: 474.11, mr_grade: 9, wg: 2.53, ct: 12.65, brightness: "B1", bodyTone: "N1", pattern: "Harlequin", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1778417214/A_ckwrav.png" }
];
