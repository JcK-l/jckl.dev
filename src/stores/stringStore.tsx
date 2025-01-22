import { atom } from 'nanostores';

export const $pastDate = atom<string>('');
export const $currentDate = atom<string>('');

export const $formData = atom({
  name: '',
  email: '',
  message: ''
});