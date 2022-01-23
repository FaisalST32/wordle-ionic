import { LetterType } from '../components/row/row.component';

export const generateEmptyRow = (): LetterType[] => [
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
];

export const generateInitialKeys = (): LetterType[][] => {
  const keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ];
  return keyRows.map((row) =>
    row.map((key) => ({
      character: key,
      state: 'empty',
    }))
  );
};
