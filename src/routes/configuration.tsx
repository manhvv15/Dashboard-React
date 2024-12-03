import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ManagermentShip4pCarrierSystem from '@/pages/configurations/ship4p-carrier-systems';
import { ManageRecomment } from '@/pages/configurations/ship4p-carrier-systems/recomment';
import { ManageTagRecomment } from '@/pages/configurations/ship4p-carrier-systems/tag-recomment';
import PaymentMethods from '@/views/configuration/payment-methods/payment-methods';
import CreatePlan from '@/views/configuration/plans/create-plan';
import DuplicatePlan from '@/views/configuration/plans/duplicate-plan';
import EditPlan from '@/views/configuration/plans/edit-plan';
import Plans from '@/views/configuration/plans/plans';
import CreatePricingModels from '@/views/configuration/pricing-models/create-pricing-models';
import EditPricingModel from '@/views/configuration/pricing-models/edit-pricing-model';
import PricingModels from '@/views/configuration/pricing-models/pricing-models';
import CreateServiceModels from '@/views/configuration/service-models/create-service-models';
import DetailServiceModels from '@/views/configuration/service-models/detail-service-models';
import DuplicateServiceModels from '@/views/configuration/service-models/duplicate-service-models';
import ServiceModels from '@/views/configuration/service-models/service-models';
import { BidRoutes } from './bid';
import { PimRoutes } from './pim';

const ConfigurationRouters = () => {
  return (
    <Routes>
      <Route path="plans">
        <Route element={<RequirePermission object={OBJECTS.PLANS} action={ACTIONS.VIEW} />}>
          <Route index element={<Plans />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.PLANS} action={ACTIONS.CREATE} />}>
          <Route path="create" element={<CreatePlan />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.PLANS} action={ACTIONS.CREATE} />}>
          <Route path="duplicate/:id" element={<DuplicatePlan />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.PLANS} action={ACTIONS.EDIT} />}>
          <Route path=":id" element={<EditPlan />} />
        </Route>
      </Route>

      <Route path="service-models">
        <Route element={<RequirePermission object={OBJECTS.SERVICE_MODELS} action={ACTIONS.VIEW} />}>
          <Route index element={<ServiceModels />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.SERVICE_MODELS} action={ACTIONS.CREATE} />}>
          <Route path="create" element={<CreateServiceModels />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.SERVICE_MODELS} action={ACTIONS.CREATE} />}>
          <Route path="duplicate/:id" element={<DuplicateServiceModels />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.SERVICE_MODELS} action={ACTIONS.VIEW} />}>
          <Route path=":id" element={<DetailServiceModels />} />
        </Route>
      </Route>

      <Route path="payment-methods">
        <Route element={<RequirePermission object={OBJECTS.PAYMENT_METHODS} action={ACTIONS.VIEW} />}>
          <Route index element={<PaymentMethods />} />
        </Route>
      </Route>

      <Route path="pricing-models">
        <Route element={<RequirePermission object={OBJECTS.PRICING_MODEL} action={ACTIONS.VIEW} />}>
          <Route index element={<PricingModels />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.PRICING_MODEL} action={ACTIONS.CREATE} />}>
          <Route path="create" element={<CreatePricingModels />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.PRICING_MODEL} action={ACTIONS.EDIT} />}>
          <Route path=":id" element={<EditPricingModel />} />
        </Route>
      </Route>
      <Route path="ship4p-carrier-system/*">
        <Route element={<RequirePermission object={OBJECTS.SHIP4P_CARRIER_SYSTEM} action={ACTIONS.VIEW} />}>
          <Route index element={<ManagermentShip4pCarrierSystem />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.MANAGE_TAG} action={ACTIONS.VIEW} />}>
          <Route path="tag-recomment" element={<ManageTagRecomment />} />
        </Route>
        <Route element={<RequirePermission object={OBJECTS.MANAGE_RECOMMENDS} action={ACTIONS.VIEW} />}>
          <Route path="recomment" element={<ManageRecomment />} />
        </Route>
      </Route>
      <Route element={<RequirePermission object={OBJECTS.MANAGE_PROXY} action={ACTIONS.VIEW} />}>
        <Route path="proxy/*" element={<PimRoutes />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.MANAGE_BID} action={ACTIONS.VIEW} />}>
        <Route path="bid-and-offer/*" element={<BidRoutes />} />
      </Route>
    </Routes>
  );
};

export default ConfigurationRouters;
