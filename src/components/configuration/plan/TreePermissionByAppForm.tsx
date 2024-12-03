import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Button, Checkbox, CheckboxTree, Collapse, Input, TreeNode } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

import { LocaleNamespace } from '@/constants/enums/common';

import SvgIcon from '@/components/commons/SvgIcon';
import { PlanFunctionConfigurationRequest } from '@/types/common';

interface IProps {
  application: PlanFunctionConfigurationRequest;
  permissionSelected: string[];
  setPermissionSelected: Dispatch<SetStateAction<string[] | undefined>>;
}
export const TreePermissionByAppForm = ({ application, permissionSelected, setPermissionSelected }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [textSearch, setTextSearch] = useState<string>();
  const [permissionIds, setPermissionIds] = useState<string[]>();
  const [visible, setVisible] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(true);

  const handleToggle = () => setVisible((prevState) => !prevState);
  const searchDebounce = useDebounce(textSearch);

  const getAllValuesFromTree = (tree: TreeNode) => {
    let values: string[] = [];
    values.push(tree.value);

    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child) => {
        const childValues = getAllValuesFromTree(child);
        values = values.concat(childValues);
      });
    }
    return values;
  };

  const [allPermissionIds, setAllPermissionIds] = useState<string[]>();
  useEffect(() => {
    if (application.treeNodes) {
      const ids = getAllValuesFromTrees(application.treeNodes);
      setAllPermissionIds(ids);
      if (permissionSelected && permissionSelected.length > 0) {
        setPermissionIds(permissionSelected);
        setPermissionSelected(permissionSelected);
      } else {
        setPermissionIds(ids);
        setPermissionSelected(ids);
      }
    }
  }, [application.treeNodes]);

  const getAllValuesFromTrees = (trees: TreeNode[]) => {
    let values: string[] = [];
    trees.forEach((tree) => {
      const ids = getAllValuesFromTree(tree);
      values = values.concat(ids);
    });
    return values;
  };

  const onChangeSelectAll = (event?: ChangeEvent<HTMLInputElement>) => {
    setIsSelectAll(event?.target.checked ?? true);
    if (event?.target.checked && allPermissionIds) {
      setPermissionIds(allPermissionIds);
      setPermissionSelected(allPermissionIds);
    } else {
      setPermissionIds([]);
      setPermissionSelected([]);
    }
  };
  const onHandleClearAll = () => {
    setIsSelectAll(false);
    setPermissionIds([]);
    setPermissionSelected([]);
  };

  const onChangeTextSearchPermission = (event?: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event?.target.value);
  };
  const onChangePermission = (input: TreeNode[]) => {
    const permissonIdsSelected = input.length > 0 ? input?.map((el) => el.value?.toString()) : [];
    setPermissionIds(permissonIdsSelected);
    setPermissionSelected(permissonIdsSelected);
  };

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px] border-[1px] rounded-lg mb-4">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <button className="font-medium w-full text-left flex" onClick={handleToggle}>
          <div className="flex w-full">
            <img src={application.logoUrl ?? ''} width={24} height={24} alt="alogo app" className="rounded-full" />
            <div className="ml-2 text-base text-ic-black-5s">{application.applicationName}</div>
          </div>
          <SvgIcon
            width={24}
            height={24}
            icon={visible ? 'arrow-up' : 'arrow-2'}
            className="ml-2 justify-end text-right"
          />
        </button>
        <Collapse orientation="vertical" expanded={visible}>
          <div className="bg-ic-white-6s py-4 rounded-lg">
            <Input
              classNameContainer="mt-2"
              placeholder={common('role.selectPermissionTextSearch')}
              hiddenClose
              name="name"
              onChange={onChangeTextSearchPermission}
              icon={<SvgIcon icon="search" width={16} height={16} className="text-ic-ink-6s" />}
            />
            {application.treeNodes != null && application.treeNodes.length > 0 ? (
              <div>
                <div className="mt-4">
                  <div className="my-4 flex">
                    <Checkbox
                      label={common('selectAllFunctions')}
                      onChange={(e) => onChangeSelectAll(e)}
                      checked={isSelectAll}
                    />
                    <Button
                      className="text-ic-primary-6s cursor-pointer ml-2"
                      variant="text"
                      onClick={() => onHandleClearAll()}
                    >
                      {common('clearAll')}
                    </Button>
                  </div>
                  <div className="mt-4 max-h-[500px] overflow-y-auto scrollbar">
                    <CheckboxTree
                      filters={{ keyword: searchDebounce }}
                      nodes={application.treeNodes ?? []}
                      value={permissionIds}
                      onChange={(el) => onChangePermission(el)}
                    ></CheckboxTree>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col w-full h-[350px]">
                <img src={'/static/svg/noDataIcon.svg'} alt="NodataIcon" />
                <div>{common('role.noPermission')}</div>
              </div>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  );
};
