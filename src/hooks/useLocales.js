import { useTranslation } from 'react-i18next';
// material
import { enUS } from '@mui/material/locale';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    label: 'Myanmar',
    value: 'mm',
    systemValue: enUS,
    icon: '/assets/icons/ic_flag_mm.svg',
  },
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

  const handleChangeLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS,
  };
}
