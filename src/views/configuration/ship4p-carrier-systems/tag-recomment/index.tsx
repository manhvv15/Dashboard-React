import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getTagRecomented, updateIndexOrderRecomented } from '@/services/ship4p/recommented';
import { TagsRecomented, UpdateIndexRecomented } from '@/types/ship4p/recomented';
import { showToast } from '@/utils/toasts';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { Button, Input, LoadingOverlay, SearchIcon } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import { CreateTagRecommented } from './modals/create';
import { TagRecomentHeader } from './modals/tag-recoment-header';
import { TabRecomentItems } from './modals/tag-recomented-items';
export const TagRecomment = () => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [enabled, setEnabled] = useState(false);
  const [tagRecomments, setTagRecomments] = useState<TagsRecomented[]>();
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [searchTagRecoment, setSearchTagRecoment] = useState({
    keyword: '',
  });
  const searchDebounce = useDebounce(searchTagRecoment);
  const {
    isLoading,
    isSuccess,
    refetch: refetchTagRecomment,
  } = useQuery({
    queryKey: ['getTagRecomment', searchDebounce],
    queryFn: () => getTagRecomented(searchDebounce),
    onSuccess: (res) => {
      setTagRecomments(res.data);
    },
  });
  const onChangeSearchInput = (value?: React.ChangeEvent<HTMLInputElement>) => {
    const valueSearchInput = value?.target.value;
    setSearchTagRecoment((prev) => ({
      ...prev,
      keyword: valueSearchInput ?? '',
    }));
  };

  const onClearDataSearch = () => {
    setSearchTagRecoment((prev) => ({
      ...prev,
      keyword: '',
    }));
  };
  const onHandleOpenModalCreate = () => {
    setVisibleCreate(true);
  };
  const onHandleCloseModalCreate = () => {
    onConfirm();
    setVisibleCreate(false);
  };
  const onConfirm = () => {
    refetchTagRecomment();
  };

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  const reorder = (list: TagsRecomented[], startIndex?: number, endIndex?: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex ?? 0, 1);
    result.splice(endIndex ?? 0, 0, removed);
    result.forEach((e, index) => {
      e.index = index;
    });
    return result;
  };
  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }

    const listTags = [...(tagRecomments || [])];
    const tags = reorder(listTags, source.index, destination?.index);
    setTagRecomments(tags);
    onHandleUpdate(tags);
  };
  const updateTagIndexRecoment = useMutation({
    mutationFn: updateIndexOrderRecomented,
  });

  const onHandleUpdate = (tagsRecomment: TagsRecomented[]) => {
    const dataUpdate = {
      recomments: tagsRecomment.map((e) => ({
        id: e.id,
        index: e.index,
      })),
    } as UpdateIndexRecomented;
    updateTagIndexRecoment.mutate(dataUpdate, {
      onSuccess: () => {
        showToast({
          type: 'success',
          detail: t('updatetagName.succes'),
        });
        onConfirm();
      },
      onError: () => {
        showToast({
          type: 'error',
          detail: error('export.error'),
        });
      },
    });
  };
  const elementCreateTag = (
    <AccessibleComponent object={OBJECTS.MANAGE_TAG} action={ACTIONS.CREATE}>
      <Button size="40" onClick={onHandleOpenModalCreate}>
        <SvgIcon icon="plus" height={24} width={24} />
        <span>{tShip4p('create.tag.recomment.title')}</span>
      </Button>
    </AccessibleComponent>
  );
  return (
    <div className="w-full h-full flex flex-col">
      <div className="z-50 sticky top-0 w-full min-h-14 border-b bg-ic-white-6s border-ic-ink-2s flex items-center justify-between px-6">
        <div className="text-base font-medium leading-6 text-ic-ink-6s">{tShip4p('configuration.tag.recomment')}</div>
        <div>{elementCreateTag}</div>
      </div>
      <div className="flex-1 bg-ic-ink-1s p-2 rounded-t-lg overflow-auto scrollbar">
        <div className="h-full flex flex-1 overflow-hidden">
          <LoadingOverlay isLoading={isLoading} className="w-full flex-1 overflow-auto">
            <div className="flex w-full h-full bg-white px-5 rounded-lg pt-3 pb-6 gap-4 ">
              {((tagRecomments || []).length > 0 || searchDebounce.keyword) && isSuccess && (
                <div className="flex flex-col overflow-hidden w-full ">
                  {!searchDebounce.keyword && (tagRecomments || []).length < 1 ? (
                    <></>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-6">
                        <div className="w-[700px]">
                          <Input
                            size={32}
                            hiddenClose={!searchTagRecoment.keyword}
                            onClearData={onClearDataSearch}
                            placeholder={tShip4p('search.tagRecomment.placeholder')}
                            value={searchTagRecoment.keyword}
                            onChange={onChangeSearchInput}
                            icon={<SearchIcon />}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {(tagRecomments || []).length > 0 ? (
                    <div className="flex flex-col overflow-hidden w-full p-1">
                      <div className="flex flex-col h-full">
                        <TagRecomentHeader />
                        <div className="flex-1 overflow-auto scrollbar">
                          <div className="flex-col flex">
                            <DragDropContext onDragEnd={onDragEnd}>
                              {enabled && (
                                <Droppable droppableId="droppable">
                                  {(provided) => (
                                    <div
                                      className={`flex-1 overflow-hidden`}
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {tagRecomments?.map((item, index) => (
                                        <TabRecomentItems
                                          index={index}
                                          item={item}
                                          onConfirm={onConfirm}
                                          key={item.id}
                                        />
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              )}
                            </DragDropContext>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    searchDebounce.keyword && (
                      <div className="flex w-full h-full gap-4 items-center flex-col justify-center">
                        <SvgIcon icon="empty-search" width="168" height="168" />
                        <span>{t('noResultsFound.tag')}</span>
                        {elementCreateTag}
                      </div>
                    )
                  )}
                </div>
              )}

              {(tagRecomments || []).length < 1 && !searchDebounce.keyword && isSuccess && !isLoading && (
                <div className="flex w-full h-full">
                  <div className="flex w-full h-full gap-4 items-center flex-col justify-center">
                    <SvgIcon icon="empty" width="168" height="168" />
                    <span className="font-medium text-base leading-6 text-ic-ink-6s">{t('noResultsFound.tag')}</span>
                    {elementCreateTag}
                  </div>
                </div>
              )}
            </div>
          </LoadingOverlay>
        </div>
        {visibleCreate && (
          <Suspense>
            <CreateTagRecommented
              open={visibleCreate}
              onClose={onHandleCloseModalCreate}
              type="create"
              index={(tagRecomments || [])?.[(tagRecomments || [])?.length - 1]?.index}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};
