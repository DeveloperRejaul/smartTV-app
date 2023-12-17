import { useSelector } from 'react-redux';
import { prayerNavigation } from '../../constants/constants';
import Azan from '../azan/Azan';
import AzanCountdown from '../azanCountdown/AzanCountdown';
import IqomahCountdown from '../iqomahCountdown/IqomahCountdown';
import Iqomah from '../Iqomah/Iqomah';
import Khutbha from '../khutbah/khutbha';
import PepperingSalat from '../pepperingSalat/PepperingSalat';
import Salat from '../salat/Salat';

const component = {
  [prayerNavigation.AZAN_COUNTDOWN]: <AzanCountdown />,
  [prayerNavigation.AZAN]: <Azan />,
  [prayerNavigation.IQOMAH_COUNTDOWN]: <IqomahCountdown />,
  [prayerNavigation.IQOMAH]: <Iqomah />,
  [prayerNavigation.KHOTBAH]: <Khutbha />,
  [prayerNavigation.SALAT_PREPARE]: <PepperingSalat />,
  [prayerNavigation.SALAT]: <Salat />,
};

export default function RootPrayer() {
  const prayer = useSelector((state) => state.navigation.prayer);

  return component[prayer];
}
