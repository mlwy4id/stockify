import CreateInventoryForm from "../form/CreateItemForm";
import EditItemForm from "../form/EditItemForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export const MODAL_COMPONENT_STRATEGIES = {
  CREATE_ITEM: { title: "Create Item", Component: CreateInventoryForm },
  EDIT_ITEM: { title: "Edit Item", Component: EditItemForm },
  DELETE_ITEM: { title: "Delete Item?", Component: ConfirmDeleteModal },
};
