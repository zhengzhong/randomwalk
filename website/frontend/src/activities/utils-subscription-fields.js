export const SINGLE_LINE_TEXT = 'SingleLineText';
export const MULTI_LINE_TEXT = 'MultiLineText';
export const SINGLE_CHOICE_SELECT = 'SingleChoiceSelect';
export const CHECKBOX = 'Checkbox';

export const SUBSCRIPTION_FIELD_CHOICES = [
  {
    type: SINGLE_LINE_TEXT,
    name: 'Single-line Text',
    description: 'Brief description of this field',
  },
  {
    type: MULTI_LINE_TEXT,
    name: 'Multi-line Text',
    description: 'Brief description of this field',
  },
  {
    type: SINGLE_CHOICE_SELECT,
    name: 'Single-choice Select',
    description: 'Brief description of this field',
  },
  {
    type: CHECKBOX,
    name: 'Checkbox',
    description: 'Brief description of this field',
  },
];

export const SUBSCRIPTION_FIELD_TYPES = [
  SINGLE_LINE_TEXT,
  MULTI_LINE_TEXT,
  SINGLE_CHOICE_SELECT,
  CHECKBOX,
];


export function parseFieldChoices(fieldChoices) {
  if (!fieldChoices || !fieldChoices.trim()) {
    return [];
  }
  return fieldChoices.split(/\r?\n/)
    .map(value => value.trim())
    .filter(value => value.length > 0);
}


export default {
};
