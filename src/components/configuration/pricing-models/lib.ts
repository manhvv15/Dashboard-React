export const showError = (errorPrice: any[]) => {
  let listError: string[] = [];
  if (errorPrice && errorPrice?.length > 0) {
    errorPrice?.forEach((item: any) => {
      if (item && Object.keys(item).length > 0) {
        Object.keys(item).forEach((item2) => {
          if (Object.hasOwn(item[item2], 'message')) {
            if (item[item2].message === 'required') {
              listError.push('fieldRequired');
            } else {
              listError.push(item[item2].message);
            }
          } else {
            listError.push('fieldRequired');
          }
        });
      }
    });
  } else {
    listError = [];
  }
  return Array.from(new Set(listError));
};
