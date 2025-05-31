
import React, { useState } from 'react';
import TabButton from '../TabButton';
import { Service } from '../../types'; // AppPaymentGateway is no longer needed here
import {
  PAYMENT_SUB_TAB_GATEWAYS, PAYMENT_SUB_TAB_PRICING, PAYMENT_SUB_TAB_CHARGES,
  PAYMENT_SUB_TAB_SUBSCRIPTIONS, PAYMENT_SUB_TAB_TRANSACTIONS, PAYMENT_SUB_TAB_REFUNDS,
  CreditCardIcon, CurrencyDollarIcon, ReceiptPercentIcon, RectangleStackIcon, ListBulletIcon, ArrowUturnLeftIcon
} from '../../constants';

// Import sub-tab components
import GatewaysTab from './payment_tabs/GatewaysTab';
import PricingTab from './payment_tabs/PricingTab';
import ChargesTab from './payment_tabs/ChargesTab';
import SubscriptionsTab from './payment_tabs/SubscriptionsTab';
import TransactionsTab from './payment_tabs/TransactionsTab';
import RefundsTab from './payment_tabs/RefundsTab';

interface AdminPaymentsPanelProps {
  services: Service[]; // For PricingTab, and potentially others later
  // Other props will be added as other tabs are refactored for Supabase
}

type PaymentSubTab = typeof PAYMENT_SUB_TAB_GATEWAYS | typeof PAYMENT_SUB_TAB_PRICING | typeof PAYMENT_SUB_TAB_CHARGES | typeof PAYMENT_SUB_TAB_SUBSCRIPTIONS | typeof PAYMENT_SUB_TAB_TRANSACTIONS | typeof PAYMENT_SUB_TAB_REFUNDS;

const AdminPaymentsPanel: React.FC<AdminPaymentsPanelProps> = ({
  services,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<PaymentSubTab>(PAYMENT_SUB_TAB_GATEWAYS);

  return (
    <div className="bg-white rounded-xl shadow-sm"> 
      <div className="p-6"> {/* Standardized padding for the panel header area */}
        <h2 className="text-2xl font-semibold text-primary-dark mb-1">Manage Payments</h2>
        <p className="text-sm text-neutral-DEFAULT mb-4">
          Configure payment gateways, manage service pricing, issue charges, oversee subscriptions, view transactions, and process refunds.
        </p>
      </div>
      
      <div className="mb-0 border-b border-slate-200 px-2 md:px-4"> {/* Adjusted padding for tab bar */}
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-0">
          <TabButton
            label="Gateways"
            isActive={activeSubTab === PAYMENT_SUB_TAB_GATEWAYS}
            onClick={() => setActiveSubTab(PAYMENT_SUB_TAB_GATEWAYS)}
            icon={<CreditCardIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Pricing"
            isActive={activeSubTab === PAYMENT_SUB_TAB_PRICING}
            onClick={() => setActiveSubTab(PAYMENT_SUB_TAB_PRICING)}
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Charges"
            isActive={activeSubTab === PAYMENT_SUB_TAB_CHARGES}
            onClick={() => setActiveSubTab(PAYMENT_SUB_TAB_CHARGES)}
            icon={<ReceiptPercentIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Subscriptions"
            isActive={activeSubTab === PAYMENT_SUB_TAB_SUBSCRIPTIONS}
            onClick={() => setActiveSubTab(PAYMENT_SUB_TAB_SUBSCRIPTIONS)}
            icon={<RectangleStackIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Transactions"
            isActive={activeSubTab === PAYMENT_SUB_TAB_TRANSACTIONS}
            onClick={() => setActiveSubTab(PAYMENT_SUB_TAB_TRANSACTIONS)}
            icon={<ListBulletIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Refunds"
            isActive={activeSubTab === PAYMENT_SUB_TAB_REFUNDS}
            onClick={() => setActiveSubTab(PAYMENT_SUB_TAB_REFUNDS)}
            icon={<ArrowUturnLeftIcon className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Content for each sub-tab will now also have p-6 for consistency */}
      <div className="p-0"> {/* Sub-tabs will apply their own p-6 */}
        {activeSubTab === PAYMENT_SUB_TAB_GATEWAYS && (
          <GatewaysTab /> // No props needed from here as it manages its own data
        )}
        {activeSubTab === PAYMENT_SUB_TAB_PRICING && (
          <PricingTab services={services} />
        )}
        {activeSubTab === PAYMENT_SUB_TAB_CHARGES && (
          <ChargesTab />
        )}
        {activeSubTab === PAYMENT_SUB_TAB_SUBSCRIPTIONS && (
          <SubscriptionsTab />
        )}
        {activeSubTab === PAYMENT_SUB_TAB_TRANSACTIONS && (
          <TransactionsTab />
        )}
        {activeSubTab === PAYMENT_SUB_TAB_REFUNDS && (
          <RefundsTab />
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPanel;
