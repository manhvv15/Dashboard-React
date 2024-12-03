import { useState } from 'react';

import { Tooltip } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import SvgIcon from './SvgIcon';

interface Props {
  code: string;
  className?: string;
  successMessage?: string;
}

export default function CopyToClipboard({ code, className = 'z-[9999999]', successMessage }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);

  const [isCopied, setIsCopied] = useState(false);

  const clipBoard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code);
    } else {
      const textArea = document.createElement('input');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Tooltip content={isCopied ? successMessage || t('copied') : t('copy')}>
      <button className={className} onClick={clipBoard}>
        <SvgIcon icon="coppy-icon" width={16} height={16} />
      </button>
    </Tooltip>
  );
}
