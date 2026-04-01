export interface Product {
  id: number;
  brand: string;
  name: string;
  category: string;
  price: number;
  image: string;
  textureVideo?: string;
  description: string;
  ingredients: string;
  options?: { size: string; price: number }[];
  idealFor?: { skinType: string[]; concern: string[] }[];
  reviews: { author: string; title: string; content: string; rating: number; date: string }[];
}


import { brandDrRejuAllProducts } from './brands/dr-reju-all';
import { brandKracieIchikamiProducts } from './brands/kracie-ichikami';
import { brandJoocyeeProducts } from './brands/joocyee';
import { brandJudydollProducts } from './brands/judydoll';
import { brandLululunProducts } from './brands/lululun';
import { brandMedicubeProducts } from './brands/medicube';
import { brandSNatureProducts } from './brands/s-nature';
import { brandDAlbaProducts } from './brands/d-alba';
import { brandCosrxProducts } from './brands/cosrx';
import { brandSkin1004Products } from './brands/skin1004';
import { brandIlsoProducts } from './brands/ilso';
import { brandJmellaProducts } from './brands/jmella';
import { brandCowBrandProducts } from './brands/cow-brand';
import { brandIsntreeProducts } from './brands/isntree';
import { brandWasosenProducts } from './brands/wasosen';
import { brandAnuaProducts } from './brands/anua';
import { brandVtCosmeticsProducts } from './brands/vt-cosmetics';
import { brandUnoveProducts } from './brands/unove';
import { brandTirtirProducts } from './brands/tirtir';
import { brandJmSolutionProducts } from './brands/jm-solution';
import { brandPuritoProducts } from './brands/purito';
import { brandMeditherapyProducts } from './brands/meditherapy';
import { brandAshiriraProducts } from './brands/ashirira';
import { brandBiodanceProducts } from './brands/biodance';
import { brandHoneyProducts } from './brands/honey';
import { brandNumbuzinProducts } from './brands/numbuzin';
import { brandPuredermProducts } from './brands/purederm';
import { brandNuseProducts } from './brands/nuse';
import { brandTorridenProducts } from './brands/torriden';
import { brandMedihealProducts } from './brands/mediheal';
import { brandWDressroomProducts } from './brands/w-dressroom';
import { brandFarmstayProducts } from './brands/farmstay';
import { brandIlliyoonProducts } from './brands/illiyoon';
import { brandRosyRosaProducts } from './brands/rosy-rosa';
import { brandLaneigeProducts } from './brands/laneige';
import { brandSungboonEditorProducts } from './brands/sungboon-editor';
import { brandDrGProducts } from './brands/dr-g';
import { brandAbibProducts } from './brands/abib';
import { brandFweeProducts } from './brands/fwee';
import { brandDrAltheaProducts } from './brands/dr-althea';
import { brandMediFlowerProducts } from './brands/medi-flower';
import { brandSulwhasooProducts } from './brands/sulwhasoo';
import { brandMixsoonProducts } from './brands/mixsoon';
import { brandMedipeelProducts } from './brands/medipeel';
import { brandAxisYProducts } from './brands/axis-y';
import { brandCelimaxProducts } from './brands/celimax';
import { brandIMFromProducts } from './brands/i-m-from';
import { brandTocoboProducts } from './brands/tocobo';
import { brandKundalProducts } from './brands/kundal';
import { brandHaruharuWonderProducts } from './brands/haruharu-wonder';
import { brandCureProducts } from './brands/cure';
import { brandEqqualberryProducts } from './brands/eqqualberry';
import { brandItsSkinProducts } from './brands/its-skin';
import { brandPeriperaProducts } from './brands/peripera';
import { brandCurLProducts } from './brands/cur-l';
import { brandIpsaProducts } from './brands/ipsa';
import { brandBclProducts } from './brands/bcl';
import { brandOffRelaxProducts } from './brands/off-relax';
import { brandKissmeProducts } from './brands/kissme';
import { brandKaoProducts } from './brands/kao';
import { brandIzezeProducts } from './brands/izeze';
import { brandVillage11FactoryProducts } from './brands/village-11-factory';
import { brandMizonProducts } from './brands/mizon';
import { brandIshizawaProducts } from './brands/ishizawa';
import { brandHeimishProducts } from './brands/heimish';
import { brandAriulProducts } from './brands/ariul';
import { brandSkinfoodProducts } from './brands/skinfood';
import { kiyokoExtrasProducts } from './brands/kiyoko-extras';
import { kiyokoAllNewProducts } from './brands/kiyoko-all-new';

const allProducts: Product[] = [
  ...brandDrRejuAllProducts,
  ...brandKracieIchikamiProducts,
  ...brandJoocyeeProducts,
  ...brandJudydollProducts,
  ...brandLululunProducts,
  ...brandMedicubeProducts,
  ...brandSNatureProducts,
  ...brandDAlbaProducts,
  ...brandCosrxProducts,
  ...brandSkin1004Products,
  ...brandIlsoProducts,
  ...brandJmellaProducts,
  ...brandCowBrandProducts,
  ...brandIsntreeProducts,
  ...brandWasosenProducts,
  ...brandAnuaProducts,
  ...brandVtCosmeticsProducts,
  ...brandUnoveProducts,
  ...brandTirtirProducts,
  ...brandJmSolutionProducts,
  ...brandPuritoProducts,
  ...brandMeditherapyProducts,
  ...brandAshiriraProducts,
  ...brandBiodanceProducts,
  ...brandHoneyProducts,
  ...brandNumbuzinProducts,
  ...brandPuredermProducts,
  ...brandNuseProducts,
  ...brandTorridenProducts,
  ...brandMedihealProducts,
  ...brandWDressroomProducts,
  ...brandFarmstayProducts,
  ...brandIlliyoonProducts,
  ...brandRosyRosaProducts,
  ...brandLaneigeProducts,
  ...brandSungboonEditorProducts,
  ...brandDrGProducts,
  ...brandAbibProducts,
  ...brandFweeProducts,
  ...brandDrAltheaProducts,
  ...brandMediFlowerProducts,
  ...brandSulwhasooProducts,
  ...brandMixsoonProducts,
  ...brandMedipeelProducts,
  ...brandAxisYProducts,
  ...brandCelimaxProducts,
  ...brandIMFromProducts,
  ...brandTocoboProducts,
  ...brandKundalProducts,
  ...brandHaruharuWonderProducts,
  ...brandCureProducts,
  ...brandEqqualberryProducts,
  ...brandItsSkinProducts,
  ...brandPeriperaProducts,
  ...brandCurLProducts,
  ...brandIpsaProducts,
  ...brandBclProducts,
  ...brandOffRelaxProducts,
  ...brandKissmeProducts,
  ...brandKaoProducts,
  ...brandIzezeProducts,
  ...brandVillage11FactoryProducts,
  ...brandMizonProducts,
  ...brandIshizawaProducts,
  ...brandHeimishProducts,
  ...brandAriulProducts,
  ...brandSkinfoodProducts,
  ...kiyokoExtrasProducts,
  ...kiyokoAllNewProducts
];

export const products: Product[] = allProducts;

