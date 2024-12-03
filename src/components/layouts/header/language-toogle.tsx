import { Button, Menu, MenuHandler, MenuItem, MenuList, CountryFlag } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Language, LocaleNamespace } from '@/constants/enums/common';
import ArrowIcon from '@/public/static/icons/arrow.svg';
import DoneCheckIcon from '@/public/static/icons/done-check.svg';
import { updateSessionInfo } from '@/services/user-management/user';

const LanguageToogle = () => {
  const { i18n, t } = useTranslation(LocaleNamespace.Menu);

  const languageOptions = [
    {
      value: Language.EN,
      name: t('language.en'),
      countryCode: 'US',
    },
    {
      value: Language.JA,
      name: t('language.ja'),
      countryCode: 'JP',
    },
    {
      value: Language.VI,
      name: t('language.vi'),
      countryCode: 'VN',
    },
  ];

  const updateSessionInfoMutation = useMutation({ mutationFn: updateSessionInfo });

  const handleChangeLanguage = async (language: Language) => {
    await i18n.changeLanguage(language);
    updateSessionInfoMutation.mutate({ languageCode: language });
  };

  return (
    <Menu>
      <MenuHandler>
        <Button color="stroke" size="16" variant="text" className="!pr-0 !pl-2">
          {(i18n.language ?? Language.EN).toUpperCase()}
          <ArrowIcon />
        </Button>
      </MenuHandler>
      <MenuList>
        {languageOptions.map((option) => (
          <MenuItem
            onClick={() => {
              handleChangeLanguage(option.value);
            }}
            key={option.value}
          >
            <div className="flex items-center gap-10 justify-between">
              <div className="flex items-center gap-2">
                <CountryFlag code={option.countryCode.toLowerCase()} />
                {option.name}
              </div>
              {i18n.language === option.value && <DoneCheckIcon className="text-ic-primary-6s" />}
            </div>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageToogle;
