import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';

export const Brand = () => (
  <div className="pv-brand">
    <div className="pv-lbox"><Logo/></div>
    <div>
      <div className="pv-ltext">Pedi<em>Vault</em></div>
      <div className="pv-lsub">{t('common.tagline','Child Health Records')}</div>
    </div>
  </div>
);

export default Brand;
