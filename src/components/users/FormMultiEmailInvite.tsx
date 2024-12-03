import { useState } from 'react';

import { FormHelperText } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';

import { REGEX_EMAIL } from '@/constants/variables/regexException';
import { ReactMultiEmail } from '@/shared/ui/react-multi-email';
import { cn } from '@/utils/common';

interface Imail {
  emails: Array<string>;
  setEmail: (value: Array<string>) => void;
  error?: string;
}

const removeDuplicates = (list: string[]) => Array.from(new Set(list));

export function FormMultiEmailInvite({ emails, setEmail, error }: Imail) {
  const [invalidEmails, setInvalidEmails] = useState<string[] | []>([]);
  let _invalidEmails: string[] = [];

  const onChange = (_emails: string[]) => {
    setEmail(removeDuplicates(_emails));
  };

  const validateEmailHandle = (email: string) => {
    if (email === 'undefined') {
      return false;
    }

    const isValid = REGEX_EMAIL.test(email);

    _invalidEmails = _invalidEmails.filter((item) => !item.includes(email) && !email.includes(item));

    if (!isValid && _invalidEmails.indexOf(email) === -1) {
      _invalidEmails.push(email);
    }

    return isValid;
  };

  const backSpaceHandle = () => {
    if (emails.length === 1) {
      setInvalidEmails([]);
    }
  };

  const getLabel = (
    email: string,
    index: number,
    removeEmail: (index: number, isDisabled?: boolean | undefined) => void,
  ) => {
    return (
      <div data-tag key={index}>
        <div data-tag-item>{email}</div>
        <button data-tag-handle onClick={() => removeEmail(index)}>
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="mb-4 text-sm">
      <div className="mb-1">
        <label htmlFor="Email">
          {t('emailAddress')} <span className="text-red-500">*</span>
        </label>
      </div>
      <ReactMultiEmail
        placeholder="E.g: abc@email.com"
        emails={emails}
        onChange={onChange}
        validateEmail={validateEmailHandle}
        backspaceOnPress={backSpaceHandle}
        getLabel={getLabel}
        className={cn({ '!border-ic-red-6s': !!error })}
      />
      {!!error && <FormHelperText error>{error}</FormHelperText>}
      {!error && (
        <p className="text-sm font-medium text-ic-black-5s mt-0.5">
          {t('user.separateEmailsByUsingCommaOrEnterButton')}
        </p>
      )}
      {invalidEmails.length > 0 && (
        <div className="mt-1 text-red-6 text-sm font-normal leading-5">
          <strong>{t('invalid')}: </strong> {invalidEmails.join(', ')}
        </div>
      )}
    </div>
  );
}
