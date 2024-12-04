import {
  StatusSelect,
  ParentSelect,
  SizeInput,
  ActivatedSelect,
} from "../components/valueField";
export default function handleValueFieldChange(
  fieldName: string | undefined,
  index: number,
  operator?: string
) {
  if (fieldName === undefined) return;
  switch (fieldName) {
    case "status":
      return StatusSelect();
    case "parent_id":
      return ParentSelect();
    case "size":
      return SizeInput(index, operator);
    case "activated":
      return ActivatedSelect();
    default:
  }
}
