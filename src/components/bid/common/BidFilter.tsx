import SvgIcon from '@/components/commons/SvgIcon';
import { cn, convertToAsciiString, onlySpaces } from '@/utils/common';
import { Button, Checkbox, Input, Menu, MenuHandler, MenuList } from '@ichiba/ichiba-core-ui';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CFormCheckProps = React.ComponentProps<typeof Checkbox>;

export function BidFilter<T extends CFormCheckProps['value']>(props: {
  onChange: (value?: T) => void;
  dropDownList: { label: string; value: T }[];
  title: string;
  value?: T;
  icon?: React.ReactNode;
  isSearch?: boolean;
  type?: 'radio';
}): JSX.Element;
export function BidFilter<T extends CFormCheckProps['value']>(props: {
  onChange: (value?: T[]) => void;
  dropDownList: { label: string; value: T }[];
  title: string;
  value?: T[];
  icon?: React.ReactNode;
  isSearch?: boolean;
  type?: 'checkbox';
}): JSX.Element;
export function BidFilter<T extends CFormCheckProps['value']>(props: {
  onChange: (value?: T[] | T) => void;
  dropDownList: { label: string; value: T }[];
  title: string;
  value?: T[] | T;
  icon?: React.ReactNode;
  isSearch?: boolean;
  type?: CFormCheckProps['type'];
}): JSX.Element {
  const { onChange, dropDownList, title, value, icon, isSearch = false, type = 'checkbox' } = props;
  const { t: common } = useTranslation('common');
  const [searchKeyword, setSearchKeyword] = useState('');

  const isArray = Array.isArray(value);
  const isCheckbox = type === 'checkbox';

  const filteredList = dropDownList.filter((item) =>
    convertToAsciiString(item.label).toLowerCase().includes(convertToAsciiString(searchKeyword).toLowerCase()),
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    if (onlySpaces(keyword)) {
      setSearchKeyword('');
    } else {
      setSearchKeyword(keyword);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
  };

  const handleChange = (selected: T) => {
    if (isCheckbox) {
      const currentValues = isArray ? value : undefined;
      const isExisted = currentValues?.includes(selected);
      if (isExisted) {
        const newValues = currentValues?.filter((i) => i !== selected);
        onChange(newValues && newValues?.length > 0 ? newValues : undefined);
      } else {
        onChange([...(currentValues ?? []), selected]);
      }
    } else {
      onChange(selected);
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <Menu>
      <MenuHandler className="flex justify-center items-center gap-2 hover:!bg-ic-ink-1s border border-ic-ink-2s !bg-white !text-ic-ink-6s !rounded-lg">
        <Button>
          {icon && typeof icon === 'string' ? <SvgIcon icon={icon} width={16} height={16} /> : icon}
          <span className="text-sm whitespace-nowrap">{title}</span>
          <SvgIcon icon="arrow" width={24} height={24} />
        </Button>
      </MenuHandler>
      <MenuList className="w-[300px] z-50 py-3 px-4">
        {isSearch && (
          <Input
            type="text"
            placeholder={common('search')}
            icon={<SvgIcon icon="search" />}
            onChange={handleSearch}
            onReset={handleClearSearch}
            value={searchKeyword}
          />
        )}
        <div className="scroll mt-2 max-h-[200px] overflow-y-scroll -mr-2">
          {filteredList.map((item, index) => {
            const handleClick = (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              handleChange(item.value);
            };
            return (
              <div
                key={index}
                className="hover:bg-ic-ink-1s py-2 px-3 text-ic-ink-5s rounded-lg text-sm leading-5 font-normal w-full block whitespace-normal cursor-pointer"
                onClick={handleClick}
              >
                <Checkbox
                  id={item.label}
                  type={type}
                  value={item.value}
                  /** Prevent uncontrolled input error */
                  onChange={() => {}}
                  label={<p className="cursor-pointer">{item.label}</p>}
                  className="cursor-pointer flex items-center"
                  checked={isArray ? value?.includes(item.value) : value === item.value}
                />
              </div>
            );
          })}
        </div>
        <p
          className={cn(
            'ml-3 mt-2 text-sm font-medium',
            value ? 'text-ic-primary-6s cursor-pointer' : 'text-ic-ink-5s cursor-default',
          )}
          onClick={handleClear}
        >
          {common('clear')}
        </p>
      </MenuList>
    </Menu>
  );
}
