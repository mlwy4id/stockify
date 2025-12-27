import CreateInventoryForm from '../form/CreateItemForm';
import EditItemForm from '../form/EditItemForm';

export const MODAL_COMPONENT_STRATEGIES = {
  CREATE_ITEM: { title: 'Create Item', Component: CreateInventoryForm },
  EDIT_ITEM: { title: 'Edit Item', Component: EditItemForm },
};
