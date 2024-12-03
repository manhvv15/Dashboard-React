import * as React from 'react';

import { isEmail as isEmailFn } from './isEmail';

export interface IReactMultiEmailProps {
  id?: string;
  emails?: string[];
  onChange?: (emails: string[]) => void;
  enable?: ({ emailCnt }: { emailCnt: number }) => boolean;
  onDisabled?: () => void;
  onChangeInput?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  noClass?: boolean;
  validateEmail?: (email: string) => boolean | Promise<boolean>;
  enableSpinner?: boolean;
  style?: React.CSSProperties;
  getLabel: (
    email: string,
    index: number,
    removeEmail: (index: number, isDisabled?: boolean) => void,
  ) => React.ReactNode;
  className?: string;
  placeholder?: string | React.ReactNode;
  autoFocus?: boolean;
  spinner?: () => React.ReactNode;
  delimiter?: string;
  backspaceOnPress?: () => void;
}

export function ReactMultiEmail(props: IReactMultiEmailProps) {
  const {
    id,
    style,
    getLabel,
    className = '',
    noClass,
    placeholder,
    autoFocus,
    enable,
    onDisabled,
    validateEmail,
    onChange,
    onChangeInput,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    spinner,
    delimiter = '[ ,;]',
    backspaceOnPress,
  } = props;
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const [focused, setFocused] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [spinning, setSpinning] = React.useState(false);

  const findEmailAddress = React.useCallback(
    async (value: string, isEnter?: boolean) => {
      const validEmails: string[] = [];
      const newValidEmails: string[] = [];
      let newInputValue: string = '';
      const re = new RegExp(delimiter, 'g');
      const isEmail = validateEmail || isEmailFn;

      const addEmails = (email: string) => {
        validEmails.push(email);
        for (let i = 0, l = emails.length; i < l; i += 1) {
          if (emails[i] === email) {
            return false;
          }
        }
        newValidEmails.push(email);
        return true;
      };

      if (value !== '') {
        if (re.test(value)) {
          const splitData = value.split(re).filter((n) => {
            return n !== '' && n !== undefined && n !== null;
          });

          const setArr = new Set(splitData);
          const arr = [...setArr];
          do {
            const validateResult = isEmail(`${arr[0]}`);

            if (typeof validateResult === 'boolean') {
              if (validateResult) {
                addEmails(`${arr.shift()}`);
              } else if (arr.length === 1) {
                newInputValue = `${arr.shift()}`;
              } else {
                arr.shift();
              }
            } else {
              // handle promise
              setSpinning(true);

              if (validateEmail?.(value) === true) {
                addEmails(`${arr.shift()}`);
                setSpinning(false);
              } else if (arr.length === 1) {
                newInputValue = `${arr.shift()}`;
              } else {
                arr.shift();
              }
            }
          } while (arr.length);
        } else {
          if (enable && !enable({ emailCnt: emails.length })) {
            onDisabled?.();
            return;
          }

          if (isEnter) {
            const validateResult = isEmail(value);
            if (typeof validateResult === 'boolean') {
              if (validateResult) {
                addEmails(value);
              } else {
                newInputValue = value;
              }
            } else {
              // handle promise
              setSpinning(true);
              if ((await validateEmail?.(value)) === true) {
                addEmails(value);
                setSpinning(false);
              } else {
                newInputValue = value;
              }
            }
          } else {
            newInputValue = value;
          }
        }
      }

      setEmails([...emails, ...newValidEmails]);
      setInputValue(newInputValue);

      if (validEmails.length) {
        onChange?.([...emails, ...newValidEmails]);
        setInputValue('');
      }
    },
    [delimiter, emails, enable, onChange, onChangeInput, onDisabled, validateEmail],
  );

  const onChangeInputValue = React.useCallback(
    async (value: string) => {
      onChangeInput?.(value);
      await findEmailAddress(value);
    },
    [findEmailAddress, onChangeInput],
  );

  const removeEmail = React.useCallback(
    (index: number, isDisabled?: boolean) => {
      if (isDisabled) {
        return;
      }

      const _emails = [...emails.slice(0, index), ...emails.slice(index + 1)];
      setEmails(_emails);
      onChange?.(_emails);
    },
    [emails, onChange],
  );

  const handleOnKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          break;
        case 'Backspace':
          backspaceOnPress?.();
          if (!e.currentTarget.value) {
            removeEmail(emails.length - 1, false);
          }
          break;
        default:
      }
    },
    [emails.length, onKeyDown, removeEmail],
  );

  const handleOnKeyup = React.useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(e);

      switch (e.key) {
        case 'Enter':
          await findEmailAddress(e.currentTarget.value, true);
          break;
        case 'Backspace':
          await findEmailAddress(e.currentTarget.value, false);
          break;
        default:
      }
    },
    [findEmailAddress, onKeyUp],
  );

  const handleOnChange = React.useCallback(
    async (e: React.SyntheticEvent<HTMLInputElement>) => onChangeInputValue(e.currentTarget.value),
    [onChangeInputValue],
  );

  const handleOnBlur = React.useCallback(
    async (e: React.SyntheticEvent<HTMLInputElement>) => {
      setFocused(false);
      await findEmailAddress(e.currentTarget.value, true);
      onBlur?.();
    },
    [findEmailAddress, onBlur],
  );

  const handleOnFocus = React.useCallback(() => {
    setFocused(true);
    onFocus?.();
  }, [onFocus]);

  React.useEffect(() => {
    setEmails(props.emails ?? []);
  }, [props.emails]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`${className} ${noClass ? '' : 'react-multi-email'} ${
        focused ? 'focused' : ''
      } ${inputValue === '' && emails.length === 0 ? 'empty' : ''}`}
      style={style}
      onClick={() => emailInputRef.current?.focus()}
    >
      {spinning && spinner?.()}
      {placeholder ? <span data-placeholder>{placeholder}</span> : null}
      {emails.map((email: string, index: number) => getLabel(email, index, removeEmail))}
      <input
        id={id}
        style={{ opacity: spinning ? 0.45 : 1.0 }}
        ref={emailInputRef}
        type="text"
        value={inputValue}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        onKeyDown={handleOnKeydown}
        onKeyUp={handleOnKeyup}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
      />
    </div>
  );
}
