import { atom } from 'nanostores';

export const $date = atom<string>('');

export const $formData = atom({
  name: '',
  email: '',
  message: ''
});