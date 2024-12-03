import SvgIcon from '@/components/commons/SvgIcon';
import { GetEntriesRecommendedResponse, TagRecommened } from '@/types/ship4p/recomented';
import { Popover, PopoverContent, PopoverHandler } from '@ichiba/ichiba-core-ui';
import { Suspense, useEffect, useState } from 'react';
import ModalRemoveRecoment from '../../modals/remove';

export const TagRecomented = ({ data, confirm }: { data: GetEntriesRecommendedResponse; confirm: () => void }) => {
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [visiblePopperTags, setVisiblePopperTags] = useState<boolean>(false);
  const [recomentTags, setRecomentedTag] = useState<TagRecommened[]>();
  const [recomentTagRemaining, setRecomentedTagRemaining] = useState<TagRecommened[]>();
  const [sttRemainingTag, setSttRemainningTag] = useState<number>();
  const [dataDelete, setDataDelete] = useState<GetEntriesRecommendedResponse>();
  const onClickDelete = (index: number, isRemaining?: boolean) => {
    if (isRemaining) {
      var newTags = { ...data };
      setVisibleDelete(true);
      var tagRecomenteds = newTags.tagRecommeneds.filter((e) => e.tagId !== (recomentTagRemaining || [])[index].tagId);
      newTags.tagRecommeneds = tagRecomenteds;
      setDataDelete(newTags);
      return;
    }
    var newTags = { ...data };
    var tagRecomenteds = [...newTags.tagRecommeneds];
    tagRecomenteds.splice(index, 1);
    setVisibleDelete(true);
    newTags.tagRecommeneds = tagRecomenteds;
    setDataDelete(newTags);
  };
  const onClose = () => {
    confirm();
    setVisibleDelete(false);
  };
  useEffect(() => {
    if (data.tagRecommeneds?.length > 3) {
      const sliceTags = data.tagRecommeneds.slice(0, 3);
      setRecomentedTag(sliceTags);
      setRecomentedTagRemaining(data.tagRecommeneds.slice(sliceTags.length, data.tagRecommeneds.length));
      setSttRemainningTag(data.tagRecommeneds?.length - sliceTags?.length);
    } else {
      setRecomentedTag(data.tagRecommeneds);
    }
  }, [data]);
  return (
    <div className="flex flex-row gap-1">
      <div className="flex flex-row gap-1 flex-wrap">
        {(recomentTags || []).length > 0 &&
          recomentTags?.map((tag, index) => (
            <div
              className="items-center border flex max-w-max px-2 py-1  min-w-max h-6 justify-between rounded-lg"
              style={{
                backgroundColor: `${tag.backgroundColor}`,
              }}
            >
              <div className="flex gap-1">
                <span className="text-xs text-white ">{tag.name}</span>
                <div className="w-3 h-3">
                  <SvgIcon
                    icon="close-circel"
                    height={16}
                    width={16}
                    className="cursor-pointer text-ic-ink-5s transition ease-in-out "
                    onClick={() => onClickDelete(index)}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      {sttRemainingTag && (
        <Popover
          open={visiblePopperTags}
          handler={() => setVisiblePopperTags(!visiblePopperTags)}
          placement="bottom-end"
        >
          <PopoverHandler>
            <div className="px-2 py-0.5 flex bg-ic-ink-1s cursor-pointer transition ease-in-out hover:bg-ic-ink-2s rounded-3xl items-center h-6">
              <span className="font-medium text-sm text-ic-ink-6s leading-5">{sttRemainingTag}+</span>
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="relative">
              <div className="absolute left-[100%] bottom-[100%]">
                <SvgIcon
                  icon="close-circel"
                  height={32}
                  width={32}
                  className="cursor-pointer text-ic-ink-5s transition ease-in-out "
                  onClick={() => setVisiblePopperTags(!visiblePopperTags)}
                />
              </div>
              <div className="flex flex-row gap-1 flex-wrap max-w-[500px]">
                {(recomentTagRemaining || []).length > 0 &&
                  recomentTagRemaining?.map((tag, index) => (
                    <div
                      className="items-center border flex max-w-max px-2 py-1  min-w-max h-6 justify-between rounded-lg"
                      style={{
                        backgroundColor: `${tag.backgroundColor}`,
                      }}
                    >
                      <div className="flex gap-1">
                        <span className="text-xs text-white ">{tag.name}</span>
                        <div className="w-3 h-3">
                          <SvgIcon
                            icon="close-circel"
                            height={16}
                            width={16}
                            className="cursor-pointer text-ic-ink-5s transition ease-in-out "
                            onClick={() => onClickDelete(index, true)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      {visibleDelete && (
        <Suspense>
          <ModalRemoveRecoment isOpen={visibleDelete} onClose={onClose} tag={dataDelete} type="edit" />
        </Suspense>
      )}
    </div>
  );
};
