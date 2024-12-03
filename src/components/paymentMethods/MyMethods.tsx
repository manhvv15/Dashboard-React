import { Suspense, useState } from 'react';

import { DragDropContext, Draggable, Droppable, DropResult, Label, RadioButton, Spinner } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';

import { merchantAccountActive, updateMerchantAccount } from '@/services/payment-method';
import { MerchantAccountTypeEnum } from '@/types/payment-methods/enum';
import { MerchantAccountActive } from '@/types/payment-methods/payment-method';

import Bidv from './details/Bidv';
import Payme from './details/Payme';
import Paypal from './details/Paypal';

import SvgIcon from '../commons/SvgIcon';
import Stripe from './details/Stripe';

const MyMethods = () => {
  const [typePayment, setTypePayment] = useSearchParams();

  const [listMerchant, setListMerchant] = useState<MerchantAccountActive[]>();

  const getType = Number(typePayment.get('type')) as MerchantAccountTypeEnum;

  const { refetch } = useQuery({
    queryKey: [merchantAccountActive.name],
    queryFn: () => merchantAccountActive(),
    onSuccess: (res) => {
      setListMerchant(res.data);

      if (typePayment.get('type') === null || typePayment.get('type') === undefined) {
        setTypePayment({ tab: typePayment.get('tab') as string, type: String(res.data[0].type) as string });
      }
    },
  });

  const updateMerchantAccountMutation = useMutation({
    mutationFn: updateMerchantAccount,
    onSuccess: () => {
      refetch();
    },
  });

  const reorder = (list: MerchantAccountActive[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    updateMerchantAccountMutation.mutate({
      merchantAccountOrders: result.map((item, index) => ({ id: item.id, order: index })),
    });

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const data = reorder(listMerchant ?? [], result.source.index, result.destination.index);

    setListMerchant([...data]);
  };

  const getListStyle2 = () => ({
    overflow: 'auto',
  });

  const getItemStyle2 = (isDragging: any, draggableStyle: any) => ({
    userSelect: 'none',

    background: isDragging ? '#F9F9F9' : '',

    ...draggableStyle,
  });

  const handleChangePayment = (type: MerchantAccountTypeEnum) => {
    setTypePayment({ tab: typePayment.get('tab') as string, type: String(type) as string });
  };

  const handleIdDefault = (type: MerchantAccountTypeEnum) => {
    updateMerchantAccountMutation.mutate({
      type: type,
      isDefault: true,
    });
  };

  const codePayment = ['paypal', 'payme', 'cod', 'banktranfer', 'vietqr', 'cash', 'bidv', 'stripe'];

  return (
    <Suspense fallback={<Spinner />}>
      <div className="w-full mt-2 flex h-full">
        <div className="min-w-[300px] py-4 px-2 ">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="flex flex-col gap-y-2 "
                  style={getListStyle2()}
                  {...provided.droppableProps}
                >
                  {listMerchant?.map((item, index) => {
                    const onAction = () => {
                      handleChangePayment(item.type);
                    };
                    const onIdDefault = () => {
                      handleIdDefault(item.type);
                    };
                    return (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <button
                            key={item.id}
                            ref={provided.innerRef}
                            onClick={onAction}
                            {...provided.draggableProps}
                            style={getItemStyle2(snapshot.isDragging, provided.draggableProps.style)}
                            className={clsx(
                              'h-16 rounded-lg justify-between px-3 py-2  flex items-center border border-ic-ink-2s shadow-sm',
                              {
                                'bg-ic-orange-1s': getType === item.type,
                              },
                            )}
                          >
                            <div className="flex items-center">
                              <button {...provided.dragHandleProps}>
                                <SvgIcon icon="dots" width={20} height={20} className="text-ic-ink-6s" />
                              </button>
                              <img
                                className="ml-2"
                                src={`/static/images/payment/${codePayment[item.type]}.svg`}
                                width={76}
                                height={24}
                                alt=""
                              />
                            </div>
                            <div className="flex items-center gap-x-2">
                              {item.isDefault && (
                                <Label className="py-[2px]" type="outline" color="blue">
                                  <span className="text-xs font-normal leading-4">Default</span>
                                </Label>
                              )}
                              <RadioButton onChange={onIdDefault} checked={item.isDefault} />
                            </div>
                          </button>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="border-l border-ic-ink-2s p-4 w-full">
          {getType === MerchantAccountTypeEnum.BIDV && <Bidv />}
          {getType === MerchantAccountTypeEnum.Paypal && <Paypal />}
          {getType === MerchantAccountTypeEnum.Payme && <Payme />}
          {getType === MerchantAccountTypeEnum.Stripe && <Stripe />}
        </div>
      </div>
    </Suspense>
  );
};
export default MyMethods;
