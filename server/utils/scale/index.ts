import MACI from './MACI';
import MACIData from './MACI.data';
import MCMI from './MCMI';
import MCMIData from './MCMI.data';
import MMPIRF from './MMPI-RF';
import MMPIRFData from './MMPI-RF.data';
import TCI from './TCI';
import TCIData from './TCI.data';
import MPQ from './MPQ';
import MPQData from './MPQ.data';
import EPQ from './EPQ';
import EPQData from './EPQ.data';
import EPQR from './EPQ-R';
import EPQRData from './EPQ-R.data';
import JTCI from './JTCI';
import JTCIData from './JTCI.data';
import JEPQ from './JEPQ';
import JEPQData from './JEPQ.data';
import SCL90R from './SCL-90R';
import SCL90RData from './SCL-90R.data';
// import DSMDC from './DSMD-C';
// import DSMDCData from './DSMD-C.data';
// import DSMDA from './DSMD-A';
// import DSMDAData from './DSMD-A.data';
// import LEYTON from './LEYTON';
// import LEYTONData from './LEYTON.data';

const Scales = {
  MCMI, MACI, 'MMPI-RF': MMPIRF, TCI, MPQ, EPQ,
  'EPQ-R': EPQR, JTCI, JEPQ, 'SCL-90R': SCL90R,
  // 'DSMD-C': DSMDC, 'DSMD-A': DSMDA
} as const;
const Data = {
  MCMI: MCMIData, MACI: MACIData, 'MMPI-RF': MMPIRFData, TCI: TCIData,
  MPQ: MPQData, EPQ: EPQData, 'EPQ-R': EPQRData, JTCI: JTCIData, JEPQ: JEPQData, 'SCL-90R': SCL90RData,
  // 'DSMD-C': DSMDCData, 'DSMD-A': DSMDAData
} as const;
type ScaleNames = keyof typeof Scales
export { Scales, Data };
